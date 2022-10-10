const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const si = require('systeminformation');
const smi = require('node-nvidia-smi');
var result = {}

app.use(cors())
app.use(express.static('public'))

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/api', function(req, res) {
    si.cpuCurrentSpeed()
        .then(data => {
            result.cpuspeed = data.avg
            return si.cpuTemperature()
        })
        .then(data => {
            result.cputemperature = data.main
            return si.mem()
        })
        .then(data => {
            result.memtotal = Number((data.total / Math.pow(1024, 3)).toFixed(1))
            result.memfree = Number((data.free / Math.pow(1024, 3)).toFixed(1))
            result.memused = Number((data.used / Math.pow(1024, 3)).toFixed(1))
            return si.battery()
        })
        .then(data => {
            if(data.hasbattery){
                result.batcharging = data.ischarging
                result.batpercentage = data.percent
            }
            return si.graphics()
        })
        .then(data => {
            if (data.controllers.length > 0) {
                result.gfxname =  data.controllers[0].model
                result.gfxram = Math.round(data.controllers[0].vram / 1024)
            } else {
                result.gfxname =  ''
                result.gfxram = 0
            }
            return si.fsSize()
        })
        .then(data => {
            result.disks = []
            data.map(item => {
                let diskdata = {}
                diskdata.total = Math.round(item.size / Math.pow(1024, 3))
                diskdata.used = Math.round(item.used / Math.pow(1024, 3))
                diskdata.percent =  Math.round(item.use)
                result.disks.push(diskdata)
            })
            return si.currentLoad()
        })
        .then(data => {
            result.cpuload = Math.round(data.currentLoad)
            smi(function (err, data) {
                if (err) {
                    result.nvidia = false
                    res.json(result)
                } else {
                    var info = data.nvidia_smi_log.gpu
                    result.nvidia = true
                    result.nvidia_name = info.product_name
                    result.nvidia_fan = Number(info.fan_speed.split(' ')[0])
                    result.nvidia_mem_total = Number(info.fb_memory_usage.total.split(' ')[0])
                    result.nvidia_mem_used = Number(info.fb_memory_usage.used.split(' ')[0])
                    result.nvidia_mem_free = Number(info.fb_memory_usage.free.split(' ')[0])
                    result.nvidia_mem_percent = Number(info.utilization.memory_util.split(' ')[0])
                    result.nvidia_load = Number(info.utilization.gpu_util.split(' ')[0])
                    result.nvidia_temp = Number(info.temperature.gpu_temp.split(' ')[0])
                    res.json(result)
                }
            })
        })
})

app.listen(5000, function () {
    console.log('Server listening in port 5000')
});

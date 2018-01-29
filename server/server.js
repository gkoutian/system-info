var express = require('express');
var app = express();
var path = require('path');
var cors = require('cors');
const si = require('systeminformation');
var result = {}

app.use(cors())

// viewed at http://localhost:8080
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/api', function(req, res) {
    si.cpuCurrentspeed()
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
            result.gfxname = data.controllers[0].model 
            result.gfxram = Math.round(data.controllers[0].vram / 1024)
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
            result.cpuload = Math.round(data.currentload)
            res.json(result)
        })

})

app.listen(5000, function () {
    console.log('Server listening in port 5000')
});
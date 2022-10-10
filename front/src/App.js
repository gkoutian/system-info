import React, { Component } from 'react';
import './App.css';
import Menu from './components/menu'
import PieChart from 'react-minimal-pie-chart';

class App extends Component {

  getData() {
    fetch('http://localhost:5000/api')
      .then(data => data.json())
      .then(data => {
        this.setState(data);
      })
  }

  componentDidMount() {
    this.getData()
    setInterval(function() {
      fetch('http://localhost:5000/api')
      .then(data => data.json())
      .then(data => {
        this.setState(data);
      })
    }.bind(this), 5000);
  }

  componentDidUpdate() {
    document.getElementById("ram").style.width = ((this.state.memused * 100) / this.state.memtotal) + '%';
    if (this.state.batcharging !== undefined) {
      document.getElementById("battery").style.width = this.state.batpercentage + '%';}
    if (this.state.nvidia === true) {
      document.getElementById("gpu").style.width = this.state.nvidia_mem_percent + '%';}
    this.state.disks.map((item, key) => {
      let itemid = 'drivebar' + key;
      document.getElementById(itemid).style.width = item.percent + '%';
      return null
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      "cpuspeed": 0,
      "cputemperature": 0,
      "cpuload": 0,
      "memtotal": 0,
      "memfree": 0,
      "memused": 0,
      "gfxname": "",
      "gfxram": 0,
      "disks":[{
        "total": 0,
        "used": 0,
        "percent": 0
      }],
      "nvidia": false
    }
  }

  render() {
    return (
      <div className="App">
        <Menu />
        <div className="content">
        <section>
          <div className="info">
            <h4>CPU <span>at {this.state.cpuspeed} GHz</span></h4>
          </div>
          <div className="data">
            <div className="data-item">
              <PieChart
                data={[
                  { value: this.state.cpuload, key: 1, color: '#009af3' },
                  { value: 100 - this.state.cpuload , key: 2, color: '#424251' },
                ]}
                startAngle={-90}
                lineWidth={10}
              />
              <h5>{this.state.cpuload} %</h5>
              <h6>Load</h6>
            </div>
            <div className="data-item">
              <PieChart
                data={[
                  { value: this.state.cputemperature, key: 1, color: '#ff3756' },
                  { value: 100 - this.state.cputemperature, key: 2, color: '#424251' },
                ]}
                startAngle={-90}
                lineWidth={10}
              />
              <h5>{this.state.cputemperature} °</h5>
              <h6>Temperature</h6>
            </div>
          </div>
        </section>
        <section className="gfx">

          {
            !this.state.nvidia
            ?
              <div>
              <div className="info">
                <h4>GPU</h4>
              </div>
              <h6>Name: {this.state.gfxname}</h6>
              <h6>Vram: {this.state.gfxram} Gb</h6>
              </div>
            :
            <div>
              <div className="info">
                <h4>GPU <span>{this.state.nvidia_name}</span></h4>
              </div>
              <div className="data">
                <div className="data-item">
                  <PieChart
                    data={[
                      { value: this.state.nvidia_load, key: 1, color: '#00ffbf' },
                      { value: 100 - this.state.nvidia_load , key: 2, color: '#424251' },
                    ]}
                    startAngle={-90}
                    lineWidth={10}
                  />
                  <h5>{this.state.nvidia_load} %</h5>
                  <h6>Load</h6>
                </div>
                <div className="data-item">
                  <PieChart
                    data={[
                      { value: this.state.nvidia_temp, key: 1, color: '#ff3756' },
                      { value: 100 - this.state.nvidia_temp, key: 2, color: '#424251' },
                    ]}
                    startAngle={-90}
                    lineWidth={10}
                  />
                  <h5>{this.state.nvidia_temp} °</h5>
                  <h6>Temperature</h6>
                </div>
                <div className="data-item">
                  <PieChart
                    data={[
                      { value: this.state.nvidia_fan, key: 1, color: '#f09145' },
                      { value: 100 - this.state.nvidia_fan, key: 2, color: '#424251' },
                    ]}
                    startAngle={-90}
                    lineWidth={10}
                  />
                  <h5>{this.state.nvidia_fan} %</h5>
                  <h6>Fan</h6>
                </div>
              </div>
            </div>
          }

        </section>
        { this.state.nvidia === true
          ?
            <section className="gfx">
              <div className="info">
                <h4>GPU RAM</h4>
                <h6>{this.state.nvidia_mem_used} of {this.state.nvidia_mem_total} gb</h6>
              </div>
              <div className="bar batterybar" id="gpu"></div>
              <div className="bar"></div>
            </section>
          :
             null
        }
        <section>
          <div className="info">
            <h4>RAM</h4>
            <h6>{this.state.memused} of {this.state.memtotal} gb</h6>
          </div>
          <div className="bar rambar" id="ram"></div>
          <div className="bar"></div>
        </section>
        { this.state.disks.map((disk, key) => {
          let classs = 'drivebar' + key
          return (
            <section key={key}>
              <div className="info">
                <h4>DRIVE {key + 1}</h4>
                <h6>{this.state.disks[key].used} of {this.state.disks[key].total} gb</h6>
              </div>
              <div className="bar drivebar" id={`${classs}`}></div>
              <div className="bar"></div>
            </section>)
        })}
        { this.state.batcharging !== undefined
          ?
            <section>
              <div className="info">
                {
                  this.state.batcharging === true
                    ?
                      <h4>BATTERY <span>charging</span></h4>
                    :
                      <h4>BATTERY</h4>
                }

                <h6>{this.state.batpercentage}%</h6>
              </div>
              <div className="bar batterybar" id="battery"></div>
              <div className="bar"></div>
            </section>
          :
             null
        }
        </div>
      </div>
    );
  }
}

export default App;

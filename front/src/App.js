import React, { Component } from 'react';
import './App.css';
import Menu from './components/menu'

class App extends Component {

  componentDidMount() {
    fetch('http://10.0.0.253:5000/api')
      .then(data => data.json())
      .then(data => {
        this.setState(data);
      })
  }

  componentDidUpdate() {
    document.getElementById("ram").style.width = ((this.state.memused * 100) / this.state.memtotal) + '%';
    document.getElementById("battery").style.width = this.state.batpercentage + '%';
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
      "gfxname": "Intel(R) HD Graphics 4000",
      "gfxram": 2,
      "disks":[]
    }
  }

  render() {
    return (
      <div className="App">
        <Menu />
        <section>
          <div className="info">
              <h4>CPU <span>at {this.state.cpuspeed} GHz</span></h4>
          </div>
          <h4>Temperature: {this.state.cputemperature}°</h4>
          <h4>Load: {this.state.cpuload}%</h4>
        </section>
        <section>
          <h4>GPU</h4>
        </section>
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
    );
  }
}

export default App;

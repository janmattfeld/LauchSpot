import React, { Component } from 'react';
import './App.css';
import p1 from './pics/1.jpg';
import p2 from './pics/2.jpg';
import p3 from './pics/3.jpg';
const belle = require('belle');
const TextInput = belle.TextInput;
const Card = belle.Card;

class App extends Component {
  render() {
      const picArray = [p1,p2,p3];
      const cardStyle= {width: '40%', padding: '0px 0', boxShadow: '0px', margin: '0px', display: 'inline'};
      return (
      <div className="App">
          <TextInput placeholder="Insert your favourite album here"/>
          {picArray.map((pic) => {
              return (<Card style={cardStyle}>
                  <img src={pic}/>
              </Card>);
          })}
      </div>
    );
  }
}

export default App;

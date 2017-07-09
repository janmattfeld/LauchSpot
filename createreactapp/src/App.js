import React, { Component } from 'react';
import './App.css';
import p1 from './pics/1.jpg';
import p2 from './pics/2.jpg';
import p3 from './pics/3.jpg';
const belle = require('belle');
const TextInput = belle.TextInput;
const Card = belle.Card;

class Logic {

}
class App extends Component {
    constructor() {
        this.state = {
            albumPics: []
        };
    }

    searchSpotify(searchString, callback) {
        const picArray = [p1,p2,p3];
        const response = {
            se
        }
        callback.apply(picArray);
    }

    searchCallback() {
        this.setState
    }
  render() {
      const cardStyle= {width: '100%', padding: '0px 0', boxShadow: '0px', margin: '0px', display: 'inline'};
      return (
      <div className="App">
          <TextInput placeholder="Insert your favourite album here" onclick={}/>
          {picArray.map((pic, index) => {
              return (<Card style={cardStyle}>
                  <img src={pic} alt={"album_" + index} width='auto' display="block"/>
              </Card>);
          })}
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import './App.css';

import * as injectTapEventPlugin from 'react-tap-event-plugin';


import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import TextField from 'material-ui/TextField'
import {Card, CardMedia} from 'material-ui/Card'
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class Logic {
    search(searchString, callback) {
        let song = {
            'titleName': 'Baba O\'Riley',
            'artist': 'The Who',
            'titleCoverUri': 'http://www.thewho.com/wp-content/uploads/2012/08/39-02-the_who_ultimate_coll-us-300x300.jpg'
        };

        console.log(searchString);

        let result = {
            'selectedSong': song,
            'otherSongs': [
                song,
                song,
                song,
                song,
                song
            ]
        };

        callback(result);
    }
}

class App extends Component {
    state = {
        searchString: ""
    };

    l = new Logic();

    onSearchResultSuccessfulCallback = (result) => {
        console.log(result);
    };

    onSearchFieldKeyPress = (event) => {
        if (event.charCode === 13) {
            this.l.search(this.state.searchString, this.onSearchResultSuccessfulCallback)
        }
    };

    onSearchChange = (_, searchString) => {
        this.setState({
            searchString : searchString
        });
    };

    handleSearchResult() {

    }

  render() {
      const cardStyle= {width: '100%', padding: '0px 0', boxShadow: '0px', margin: '0px', display: 'inline'};
      return (
          <MuiThemeProvider>
              <div className="App">
                  <TextField fullWidth={true} onChange={this.onSearchChange} onKeyPress={this.onSearchFieldKeyPress}/>

                  <div style={{position: "absolute", top: "50%", left: "50%"}}>
                  <Card style={{width: "300", height: "300", position: "relative", top: "-150", left: "-150"}}
                        containerStyle={{width: "300", height: "300"}}>
                      <CardMedia mediaStyle={{width: "300px", height: "300px", display: "block"}}>
                        <img src="http://www.thewho.com/wp-content/uploads/2012/08/39-02-the_who_ultimate_coll-us-300x300.jpg" alt="pic1"/>
                      </CardMedia>
                  </Card>
                  </div>
              </div>
          </MuiThemeProvider>
    );
  }
}

export default App;

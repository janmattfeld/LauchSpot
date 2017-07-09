import React, { Component } from 'react';
import './App.css';

import * as injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField'
import ArtistCards from './components/ArtistCards'

import SpotifyWrapper from './classes/SpotifyWrapper'

// Needed for onTouchTap by material-ui
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {
    state = {
        searchString: ""
    };

    spotifyWrapper = new SpotifyWrapper();

    onSearchResultSuccessfulCallback = (result) => {
        this.setState({ artists: result })
    };

    onSearchFieldKeyPress = (event) => {
        if (event.charCode === 13) {
            this.spotifyWrapper.search(this.state.searchString, this.onSearchResultSuccessfulCallback)
        }
    };

    onSearchChange = (_, searchString) => {
        this.setState({
            searchString : searchString
        });
    };

  render() {
      return (
          <MuiThemeProvider>
              <div className="App">
                  <TextField
                      name="searchField"
                      hintText={<p>Link your favourite song here.</p>}
                      hintStyle={{color: "#FFFFFF"}}
                      style={{width: "50%", marginTop: "20px"}}
                      onChange={this.onSearchChange}
                      onKeyPress={this.onSearchFieldKeyPress}
                      underlineFocusStyle={{borderColor: "#1BA64E"}}
                      inputStyle={{color: "#FFFFFF"}}/>
                  <ArtistCards artists={this.state.artists}/>
              </div>
          </MuiThemeProvider>
    );
  }
}

export default App;

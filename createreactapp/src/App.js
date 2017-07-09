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
                song
            ]
        };

        callback(result);
    }
}

var card_height=300;
var card_width=300;
var card_height_offset=(-card_height/2);
var card_width_offset=(-card_width/2).toString();

class ArtistCard extends Component {
    render() {
        //console.log("here: ", card_height_offset);
        return (<div style={{position: "absolute", top: "50%", left: "50%"}}>
            <div style={this.props.stylePosition}>
                <Card style={{width: card_width, height: card_height, position: "relative", top: card_height_offset, left: card_width_offset}}
                      containerStyle={{width: "300", height: "300"}}>
                    <CardMedia mediaStyle={{width: "300px", height: "300px", display: "block"}}>
                        <img src={this.props.artist.titleCoverUri} alt="pic1"/>
                    </CardMedia>
                </Card>
            </div>
        </div>)
    }
}

class ArtistCards extends Component {
    cardPositions = [
        {position: "relative", top: "-150", left: "-150"},
        {position: "relative", top: "150", left: "-150"},
        {position: "relative", top: "150", left: "150"},
        {position: "relative", top: "-150", left: "150"}
    ];

    render() {
        //console.log(this.props.artists);
        if(Object.keys(this.props.artists).length === 0) {
            return <div/>;
        }
        return (<div style={{position: "absolute", top: "50%", left: "50%"}}>

            {this.props.artists["otherSongs"].map((song, index) => {
                //console.log("position: ", this.cardPositions[index]);
                return <ArtistCard artist={this.props.artists["selectedSong"]} stylePosition={this.cardPositions[index]} />
            })}

            <ArtistCard artist={this.props.artists["selectedSong"]} stylePosition={{position: "relative", top: "0", left: "0"}}/>
            
            </div>)
    }
}

class App extends Component {
    state = {
        searchString: "",
        artists: {}
    };

    l = new Logic();

    onSearchResultSuccessfulCallback = (result) => {
        //console.log(result);
        this.setState({ artists: result })
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

  render() {
      return (
          <MuiThemeProvider>
              <div className="App" height="100%" width="100%" backgroundColor="#122329">
                  <TextField fullWidth={true} onChange={this.onSearchChange} onKeyPress={this.onSearchFieldKeyPress} underlineFocusStyle={{borderColor: "#1BA64E", color: "#1BA64E"}} inputStyle={{color: "#FFFFFF"}}/>
                  <ArtistCards artists={this.state.artists}/>
              </div>
          </MuiThemeProvider>
    );
  }
}

export default App;

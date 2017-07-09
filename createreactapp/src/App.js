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

var box_dimension=500;
var card_height=box_dimension;
var card_width=box_dimension;
var card_height_offset=-card_height / 2;
var card_width_offset=-card_width / 2;
var image_height=box_dimension;
var image_width=box_dimension;

var standard_picture_offset=box_dimension / 1.5;

class ArtistCard extends Component {
    render() {
        return (<div style={{position: "absolute", top: "50%", left: "50%"}}>
            <div style={this.props.stylePosition}>
                <Card style={{width: card_width, height: card_height, position: "relative", top: card_height_offset, left: card_width_offset}}
                      containerStyle={{width: card_width, height: card_height}}>
                    <CardMedia mediaStyle={{width: image_width, height: image_height, display: "block"}}>
                        <img src={this.props.artist.titleCoverUri} alt="pic1"/>
                    </CardMedia>
                </Card>
            </div>
        </div>)
    }
}

class ArtistCards extends Component {
    selectedCardPosition = {position: "relative", top: "0", left: "0"};

    cardPositions = [
        {position: "relative", top: -standard_picture_offset, left: -standard_picture_offset},
        {position: "relative", top: standard_picture_offset, left: -standard_picture_offset},
        {position: "relative", top: standard_picture_offset, left: standard_picture_offset},
        {position: "relative", top: -standard_picture_offset, left: standard_picture_offset}
    ];

    state = {
        previousCardPositions: this.cardPositions
    };

    randomHoverOffset() {
        return -.1 + .2 * Math.random();
    }

    randomStartOffset() {
        return -40 + 80 * Math.random();
    }

    componentDidUpdate() {
        setTimeout(()=> {
            console.log("hit");

            var cardPositions = this.state.previousCardPositions.map(position => {
                return {
                    ...position,
                    left: position.left + this.randomHoverOffset(),
                    top: position.top + this.randomHoverOffset()
                }
            });

            this.setState({
                previousCardPositions: cardPositions
            });
        }, 1);
    }

    render() {
        if(this.objectIsEmpty(this.props.artists)) {
            return <div/>;
        }

        //console.log(this.state.previousCardPositions);

        return (<div style={{position: "absolute", top: "50%", left: "50%"}}>
            {this.props.artists["otherSongs"].map((song, index) => {
                //var cardPosition = this.state.previousCardPositions[index];
                //cardPosition.left += this.randomHoverOffset();
                //cardPosition.top += this.randomHoverOffset();
                //this.state.previousCardPositions[index] = cardPosition;
                console.log(this.state.previousCardPositions);
                //debugger;
                return <ArtistCard artist={song} stylePosition={this.state.previousCardPositions[index]} />
            })}
            <ArtistCard artist={this.props.artists["selectedSong"]} stylePosition={this.selectedCardPosition}/>
        </div>)
    }

    objectIsEmpty(obj) {
        return Object.keys(obj).length === 0;
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

import React, { Component } from 'react';
import './App.css';

import * as injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField'
import {Card, CardMedia, CardTitle} from 'material-ui/Card'

// Needed for onTouchTap by material-ui
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

var SpotifyWeb = require('spotify-web-api-js');

class Logic {
    set(tracks, callback) {

        console.log(tracks)

        let result = {

            'selectedSong': tracks[0],

            'otherSongs': [tracks[1], tracks[2], tracks[3], tracks[4]]

        };

        callback(result);

    }

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
                    <CardMedia
                        mediaStyle={{width: image_width, height: image_height, display: "block"}}
                        overlay={<CardTitle title={this.props.artist.titleName} subtitle={this.props.artist.artist} />}>
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
        previousCardPositions: [
            {position: "relative", top: -standard_picture_offset, left: -standard_picture_offset},
            {position: "relative", top: standard_picture_offset, left: -standard_picture_offset},
            {position: "relative", top: standard_picture_offset, left: standard_picture_offset},
            {position: "relative", top: -standard_picture_offset, left: standard_picture_offset}
        ]
    };

    goalPositions = [
        {position: "relative", top: -standard_picture_offset, left: -standard_picture_offset},
        {position: "relative", top: standard_picture_offset, left: -standard_picture_offset},
        {position: "relative", top: standard_picture_offset, left: standard_picture_offset},
        {position: "relative", top: -standard_picture_offset, left: standard_picture_offset}
    ];

    randomHoverOffset() {
        return -.1 + .2 * Math.random();
    }

    randomStartOffset() {
        return -40 + 80 * Math.random();
    }

    setNewGoalPositions() {
        this.goalPositions = this.cardPositions.map(position => {
            var newLeft = position.left + this.randomStartOffset();
            var newTop = position.top + this.randomStartOffset();

            return {
                position: position.position,
                left: newLeft,
                top: newTop
            }
        });

        setTimeout(() => {
            this.setNewGoalPositions();
        }, 300);
    }

    componentDidUpdate() {
        setTimeout(()=> {
            console.log("updating positions");

            var cardPositions = [];
            for (var i = 0; i < this.goalPositions.length; i++) {
                var currentPosition = this.state.previousCardPositions[i];
                var goalPosition = this.goalPositions[i];

                var newLeft = currentPosition.left + 0.01 * (goalPosition.left - currentPosition.left);
                var newTop = currentPosition.top + 0.01 * (goalPosition.top - currentPosition.top);

                cardPositions[i] = {
                    ...currentPosition,
                    left: newLeft,
                    top: newTop
                }
            }

            this.setState({
                previousCardPositions: cardPositions
            });
        }, 1);
    }

    componentDidMount() {
        console.log("updating goals");
        this.setNewGoalPositions();
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
                //console.log(this.state.previousCardPositions);
                //debugger;
                return <ArtistCard key={"song" + index} artist={song} stylePosition={this.state.previousCardPositions[index]} />
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
        artists: {},
        spotify: new SpotifyWeb()
    };

    componentWillMount() {

        this.setState({artist: this.state.defaultArtist})

        // Setup Spotify API

        fetch("https://accounts.spotify.com/api/token", {

            body: "grant_type=client_credentials",

            headers: {

                Authorization: "Basic ODA5MmJmNDc5MTIwNGU5NmE0ZjkyMjdmNWNhNWUzOGI6NGRhMjEzNDA1YTAzNGY4MWE5Mjk4MG" +

                "E2YzNjYWRjZTg=",

                "Content-Type": "application/x-www-form-urlencoded"

            },

            method: "POST"

        }).then((response) => {

            return response.json();

        }).then((result) => {

            this

                .state

                .spotify

                .setAccessToken(result.access_token)

        })

    }

    findArtist = (searchValue) => {

        return new Promise((resolve, reject) => {

            this

                .state

                .spotify

                .searchArtists(searchValue, (err, data) => {

                    if (err) {

                        this.setState({artist: this.state.defaultArtist})

                    } else {

                        if (data.artists && data.artists.items[0] && data.artists.items[0].name && data.artists.items[0].images && data.artists.items[0].images[1]) {

                            let newArtist = data.artists.items[0]

                            this.setState({artist: newArtist})

                            resolve(newArtist.id)

                        } else {

                            this.setState({artist: this.state.defaultArtist})

                            reject()

                        }

                    }

                })

        });

    }

    findRelatedTracks = (artistID) => {

        return new Promise((resolve, reject) => {

            this

                .state

                .spotify

                .getArtistTopTracks(artistID, 'DE', function (err, data) {

                    if (err) {

                        console.error(err);

                        reject()

                    } else {

                        console.log(data);

                        resolve(data)

                    }

                })

        });

    }

    l = new Logic();

    onSearchResultSuccessfulCallback = (result) => {
        //console.log(result);
        this.setState({ artists: result })
    };

    onSearchFieldKeyPress = (event) => {
        if (event.charCode === 13) {
            this

                .findArtist(this.state.searchString)

                .then(this.findRelatedTracks)

                .then((tracks) => {

                    console.log(tracks)

                    let songs = []

                    for (let i=0;i<5;i++) {

                        songs[i]= {

                            'titleName': tracks.tracks[i].name,

                            'artist': tracks.tracks[i].artists[0].name,

                            'titleCoverUri': tracks.tracks[i].album.images[0].url

                        }

                    }

                    this

                        .l

                        .set(songs, this.onSearchResultSuccessfulCallback)

                })        }
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

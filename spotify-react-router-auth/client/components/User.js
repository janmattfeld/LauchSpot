import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getMyInfo,
  setTokens,
} from '../actions/actions';

const SpotifyWeb = require('spotify-web-api-js');

/**
 * Our user page
 * Displays the user's information
 */
class User extends Component {
  constructor(props) {
    super(props);
    // console.log(this.probs);
    this.state = {
      spotify: new SpotifyWeb(),
      defaultArtist: {
        images: [
          {
            url: 'http://bobjames.com/wp-content/themes/soundcheck/images/default-album-artwork.png',
          }, {
            url: 'http://bobjames.com/wp-content/themes/soundcheck/images/default-album-artwork.png',
          }, {
            url: 'http://bobjames.com/wp-content/themes/soundcheck/images/default-album-artwork.png',
          },
        ],
      },
    };
    console.log(this.state);
  }

  /** When we mount, get the tokens from react-router and initiate loading the info */
  componentDidMount() {
    // params injected via react-router, dispatch injected via connect
    const { dispatch, params } = this.props;
    const {accessToken, refreshToken} = params;
    this.setState({ artist: this.state.defaultArtist });
    this.state.spotify.setAccessToken(accessToken);
    dispatch(setTokens({ accessToken, refreshToken }));
    dispatch(getMyInfo());
  }

  handleSearchInput (e) {
    console.log('Handler triggered');
    if (!e.target.value) {
      // No search value -> reset
      this.setState({ artist: this.state.defaultArtist });
      return;
    }

    // Search for an Artist on Spotify
    console.log('Searching for Artist')
    this.state.spotify.searchArtists(e.target.value, (err, data) => {
        if (err) {
          console.log("Error in Spotify artist search");
          this.setState({artist: this.state.defaultArtist})
        } else {
          if (data.artists && data.artists.items[0] && data.artists.items[0].name && data.artists.items[0].images && data.artists.items[0].images[1]) {
            let newArtist = data.artists.items[0]
            this.setState({artist: newArtist})
          } else {
            this.setState({artist: this.state.defaultArtist})
          }
        }

      })
    console.log(this.state);
  }

  handleAlbumClick(artistID){
      console.log("Artist ID: " + artistID);
      this.state.spotify.getArtistTopTracks(artistID, 'DE', (err, data) => {
        if (err) {
          console.log("Could not get TopSongs of artist");
        } else {
          console.log(data);
          function getURI(item, index) {
              var URI = item.uri;
              return URI;
          }
          var songURIs = data.tracks.map(getURI);
          console.log(songURIs);
          this.setState({songList: songURIs});

          fetch("https://api.spotify.com/v1/me/player/play", {
            body: JSON.stringify({uris: songURIs}),
            headers: {
              Authorization: "Bearer " + this.props.params.accessToken,
              "Content-Type": "application/json"
            },
            method: "PUT"
          }).then((response) => {
            console.log(response);
            console.log(result);
          });

        }
      });


    //console.log(JSON.stringify({uris: '[spotify:track:6QPKYGnAW9QozVz2dSWqRg]'}));  
  }

  /** Render the user's info */
  render() {
    const { accessToken, refreshToken, user } = this.props;
    const { loading, display_name, images, id, email,
      external_urls, href, country, product } = user;
    // if we're still loading, indicate such
    if (loading) {
      return <h2>Loading...</h2>;
    }

    var imageURL = this.state.artist ? this.state.artist.images[1].url : null;
    var artistName = this.state.artist ? this.state.artist.name : 'Artist not found';
    var artistID = this.state.artist ? this.state.artist.id : null;
    //const {artist} = this.state

    return (
        <div className="user">
          <div className='user-Content'>
            <img src={imageURL} className="App-logo" alt="logo" onClick={this.handleAlbumClick.bind(this, artistID)}/>
            <h2>{artistName}</h2>
          </div>
          <input type={'text'} onChange={this.handleSearchInput.bind(this)}/>
          {/* Spotify Player is not synced to current playback
          <div className='SpotifyPlayer'>
          <iframe src="https://open.spotify.com/embed?uri=spotify:user:blzonline:playlist:5mHZgvgf7qPAg2IpY8Ovej" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>
          </div>
          */}  
        </div>
    );
  }
}

export default connect(state => state)(User);

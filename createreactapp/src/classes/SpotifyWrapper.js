
var SpotifyWeb = require('spotify-web-api-js');

class SpotifyWrapper {
    constructor() {
        this.spotify = new SpotifyWeb();

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
                .spotify
                .setAccessToken(result.access_token)
        })
    }

    search(searchString, callback) {
        this
            .findArtist(searchString)
            .then(this.findRelatedTracks)
            .then((tracksResult) => {
                var result = {
                    'selectedSong': {},
                    'otherSongs': []
                }

                var numTracksShown = Math.min(5, tracksResult.tracks.length);
                for (let i = 0; i < numTracksShown; i++) {
                    console.log(tracksResult);
                    var song = {
                        'titleName': tracksResult.tracks[i].name,
                        'artist': tracksResult.tracks[i].artists[0].name,
                        'titleCoverUri': tracksResult.tracks[i].album.images[0].url
                    }

                    if (i === 0) result['selectedSong'] = song;
                    else result['otherSongs'][i - 1] = song;
                }

                callback(result);
            })
    }

    findArtist = (searchValue) => {
        return new Promise((resolve, reject) => {
            this
                .spotify
                .searchArtists(searchValue, (err, data) => {
                    if (err) {
                        //this.setState({artist: this.state.defaultArtist})
                    } else {
                        if (data.artists && data.artists.items[0] && data.artists.items[0].name && data.artists.items[0].images && data.artists.items[0].images[1]) {
                            let newArtist = data.artists.items[0]
                            //this.setState({artist: newArtist})
                            resolve(newArtist.id)
                        } else {
                            //this.setState({artist: this.state.defaultArtist})
                            reject()
                        }
                    }
                })
        });

    }

    findRelatedTracks = (artistID) => {
        return new Promise((resolve, reject) => {
            this
                .spotify
                .getArtistTopTracks(artistID, 'DE', function (err, data) {
                    if (err) {
                        console.error(err);
                        reject();
                    } else {
                        console.log(data);
                        resolve(data);
                    }
                })
        });
    }
};

module.exports = SpotifyWrapper;
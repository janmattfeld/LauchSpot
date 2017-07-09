import React, { Component } from 'react';

/**
 * Main app component
 * Has a header and then render's the page content
 */
export default class SpotifyLogin extends Component {
  render() {
    // injected via react router
    const {children} = this.props;
    return (
      <div className="spotify-login">
        <h1>Spotify + React = AWESOME</h1>
        <div className="page-content">
          <p>Enter an artist and then click on the image to start playback.</p>
          {children}
        </div>
      </div>
    );
  }
}

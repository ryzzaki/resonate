import React from 'react';

class WebPlayer extends React.Component {
  constructor(props: Readonly<{}>) {
    super(props);
    this.handleLoadSuccess = this.handleLoadSuccess.bind(this);
    // this.handleLoadFailure = this.handleLoadSuccess.bind(this);
    this.cb = this.cb.bind(this);
  }

  componentDidMount() {
    window.onSpotifyWebPlaybackSDKReady = () => {
      this.handleLoadSuccess();
    };
  }

  handleLoadSuccess() {
    this.setState({ scriptLoaded: true });
    const token = '[ACCESS_TOKEN]';
    const player = new window.Spotify.Player({
      name: 'Web Playback SDK Quick Start Player',
      getOAuthToken: (cb: (arg0: string) => void) => {
        cb(token);
      },
    });

    // Error handling
    player.addListener('initialization_error', ({ message }: any) => {
      // console.error(message);
    });
    player.addListener('authentication_error', ({ message }: any) => {
      // console.error(message);
    });
    player.addListener('account_error', ({ message }: any) => {
      // console.error(message);
    });
    player.addListener('playback_error', ({ message }: any) => {
      // console.error(message);
    });

    player.addListener('player_state_changed', (state: any) => {
      // console.log(state);
    });

    player.addListener('ready', ({ device_id }: any) => {
      // console.log('Ready with Device ID', device_id);
      this.play({
        playerInstance: player,
        spotify_uri: 'spotify:track:3ylAQdZiFJM9LlxryPxr1A',
      });
    });

    player.addListener('not_ready', ({ device_id }: any) => {
      // console.log('Device ID has gone offline', device_id);
    });

    player.connect();
  }

  play({
    spotify_uri,
    playerInstance: {
      _options: { getOAuthToken, id },
    },
  }: any) {
    getOAuthToken((accessToken: string) => {
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [spotify_uri] }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });
    });
  }

  cb(token: any) {
    return token;
  }

  handleScriptCreate() {
    this.setState({ scriptLoaded: false });
  }

  handleScriptError() {
    this.setState({ scriptError: true });
  }

  handleScriptLoad() {
    this.setState({ scriptLoaded: true });
  }
}

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: any;
    Spotify: any;
  }
}

export default WebPlayer;

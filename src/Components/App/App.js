import React from 'react';
//import logo from './logo.svg';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import PlaylistList from '../PlaylistList/PlaylistList';
import Spotify from '../../util/Spotify';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'Enter a new playlist name',
      playlistTracks: []
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
    this.selectPlaylist = this.selectPlaylist.bind(this);

  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack =>
      savedTrack.id === track.id
    )) {
      return;
    }
    tracks.push(track);
    this.setState(
      { playlistTracks: tracks }
    );
  }
  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    let newTracks = tracks.filter(currentTrack => currentTrack.id != track.id);
    this.setState(
      { playlistTracks: newTracks }
    );
  }
  updatePlaylistName(name) {
    this.setState({ playlistName: name });
  }

  savePlaylist() {
    //alert("this is bound to save button");
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState(
        {
          playlistName: 'Enter new playlist name',
          playlistTracks: []

        }
      );
    });
  }
  search(searchTerm) {
    //alert('search started');
    Spotify.search(searchTerm).then(searchResults => {
      this.setState({ searchResults: searchResults })
    });
  }

  selectPlaylist(id){
    const userPlaylists = Spotify.getUserPlaylists();
    const chosenPlaylist = userPlaylists.filter(playlist => playlist.id === id);
    Spotify.getPlaylist(id).then((response)=>{
      this.setState(
        {
          playlistName: chosenPlaylist.name,
          playlistTracks: [response]
        }
      );
    });
  }

  componentDidMount(){
    window.addEventListener('load', Spotify.getAccessToken);
  }
  render() {

    return (
      <div>
        <h1>Spotty<span className="highlight">list</span></h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <PlaylistList onSelect={this.selectPlaylist}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );

  }
}

export default App;


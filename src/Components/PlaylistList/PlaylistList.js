import React from 'react';
import './PlaylistList.css';
import Spotify from '../../util/Spotify';
import PlaylistListItem from '../playlistListItem/playlistListItem';

class PlaylistList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playlists: []
        }

        this.renderAction = this.renderAction.bind(this);
    }

    componentWillMount() {

        Spotify.getUserPlaylists().then(result => {
            alert(result);
            this.setState(
                { playlists: result }

            );
        }

        );
        // alert('componentwill mount worked');

        //alert(playlists);


    }
    renderAction() {
        if (this.state.playlist) {
            this.state.playlists.map(playlist => {
                return <PlaylistListItem playlistName={playlist.name} key={playlist.id} onSelect={this.props.onSelect} />
            });
        } else return <div></div>;
    }

    render() {
        return (
            <div className='PlaylistList'>
                <h2>Local Playlists</h2>
                {this.renderAction()}
            </div>
        );
    }
}

export default PlaylistList;
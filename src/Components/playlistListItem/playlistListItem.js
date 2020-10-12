import React from 'react';
import './playlistListItem.css';

class playlistListItem extends React.Component{

    render(){
        return(
            <div className="Track">
                <div className="Track-information" onClick={this.props.onSelect(this.props.key)}>
                    <h3>{this.props.playlistName}</h3>
                </div>
            </div>

        );
    }
}

export default playlistListItem;
const clientID = '721b659e57c94fb6a8eb3b631f9df80a';
const redirectUri = 'http://localhost:3000/';
let accessToken = '';



const Spotify = {
    getAccessToken() {
        if (accessToken) {
            //alert('acces token already exist');
            return accessToken;
        }
/*
        const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
        window.location = accessUrl;

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            //this wipes the access token and URL parameters
           window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            alert('access token ' +  accessToken);
            return accessToken;
        }

*/


        //check for access token
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);

            //this wipes the access token and URL parameters
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            alert('access token ' +  accessToken);
            
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }


    },

    search(searchTerm) {
        const accessToken = Spotify.getAccessToken();
       

        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
            {
                headers: {Authorization: `Bearer ${accessToken}`}
            }
        ).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                //alert('no track');
                return [];
            }
          
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                //artist: track.artist[0].name,
                album: track.album.name,
                uri: track.uri
            }));

        });


    },

    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        // const uriList = trackUris.join();
        let userID = '';
        let playlistID = '';

        return fetch(`https://api.spotify.com/v1/me`,
            {
                headers: headers
            }
        ).then(response => response.json()
        ).then(jsonResponse => {
            userID = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`,
                {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({ name: name })
                }
            ).then(response => response.json()
            ).then(jsonResponse => {
                playlistID = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
                    {
                        method: 'POST',
                        headers: headers,
                        body: JSON.stringify({ uris: trackUris })
                    }
                );
            });
        }
        );




    }
}


export default Spotify;
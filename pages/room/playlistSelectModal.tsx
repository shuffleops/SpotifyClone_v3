import React, { useState, useEffect } from "react";
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;


export default function playlistSelectModal({ setPlaylist, setPlaylistSelectShow }) {
    const [isFetched, setIsFetched] = useState<boolean>(false);
    const [playlists, setPlaylists] = useState<any[]>([]);

    useEffect(() => {
        // get all playlists from spotify
        // display them in a modal
        // user selects one
        // modal closes
        // playlist is added to room
        const fetchPlaylists = async () => {
            const response = await fetch(`${SERVER_URL}/api/playlists`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            const fetchedPlaylists = await response.json();
            console.log('fetchedPlaylists', fetchedPlaylists.items)
            setPlaylists(fetchedPlaylists.items);
            setIsFetched(true);
        }
        if (!isFetched) {
            fetchPlaylists();
        }
    }, [])

    const handleClose = (e) => {
        e.preventDefault();
        setPlaylistSelectShow(false);
    }

    const handleSelect = (e) => {
        e.preventDefault();
        setPlaylist(e.target.value);
        setPlaylistSelectShow(false);
    }

    if (!playlists) return (
        <div>Loading...</div>
    )

    return (
        <div
            className='modalBackground'
            id="outside"
            onClick={handleClose}>
            <div className='modal'>
                <div className='rounded-lg shadow-lg p-4 border border-white'>
                    <div className="cart-header flex flex-row place-content-between border-b p-1 border-white">
                        <div className="text-bold">Playlist select</div>
                        <button className="text-bold" onClick={handleClose}>
                            X
                        </button>
                    </div>
                    <div className="">
                        {playlists?.map((playlist) => (
                            <div className="flex flex-row place-content-between border-b p-1 border-gray-300">
                                <div className="text-bold">{playlist.name}</div>
                                <button 
                                    className="bg-gray-100 rounded-lg py-2 px-4 text-white border border-white"
                                    key={playlist.id}
                                    value={(playlist)}

                                    // value={JSON.stringify(playlist)}
                                    onClick={handleSelect}
                                    >
                                    Select
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

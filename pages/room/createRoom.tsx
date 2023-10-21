"use client";
import { useState, useContext, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import Layout from "../../components/Layout";
import QueueTable from "../../components/QueueTable";
import { MySession, Room } from "../../types/types";
import { customGet } from "../../utils/customGet";
import { isAuthenticated } from "../../utils/isAuthenticated";
import { useRoom } from "../../context/RoomContext";
import { createRoom, getRoom } from "../../utils/database/calls";

import PlaylistSelect from "./playlistSelectModal";

interface IProps {
  room: Room;
}

export default function CreateRoom() {
  const router = useRouter();

  const { data: session }: { data: MySession } = useSession();
  const { room, setRoom } = useRoom();

  const [roomName, setRoomName] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [playlistSelectShow, setPlaylistSelectShow] = useState<boolean>(false);
  const [playlist, setPlaylist] = useState<string>();

  useEffect(() => {
    if (room) {
      // redirect to createRoom.tsx
      router.push("/room/currentRoom");
    }
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    const newRoom = {
      id: '1',
      name: roomName,
      owner: session.user.email,
      members: [session.user.email],
    }
    const result = await createRoom(newRoom);
    console.log('result', result)
    if (!result) {
      alert("Error creating room");
    } else {
      setRoom(newRoom);
      router.push("/room/currentRoom");
    }
  }

  const handleJoinRoom = async (e) => {
    e.preventDefault();

    const newRoom = await getRoom(roomId);
    console.log('newRoom', newRoom)
    if (newRoom) {
      setRoom(newRoom);
      router.push("/room/currentRoom");
    } else {
      alert("Room not found");
    }
  }

  const handlePlaylistSelect = async (e) => {
    e.preventDefault();
    setPlaylistSelectShow(true)
  }

  if (playlist) {
    // console.log(JSON.stringify(playlist));
    }

  return (
    <Layout title="Create or Join Room">
      <div>
        {playlistSelectShow && (
          <PlaylistSelect setPlaylist={setPlaylist} setPlaylistSelectShow={setPlaylistSelectShow} />
        )}
      </div>
      <>
        <div className="flex flex-col gap-20">
          <div className="flex flex-col gap-3">
            <h2 className="text-5xl font-bold">Create Room</h2>

            <div className="flex flex-col items-start gap-5 text-sm">
              <span className="font-bold">Create a room to share with friends</span>
              <input className="text-black" type="text" placeholder="Room Name" onChange={(e) => setRoomName(e.target.value)} />
              {!playlist && (
                <button
                  className="bg-gray-100 rounded-lg py-2 px-4 text-white border border-white"
                  onClick={handlePlaylistSelect}>Select a playlist</button>
              )}
              {playlist && (
                <span className="font-bold">Playlist: {playlist.name}</span>
              )}
              <button
                className="bg-gray-100 rounded-lg py-2 px-4 text-white border border-white"
                onClick={handleCreateRoom}>Create Room</button>
            </div>
          </div>


          <div className="flex flex-col gap-3">
            <h2 className="text-5xl font-bold">Join Room</h2>

            <div className="flex flex-col items-start gap-5 text-sm">
              <span className="font-bold">Room ID:</span>
              <input className="text-black" placeholder="Room Code" onChange={(e) => setRoomId(e.target.value)} />
              <button onClick={(e) => {
                handleJoinRoom(e);
              }}>Join Room</button>
            </div>
          </div>
        </div>

      </>
    </Layout>
  );
}

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const session = await getSession(ctx);

//   if (!(await isAuthenticated(session))) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   // const likedTracks = await customGet(
//   //   `https://api.spotify.com/v1/me/tracks?market=from_token&limit=50`,
//   //   session
//   // );
//   // const { queueList } = useSpotify();


//   // return { props: { queueList } };
// };

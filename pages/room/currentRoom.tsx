import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import Layout from "../../components/Layout";
import QueueTable from "../../components/QueueTable";
import { MySession, PlaylistType, Track } from "../../types/types";
import { customGet } from "../../utils/customGet";
import { isAuthenticated } from "../../utils/isAuthenticated";
import { usePlayer } from "../../context/PlayerContext";
import { useRoom } from "../../context/RoomContext";
import PreviewPlayer from "../../components/PreviewPlayer";

interface IProps {
  queueList: PlaylistType;
}

export default function CurrentRoom() {
  const router = useRouter();
  const { data: session }: { data: MySession } = useSession();
  const { currentTrack, setCurrentTrack, duration, currentTime } = usePlayer();
  const { room, queueList, setQueueList } = useRoom();

  // CHECK IF IN ROOM
  useEffect(() => {
    if (!room) {
      // redirect to createRoom.tsx
      router.push("/room/createRoom");
    }
  }, []);

  const playTrack = (track: Track) => {
    setCurrentTrack(track);
  };

  // PLAY SONG ON OPEN
  useEffect(() => {
    if (queueList && !currentTrack) {
      playTrack(queueList.queuedTracks.items[0].queuedTrack)
    }
  }, []);

  // SHUFFLE QUEUE
  useEffect(() => {
    if (duration && currentTime && (duration == currentTime)) {
      setQueueList((prevQueueList) => {
        const newList = { ...prevQueueList };
  
        // Remove the first track from the queue
        newList.queuedTracks.items.shift();
  
        // Sort the remaining tracks based on the difference between upvotes and downvotes
        newList.queuedTracks.items.sort((a, b) => {
          const aVoteDiff = a.queuedTrack.upvotes - a.queuedTrack.downvotes;
          const bVoteDiff = b.queuedTrack.upvotes - b.queuedTrack.downvotes;
          return bVoteDiff - aVoteDiff; // Sort in descending order
        });
  
        // Update the position property for each track
        newList.queuedTracks.items.forEach((item, index) => {
          item.queuedTrack.position = index + 1;
        });
  
        return newList;
      });
  
      if (queueList.queuedTracks.items[0]) {
        playTrack(queueList.queuedTracks.items[0].queuedTrack)
      } else {
        setCurrentTrack(null);
      }
    }
  }, [duration, currentTime]);

  return (
    <Layout title="Spotify - Liked Songs">
      {/* {queueList && ( */}
      <>
        <div className="flex items-end gap-6">
          <div className="flex flex-col gap-3">
            <h2 className="text-5xl font-bold">Room: {room?.name}</h2>

            <div className="flex items-center gap-5 text-sm">
              <span className="font-bold">Currently Playing</span>
            </div>
          </div>
        </div>
        <div>
          <div className="mb-5">
            <PreviewPlayer />
          </div>
          <div className="flex items-center gap-5 text-sm">
            <span className="font-bold">Next in Queue</span>
            {queueList?.queuedTracks?.items.length > 0 && (
              <span className="text-gray">{queueList?.queuedTracks?.total - 1} songs</span>
            )}{" "}
          </div>
          <QueueTable tracks={queueList?.queuedTracks?.items.map((item) => item.queuedTrack)} />
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

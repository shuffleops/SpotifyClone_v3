import Link from "next/link";
import { MdSchedule } from "react-icons/md";
import { usePlayer } from "../context/PlayerContext";
import { useSpotify } from "../context/SpotifyContext";
import { useRoom } from "../context/RoomContext";
import { QueuedTrack, QueueType, Room, Track } from "../types/types";
import { fmtMSS } from "../utils/formatDuration";
import { updateRoom } from "../utils/database/calls";

interface IProps {
  tracks: Track[];
  noAlbum?: boolean;
  noArtist?: boolean;
}

export default function TracksTable({
  tracks,
  noAlbum = false,
  noArtist = false,
}: IProps) {
  const { setCurrentTrack } = usePlayer();
  const { setTracksQueue } = useSpotify();
  const { room, setRoom, setQueuedTrack, queueList, setQueueList } = useRoom();


  const playTrack = (track: Track) => {
    if (track.preview_url) {
      setCurrentTrack(track);
    }
  };

  const getAlbumFromUrl = async () => {
    const currentUrl = window.location.href;
    const regex = /album\/([\w-]+)/;
    const match = currentUrl.match(regex);
    const albumId = match ? match[1] : null;
    // console.log(`albumId ${albumId}`)
    const result = await fetch(`/api/album`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ albumId: albumId }),
    });
    const albumDetails = await result.json();
    return albumDetails
  };

  const generateNewQueueList = (prevQueueList, newQueuedTrack) => {
    if (!prevQueueList) {
      // If the queueList is empty (null), create a new QueueType item
      const newQueueItem: QueueType = {
        id: "some_unique_id", // Use a unique id
        name: "some_name", // Use an appropriate name
        queuedTracks: {
          items: [{ added_at: new Date().toISOString(), queuedTrack: newQueuedTrack }],
          total: 1,
        },
      };
      return newQueueItem;
    }
  
    // Otherwise, add the newQueuedTrack to the queuedTracks of the existing queueList
    const updatedQueueList = {
      ...prevQueueList,
      queuedTracks: {
        items: [
          ...(prevQueueList.queuedTracks?.items || []),
          { added_at: new Date().toISOString(), queuedTrack: newQueuedTrack },
        ],
        total: (prevQueueList.queuedTracks?.total || 0) + 1,
      },
    };
  
    return updatedQueueList;
  };

  // Add track to queueList
  const addTrack = async (track: Track) => {
    // Check if in room
    if (!room) {
      alert("You must be in a room to add a track to the queue");
      return;
    }
    // Check if in album, if not, get the album id from the url?
    if (!track.album) {
      const albumDetails = await getAlbumFromUrl();
      // console.log(`albumDetails = ${JSON.stringify(albumDetails)}`)
      track = { ...track, album: albumDetails };
    }
    // Check if there's a valid item in queueList
    // const validQueueItem = queueList?.length > 0 && queueList[0];
    const validQueueItem = queueList;


    // Get the current total tracks in QueueList
    const currentTotalTracks = validQueueItem?.queuedTracks?.total || 0;

    // Generate the position for the new track
    const newPosition = currentTotalTracks + 1;

    // Create a new QueuedTrack object
    const newQueuedTrack: QueuedTrack = {
      position: newPosition,
      upvotes: 0,
      downvotes: 0,
      ...track,
    };
    // console.log(JSON.stringify(newQueuedTrack))

    const newQueueList = generateNewQueueList(queueList, newQueuedTrack);
    // console.log(`newQueueList ${JSON.stringify(newQueueList)}`)

    // Add the new QueuedTrack to the first item in the queueList
    setQueueList(newQueueList)

    // Update the room with the new queue list
    const roomUpdate: Room = { ...room, queueList: newQueueList };
    await updateRoom(roomUpdate);

    return newQueueList;
  }

  return (
    <div className="grid grid-cols-12 gap-2 p-1 mt-8">
      {!noArtist && (
        <>
          <div className="col-span-1 font-semibold tracking-wider text-left text-white uppercase">
            #
          </div>

          <div
            className={`${noAlbum ? "col-span-10" : "col-span-6"
              } text-sm font-medium tracking-wider text-left uppercase text-gray`}
          >
            Title
          </div>

          {!noAlbum && (
            <div className="col-span-4 text-sm font-medium tracking-wider text-left uppercase text-gray">
              Album
            </div>
          )}

          <div className="col-span-1 text-sm font-medium tracking-wider text-left uppercase text-gray">
            <MdSchedule className="text-xl" />
          </div>

          <div className="col-span-12 my-3 border-b border-gray"></div>
        </>
      )}

      <div className="w-full col-span-12">
        {tracks?.map((track, index) => (
          <div
            className={`grid grid-cols-12 ${!track.preview_url ? "opacity-50" : ""
              }`}
            key={track.id + index + 1}
          >
            {/* <div className="flex items-center col-span-1 my-3 text-sm text-gray">
              {index + 1}
            </div> */}
            <div className="flex items-center col-span-1 my-3 text-sm text-gray">
              <button className="text-white" onClick={() => addTrack(track)}>Add</button>
            </div>

            <div
              className={`${noAlbum ? "col-span-10" : "col-span-6"
                } flex items-center w-full  my-3`}
            >
              <div className="flex items-center w-full gap-4">
                {(!noAlbum || noArtist) && (
                  <div className="flex-shrink-0 w-10 h-10">
                    <img
                      src={track.album.images?.[0].url}
                      alt={track.name}
                      className="object-contain w-10 h-10"
                    />
                  </div>
                )}

                <div className="w-full">
                  <h2
                    className={`w-10/12 text-sm font-medium truncate ${track.preview_url
                      ? "cursor-pointer hover:underline"
                      : "cursor-default"
                      }`}
                    onClick={() => playTrack(track)}
                  >
                    {track.name}
                  </h2>

                  {!noArtist && (
                    <div className="flex flex-wrap items-center w-10/12 gap-1 text-sm text-gray">
                      <span className="truncate ">
                        {track.artists.map((artist, index) => (
                          <Link
                            key={artist.id + track.id}
                            href={`/artist/${artist.id}`}
                          >
                            <a>
                              <span className="hover:text-white hover:underline">
                                {index !== 0 ? `, ${artist.name}` : artist.name}
                              </span>
                            </a>
                          </Link>
                        ))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!noAlbum && (
              <div className="flex items-center w-10/12 col-span-4 my-3 text-sm text-gray">
                <Link href={`/album/${track.album.id}`}>
                  <a className="truncate hover:text-white hover:underline">
                    {track.album.name}
                  </a>
                </Link>
              </div>
            )}

            <div className="flex items-center col-span-1 my-3 text-sm text-gray ">
              {fmtMSS(track.duration_ms)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

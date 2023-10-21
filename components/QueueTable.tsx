import Link from "next/link";
import { MdSchedule } from "react-icons/md";
import { usePlayer } from "../context/PlayerContext";
import { useRoom } from "../context/RoomContext";
import { QueuedTrack, QueueType, Track, Room } from "../types/types";
import { fmtMSS } from "../utils/formatDuration";
import { updateRoom } from "../utils/database/calls";

interface IProps {
  tracks: Track[];
  noAlbum?: boolean;
  noArtist?: boolean;
}

export default function QueueTable({
  tracks,
  noAlbum = false,
  noArtist = false,
}: IProps) {
  const { setCurrentTrack } = usePlayer();
  const { room, setRoom, setQueuedTrack, queueList, setQueueList } = useRoom();

  const playTrack = (track: Track) => {
    if (track.preview_url) {
      setCurrentTrack(track);
    }
  };

  const bumpUp = async (track: Track) => {
    // Increment upvotes
    const updateQueueList = (prevQueueList): QueueType => {
      const newList = { ...prevQueueList };
      const trackIndex = newList.queuedTracks.items.findIndex((t) => t.queuedTrack.id === track.id);
      if (trackIndex >= 0) {
        // Increment upvotes
        // console.log(`track ${JSON.stringify(newList.queuedTracks.items[trackIndex].queuedTrack)}`)
        newList.queuedTracks.items[trackIndex].queuedTrack.upvotes += 1;
      }
      return newList;
    }
    const newQueueList = updateQueueList(queueList)
    setQueueList(newQueueList)
    // Send updated queue list to the database
    const roomUpdate: Room = { ...room, queueList: newQueueList };
    await updateRoom(roomUpdate);
  };


  const bumpDown = async (track: Track) => {
    // Increment upvotes
    const updateQueueList = (prevQueueList): QueueType => {
      const newList = { ...prevQueueList };
      const trackIndex = newList.queuedTracks.items.findIndex((t) => t.queuedTrack.id === track.id);
      if (trackIndex >= 0) {
        // Increment upvotes
        newList.queuedTracks.items[trackIndex].queuedTrack.downvotes += 1;
      }
      return newList;
    }
    const newQueueList = updateQueueList(queueList)
    setQueueList(newQueueList)
    // Send updated queue list to the database
    const roomUpdate: Room = { ...room, queueList: newQueueList };
    await updateRoom(roomUpdate);
  };




  return (
    <div className="grid grid-cols-12 gap-2 p-1 mt-5">
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
        {!tracks && (
          <div className="flex flex-col items-center justify-center w-full h-full py-10 text-gray">
            <h2 className="text-2xl font-semibold">No tracks in queue</h2>
            <p className="mt-2 text-sm">
              Add tracks to the queue by clicking the <b>+</b> icon on any track
            </p>
          </div>
        )}
        {tracks?.map((track, index) => {
          if (index === 0) {
            return null; // Skip the first index
          }
          return (
            <div
              className={`grid grid-cols-12 ${!track.preview_url ? "opacity-50" : ""
                }`}
              key={track.id + index + 1}
            >
              {/* <div className="flex items-center col-span-1 my-3 text-sm text-gray">
              {index + 1}
            </div> */}
              <div className="flex flex-col items-center col-span-1 my-3 text-sm text-gray">
                <button className="text-white" onClick={() => bumpUp(track)}>Up</button>
                <button className="text-white" onClick={() => bumpDown(track)}>Down</button>
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
                    <Link
                      key={track.id}
                      href={`/track/${track.id}`}
                    >
                      <a>
                        <h2 className={`w-10/12 text-sm font-medium truncate ${track.preview_url
                          ? "cursor-pointer hover:underline"
                          : "cursor-default"
                          }`}>
                          {track.name}
                        </h2>
                      </a>

                    </Link>

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
          );
        })}
      </div>
    </div>
  );
}

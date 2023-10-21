import axios from "axios";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { QueuedTrack, QueueType, Room, Track } from "../types/types";

interface ContextProps {
  queuedTrack: QueuedTrack | null;
  setQueuedTrack: Dispatch<SetStateAction<QueuedTrack | null>>;
  queueList: QueueType | null;
  setQueueList: Dispatch<SetStateAction<QueueType | null>>;
  room: Room | null;
  setRoom: Dispatch<SetStateAction<Room | null>>;
}

const RoomContext = createContext({} as ContextProps);

export const RoomProvider = ({ children }: any) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [queuedTrack, setQueuedTrack] = useState<QueuedTrack | null>(null);
  const [queueList, setQueueList] = useState<QueueType | null>(null);

  return (
    <RoomContext.Provider
      value={{
        queuedTrack,
        setQueuedTrack,
        queueList,
        setQueueList,
        room,
        setRoom,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export const useRoom = () => useContext(RoomContext);

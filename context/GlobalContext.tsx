import axios from "axios";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { PlaylistType, SearchResults, Track } from "../types/types";

interface ContextProps {
  roomID: string | null;
  setRoomID: Dispatch<SetStateAction<string | null>>;
  currentTrack: Track | null;
  setCurrentTrack: Dispatch<SetStateAction<Track | null>>;
  tracksQueue: Track[];
  setTracksQueue: Dispatch<SetStateAction<Track[]>>;
}

const GlobalContext = createContext({} as ContextProps);

export const GlobalProvider = ({ children }: any) => {
  const [roomID, setRoomID] = useState<string | null>(null);
  const [tracksQueue, setTracksQueue] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);


  return (
    <GlobalContext.Provider
      value={{
        roomID,
        setRoomID,
        currentTrack,
        setCurrentTrack,
        tracksQueue,
        setTracksQueue,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => useContext(GlobalContext);

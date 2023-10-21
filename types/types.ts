import { DefaultSession } from "next-auth";

interface MyUser {
  name?: string | null;
  email?: string | null;
  picture?: string | null;
  image?: string | null;
  accessToken?: string | null;
}

export interface MySession extends Omit<DefaultSession, "user"> {
  user?: MyUser;
  expires: string;
}

interface Image {
  height: number | null;
  url: string | null;
  width: number | null;
}

export interface Album {
  id: string;
  name: string;
  artists: [Artist];
  images?: [Image];
  album_type?: string;
  release_date?: string;
  tracks?: {
    total: number;
    items: Track[];
  };
}

export interface Artist {
  id: string;
  name: string;
  images?: [Image];
  followers?: {
    total: number;
  };
  genres?: [string];
}




export interface PlaylistType {
  description?: string;
  id: string;
  followers?: {
    total?: number;
  };
  images?: [Image];
  name: string;
  owner?: {
    id: string;
    display_name?: string;
  };
  items?: [{ added_at: string; track: Track }];
  tracks?: {
    items?: [{ added_at: string; track: Track }];
    total: number;
  };
  type?: string;
  total?: number;
}

export interface Profile {
  name?: string;
  email?: string;
  credits?: number;
}

export interface QueuedTrack {
  position: number;
  upvotes?: number;
  downvotes?: number;
  id: string;
  name: string;
  album: Album;
  artists: [Artist];
  duration_ms: number;
  preview_url: string;
}

export interface QueueType {
  description?: string;
  id?: string;
  followers?: {
    total?: number;
  };
  images?: [Image];
  name?: string;
  owner?: {
    id: string;
    display_name?: string;
  };
  items?: [{ added_at: string; queuedTrack: QueuedTrack }];
  queuedTracks?: {
    items?: [{ added_at: string; queuedTrack: QueuedTrack }];
    total: number;
  };
  type?: string;
  total?: number;
}

export interface Room {
  id: string;
  name: string;
  description?: string;
  owner?: string;
  members?: string[];
  queueList?: QueueType;
}


export interface SearchResults {
  albums?: {
    items: Album[];
  };
  artists?: {
    items: Artist[];
  };
  playlists?: {
    items: PlaylistType[];
  };
  tracks?: {
    items: Track[];
  };
}

export interface Track {
  id: string;
  name: string;
  album: Album;
  artists: [Artist];
  duration_ms: number;
  preview_url: string;
}
export interface Song {
  id?: string;
  title: string;
  artist: string;
  duration?: number;
  album?: string;
  imageUrl?: string;
  audioUrl?: string;
  playCount?: number;
}

export interface Artist {
  id?: string;
  name: string;
  genre: string;
  imageUrl?: string;
  followers?: number;
}

export interface Album {
  id?: string;
  title: string;
  artist: string;
  year: number;
  imageUrl?: string;
}

export interface Playlist {
  id?: string;
  title: string;
  description: string;
  owner: string;
  isPublic: boolean;
  imageUrl?: string;
  trackCount?: number;
  duration?: number;
}

export type MediaType = 'song' | 'artist' | 'album' | 'playlist';

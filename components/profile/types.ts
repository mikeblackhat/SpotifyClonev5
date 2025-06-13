export interface TopTrack {
  id: number;
  title: string;
  artist: string;
  duration: string;
  plays: number;
}

export interface Artist {
  id: number;
  name: string;
  plays: number;
  image: string;
}

export interface UserData {
  name: string;
  email: string;
  followers: number;
  following: number;
  playlists: number;
  topGenres: string[];
  topArtists: Artist[];
  memberSince?: string;
  plan?: string;
  totalPlays?: number;
  topTrack?: string;
  topArtist?: string;
  minutesListened?: number;
  favoriteDecade?: string;
  favoritePodcast?: string;
  recentlyPlayed?: string[];
  topAlbum?: string;
  topPodcast?: string;
  topPlaylist?: string;
}

export interface PlaylistItem {
  id: number;
  name: string;
  tracks: number;
}

export interface ProfileHeaderProps {
  user: UserData;
}

export interface PlaylistsSectionProps {
  user: UserData;
}

export interface MixesSectionProps {
  user: UserData;
}

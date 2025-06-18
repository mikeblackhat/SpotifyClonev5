import { Playlist } from '@/types/media';

export const samplePlaylists: Omit<Playlist, 'id' | 'imageUrl' | 'duration' | 'trackCount'>[] = [
  { 
    title: "Today's Top Hits", 
    description: "The hottest tracks right now", 
    owner: "Spotify",
    isPublic: true
  },
  { 
    title: "RapCaviar", 
    description: "New music from Drake, Kendrick Lamar and more", 
    owner: "Spotify",
    isPublic: true
  },
  { 
    title: "All Out 2010s", 
    description: "The biggest songs of the 2010s", 
    owner: "Spotify",
    isPublic: true
  },
  { 
    title: "Rock Classics", 
    description: "Rock legends & epic songs that continue to inspire generations", 
    owner: "Spotify",
    isPublic: true
  },
  { 
    title: "Chill Hits", 
    description: "Kick back to the best new and recent chill hits", 
    owner: "Spotify",
    isPublic: true
  },
  { 
    title: "All Out 2000s", 
    description: "The biggest songs of the 2000s", 
    owner: "Spotify",
    isPublic: true
  },
  { 
    title: "Rock Party", 
    description: "The ultimate party playlist featuring arena anthems", 
    owner: "Spotify",
    isPublic: true
  },
  { 
    title: "All Out 80s", 
    description: "The biggest songs of the 1980s", 
    owner: "Spotify",
    isPublic: true
  },
  { 
    title: "Songs to Sing in the Shower", 
    description: "Make your shower more enjoyable by singing along to these hits", 
    owner: "Spotify",
    isPublic: true
  },
  { 
    title: "I Love My '90s Hip-Hop", 
    description: "The best hip-hop from the golden age of the '90s", 
    owner: "Spotify",
    isPublic: true
  }
];

import { Song } from '@/types/media';

export const sampleSongs: Omit<Song, 'id' | 'imageUrl' | 'audioUrl' | 'duration' | 'playCount'>[] = [
  { title: "Blinding Lights", artist: "The Weeknd" },
  { title: "Save Your Tears", artist: "The Weeknd" },
  { title: "Stay", artist: "The Kid LAROI, Justin Bieber" },
  { title: "good 4 u", artist: "Olivia Rodrigo" },
  { title: "Levitating", artist: "Dua Lipa ft. DaBaby" },
  { title: "Montero", artist: "Lil Nas X" },
  { title: "Peaches", artist: "Justin Bieber ft. Daniel Caesar, Giveon" },
  { title: "Kiss Me More", artist: "Doja Cat ft. SZA" },
  { title: "Butter", artist: "BTS" },
  { title: "Stay (with Justin Bieber)", artist: "The Kid LAROI" },
  { title: "Bad Habits", artist: "Ed Sheeran" },
  { title: "Industry Baby", artist: "Lil Nas X, Jack Harlow" },
];

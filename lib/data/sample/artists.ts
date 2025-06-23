import { Artist } from '@/types/media';

export const sampleArtists: Omit<Artist, 'id' | 'imageUrl' | 'followers'>[] = [
  { name: "Bad Bunny", genre: "Reggaeton, Latin Trap" },
  { name: "Taylor Swift", genre: "Pop, Country" },
  { name: "The Weeknd", genre: "R&B, Pop" },
  { name: "Dua Lipa", genre: "Pop, Dance" },
  { name: "Billie Eilish", genre: "Alternative, Pop" },
  { name: "BTS", genre: "K-Pop, Pop" },
  { name: "Ed Sheeran", genre: "Pop, Folk" },
  { name: "Ariana Grande", genre: "Pop, R&B" },
  { name: "Drake", genre: "Hip-Hop, Rap" },
  { name: "Olivia Rodrigo", genre: "Pop, Alternative" },
  { name: "Doja Cat", genre: "Pop, R&B" },
  { name: "Justin Bieber", genre: "Pop, R&B" },
];

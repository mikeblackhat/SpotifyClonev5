import { Album } from '@/types/media';

type AlbumSeed = Omit<Album, 'id' | 'imageUrl'> & { year: number };

export const sampleAlbums: Omit<AlbumSeed, 'id' | 'imageUrl'>[] = [
  { title: "Un Verano Sin Ti", artist: "Bad Bunny", year: 2022 },
  { title: "Midnights", artist: "Taylor Swift", year: 2022 },
  { title: "SOS", artist: "SZA", year: 2022 },
  { title: "Génesis", artist: "Peso Pluma", year: 2023 },
  { title: "Mañana Será Bonito", artist: "Karol G", year: 2023 },
  { title: "Saturno", artist: "Rauw Alejandro", year: 2023 },
  { title: "Motomami", artist: "Rosalía", year: 2022 },
  { title: "Donda", artist: "Kanye West", year: 2021 },
  { title: "Planet Her", artist: "Doja Cat", year: 2021 },
  { title: "El Último Tour Del Mundo", artist: "Bad Bunny", year: 2020 },
  { title: "Sour", artist: "Olivia Rodrigo", year: 2021 },
  { title: "Future Nostalgia", artist: "Dua Lipa", year: 2020 },
  { title: "After Hours", artist: "The Weeknd", year: 2020 },
  { title: "Happier Than Ever", artist: "Billie Eilish", year: 2021 },
  { title: "Justice", artist: "Justin Bieber", year: 2021 }
];

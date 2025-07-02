-- Actualizar canciones con enlaces de audio reales
-- Usando archivos de muestra de SoundHelix que son compatibles con la web

-- Primero, insertar algunos géneros si no existen
INSERT INTO genres (name, description)
VALUES 
  ('Pop', 'Música popular contemporánea'),
  ('Rock', 'Música rock en todas sus variantes'),
  ('Electrónica', 'Música electrónica y dance'),
  ('Hip Hop', 'Hip hop y rap')
ON CONFLICT (name) DO NOTHING;

-- Insertar algunos artistas
WITH inserted_artists AS (
  INSERT INTO artists (name, bio, image)
  VALUES 
    ('The Weekend', 'Cantante y compositor canadiense', 'https://i.scdn.co/image/ab6761610000e5eb0bae407522a32a0bba9dcf7a'),
    ('Dua Lipa', 'Cantante y compositora británica', 'https://i.scdn.co/image/ab6761610000e5eb5da361915b1fa48895d4f23f'),
    ('Imagine Dragons', 'Banda de rock alternativo estadounidense', 'https://i.scdn.co/image/ab6761610000e5eb7a1644d0f0ef5c1c9e60901d'),
    ('Martin Garrix', 'DJ y productor musical neerlandés', 'https://i.scdn.co/image/ab6761610000e5ebc36dd9eb55cd0b49162b0516'),
    ('Kendrick Lamar', 'Rapero y compositor estadounidense', 'https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff1022')
  ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
  RETURNING id, name
)
-- Insertar álbumes
INSERT INTO albums (title, description, thumbnail, artist_id, genre_id)
SELECT 
  CASE 
    WHEN a.name = 'The Weekend' THEN 'After Hours'
    WHEN a.name = 'Dua Lipa' THEN 'Future Nostalgia'
    WHEN a.name = 'Imagine Dragons' THEN 'Evolve'
    WHEN a.name = 'Martin Garrix' THEN 'Sentio'
    WHEN a.name = 'Kendrick Lamar' THEN 'DAMN.'
  END as title,
  CASE 
    WHEN a.name = 'The Weekend' THEN 'Cuarto álbum de estudio de The Weeknd'
    WHEN a.name = 'Dua Lipa' THEN 'Segundo álbum de estudio de Dua Lipa'
    WHEN a.name = 'Imagine Dragons' THEN 'Tercer álbum de estudio de Imagine Dragons'
    WHEN a.name = 'Martin Garrix' THEN 'Álbum debut de Martin Garrix'
    WHEN a.name = 'Kendrick Lamar' THEN 'Cuarto álbum de estudio de Kendrick Lamar'
  END as description,
  CASE 
    WHEN a.name = 'The Weekend' THEN 'https://i.scdn.co/image/ab67616d00001e02d5f9985caa9c7c5ff58d9b86'
    WHEN a.name = 'Dua Lipa' THEN 'https://i.scdn.co/image/ab67616d00001e02a991995542d50a690b8ae5c3'
    WHEN a.name = 'Imagine Dragons' THEN 'https://i.scdn.co/image/ab67616d00001e02d8cc394fc9c7da07a4c9f357'
    WHEN a.name = 'Martin Garrix' THEN 'https://i.scdn.co/image/ab67616d00001e02c3b8d8a9e7a2c5d9e9a1e1c1'
    WHEN a.name = 'Kendrick Lamar' THEN 'https://i.scdn.co/image/ab67616d00001e02f7a2c9e3b1e9e3d9e9a1e1c1'
  END as thumbnail,
  a.id as artist_id,
  g.id as genre_id
FROM inserted_artists a
CROSS JOIN (
  SELECT id FROM genres ORDER BY id LIMIT 5
) g
ON CONFLICT (title, artist_id) DO UPDATE SET title = EXCLUDED.title
RETURNING id, title, artist_id;

-- Actualizar canciones con enlaces de audio reales
UPDATE songs s
SET 
  url = CASE 
    WHEN s.title = 'Blinding Lights' THEN 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    WHEN s.title = 'Save Your Tears' THEN 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    WHEN s.title = 'Dont Start Now' THEN 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    WHEN s.title = 'Levitating' THEN 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    WHEN s.title = 'Thunder' THEN 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
    WHEN s.title = 'Believer' THEN 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
    WHEN s.title = 'In the Name of Love' THEN 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
    WHEN s.title = 'Animals' THEN 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
    WHEN s.title = 'HUMBLE.' THEN 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3'
    WHEN s.title = 'LOYALTY.' THEN 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3'
    ELSE s.url
  END,
  duration = CASE 
    WHEN s.title = 'Blinding Lights' THEN 200
    WHEN s.title = 'Save Your Tears' THEN 215
    WHEN s.title = 'Dont Start Now' THEN 183
    WHEN s.title = 'Levitating' THEN 203
    WHEN s.title = 'Thunder' THEN 187
    WHEN s.title = 'Believer' THEN 204
    WHEN s.title = 'In the Name of Love' THEN 207
    WHEN s.title = 'Animals' THEN 195
    WHEN s.title = 'HUMBLE.' THEN 177
    WHEN s.title = 'LOYALTY.' THEN 210
    ELSE s.duration
  END
WHERE s.title IN (
  'Blinding Lights', 'Save Your Tears', 'Dont Start Now', 'Levitating', 
  'Thunder', 'Believer', 'In the Name of Love', 'Animals', 'HUMBLE.', 'LOYALTY.'
);

-- Insertar canciones de ejemplo si no existen
INSERT INTO songs (title, duration, url, image, album_id, artist_id, genre_id)
SELECT 
  s.title,
  s.duration,
  s.url,
  a.thumbnail as image,
  a.id as album_id,
  a.artist_id,
  a.genre_id
FROM (
  SELECT 
    'Blinding Lights' as title, 200 as duration, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' as url, 1 as album_order
  UNION ALL SELECT 'Save Your Tears', 215, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 1
  UNION ALL SELECT 'Dont Start Now', 183, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 2
  UNION ALL SELECT 'Levitating', 203, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 2
  UNION ALL SELECT 'Thunder', 187, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 3
  UNION ALL SELECT 'Believer', 204, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 3
  UNION ALL SELECT 'In the Name of Love', 207, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', 4
  UNION ALL SELECT 'Animals', 195, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 4
  UNION ALL SELECT 'HUMBLE.', 177, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', 5
  UNION ALL SELECT 'LOYALTY.', 210, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', 5
) s
JOIN (
  SELECT a.*, ROW_NUMBER() OVER (ORDER BY id) as rn
  FROM albums a
  WHERE a.artist_id IN (SELECT id FROM artists WHERE name IN ('The Weekend', 'Dua Lipa', 'Imagine Dragons', 'Martin Garrix', 'Kendrick Lamar'))
) a ON s.album_order = a.rn
WHERE NOT EXISTS (
  SELECT 1 FROM songs s2 
  WHERE s2.title = s.title 
  AND s2.album_id = a.id
);

-- Script para actualizar canciones con enlaces de audio reales
-- Usando archivos de muestra de SoundHelix que son compatibles con la web

-- Primero, verificar e insertar géneros si no existen
INSERT INTO genres (name, description)
SELECT 'Pop', 'Música popular contemporánea'
WHERE NOT EXISTS (SELECT 1 FROM genres WHERE name = 'Pop');

INSERT INTO genres (name, description)
SELECT 'Rock', 'Música rock en todas sus variantes'
WHERE NOT EXISTS (SELECT 1 FROM genres WHERE name = 'Rock');

INSERT INTO genres (name, description)
SELECT 'Electrónica', 'Música electrónica y dance'
WHERE NOT EXISTS (SELECT 1 FROM genres WHERE name = 'Electrónica');

INSERT INTO genres (name, description)
SELECT 'Hip Hop', 'Hip hop y rap'
WHERE NOT EXISTS (SELECT 1 FROM genres WHERE name = 'Hip Hop');

-- Insertar artistas si no existen
INSERT INTO artists (name, bio, image)
SELECT 'The Weeknd', 'Cantante y compositor canadiense', 'https://i.scdn.co/image/ab6761610000e5eb0bae407522a32a0bba9dcf7a'
WHERE NOT EXISTS (SELECT 1 FROM artists WHERE name = 'The Weeknd');

INSERT INTO artists (name, bio, image)
SELECT 'Dua Lipa', 'Cantante y compositora británica', 'https://i.scdn.co/image/ab6761610000e5eb5da361915b1fa48895d4f23f'
WHERE NOT EXISTS (SELECT 1 FROM artists WHERE name = 'Dua Lipa');

INSERT INTO artists (name, bio, image)
SELECT 'Imagine Dragons', 'Banda de rock alternativo estadounidense', 'https://i.scdn.co/image/ab6761610000e5eb7a1644d0f0ef5c1c9e60901d'
WHERE NOT EXISTS (SELECT 1 FROM artists WHERE name = 'Imagine Dragons');

INSERT INTO artists (name, bio, image)
SELECT 'Martin Garrix', 'DJ y productor musical neerlandés', 'https://i.scdn.co/image/ab6761610000e5ebc36dd9eb55cd0b49162b0516'
WHERE NOT EXISTS (SELECT 1 FROM artists WHERE name = 'Martin Garrix');

INSERT INTO artists (name, bio, image)
SELECT 'Kendrick Lamar', 'Rapero y compositor estadounidense', 'https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff1022'
WHERE NOT EXISTS (SELECT 1 FROM artists WHERE name = 'Kendrick Lamar');

-- Insertar álbumes
WITH artist_ids AS (
  SELECT id, name FROM artists 
  WHERE name IN ('The Weeknd', 'Dua Lipa', 'Imagine Dragons', 'Martin Garrix', 'Kendrick Lamar')
),
genre_id AS (
  SELECT id FROM genres WHERE name = 'Pop' LIMIT 1
)
INSERT INTO albums (title, description, thumbnail, artist_id, genre_id)
SELECT 
  a.album_title,
  a.description,
  a.thumbnail,
  ar.id as artist_id,
  (SELECT id FROM genre_id) as genre_id
FROM (
  SELECT 'After Hours' as album_title, 'Cuarto álbum de estudio de The Weeknd' as description, 'https://i.scdn.co/image/ab67616d00001e02d5f9985caa9c7c5ff58d9b86' as thumbnail, 'The Weeknd' as artist_name
  UNION ALL SELECT 'Future Nostalgia', 'Segundo álbum de estudio de Dua Lipa', 'https://i.scdn.co/image/ab67616d00001e02a991995542d50a690b8ae5c3', 'Dua Lipa'
  UNION ALL SELECT 'Evolve', 'Tercer álbum de estudio de Imagine Dragons', 'https://i.scdn.co/image/ab67616d00001e02d8cc394fc9c7da07a4c9f357', 'Imagine Dragons'
  UNION ALL SELECT 'Sentio', 'Álbum debut de Martin Garrix', 'https://i.scdn.co/image/ab67616d00001e02c3b8d8a9e7a2c5d9e9a1e1c1', 'Martin Garrix'
  UNION ALL SELECT 'DAMN.', 'Cuarto álbum de estudio de Kendrick Lamar', 'https://i.scdn.co/image/ab67616d00001e02f7a2c9e3b1e9e3d9e9a1e1c1', 'Kendrick Lamar'
) a
JOIN artist_ids ar ON a.artist_name = ar.name
WHERE NOT EXISTS (
  SELECT 1 FROM albums al 
  WHERE al.title = a.album_title 
  AND al.artist_id = ar.id
);

-- Insertar canciones de ejemplo
WITH album_data AS (
  SELECT a.id, a.title as album_title, ar.name as artist_name
  FROM albums a
  JOIN artists ar ON a.artist_id = ar.id
  WHERE ar.name IN ('The Weeknd', 'Dua Lipa', 'Imagine Dragons', 'Martin Garrix', 'Kendrick Lamar')
)
INSERT INTO songs (title, duration, url, image, album_id, artist_id, genre_id)
SELECT 
  s.title,
  s.duration,
  s.url,
  a.thumbnail as image,
  a.id as album_id,
  ar.id as artist_id,
  (SELECT id FROM genres WHERE name = 'Pop' LIMIT 1) as genre_id
FROM (
  -- Canciones de The Weeknd - After Hours
  SELECT 'Blinding Lights' as title, 200 as duration, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' as url, 'After Hours' as album_title, 'The Weeknd' as artist_name
  UNION ALL SELECT 'Save Your Tears', 215, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', 'After Hours', 'The Weeknd'
  
  -- Canciones de Dua Lipa - Future Nostalgia
  UNION ALL SELECT 'Dont Start Now', 183, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', 'Future Nostalgia', 'Dua Lipa'
  UNION ALL SELECT 'Levitating', 203, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 'Future Nostalgia', 'Dua Lipa'
  
  -- Canciones de Imagine Dragons - Evolve
  UNION ALL SELECT 'Thunder', 187, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', 'Evolve', 'Imagine Dragons'
  UNION ALL SELECT 'Believer', 204, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 'Evolve', 'Imagine Dragons'
  
  -- Canciones de Martin Garrix - Sentio
  UNION ALL SELECT 'In the Name of Love', 207, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', 'Sentio', 'Martin Garrix'
  UNION ALL SELECT 'Animals', 195, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', 'Sentio', 'Martin Garrix'
  
  -- Canciones de Kendrick Lamar - DAMN.
  UNION ALL SELECT 'HUMBLE.', 177, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', 'DAMN.', 'Kendrick Lamar'
  UNION ALL SELECT 'LOYALTY.', 210, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', 'DAMN.', 'Kendrick Lamar'
) s
JOIN album_data a ON s.album_title = a.album_title AND s.artist_name = a.artist_name
JOIN artists ar ON a.artist_name = ar.name
WHERE NOT EXISTS (
  SELECT 1 FROM songs s2 
  WHERE s2.title = s.title 
  AND s2.album_id = a.id
);

-- Actualizar las URLs de las canciones existentes
UPDATE songs s
SET 
  url = subquery.url,
  duration = subquery.duration
FROM (
  SELECT 
    s.id,
    CASE 
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
    END as url,
    CASE 
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
    END as duration
  FROM songs s
  WHERE s.title IN (
    'Blinding Lights', 'Save Your Tears', 'Dont Start Now', 'Levitating', 
    'Thunder', 'Believer', 'In the Name of Love', 'Animals', 'HUMBLE.', 'LOYALTY.'
  )
) as subquery
WHERE s.id = subquery.id;

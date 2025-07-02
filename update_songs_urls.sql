-- Actualizar las URLs de audio de las canciones existentes
UPDATE songs
SET 
  url = CASE 
    WHEN id % 10 = 0 THEN 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3'
    ELSE 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-' || (id % 10)::text || '.mp3'
  END,
  duration = CASE 
    WHEN id % 10 = 0 THEN 210
    ELSE 180 + (id % 10) * 5
  END
WHERE id > 0;

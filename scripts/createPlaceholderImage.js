import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear un canvas de 300x300 píxeles
const size = 300;
const canvas = createCanvas(size, size);
const context = canvas.getContext('2d');

// Rellenar con un color de fondo
context.fillStyle = '#1f2937'; // Gris oscuro
context.fillRect(0, 0, size, size);

// Dibujar un ícono de nota musical
context.fillStyle = '#6b7280'; // Gris medio
context.font = 'bold 100px Arial';
context.textAlign = 'center';
context.textBaseline = 'middle';
context.fillText('♪', size / 2, size / 2);

// Guardar la imagen
const out = fs.createWriteStream(path.join(__dirname, '../frontend/public/images/placeholder-album.png'));
const stream = canvas.createPNGStream();
stream.pipe(out);

out.on('finish', () => {
  console.log('Imagen de placeholder creada correctamente');  
});

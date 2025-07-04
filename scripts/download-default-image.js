import { createWriteStream, existsSync, mkdirSync, unlink } from 'fs';
import { get } from 'https';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// URL de una imagen de artista por defecto (puedes reemplazarla con otra URL válida)
const imageUrl = 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80';

// Ruta donde se guardará la imagen
const imagesDir = join(__dirname, '../frontend/public/images');
const outputPath = join(imagesDir, 'default-artist.jpg');

console.log('Directorio de imágenes:', imagesDir);
console.log('Ruta de salida:', outputPath);

// Crear el directorio si no existe
if (!existsSync(imagesDir)) {
  mkdirSync(imagesDir, { recursive: true });
  console.log(`Directorio creado: ${imagesDir}`);
}

// Descargar la imagen
const file = createWriteStream(outputPath);
get(imageUrl, (response) => {
  response.pipe(file);
  
  file.on('finish', () => {
    file.close();
    console.log('Imagen descargada correctamente en:', outputPath);
  });  
}).on('error', (err) => {
  unlink(outputPath, () => {}); // Eliminar el archivo si hay un error
  console.error('Error al descargar la imagen:', err.message);
});

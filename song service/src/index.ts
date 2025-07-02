import express from "express";
import dotenv from "dotenv";
import songRoutes from "./route.js";
import { createClient, RedisClientType } from "redis";
import cors from "cors";

// Cargar variables de entorno
dotenv.config();

// Configuración de Redis
let redisClient: RedisClientType;

const initRedis = async () => {
  try {
    if (!process.env.REDIS_URL) {
      console.warn('REDIS_URL no está definida. Redis no estará disponible');
      return null;
    }

    redisClient = createClient({
      url: process.env.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 10) {
            console.error('Demasiados intentos de reconexión a Redis. Cerrando...');
            return new Error('Demasiados intentos de reconexión');
          }
          // Reintentar después de 1 segundo
          return 1000;
        },
      },
    });

    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    redisClient.on('connect', () => console.log('Conectando a Redis...'));
    redisClient.on('ready', () => console.log('Redis listo'));
    redisClient.on('reconnecting', () => console.log('Reconectando a Redis...'));

    await redisClient.connect();
    console.log('Conectado a Redis exitosamente');
    return redisClient;
  } catch (error) {
    console.error('Error al conectar a Redis:', error);
    return null;
  }
};

// Inicializar Redis
const redisPromise = initRedis() as Promise<RedisClientType | null>;

export { redisClient, redisPromise };

const app = express();

app.use(cors());

app.use("/api/v1", songRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});

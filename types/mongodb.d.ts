import { MongoClient } from 'mongodb';

declare global {
  // Extend the NodeJS namespace with global variables
  namespace NodeJS {
    interface Global {
      _mongoClientPromise: Promise<MongoClient>;
    }
  }
}

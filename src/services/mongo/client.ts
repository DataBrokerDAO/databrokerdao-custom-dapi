import { MongoClient, Db } from 'mongodb';
import { MONGO_DB_URL, MONGO_DB_NAME } from '../../config/dapi-config';

let client: MongoClient;
let db: Db;

async function init() {
  connect();
}

async function connect() {
  if (!client) {
    try {
      client = await MongoClient.connect(MONGO_DB_URL, {
        sslValidate: true
      });
      db = await client.db(MONGO_DB_NAME);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return client;
}

export async function get() {
  if (!db) {
    await connect();
  }

  return db;
}

export async function getCollection(collectionName: string) {
  const db = await get();
  return db.collection(collectionName);
}

export async function listCollections() {
  const db = await get();
  return db.collections();
}

export async function createCollection(collectionName: string) {
  const db = await get();
  return db.createCollection(collectionName);
}

init();

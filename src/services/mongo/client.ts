import { MongoClient, Mongos } from "mongodb";
import { MONGO_DB_URL, MONGO_DB_NAME } from '../../config/dapi-config';

let client: MongoClient;
// TODO: find correct class for mongodb
let db;;

async function init() {
  connectDb();
}

async function connectDb() {
  if(!client) {
    try {
      client = await MongoClient.connect(MONGO_DB_URL, {
        sslValidate: true;
      });
      db = await client.db(MONGO_DB_NAME);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return client;
}

export async function getDb() {
  if (!db) {
    await connectDb();
    }

    return db;
}

export async function getDbCollection(collectionName: string) {
  const db = await getDb();
  return db.collection(collectionName);
}

export async function listDbCollections() {
  const db = await getDb();
  return db.collections();
}

export async function createDbCollection(collectionName: string) {
  const db = await getDb();
  return db.createCollection(collectionName);
}

init();

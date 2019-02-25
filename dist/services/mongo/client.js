"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const dapi_config_1 = require("../../config/dapi-config");
let client;
let db;
async function init() {
    connectDb();
}
async function connectDb() {
    if (!client) {
        try {
            client = await mongodb_1.MongoClient.connect(dapi_config_1.MONGO_DB_URL, {
                sslValidate: true
            });
            db = await client.db(dapi_config_1.MONGO_DB_NAME);
        }
        catch (error) {
            console.error(error);
            throw error;
        }
    }
    return client;
}
async function getDb() {
    if (!db) {
        await connectDb();
    }
    return db;
}
exports.getDb = getDb;
async function getDbCollection(collectionName) {
    const db = await getDb();
    return db.collection(collectionName);
}
exports.getDbCollection = getDbCollection;
async function listDbCollections() {
    const db = await getDb();
    return db.collections();
}
exports.listDbCollections = listDbCollections;
async function createDbCollection(collectionName) {
    const db = await getDb();
    return db.createCollection(collectionName);
}
exports.createDbCollection = createDbCollection;
init();
//# sourceMappingURL=client.js.map
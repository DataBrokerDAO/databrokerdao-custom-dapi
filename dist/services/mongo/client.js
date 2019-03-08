"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const dapi_config_1 = require("../../config/dapi-config");
let client;
let db;
async function init() {
    connect();
}
async function connect() {
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
async function get() {
    if (!db) {
        await connect();
    }
    return db;
}
exports.get = get;
async function getCollection(collectionName) {
    await get();
    return db.collection(collectionName);
}
exports.getCollection = getCollection;
async function listCollections() {
    await get();
    return db.collections();
}
exports.listCollections = listCollections;
async function createCollection(collectionName) {
    await get();
    return db.createCollection(collectionName);
}
exports.createCollection = createCollection;
init();
//# sourceMappingURL=client.js.map
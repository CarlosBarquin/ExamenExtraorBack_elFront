import { MongoClient, Database } from "mongo";

import { EventoSchema } from "./schemas.ts";

const client = new MongoClient();
await client.connect(`mongodb://mongo:27017`);

const db = client.database("MyDatabase");
console.info(`MongoDB ${db.name} connected`);

export const eventCollection = db.collection<EventoSchema>("eventos")




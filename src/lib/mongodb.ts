import { MongoClient } from "mongodb";

const options = {};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export default function getMongoClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    return Promise.reject(
      new Error("Missing MONGODB_URI environment variable."),
    );
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  }

  const client = new MongoClient(uri, options);
  return client.connect();
}

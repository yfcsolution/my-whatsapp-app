import { MongoClient, type Db } from "mongodb"

// <CHANGE> Make MongoDB connection lazy to avoid build-time errors
let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

function getMongoClient(): Promise<MongoClient> {
  if (!process.env.MONGODB_URI) {
    throw new Error("Please add your MongoDB URI to .env.local")
  }

  if (clientPromise) {
    return clientPromise
  }

  const uri = process.env.MONGODB_URI
  const options = {}

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable to preserve the connection
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    // In production mode, create a new client
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }

  return clientPromise
}

export default getMongoClient

export async function getDatabase(): Promise<Db> {
  const client = await getMongoClient()
  return client.db("whatsapp_business")
}
</parameter>

import mongoose from "mongoose"

const MONGODB_URI = process.env.MONGODB_URI!
if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined")

interface Cached { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }

const g = global as typeof globalThis & { mongoose?: Cached }
if (!g.mongoose) g.mongoose = { conn: null, promise: null }
const cached = g.mongoose

export async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
  }
  cached.conn = await cached.promise
  return cached.conn
}

import { MongoClient } from 'mongodb';

const URI = process.env.DB_URL
const options = {}

if (!URI) {
    throw new Error('DB_URL is not defined')
}

let client = new MongoClient(URI, options)
let clientPromise

if (process.env.NODE_ENV === 'production') {
    clientPromise = client.connect()
} else {
    if (!global._mongoClientPromise) {
        global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
}

export default clientPromise
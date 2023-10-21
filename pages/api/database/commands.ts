import clientPromise from "./client";
import { NextApiRequest, NextApiResponse } from "next";
import { Room } from "../../../types/types";

let client
let db

async function init() {
    if (db) return
    try {
        client = await clientPromise
        db = await client.db('shuffle')
    } catch (error) {
        throw new Error('Could not connect to database')
    }
}

; (async () => {
    await init()
})()

export async function createRoom(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!db) await init()
        const room: Room = req.body.room
        console.log('creating')
        const rooms = db.collection("rooms");
        const result = await rooms.find({ "room.id": room.id }).toArray();
        var status

        if (result.length != 0) {
            // REPLACE //
            console.log("Replacing")
            status = await rooms.replaceOne({
                "room.id": room.id
            }, {
                room
            })

        } else {
            // INSERT NEW //
            console.log("Inserting")
            status = await rooms.insertOne({
                room
            });
        }
        console.log(status)
        res.status(200).json({ status: status })
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error creating room' })
    }

}

export async function getRoom(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!db) await init();
        const roomId = req.body.roomId;
        const rooms = db.collection("rooms");

        // Find the room with the given roomId
        const result = await rooms.findOne({ "room.id": roomId });

        if (result.length != 0) {
            res.status(200).json({ room: result.room }); // Return the room if found
        } else {
            res.status(200).json({ room: null });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error getting room' })
    }
}

export async function updateRoom(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!db) await init();
        const room: Room = req.body.room;
        const rooms = db.collection("rooms");

        // Find the room with the given roomId and replace it with the current room
        const status = await rooms.replaceOne({
            "room.id": room.id
        }, {
            room
        })

        if (status.acknowledged) {
            res.status(200).json({ status: status });
        } else {
            res.status(200).json({ status: null });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error updating room' })
    }
}


export async function getProfile(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (!db) await init();
        const profile = req.body.profile;
        const email = profile.email;
        const profiles = db.collection("profiles");

        // Find the room with the given roomId
        const result = await profiles.findOne({ "profile.email": email });
        // console.log('result', result)
        if (result) {
            res.status(200).json({ profile: result.profile });
        } else {
            const status = await profiles.insertOne({ profile })
            console.log('status', status)
            if (status.acknowledged) {
                res.status(200).json({ profile: profile });
            } else {
                res.status(200).json({ profile: null });
            }
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Error adding profile' })
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { route } = req.body
    switch (route) {
        case 'createRoom':
            await createRoom(req, res)
            break;
        case 'getRoom':
            await getRoom(req, res)
            break;

        case 'updateRoom':
            await updateRoom(req, res)
            break;

        case 'getProfile':
            await getProfile(req, res)
            break;

        default:
            return null

    }
}

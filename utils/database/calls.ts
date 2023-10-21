import { Profile, Room } from "../../types/types";
const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;


export async function createRoom(room: Room) {
    const response = await fetch(`${SERVER_URL}/api/database/commands`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            route: 'createRoom',
            room: room
        }),
    });
    const data = await response.json();
    console.log('data', data.status.acknowledged)
    return data.status.acknowledged;
}

export async function getRoom(roomId: string) {
    const response = await fetch(`${SERVER_URL}/api/database/commands`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            route: 'getRoom',
            roomId: roomId
        }),
    });
    const data = await response.json();
    return data.room;
}

export async function updateRoom(room: Room) {
    const response = await fetch(`${SERVER_URL}/api/database/commands`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            route: 'updateRoom',
            room: room
        }),
    });
    const data = await response.json();
    return data.status;
}

export async function getProfile(profile: Profile) {
    const response = await fetch(`${SERVER_URL}/api/database/commands`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            route: 'getProfile',
            profile: profile
        }),
    });
    const data = await response.json();
    return data.profile;
}

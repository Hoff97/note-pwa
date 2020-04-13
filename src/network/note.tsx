import { Note, toNetworkData, fromNetworkData } from "../util/types";

const urlPrefix = 'http://localhost:8000/api';

export async function fetchNotes() {
    const response = await fetch(`${urlPrefix}/entity/?tpe=note`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        }
    });

    const json = await response.json();
    return json.map((x: any) => fromNetworkData(x));
}

export async function createNote(note: Note) {
    const response = await fetch(`${urlPrefix}/entity/?tpe=note`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`
        },
        body: JSON.stringify(toNetworkData(note))
    });

    const json = await response.json();
    return json.map((x: any) => fromNetworkData(x));
}

let token: string;
export let loggedIn = false;

export async function login(username: string, password: string) {
    const respone = await fetch(`${urlPrefix}/api-token-auth/`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username, password
        })
    });

    const json = await respone.json();
    token = json.token;
    loggedIn = true;
}
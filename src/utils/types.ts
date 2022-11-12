export type Payload = {
    email: string;
}

export type FacebookPayload = {
    email: string;
    firstName: string;
    lastName: string;
    id: string;
}

export type GooglePayload = {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    accessToken: string;
    refreshToken: string;
    id: string;
}
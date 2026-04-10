import { err, ok, type Result } from "./error";
import { fetch } from "./utils";

export interface Channel {
    id: string,
    name: string,
}

export interface GetInfoResponse {
    title: string,
    channels: Channel[],
}

export async function getInfo(url: string): Promise<Result<GetInfoResponse, any>> {
    const [okay, value] = await fetch(`${url}/info`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    if (okay && value.ok) {
        return ok(await value.json());
    } else {
        return err(value);
    }
}

import { err, ok, type Result } from "./error";
import { fetch } from "./utils";

export interface GetInfoResponse {
    title: string
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

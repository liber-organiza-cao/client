export function error(message: any) {
    const msg = typeof message == "string" ? message : JSON.stringify(message, Object.getOwnPropertyNames(message));
    console.log(`[error]: ${msg}`);
}
export function warn(message: any) {
    const msg = typeof message == "string" ? message : JSON.stringify(message, Object.getOwnPropertyNames(message));
    console.log(`[warn]: ${msg}`);
}
export function info(message: any) {
    const msg = typeof message == "string" ? message : JSON.stringify(message, Object.getOwnPropertyNames(message));
    console.log(`[info]: ${msg}`);
}
export function debug(message: any) {
    const msg = typeof message == "string" ? message : JSON.stringify(message, Object.getOwnPropertyNames(message));
    console.log(`[debug]: ${msg}`);
}
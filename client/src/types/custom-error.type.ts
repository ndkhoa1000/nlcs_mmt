/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CustomError extends Error {
    errorCode?: string,
    response?: any,
}
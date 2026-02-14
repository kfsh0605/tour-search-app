import type { ErrorResponse } from './types';

class ApiError extends Error {
    code: number;
    waitUntil?: string;

    constructor(code: number, message: string, waitUntil?: string) {
        super(message);
        this.name = 'ApiError';
        this.code = code;
        this.waitUntil = waitUntil;
    }
}

async function handleApiError(response: Response): Promise<never> {
    const error: ErrorResponse = await response.json();
    throw new ApiError(error.code, error.message, error.waitUntil);
}

function isNotReadyError(error: unknown): error is ApiError {
    return error instanceof ApiError && error.code === 425;
}

function isNotFoundError(error: unknown): error is ApiError {
    return error instanceof ApiError && error.code === 404;
}

function isBadRequestError(error: unknown): error is ApiError {
    return error instanceof ApiError && error.code === 400;
}

export { ApiError, handleApiError, isNotReadyError, isNotFoundError, isBadRequestError };
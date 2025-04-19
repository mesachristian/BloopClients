class UnauthorizedError extends Error {
    constructor(message = "User is not authorized") {
        super(message);
        this.name = "UnauthorizedError";
        // Maintains proper stack trace (only needed in ES5 targets)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, UnauthorizedError);
        }
    }
}

export default UnauthorizedError;
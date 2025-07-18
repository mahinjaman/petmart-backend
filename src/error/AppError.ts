class AppError extends Error {
    public StatusCode: number;
    constructor(StatusCode: number, message: string, stack: "") {
        super(message);
        this.StatusCode = StatusCode;
        if (stack) {
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
class HttpError extends Error {
    constructor(msg, c) {
        super(msg);
        this.code = c;
    }
}
module.exports = HttpError;
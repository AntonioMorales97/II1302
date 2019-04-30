class ValidationError extends Error {
    constructor(errors) {
        super("Contains validation errors...");
        this.errors = errors;
    }
}

module.exports = ValidationError;
import { query } from 'express-validator';

export const validateVerifyUserToken = [
    // Validate the 'token' query parameter
    query('token')
        .notEmpty()
        .withMessage('Token is required')
        .isString()
        .withMessage('Token must be a string')
        .matches(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/)
        .withMessage('Token must be a valid JWT (header.payload.signature format)')
];
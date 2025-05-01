import { body } from 'express-validator';

export const validateCreateSadhna = [
    body("userManglaArti.didAttend")
        .isBoolean()
        .withMessage("Mangla Arti attendance must be a boolean"),
    body("userManglaArti.minsLate")
        .isInt({ min: 0 })
        .withMessage("Minutes late must be a non-negative integer"),
    body("userChantingRounds")
        .isInt({ min: 0 })
        .withMessage("Chanting rounds must be a non-negative integer"),
    body("userBookReading.didRead")
        .isBoolean()
        .withMessage("Book reading status must be a boolean"),
    body("userBookReading.bookName")
        .optional()
        .isString()
        .withMessage("Book name must be a string"),
    body("userBookReading.duration")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Reading duration must be a non-negative integer")
];


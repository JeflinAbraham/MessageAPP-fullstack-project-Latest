import { z } from 'zod';

export const usernameValidation = z
    .string()
    .min(2, {message: 'Username must be at least 2 characters'})
    .max(20, {message: 'Username must be no more than 20 characters'})
    .regex(/^[a-zA-Z0-9_]+$/, {message: 'Username must not contain special characters'});

export const signUpSchema = z.object({
    username: usernameValidation,

    // validation for email.
    email: z.string().email({ message: 'Invalid email address' }),

    //validation for password.
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' }),
});
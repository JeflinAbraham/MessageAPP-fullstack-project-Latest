import dbConnect from '@/lib/dbConnect';
import User from '@/models/user.model';
import { z } from 'zod';

const emailQuerySchema = z.object({
    email: z.string().email({message: "invalid email format"})
});

export async function GET(request: Request) {
    await dbConnect();

    try {
        // The new URL(request.url) creates a new URL object using the URL string provided by request.url.
        // Once you have a URL object, you can access its various properties and methods to manipulate and retrieve different parts of the URL.
        // urlObject.searchParams: Returns a URLSearchParams object representing the query parameters (query parameters are key-value pairs that are appended to the end of a URL after a question mark (?))
        const { searchParams } = new URL(request.url);
        const queryParams = {
            email: searchParams.get('email'),
        };


        // console log result to know more.
        const result = emailQuerySchema.safeParse(queryParams);
        if (!result.success) {
            const emailErrors = result.error.format().email?._errors || [];
            return Response.json(
                {
                    success: false,
                    message: emailErrors?.length > 0 ? emailErrors.join(', ') : 'Invalid query parameters',
                },
                { status: 400 }
            );
        }
        const { email } = result.data;



        const existingVerifiedUser = await User.findOne({
            email,
            isVerified: true,
        });

        if (existingVerifiedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'email is already taken',
                },
                { status: 200 }
            );
        }




        return Response.json(
            {
                success: true,
                message: 'Email is unique',
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: 'Error checking email',
            },
            { status: 500 }
        );
    }
}
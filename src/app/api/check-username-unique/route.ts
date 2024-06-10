    import dbConnect from '@/lib/dbConnect';
    import User from '@/models/user.model';
    import { z } from 'zod';
    import { usernameValidation } from '@/schemas/signUpSchema';

    const UsernameQuerySchema = z.object({
        username: usernameValidation,
    });

    export async function GET(request: Request) {
        await dbConnect();

        try {
            // The new URL(request.url) creates a new URL object using the URL string provided by request.url.
            // Once you have a URL object, you can access its various properties and methods to manipulate and retrieve different parts of the URL.
            // urlObject.searchParams: Returns a URLSearchParams object representing the query parameters (query parameters are key-value pairs that are appended to the end of a URL after a question mark (?))
            const { searchParams } = new URL(request.url);
            const queryParams = {
                username: searchParams.get('username'),
            };


            // console log result to know more.
            const result = UsernameQuerySchema.safeParse(queryParams);
            if (!result.success) {
                const usernameErrors = result.error.format().username?._errors || [];
                return Response.json(
                    {
                        success: false,
                        message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters',
                    },
                    { status: 400 }
                );
            }
            const { username } = result.data;



            const existingVerifiedUser = await User.findOne({
                username,
                isVerified: true,
            });

            if (existingVerifiedUser) {
                return Response.json(
                    {
                        success: false,
                        message: 'Username is already taken',
                    },
                    { status: 200 }
                );
            }




            return Response.json(
                {
                    success: true,
                    message: 'Username is unique',
                },
                { status: 200 }
            );
        } catch (error) {
            console.error('Error checking username:', error);
            return Response.json(
                {
                    success: false,
                    message: 'Error checking username',
                },
                { status: 500 }
            );
        }
    }
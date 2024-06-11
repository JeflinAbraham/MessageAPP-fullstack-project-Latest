import dbConnect from '@/lib/dbConnect';
import User from '@/models/user.model';

export async function POST(request: Request) {
    // Connect to the database
    await dbConnect();

    try {
        const { email, code } = await request.json();
        // @ was url encoded
        // console.log(email);

        const newEmail = decodeURIComponent(email);
        console.log(typeof newEmail);
        const user = await User.findOne({ email: newEmail });

        if (!user) {
            return Response.json({
                success: false,
                message: 'User not found',
            }, { status: 404 }
            );
        }

        // Check if the code is correct and not expired
        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date(Date.now());

        if (isCodeValid && isCodeNotExpired) {
            return Response.json({
                success: true,
                message: 'Account verified successfully'
            }, { status: 200 }
            );
        }
        else if (isCodeValid && !isCodeNotExpired) {
            // Code has expired
            return Response.json({
                success: false,
                message: 'Verification code has expired.',
            }, { status: 400 }
            );
        }
        else {
            // Code is incorrect
            return Response.json({
                success: false,
                message: 'Incorrect verification code'
            }, { status: 400 }
            );
        }
    }
    catch (error) {
        return Response.json({
            success: false,
            message: 'Error verifying user'
        }, { status: 500 }
        );
    }
}
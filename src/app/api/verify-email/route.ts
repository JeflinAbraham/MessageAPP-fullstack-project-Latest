import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { sendVerificationEmailForgotPass } from "@/utils/sendVerificationEmailForgotPass";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const { email } = await req.json();
        const user = await User.findOne({
            email,
        })
        if (!user) {
            return Response.json({
                success: 'false',
                message: "user not found, you may sign up first"
            },
                { status: 400 })
        }
        if (!user.isVerified) {
            return Response.json({
                success: 'false',
                message: "user is not verified, verify your email first"
            },
                { status: 400 })
        }

        // a verified user with the email exist in the db, send him a verification code.
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiryDate = new Date(Date.now() + 3600000);

        const newUser = await User.findByIdAndUpdate(
            user._id,
            {
                verifyCode,
                verifyCodeExpiry: expiryDate

            },
            {new: true}
        );
        const emailResponse = await sendVerificationEmailForgotPass(
            email,
            newUser?.username || '',
            verifyCode
        );
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message,
            },
                { status: 500 }
            );
        }

        return Response.json({
            success: true,
            message: 'enter the otp to reset your password.',
        },
            { status: 201 }
        );
    }
    catch (error) {
        return Response.json({
            success: false,
            message: 'Error registering user',
        },
            { status: 500 }
        );
    }
} 
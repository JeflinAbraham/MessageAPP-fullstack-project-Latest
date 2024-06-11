import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";

export async function POST(req: Request, { params }: { params: { email: string } }) {
    await dbConnect();
    try {
        const { newPassword, confirmPassword } = await req.json();
        if (newPassword !== confirmPassword) {
            return Response.json({
                success: false,
                description: "confirm password field doesn't match"
            })
        }
        const newEmail = decodeURIComponent(params.email);
        const user = await User.findOneAndUpdate(
            { email: newEmail },
            {
                password: newPassword
            },
            { new: true }
        );
        if (!user) {
            return Response.json({
                success: false,
                description: "user not found"
            })
        }
        await user.save();
        return Response.json({
            success: true,
            description: "Password updated successfully"
        })

    } catch (error) {
        return Response.json({
            success: false,
            description: "failed to update the password"
        })
    }
}
import dbConnect from '@/lib/dbConnect';
import User from '@/models/user.model';
import { Message } from '@/models/user.model';

export async function POST(request: Request) {
    await dbConnect();
    const { username, content } = await request.json();

    try {
        const user = await User.findOne({ username }).exec();

        if (!user) {
            return Response.json({
                success: false,
                message: 'User not found'
            },
                { status: 404 }
            );
        }

        // Check if the user is accepting messages
        if (!user.isAcceptingMessages) {
            return Response.json({
                message: 'User is not accepting messages',
                success: false
            },
                { status: 403 } // 403 Forbidden status
            );
        }

        const newMessage = { content, createdAt: new Date(Date.now()) };

        // Push the new message to the user's messages array
        // typescript issue, we should make sure that the data pushed to user.messages is of type Message, use assersion.
        user.messages.push(newMessage as Message);
        await user.save();

        return Response.json(
            { message: 'Message sent successfully', success: true },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error adding message:', error);
        return Response.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
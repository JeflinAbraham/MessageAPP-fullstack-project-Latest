import UserModel from '@/models/user.model';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import { Message } from '@/models/user.model';
import { authOptions } from '../../auth/[...nextauth]/options';
import { useParams } from 'next/navigation';

export async function DELETE(request: Request) {
    await dbConnect();
    const params = useParams();
    const messageId = params.messageid;
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: 'Not authenticated'
        },
            { status: 401 }
        );
    }
    const _user: User = session.user;

    try {
        //updateOne (filter object, update object): to update a single document in the User collection that matches the specified filter.
        // The filter object specifies which document to update.
        // Update Object { $pull: { messages: { _id: messageId } } }: The update object uses the $pull operator to remove items from an array that match a condition, { messages: { _id: messageId } } specifies that it will pull (remove) the message with the specified messageId from the messages array of UserModel document, whcih is an array of message documents.
        const updateResult = await UserModel.updateOne(
            { _id: _user._id },
            { $pull: { messages: { _id: messageId } } }
        );

        if (updateResult.modifiedCount === 0) {
            return Response.json({
                message: 'Message not found or already deleted',
                success: false
            },
                { status: 404 }
            );
        }

        return Response.json({
            message: 'Message deleted',
            success: true
        },
            { status: 200 }
        );
    } catch (error) {
        return Response.json({
            message: 'Error deleting message',
            success: false
        },
            { status: 500 }
        );
    }
}
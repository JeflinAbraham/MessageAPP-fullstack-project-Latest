import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/user.model';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: 'Not authenticated'
        },
            { status: 401 }
        );
    }

    // iss _user ka type is User (from nextAuth)
    const _user: User = session.user;

    // the user which we stored in the session if u remember was stringified.
    // when using aggreagation pipeline we need to make sure that the user's ID is of type ObjectId.
    const userId = new mongoose.Types.ObjectId(_user._id);
    const matchStage = await UserModel.aggregate([
        { $match: { _id: userId } },
        { $unwind: '$messages' },

    ]).exec();
    console.log("Match Stage Result:", matchStage);

    try {
        const user = await UserModel.aggregate([
            // This stage filters the documents in the UserModel collection to find the document where the _id field matches the userId variable. Only the document with the specified userId will be processed in the subsequent stages.
            { $match: { _id: userId } },


            //The $unwind stage deconstructs the messages array field in the user document. This means that if a user has multiple messages, this stage will create a separate document for each message, each containing the user data along with a single message from the array. (watch 4: 15 mins)
            { $unwind: '$messages' },

            // This stage sorts the unwound documents by the createdAt field of the messages array in descending order. As a result, messages are ordered from the most recent to the oldest based on their creation date.
            { $sort: { 'messages.createdAt': -1 } },

            // This stage groups the documents back into a single document for each user _id. The $push operator creates an array of messages by pushing each unwound and sorted message back into the array.
            { $group: { _id: '$_id', messages: { $push: '$messages' } } },

            // .exec() is called to execute the aggregation pipeline.
        ]).exec();

        if (!user) {
            return Response.json({
                message: 'User not foundddd',
                success: false
            },
                { status: 404 }
            );
        }
        if(user.length === 0){
            return Response.json({
                message: 'no messages',
                success: true
            },
                { status: 200 }
            );

        }

        // The result of the aggregation query is stored in the variable user, which is an array of documents. user array contains exactly one document (user with userId = _id).
        return Response.json(
            { messages: user[0].messages },
            {
                status: 200,
            }
        );
    } catch (error) {
        return Response.json({
            message: 'Internal server error',
            success: false
        },
            { status: 500 }
        );
    }
}
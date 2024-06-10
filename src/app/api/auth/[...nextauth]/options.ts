import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/models/user.model';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            // ab next auth ko nhi pata user ko kese authurize kre using the credentials provided, u need to define a custom method.
            // for async method, the return type is always a promise<>.
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    console.log(credentials);
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ],
                    });
                    if (!user) {
                        throw new Error('No user found with this email');
                    }
                    if (!user.isVerified) {
                        throw new Error('Please verify your account before logging in');
                    }
                    const isPasswordCorrect = await bcrypt.compare(
                        credentials.password,
                        user.password
                    );
                    if (isPasswordCorrect) {
                        // nextAuth docs: Any object returned will be saved in `user` property of the JWT.
                        return user;
                    } 
                    else {
                        throw new Error('Incorrect password');
                    }
                } 
                catch (err: any) {
                    throw new Error(err);
                }
            },
        }),
    ],
    callbacks: {
        // docs:
        // in jwt callback, always return token.
        // in session callback, always return session.
        // the user object in jwt is obtained from the credentials provider.
        async jwt({ token, user }) {

            // user: user from nextAuth, we should mention to typescript ki iske paaas _id, isVerified, isAcceptingMessages, username properties h.
            if (user) {
                // Convert ObjectId to string.
                token._id = user._id?.toString(); 

                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,

    // if a custom page is not provided, next-auth will use its built-in sign-in page located at /api/auth/signin.
    // next-auth handles the redirection, sign-in logic, and error messages automatically.
    // but here, by setting pages.signIn to '/sign-in', next-auth will redirect users to /sign-in when they need to authenticate.You are responsible for creating the custom sign-in page and using next-auth signIn function to handle the sign-in logic.
    pages: {
        signIn: '/sign-in',
    },
};
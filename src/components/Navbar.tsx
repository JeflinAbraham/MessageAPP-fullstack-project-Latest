'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';

function Navbar() {

    /*
    nextAuth docs for useSession:

    useSession(): to check if someone is signed in or not.
    
    data: This can be session or null.
    in case of failure (failed to retrive the session), data will be null
    in case of success, data will be Session.
    */
    const { data: session } = useSession();
    const user: User = session?.user;

    return (
        <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
            <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
                <a href="#" className="text-xl font-bold mb-4 md:mb-0">
                    True Feedback
                </a>
                {session ? (
                    <div>
                        <span className="mr-4">
                            Welcome, {user.username || user.email}
                        </span>
                        {/* nextAuth automatically handles redirection after excecuting signOut() */}
                        <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
                            Logout
                        </Button>
                    </div>
                ) : (
                    <Link href="/sign-in">
                        <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
                    </Link>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button';
import { User } from 'next-auth';
import { X } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

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

    const router = useRouter();
    const currPath = usePathname();
    const isHomePage = currPath === '/';

    const [isLoading, setIsLoading] = useState(false);
    const handleClickLogin = async () => {
        setIsLoading(true);
        setTimeout(() => {
            router.replace('/sign-in');
        }, 500);
    }

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

                        {isHomePage ? (
                            <Button className="bg-white text-black hover:bg-slate-200 mr-4"
                                onClick={() => router.replace('/dashboard')}
                            >
                                <span>View dashboard</span>
                            </Button>

                        ) : (
                            <Button className="bg-white text-black hover:bg-slate-200 mr-4"
                                onClick={() => router.replace('/')}
                            >
                                <span>Home</span>
                            </Button>
                        )}

                        {/* nextAuth automatically handles redirection after excecuting signOut() */}

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button className="bg-white text-black hover:bg-slate-200">
                                    <span>Logout</span>
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure you want to logout? Click on 'No' to cancel</AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>No</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => signOut()}>Yes</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>




                    </div>
                ) : (
                    <Button className="bg-white text-black hover:bg-slate-200 mr-4"
                        onClick={handleClickLogin}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            </>
                        ) : (
                            'Login'
                        )}
                    </Button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;








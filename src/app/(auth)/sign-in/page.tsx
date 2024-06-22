'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signInSchema } from '@/schemas/signInSchema';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { Bubblegum_Sans } from 'next/font/google';

export default function SignInForm() {
    const router = useRouter();

    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

    const { toast } = useToast();

    /*
    nextAuth flow:
    when the user needs to sign in, he is redirected to '/sign-in'(custom sign-in page), which was provided in the pages option in options.ts
    The user fills in the credentials (email and password) and submits the form, onSubmit event handler is invoked.
    This handler calls the signIn function provided by NextAuth.js with the credentials as the authentication provider.
    signIn failure/ success is managed accordingly.
    */

    const [isSubmitting, setIsSubmitting] = useState(false);
    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        const result = await signIn('credentials', {
            // redirect: false, means the function won't automatically redirect upon successful sign-in.
            redirect: false,
            identifier: data.identifier,
            password: data.password,
        });

        console.log(result);

        if (result?.error) {
            // If the sign-in attempt fails, the result object will contain an error property.
            toast({
                title: 'Error',
                description: result.error,
                variant: 'destructive',
            });
        }

        // // If the sign-in attempt is successful, the result object contains a url property. This property contains the URL where the user would have been redirected to automatically, but we manually redirect the user to '/dashboard' using next router.
        if (result?.url) {
            router.replace('/dashboard');
        }
        setIsSubmitting(false);
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Welcome Back to True Feedback
                    </h1>
                    <p className="mb-4">Sign in to continue your secret conversations</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="identifier"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <label>Email/Username</label>
                                    <Input {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <label>Password</label>
                                    <Input type="password" {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Link href='/enter-email'>
                            <button className='text-sky-600 underline'>forgot password</button>
                        </Link>
                        <Button type="submit" className='w-full' disabled={isSubmitting}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Please wait...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>  
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Not a member yet?{' '}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800 underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
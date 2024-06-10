'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { verifySchema } from '@/schemas/verifySchema';

export default function VerifyAccount() {
    const router = useRouter();

    // on successful sign-up, user is redirected to /verify/${username}.
    // useParams(): to access dynamic route parameters from the url, eg: /verify/[username], username is the dynamic paramter.
    const params = useParams();

    const { toast } = useToast();

    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post(`/api/verify-code`, {
                username: params.username,
                code: data.code,
            });

            if (response.data.success){
                toast({
                    title: 'Success',
                    description: response.data.message,
                });
            }

            router.replace('/sign-in');
        } 
        catch (error: any) {
            toast({
                title: 'Verification Failed',
                description: error.response.data.message || 'An error occurred. Please try again.',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="code"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <label>Verification code</label>
                                    <Input {...field} />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Verify</Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
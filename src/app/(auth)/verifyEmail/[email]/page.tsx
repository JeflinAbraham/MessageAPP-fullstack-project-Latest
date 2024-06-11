'use client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { verifySchema } from '@/schemas/verifySchema';
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
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function VerifyAccount() {
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    });

    const { toast } = useToast();
    const router = useRouter();

    // useParams(): to access dynamic route parameters from the url, eg: /verifyEmail/[email], email is the dynamic paramter.
    const params = useParams();


    // loading state.
    const [isVerifying, setIsVerifying] = useState(false);

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            setIsVerifying(true);
            const response = await axios.post(`/api/verify-code-email`, {
                email: params.email,
                code: data.code
            });
            if(response.data.success){
                toast({
                    title: "Success",
                    description: response.data.message,
                })
                router.replace(`/password-reset/${params.email}`);
            }
            else{
                toast({
                    title: "Error",
                    description: response.data.message,
                    variant: 'destructive'
                })
            }

        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response.data.message,
                variant: 'destructive'
            })
        }
        finally{
            setIsVerifying(false);
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
                        <Button type="submit" className='w-full' disabled={isVerifying}>
                            {isVerifying ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                'Verify'
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
}
"use client"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { toast, useToast } from "@/components/ui/use-toast"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useParams } from "next/navigation"

type Password = {
    newPassword: String,
    confirmPassword: String
}

function page() {
    const form = useForm({
        defaultValues: {
            newPassword: "",
            confirmPassword: ""
        },
    })

    const { toast } = useToast();
    const router = useRouter();
    const params = useParams();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: Password) => {
        try {
            setIsSubmitting(true);
            const response = await axios.post(`/api/password-update/${params.email}`, data);
            if (response.data.success) {
                toast({
                    title: 'Success',
                    description: response.data.message
                })
                router.replace('/sign-in');
            }
            else {
                toast({
                    title: 'Error',
                    description: response.data.message
                })
            } 
        }
        catch (error: any) {
                toast({
                    title: "Error",
                    description: error.response.data.message,
                    variant: 'destructive'
                })
            }
            finally {
                setIsSubmitting(false);
            }
        }

    return (
            <div className="flex justify-center items-center min-h-screen bg-gray-800">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <p className="mb-4 font-semibold text-lg">Reset your password</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                name="newPassword"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <label className="ml-1 text-sm">New Password</label>
                                        <Input placeholder="New Password" {...field} />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="confirmPassword"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <label className="ml-1 text-sm">Confirm Password</label>
                                        <Input placeholder="Confirm Password" {...field} />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full' disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit'
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        );
    }

    export default page
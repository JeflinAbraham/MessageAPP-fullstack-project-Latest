"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
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



function page() {
    const emailSchema = z.object({
        email: z.string().email({ message: "invalid input format" }),
    })

    const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: "",
        },
    })

    const { toast } = useToast();
    const router = useRouter();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: z.infer<typeof emailSchema>) => {
        try {
            setIsSubmitting(true);
            const response = await axios.post('/api/verify-email', data);
            if(response.data.success){
                toast({
                    title: 'Success',
                    description: response.data.message
                })
                router.replace(`/verifyEmail/${data.email}`);
            }
            else{
                toast({
                    title: 'Error',
                    description: response.data.message,
                    variant: 'destructive'
                })
            }
        } 
        catch (error: any) {
            toast({
                title: 'Error',
                description: error.response.data.message,
                variant: 'destructive'
            })
        }
        finally{
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <p className="mb-4 font-semibold text-lg">Enter your email for verification</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <label className="ml-1">Email</label>
                                    <Input placeholder="Email" {...field} />
                                    <FormMessage />
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
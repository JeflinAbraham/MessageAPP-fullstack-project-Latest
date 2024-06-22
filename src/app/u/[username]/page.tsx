'use client'
// hit the send-message api when u click on send button.
// send-message is expecting username, content in the request body.
// for content: use react-hook-forms.
// for username: use useParams().
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { messageSchema } from "@/schemas/messageSchema"
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
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"
import { title } from "process"
import axios from "axios"
import { useParams } from "next/navigation"
import { Content } from "next/font/google"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Loader2 } from "lucide-react"



function page() {

    const params = useParams();
    const username = params.username;

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: "",
        },
    })

    const { toast } = useToast();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        try {
            setIsSubmitting(true);
            const response = await axios.post('/api/send-messages', {
                username,
                content: data.content
            })
            if (response.data.success) {
                toast({
                    title: 'Success',
                    description: response.data.message
                })
            }
            else {
                toast({
                    title: 'failure',
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
        finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        name="content"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <label className="font-bold text-2xl italic mb-8">Send anonymous message to @{username}</label>
                                <Textarea {...field} placeholder="Write your anonymous message here..." />
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className='max-w-20 p-4' disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            'Send'
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default page
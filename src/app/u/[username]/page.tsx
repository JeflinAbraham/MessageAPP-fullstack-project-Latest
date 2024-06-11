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

    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        try {
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
                                <label className="font-bold text-2xl italic underline underline-offset-8 mb-8">Send anonymous message to @{username}</label>
                                <Input {...field}/>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">send</Button>
                </form>
            </Form>
        </div>
    )
}

export default page
'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/models/user.model';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';

function UserDashboard() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSwitchLoading, setIsSwitchLoading] = useState(false);

    const { toast } = useToast();

    // // removing the message from the ui.
    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((message) => message._id !== messageId));
    };

    const { data: session } = useSession();

    const form = useForm({
        resolver: zodResolver(AcceptMessageSchema),
    });

    // destructuring properties from the form object.
    const { register, watch, setValue } = form;

    // watch: to watch the value of form fields. It returns the current value of the specified field.
    const acceptMessages = watch('acceptMessages');

    // to know the acceptMessage status (get request).
    const fetchAcceptMessages = useCallback(async () => {
        setIsSwitchLoading(true);
        try {
            const response = await axios.get('/api/accept-messages');
            setValue('acceptMessages', response.data.isAcceptingMessages);
        }

        catch (error: any) {
            toast({
                title: 'Error',
                description: error.response.data.message || 'Failed to fetch message settings',
                variant: 'destructive',
            });
        } finally {
            setIsSwitchLoading(false);
        }
    }, [setValue, toast]);



    // to fetch all the messages.
    const fetchMessages = useCallback(async (refresh: boolean = false) => {
        setIsLoading(true);
        setIsSwitchLoading(false);
        try {
            const response = await axios.get('/api/get-messages');
            setMessages(response.data.messages || []);
            if (refresh) {
                toast({
                    title: 'Refreshed Messages',
                    description: 'Showing latest messages',
                });
            }
        }
        catch (error: any) {
            toast({
                title: 'Error',
                description: error.response.data.message || 'Failed to fetch messages',
                variant: 'destructive',
            });
        }
        finally {
            setIsLoading(false);
            setIsSwitchLoading(false);
        }
    },
        [setIsLoading, setMessages, toast]
    );

    // Fetch initial state from the server
    useEffect(() => {
        if (!session || !session.user) return;

        fetchMessages();
        fetchAcceptMessages();

    }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);



    // Handle switch change
    const handleSwitchChange = async () => {
        try {
            // change the acceptMessage status in the database (backend).
            const response = await axios.post('/api/accept-messages', {
                acceptMessages: !acceptMessages,
            });

            // change the accept message status in the ui (frontend).
            setValue('acceptMessages', !acceptMessages);

            toast({
                title: response.data.message,
                variant: 'default',
            });

        }
        catch (error: any) {
            toast({
                title: 'Error',
                description: error.response.data.message || 'Failed to update message settings',
                variant: 'destructive',
            });
        }
    };

    if (!session || !session.user) {
        return <div> please Login</div>;
    }

    const { username } = session.user as User;

    // window.location.protocol provides the protocol being used (e.g., http: or https:).
    // window.location.host provides the hostname of the current URL (here, localhost:3000).

    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/u/${username}`;

    // This function copies the profileUrl to the clipboard and shows a toast notification.
    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast({
            title: 'URL Copied!',
            description: 'Profile URL has been copied to clipboard.',
        });
    };

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
                <div className="flex items-center">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="input input-bordered w-full p-2 mr-2"
                    />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <Switch
                    // when we used react hook forms previously, we used to mention the 'name' of the field to be tracked.
                    // here using register, do achieve the same thing.

                    // The register function is used to register the input in the form so that it can be tracked and managed by React Hook Form.
                    // 'acceptMessages' is the name of the form field that needs to be tracked.
                    {...register('acceptMessages')}
                    checked={acceptMessages}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>
            <Separator />

            <Button
                className="mt-4"
                variant="outline"
                onClick={(e) => {
                    e.preventDefault();
                    fetchMessages(true);
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                            key={Date.now()}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    );
}

export default UserDashboard;
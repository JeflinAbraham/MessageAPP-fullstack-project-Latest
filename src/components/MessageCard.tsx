"use client"
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Message } from '@/models/user.model';
import { Button } from './ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ApiResponse } from '@/types/ApiResponse';
import { any } from "zod";

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: any) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
    const { toast } = useToast();

    const handleDeleteConfirm = async () => {
        try {
            const response = await axios.delete(`/api/delete-message/${message._id}`);
            toast({
                title: response.data.message,
            })
            onMessageDelete(message._id);

        } catch (error: any) {
            toast({
                title: 'Error',
                description:
                    error.response.data.message ?? 'Failed to delete message',
                variant: 'destructive',
            });
        }
    };
    return (
        <Card className="border border-black shadow-lg shadow-black">
            <CardHeader>
                <div className="flex justify-between">
                    <CardTitle className="mb-4">{message.content}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="bg-red-500 hover:bg-red-600">
                                <X className="w-5 h-5" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure you want to delete this message?</AlertDialogTitle>
                            </AlertDialogHeader>


                            <AlertDialogFooter >
                                <AlertDialogCancel>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>
                                    Yes
                                </AlertDialogAction>
                            </AlertDialogFooter>


                        </AlertDialogContent>
                    </AlertDialog>

                </div>
                <div className="text-sm">
                    {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                </div>
            </CardHeader>
        </Card>
    )
}
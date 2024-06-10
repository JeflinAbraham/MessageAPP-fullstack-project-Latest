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
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant='destructive'>
                            <X className="w-5 h-5" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.
                            </AlertDialogDescription>
                        </AlertDialogHeader>


                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteConfirm}>
                                Continue
                            </AlertDialogAction>
                        </AlertDialogFooter>


                    </AlertDialogContent>
                </AlertDialog>
            </CardHeader>
        </Card>
    )
}
"use client";

import  { AxiosError } from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
}from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
}from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";
import { getOrCreateFriendship } from "@/lib/friend";

const formSchema = z.object({
    email: z.string().min(1, {
        message: "Email is required."
    })
});

export const AddFriendModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const router = useRouter();
    const params = useParams();

    const isModalOpen = isOpen && type === "addFriend";
    const { ids } = data;

    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        }
    });

    const isLoading = form.formState.isSubmitting;

    const [formMessage, setFormMessage] = useState("");
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);

    useEffect(() => {
        if (isFormSubmitted) {
            setFormMessage("");
            setIsFormSubmitted(false);
        }
    }, [isFormSubmitted]);

    if(!ids){
        return null;
    }

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const friendship = await getOrCreateFriendship(ids, values.email, ids);

            if (friendship instanceof AxiosError) {
                setFormMessage(friendship.response?.data);
                return;
            }

            if (typeof friendship === 'string') {
                setFormMessage(friendship); 
                return;
            }

            form.reset();
            router.refresh();
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const handleClose = () => {
        form.reset();
        onClose();
    };

    return (
        <Dialog open={isModalOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-white text-black dark:bg-zinc-700 dark:text-white p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Add Friend
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500 dark:text-white/60">
                        Add a friend via email.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold dark:text-zinc-300 text-zinc-500">
                                            Email
                                        </FormLabel>
                                        <FormControl> 
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-200/90 dark:bg-zinc-800 border-0 focus-visible:ring-0 text-zinc-600 dark:text-zinc-200 focus-visible:ring-offset-0"
                                                placeholder="Enter the email"
                                                {...field}
                                            />
                                        </FormControl>
                                        {formMessage && (
                                            <FormMessage className="text-red-500">
                                                {formMessage}
                                            </FormMessage>
                                        )}
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="bg-gray-100 dark:bg-zinc-700 px-6 py-4">
                            <Button variant="primary" disabled={isLoading}>
                                Add
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

"use client";

import { useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
}from "@/components/ui/dialog";

import qs from "query-string"; 
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";


export const DeleteChannelModal = () => {
    const router = useRouter();
    const {isOpen, onClose, type, data } = useModal();

    const isModalOpen = isOpen && type === "deleteChannel";
    const { server, channel } = data;

    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () =>{
        try{
            setIsLoading(true);

            const url =  qs.stringifyUrl({
                url:`/api/socket/channels/${server?.id}`,
                query:{
                    channelId: channel?.id
                }
            })
            
            await axios.delete(url);

            onClose();
            router.push(`/servers/${server?.id}`);
        } catch(error){
            console.log(error);
        } finally{
            router.refresh();
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black dark:bg-zinc-700 dark:text-white p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Delete channel
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500 dark:text-white/60">
                        Are you sure you want to do this? <br />
                        <span className="text-indigo-500 font-semibold">#{channel?.name}</span> will be permanently deleted.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="bg-gray-100 dark:bg-zinc-700 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                        disabled={isLoading}
                        onClick={onClose}
                        variant="ghost"
                        className="hover:bg-zinc-400"
                        >
                            Cancel
                        </Button>
                        <Button
                        disabled={isLoading}
                        onClick={onClick}
                        variant="primary"
                        >
                            Confirm
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
"use client";

import { useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
}from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useOrigin } from "@/hooks/use-origen";
import axios from "axios";


export const InviteModal = () => {
    const { onOpen, isOpen, onClose, type, data } = useModal();

    const origin = useOrigin();

    const isModalOpen = isOpen && type === "invite";
    const { server } = data;

    const [ copied, setCopied ] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

    const onCopy = () => {
        navigator.clipboard.writeText(inviteUrl);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const onNew = async () =>{
        try{
            setIsLoading(true);
            const response = await axios.patch(`/api/servers/${server?.id}/invite-code`);

            onOpen("invite", {server: response.data});
        }catch(error){
            console.log(error);
        }finally{
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black dark:bg-zinc-700 dark:text-white p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Invite Friends
                    </DialogTitle>
                </DialogHeader>
                <div className="p-6">
                    <Label
                    className="uppercase text-xs font-bold dark:text-zinc-300 text-zinc-500"
                    >
                        Server Link
                    </Label>
                    <div className="flex items-center mt-2 gap-x-2">
                        <Input 
                        disabled={isLoading}
                        className="bg-zinc-200/90 dark:bg-zinc-800 border-0 focus-visible:ring-0 text-zinc-600 dark:text-zinc-200 focus-visible:ring-offset-0" 
                        value={inviteUrl} 
                        />
                        <Button disabled={isLoading} onClick={onCopy} size="icon" >
                            {copied ? <Check className="w-4 h-4"/> : <Copy className="w-4 h-4"/>}
                            
                        </Button>

                    </div>
                    <Button onClick={onNew} disabled={isLoading} variant="link" size="sm" className="text-xs text-zinc-600 dark:text-zinc-300 mt-4">
                        Generate Link
                        <RefreshCw className="w-4 h-4 m-2"/>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
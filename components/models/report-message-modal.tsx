"use client"

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import qs from "query-string";
import { useModal } from "@/hooks/use-modal-store";

export const ReportMessageModal = () => {
    const { isOpen, onClose, type, data } = useModal();
    const isModalOpen = isOpen && type === "reportMessage";
    const { apiUrl, query, ids } = data;
    const [isLoading, setIsLoading] = useState(false);
    const [reason, setReason] = useState("");

    const onClick = async () => {
        try {
            setIsLoading(true);

            const url = qs.stringifyUrl({
                url: apiUrl || "",
                query:{
                    reason: reason,
                    id: ids
                }
            });

            await axios.post(url);
 
            onClose();
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }; 

    const handleOnClose = async () =>{
        setReason("");
        onClose();
    }

    return (
        <Dialog open={isModalOpen} onOpenChange={handleOnClose}>
            <DialogContent className="bg-white dark:bg-zinc-700 text-white p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Report
                    </DialogTitle>
                    <div className="my-4">
                        <DialogDescription className="text-center text-zinc-300 my-4">
                            Please provide a reason for reporting:
                        </DialogDescription>
                    </div>
                    <textarea
                        className="px-8 py-6 bg-zinc-200/90 dark:bg-zinc-800 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 w-full resize-none"
                        value={reason}
                        placeholder="Reason"
                        onChange={(e) => setReason(e.target.value)}
                        rows={4}
                    />
                </DialogHeader>

                <DialogFooter className="bg-gray-100 dark:bg-zinc-700 px-6 py-4">
                    <div className="flex items-center justify-between w-full">
                        <Button
                            disabled={isLoading}
                            onClick={handleOnClose}
                            variant="ghost"
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
    );
};

"use client";

import { useEffect, useState } from "react";

import { CreateServerModal } from "@/components/models/create-server-modal";
import { InviteModal } from "@/components/models/Invite-modal";
import { EditServerModal } from "@/components/models/edit-server-modal";
import { MembersModal } from "@/components/models/members-model";
import { CreateChannelModal } from "@/components/models/create-channel-model";
import { LeaveServerModal } from "@/components/models/leave-server-modal";
import { DeleteServerModal } from "@/components/models/delete-server-modal";
import { DeleteChannelModal } from "@/components/models/delete-channel-modal";
import { EditChannelModal } from "@/components/models/edit-channel-modal";
import { MessageFileModal } from "@/components/models/message-file-modal";
import { DeleteMessageModal } from "@/components/models/delete-message-modal";
import { ReportMessageModal } from "../models/report-message-modal";
import { AddFriendModal } from "../models/add-friend-model";

export const ModalProvider = () =>{
    const [isMounted, setIsMounted] = useState(false);

    useEffect(()=>{
        setIsMounted(true);
    }, []);

    if(!isMounted){
        return null;
    }
 
    return(
        <>
            <CreateServerModal/>
            <InviteModal/>
            <EditServerModal/>
            <MembersModal/>
            <CreateChannelModal/>
            <LeaveServerModal/>
            <DeleteServerModal/>
            <DeleteChannelModal/>
            <EditChannelModal/>
            <MessageFileModal/>
            <DeleteMessageModal/>
            <ReportMessageModal/>
            <AddFriendModal/>
        </>
    )
}
"use client";

import { useEffect, useState } from "react";

import { CreateServerModal } from "@/components/models/create-server-modal";
import { InviteModal } from "@/components/models/Invite-modal";
import { EditServerModal } from "@/components/models/edit-server-modal";
import { MembersModal } from "@/components/models/members-model";

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
        </>
    )
}
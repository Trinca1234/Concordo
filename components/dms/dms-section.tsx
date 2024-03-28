"use client"

import { ServerWithMemberWithProfile } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client"

interface DmsSectionProps{
    label: string;
    role?:MemberRole;
    sectionType: "channels" | "users";
    channelType?: ChannelType;
    server?:ServerWithMemberWithProfile;
}
 
export const DmsSection = ({
    label,
}: DmsSectionProps) =>{

    return(
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
        </div>
    )
}
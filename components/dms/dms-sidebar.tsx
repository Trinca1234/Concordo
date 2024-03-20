import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";

import { redirect } from "next/navigation";
import { DmsSearch } from "./dms-search";
import { ScrollArea } from "../ui/scroll-area";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import { DmsSection } from "./dms-section";
import { DmsUser } from "./dms-user";

interface DmsSidebarProps{
    serverId: string;
}

const iconMap={
    [ChannelType.TEXT]:<Hash className="mr-2 h-4 w-4"/>,
    [ChannelType.AUDIO]:<Mic className="mr-2 h-4 w-4"/>,
    [ChannelType.VIDEO]:<Video className="mr-2 h-4 w-4"/>
};

const roleIconMap={
    [MemberRole.GUEST]:null,
    [MemberRole.MODERATOR]:<ShieldCheck className="h-4 w-4 mr-2 text-indigo-500"/>,
    [MemberRole.ADMIN]:<ShieldAlert className="h-4 w-4 mr-2 text-rose-500"/>
    
};

export const DmsSidebar = async ({
    serverId
}: DmsSidebarProps) =>{
    const profile = await currentProfile();

    if(!profile){
        return redirect("/");
    }

    const users = await db.profile.findMany({
        where:{
            id: {
                not: profile.id
            }
        },
        select: {
            id: true,
            name: true,
            imageUrl: true
        }
    });

    const role = "ADMIN";

    return(
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <DmsSearch/>
            <ScrollArea className="flex px-3">
                <div className="mt-2">
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
                {!!users?.length &&(
                    <div className="mb-2">
                        <DmsSection
                        sectionType="users"
                        role={role}
                        label="Users"
                        />
                        <div className="space-y-[2px}">
                            {users.map((users) => (
                                <DmsUser
                                    key={users.id}
                                    profile={users}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}
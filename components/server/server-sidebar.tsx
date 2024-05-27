"use client"

import { ChannelType, MemberRole, Profile } from "@prisma/client";
import { ServerHeader } from "./server-header";
import { ScrollArea } from "../ui/scroll-area";
import { ServerSearch } from "./server-search";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";
import { Separator } from "../ui/separator";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";
import { useChannelQuery } from "@/hooks/channel/use-channel-query";
import { useEffect, useState } from "react";
import { useChannelSocket } from "@/hooks/channel/use-channel-socket";

interface Member {
    id: string;
    role: MemberRole;
    status: boolean;
    profileId: string;
    serverId: string;
    createdAt: Date;
    updatedAt: Date;
    profile: {
        id: string;
        userId: string;
        name: string;
        imageUrl: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    };
}

interface Channel {
    id: string; 
    name: string; 
    type: ChannelType; 
    profileId: string; 
    serverId: string; 
    createdAt: Date; 
    updatedAt: Date;
}

interface Server {
    id: string;
    name: string;
    imageUrl: string;
    inviteCode: string;
    profileId: string;
    createdAt: Date;
    updatedAt: Date;
    channels: Channel[];
    members: Member[];
}

interface ServerSidebarProps{
    serverId: string;
    profile: Profile;
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

export const ServerSidebar = ({
    serverId,
    profile
}: ServerSidebarProps) =>{

    const [server, setServers] = useState<Server | null>(null);

    const queryKey = `channels:`;
    const updateKey = `channels:${serverId}:update`;
    const apiUrl = "/api/channels";
    
    const {
        data,
        status
    } = useChannelQuery({
        queryKey,
        apiUrl,
        serverId
    });
    useChannelSocket({queryKey, updateKey});

    useEffect(() => {
        if (data) {
            setServers(data.pages[0]);
        }
    }, [data]);

    if(server){
        const textChannels = server.channels.filter((channel) => channel.type === ChannelType.TEXT)
        const audioChannels = server.channels.filter((channel) => channel.type === ChannelType.AUDIO)
        const videoChannels = server.channels.filter((channel) => channel.type === ChannelType.VIDEO)
    
        const members = server.members.filter((member) => member.profileId !== profile.id)
    
        const role: MemberRole = server.members.find((member) => member.profileId === profile.id)?.role as MemberRole;
        return(
            <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
                <ServerHeader
                    server={server}
                    role={role}
                />
                <ScrollArea className="flex px-3">
                    <div className="mt-2">
                        <ServerSearch 
                        data={[
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map((channel)=>({ 
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                }))
                            },
                            {
                                label: "Audio Channels",
                                type: "channel",
                                data: audioChannels?.map((channel)=>({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                }))
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels?.map((channel)=>({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],
                                }))
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: members?.map((member)=>({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role],
                                }))
                            }
                        ]}
                        />
                    </div>
                    <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
                    {!!textChannels?.length &&(
                        <div className="mb-2">
                            <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.TEXT}
                            role={role}
                            label="Text Channels"
                            serverId={serverId}
                            />
                            <div className="space-y-[2px}">
                                {textChannels.map((channel)=>(
                                <ServerChannel 
                                key={channel.id}
                                channel={channel}
                                role={role}
                                server={server}
                                />
                                ))}
                            </div>
                            
                        </div>
                    )}
                    {!!audioChannels?.length &&(
                        <div className="mb-2">
                            <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.AUDIO}
                            role={role}
                            label="Audio Channels"
                            serverId={serverId}
                            />
                            <div className="space-y-[2px}">
                                {audioChannels.map((channel)=>(
                                    <ServerChannel 
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                    {!!videoChannels?.length &&(
                        <div className="mb-2">
                            <ServerSection
                            sectionType="channels"
                            channelType={ChannelType.VIDEO}
                            role={role}
                            label="Videos Channels"
                            serverId={serverId}
                            />
                            <div className="space-y-[2px}">
                                {videoChannels.map((channel)=>(
                                    <ServerChannel 
                                    key={channel.id}
                                    channel={channel}
                                    role={role}
                                    server={server}
                                    />
                                ))}
                            </div>
                        </div>
                    )} 
                    {!!members?.length &&(
                        <div className="mb-2">
                            <ServerSection
                            sectionType="members"
                            role={role}
                            label="Members"
                            server={server}
                            />
                            <div className="space-y-[2px}">
                                {members.map((member) => (
                                    member.status && member.status === true && (
                                        <ServerMember
                                            key={member.id}
                                            member={member}
                                            server={server}
                                            profile={profile}
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </ScrollArea>
            </div>
        )
    }
}
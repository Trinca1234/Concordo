"use client"

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client"
import { ChevronDown, Flag, ShieldAlert, ShieldCheck } from "lucide-react";
import { redirect, useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useMediaQuery } from "react-responsive";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "../ui/dropdown-menu";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
  } from "@/components/ui/tabs"
  import axios from "axios";
  import qs from "query-string";
import { useEffect, useState } from "react";
import { getOrCreateFriendship } from "@/lib/friend";
import { ActionTooltip } from "../action-tooltip";
import { useModal } from "@/hooks/use-modal-store";

interface ServerMemberProps{
    member: Member & {profile: Profile};
    server: Server;
    profile: Profile;
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500"/>
}

export const ServerMember = ({
    member,
    profile
}: ServerMemberProps) =>{
    const params = useParams();
    const router = useRouter();
    const [mutualFriends, setMutualFriends] = useState<{ id: string; name: string; imageUrl: string; }[]>([]);
    const [mutualServers, setMutualServers] = useState<{ id: string; name: string; imageUrl: string; }[]>([]);
    const [friendship, setFriendship] = useState(false);
    const { onOpen } = useModal();

    const icon = roleIconMap[member.role];

    const SendFriendRequest = async () =>{
        const friendship = getOrCreateFriendship(profile.id, member.profile.email, profile.id)
        console.log(friendship)
    }

    const SendMessage = () =>{
        router.push(`/dms/conversations/${member.profileId}`)
    }

    async function removeFriend() {
        try {
            const url =  qs.stringifyUrl({
                url: "/api/friends/declineFriendRequest",
                query: {
                    TwoId: member.profile.id
                }
            });
    
            const response = await axios.patch(url);

            console.log(response);

            router.refresh();
        } catch (error) {
            console.log(error);
        }
    }

    async function blockFriend() {
        try {
            const url =  qs.stringifyUrl({
                url: "/api/friends/blockFriendRequest",
                query: {
                    TwoId: member.profile.id
                }
            });

            await axios.patch(url);
            router.refresh();
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchUsers() {
        try {
            const url = qs.stringifyUrl({
                url: "/api/friends/isFriend",
                query: {
                    id: member.profileId
                }
            }); 
            
            const friendship = await axios.get(url);
            console.log(member.profileId);
            console.log(friendship.data);
            setFriendship(friendship.data);

            const url2 = qs.stringifyUrl({
                url: "/api/friends/getMutualFriends",
                query: {
                    id: member.profileId
                }
            }); 
            
            const users = await axios.get(url2);
            console.log(member.profileId);
            console.log(users);
            if(users.data === "No mutual friends found"){
                setMutualFriends([]);
            }else{
                setMutualFriends(users.data);
            }

            const url3 = qs.stringifyUrl({
                url: "/api/friends/getMutualServers",
                query: {
                    id: member.profileId
                }
            });
            
            const servers = await axios.get(url3);
            console.log(member.profileId);
            console.log(servers);
            setMutualServers(servers.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    }

    return(
        <Popover>
            <PopoverTrigger asChild>
                <button
                    onClick={fetchUsers}
                    className={cn(
                        "group px-2 py-2 rounded-mb flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 ",
                        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700"
                    )}
                >
                    <UserAvatar 
                        src={member.profile.imageUrl}
                        className="h-8 w-8 md:h-8 md:w-8"
                    />
                        <p
                            className={cn(
                                "font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition",
                                params?.memberId === member.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white"
                            )}
                        >
                            {member.profile.name.length > 14 ? `${member.profile.name.slice(0, 16)}...` : member.profile.name}
                        </p>
                    {icon}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-200 h-400 bg-zinc-700" side="right">
                <div className="grid gap-4">
                    <div className="flex items-end space-x-4">
                        <UserAvatar 
                            src={member.profile.imageUrl}
                            className="h-8 w-8 md:h-24 md:w-24"
                        />
                        {friendship === true &&(
                            <Button onClick={SendMessage} className=" bg-green-600 font-bold">
                                Send Message
                            </Button>
                        )}
                        {friendship !== true &&(
                            <Button onClick={SendFriendRequest} className=" bg-green-600 font-bold">
                                Send Friend Request
                            </Button>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className=" bg-transparent hover:bg-zinc-600">
                                    <ChevronDown color="white"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className=" w-40">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                    {friendship === true &&(
                                        <>
                                            <DropdownMenuItem onClick={removeFriend}>
                                                Remove Friend
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={blockFriend}>
                                                Block Friend
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    <DropdownMenuItem 
                                        onClick={() => onOpen("reportMessage", { 
                                            apiUrl: `/api/profile/reports`,
                                            ids: member.profileId
                                        })}
                                    >
                                        Report User
                                        <Flag
                                        className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                                        />
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="bg-zinc-800 p-4 rounded">
                        <h4 className="font-medium leading-none mb-4">{member.profile.name}</h4>
                        <Tabs defaultValue="account" className="w-full">
                            <TabsList>
                                <TabsTrigger value="Friends">Mutual Friends</TabsTrigger>
                                <TabsTrigger value="Servers">Mutual Servers</TabsTrigger>
                            </TabsList>
                            <TabsContent value="Friends">
                                <div className="flex flex-col gap-y-4">
                                    {mutualFriends && mutualFriends.length > 0 ? (
                                        mutualFriends.map(friend => (
                                            <div key={friend.id} className="flex items-center">
                                                <UserAvatar
                                                    src={friend.imageUrl}
                                                    className="h-14 w-8 md:h-14 md:w-14"
                                                />
                                                <p className="font-semibold text-base pl-2 text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-300 dark:group-hover:text-zinc-300 transition">
                                                    {friend.name}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No mutual friends found.</p>
                                    )}
                                </div>
                            </TabsContent>
                            <TabsContent value="Servers">
                                <div className="flex flex-col gap-y-4">
                                    {mutualServers.length > 0 ? (
                                        mutualServers.map(server => (
                                            <div key={server.id} className="flex items-center">
                                                <UserAvatar
                                                    src={server.imageUrl}
                                                    className="h-14 w-8 md:h-14 md:w-14"
                                                />
                                                <p className="font-semibold text-base pl-2 text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-300 dark:group-hover:text-zinc-300 transition">
                                                    {server.name}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No mutual servers found.</p>
                                    )}
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
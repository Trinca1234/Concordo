"use client"

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client"
import { ChevronDown, CircleEllipsis, LucideCircleEllipsis, ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
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

interface ServerMemberProps{
    member: Member & {profile: Profile};
    server: Server;
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 ml-2 text-rose-500"/>
}

export const ServerMember = ({
    member,
    server
}: ServerMemberProps) =>{
    const params = useParams();
    const router = useRouter();
    const [mutualFriends, setMutualFriends] = useState<{ id: string; name: string; imageUrl: string; }[]>([]);
    const [mutualServers, setMutualServers] = useState<{ id: string; name: string; imageUrl: string; }[]>([]);

    const icon = roleIconMap[member.role];
    const isDesktop = useMediaQuery({ query: '(min-width: 550px)' });

    const SendFriendRequest = () =>{
        router.push(`/dms/conversations/${member.profileId}`)
    }

    const SendMessage = () =>{
        router.push(`/dms/conversations/${member.profileId}`)
    }


    async function fetchUsers() {
        try {
            const url = qs.stringifyUrl({
                url: "/api/friends/getMutualFriends",
                query: {
                    id: member.profileId
                }
            }); 
            
            const users = await axios.get(url);
            console.log(member.profileId);
            console.log(users);
            setMutualFriends(users.data);

            const url2 = qs.stringifyUrl({
                url: "/api/friends/getMutualServers",
                query: {
                    id: member.profileId
                }
            }); 
            
            const servers = await axios.get(url2);
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
                        {isDesktop && member.profile.name.length > 20 ? `${member.profile.name.slice(0, 20)}...` : `${member.profile.name.slice(0, 14)}...`}
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
                        {/* {friendship &&(
                            <Button onClick={fetchUsers} className=" bg-green-600 font-bold">
                                Send Friend Request
                            </Button>
                        )}
                        {!friendship &&(
                            <Button onClick={fetchUsers} className=" bg-green-600 font-bold">
                                Send Friend Request
                            </Button>
                        )} */}
                        <Button onClick={fetchUsers} className=" bg-green-600 font-bold">
                            Send Friend Request
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className=" bg-transparent hover:bg-zinc-600">
                                    <ChevronDown color="white"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Billing
                                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Settings
                                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Keyboard shortcuts
                                    <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuGroup>
                                <DropdownMenuItem>Team</DropdownMenuItem>
                                <DropdownMenuSub>
                                    <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                                    <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem>Email</DropdownMenuItem>
                                        <DropdownMenuItem>Message</DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>More...</DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuSub>
                                <DropdownMenuItem>
                                    New Team
                                    <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                                </DropdownMenuItem>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>GitHub</DropdownMenuItem>
                                <DropdownMenuItem>Support</DropdownMenuItem>
                                <DropdownMenuItem disabled>API</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    Log out
                                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                </DropdownMenuItem>
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
                                <div className="flex items-center gap-x-2">
                                    {mutualFriends.map(friend => (
                                        <div key={friend.id} className="flex items-center">
                                            <UserAvatar 
                                                src={friend.imageUrl}
                                                className="h-14 w-8 md:h-14 md:w-14"
                                            />
                                            <p className="font-semibold text-base pl-2 text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-300 dark:group-hover:text-zinc-300 transition">
                                                {/* {isDesktop && friend.name.length > 20 ? `${friend.name.slice(0, 20)}...` : `${friend.name.slice(0, 14)}...`} */}
                                                {friend.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </TabsContent>
                            <TabsContent value="Servers">
                                
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
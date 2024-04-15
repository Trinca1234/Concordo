"use client"
import { ChevronDown, Hash, HelpCircle, Inbox, Settings, UserPlus } from "lucide-react";
import { MobileTogle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { SocketIndicator } from "@/components/socket-indicator";
import { UserRound } from "lucide-react";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { currentProfile } from "@/lib/current-profile";
import { Profile } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from 'react';
import axios from 'axios';
import qs from "query-string";

interface FriendsHeaderProp {
    profile: Profile;
}


export const FriendsHeader = ({ profile }: FriendsHeaderProp) =>{ 

    const {onOpen} = useModal();

    const router = useRouter();

    useEffect(() => {
        const fetchFriendRequests = async () => {
            const url = qs.stringifyUrl({
                url: "/api/friends" || "",
            });

            try {
                const response = await axios.get(url);
                console.log(response);
            } catch (error) {
                console.error('Error fetching friend requests:', error);
            }
        };

        fetchFriendRequests();
    }, []);

    const onClickButton = (route: string) => {
        router.push(`/dms/friends/${route}`);
    }

    const onClickHelpButton = (route: string) => {
        router.push(`${route}`);
    }

    return (
        <div className="text-md font-semibold px-3 flex items-center h-14 border-neutral-200 dark:border-neutral-800 border-b-2">
            <div className="h-8 w-8 mr-2 mt-1">
                <UserRound />
            </div>
            <p className="font-semibold text-md text-black dark:text-white">
                Friends
            </p>
            <Separator
                className="h-8 bg-zinc-300 dark:bg-zinc-700"
                decorative
                orientation="vertical"
                style={{ margin: '0 15px' }}
                color=""
            />
            <button
                onClick={() => onClickButton('all')}
                className={"group px-2 py-2 mx-5 rounded-mb flex items-center gap-x-2 w-auto hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 "}
            >
                <p className={"font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition"}>
                    All
                </p>
            </button>
            <button
                onClick={() => onClickButton('pending')}
                className={"group px-2 py-2 mx-5 rounded-mb flex items-center gap-x-2 w-auto hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 "}
            >
                <p className={"font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition"}>
                    Pending
                </p>
            </button>
            <button
                onClick={() => onClickButton('blocked')}
                className={"group px-2 py-2 mx-5 rounded-mb flex items-center gap-x-2 w-auto hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 "}
            >
                <p className={"font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition"}>
                    Blocked
                </p>
            </button>
            <button
                onClick={() => onOpen("addFriend", {
                    ids: profile.id
                })}
                className={"group px-2 py-2 mx-5 rounded-mb flex items-center gap-x-2 w-auto hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 "}
            >
                <p className={"font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition"}>
                    Add Friend
                </p>
            </button>
            <div className="ml-auto flex items-center">
                <Separator
                    className="h-8 bg-zinc-300 dark:bg-zinc-700"
                    decorative
                    orientation="vertical"
                    style={{ margin: '0 15px' }}
                    color=""
                />
                <DropdownMenu>
                    <DropdownMenuTrigger
                    className="focus:outline-none"
                    asChild
                    >
                        <button
                        className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
                        >
                            <Inbox className=" mx-3"/>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                    className="w-56 mr-12 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px] bg-zinc-700 dark:bg-zinc-900"
                    >
                        {/* <DropdownMenuItem
                        onClick={() => onOpen("invite")}
                        className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
                        >
                            Invite people
                            <UserPlus
                            className="h-4 w-4 ml-auto"
                            />
                        </DropdownMenuItem> */}
                        {/* <DropdownMenuItem
                        onClick={() => onOpen("editServer")}
                        className="flex items-center px-3 py-2 text-sm cursor-pointer"
                        >
                            Server Settings
                            <Settings
                            className="h-4 w-4 ml-auto"
                            />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>  */}   
                        {/* {data.map(({ id, name, icon }) => (
                            <DropdownMenuItem
                                key={id}
                                onClick={() => onClick({ id, type: "profile" })}
                                className="flex items-center px-3 py-2 text-sm cursor-pointer"
                            >
                                {icon}
                                <span>{name}</span>
                            </DropdownMenuItem>
                        ))} */}
                        
                    </DropdownMenuContent>
                </DropdownMenu>
                <button
                    onClick={() => onClickHelpButton('https://www.radix-ui.com/primitives/docs/components/separator#separator')}
                >
                    <HelpCircle className=" mx-3 " />
                </button>
            </div>
        </div>
    )
}

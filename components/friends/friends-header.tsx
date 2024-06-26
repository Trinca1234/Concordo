"use client";
import { Bell, CatIcon, CheckIcon, ChevronDown, Hash, HelpCircle, Inbox, Settings, UserPlus, UserRound } from "lucide-react";
import { UserAvatar } from "@/components/user-avatar";
import { SocketIndicator } from "@/components/socket-indicator";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { currentProfile } from "@/lib/current-profile";
import { Profile } from "@prisma/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState } from 'react';
import axios from 'axios';
import qs from "query-string";
import { DmsUser } from "../dms/dms-user";
import { DropdownMenuLabel } from "../ui/dropdown-menu";
import { DmMobileTogle } from "../mobile-toggle-dm";
import { useFriendQuery } from "@/hooks/friends/use-friend-query";
import { useFriendSocket } from "@/hooks/friends/use-friend-socket";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

interface FriendsHeaderProp {
    profile: Profile;
}

const Path = [
    {
        value: "all",
        label: "All Friends",
    },
    {
        value: "pending",
        label: "Pending Friends",
    },
    {
        value: "blocked",
        label: "Blocked Friends",
    },
]

export const FriendsHeader = ({ profile }: FriendsHeaderProp) => { 
    const queryKey = `notifications:`;
    const addKey = `notifications:${profile.id}:add`;
    const deleteKey = `notifications:${profile.id}:delete`;
    const apiUrl = "/api/notifications/getNotifications";

    /* const {
        data,
        status
    } = useFriendQuery({
        queryKey,
        apiUrl,
    })
    useFriendSocket({ queryKey, addKey, deleteKey}) */



    const [value, setValue] = useState("");
    const [open, setOpen] = useState(false);

    const { onOpen } = useModal();
    const router = useRouter();

    const onClickButton = (route: string) => {
        router.push(`/dms/friends/${route}`);
    }

    useEffect(() => {
        if (value) {
            router.push(`/dms/friends/${value}`);
        }
    }, [value, router]);

    return (
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
            <DmMobileTogle profileId={profile.id} />
            <div className="hidden md:flex h-8 w-8 mr-2 mt-1">
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
                className={"hidden md:flex group px-2 py-2 mx-5 rounded-mb items-center gap-x-2 w-auto hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1"}
            >
                <p className={"font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition"}>
                    All
                </p>
            </button>
            <button
                onClick={() => onClickButton('pending')}
                className={"hidden md:flex group px-2 py-2 mx-5 rounded-mb items-center gap-x-2 w-auto hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1"}
            >
                <p className={"font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition"}>
                    Pending
                </p>
            </button>
            <button
                onClick={() => onClickButton('blocked')}
                className={"hidden md:flex group px-2 py-2 mx-5 rounded-mb items-center gap-x-2 w-auto hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1"}
            >
                <p className={"font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition"}>
                    Blocked
                </p>
            </button>
            <button
                onClick={() => onOpen("addFriend", { ids: profile.id })}
                className={"group px-2 py-2 md:mx-5 rounded-mb flex items-center gap-x-2 w-auto hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1"}
            >
                <p className={"font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition"}>
                    Add Friend
                </p>
            </button>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        aria-expanded={open}
                        className="w-auto md:hidden justify-between bg-transparent hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition"
                    >
                        <ChevronDown className="font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandGroup>
                            {Path.map((Path) => (
                                <CommandItem
                                    key={Path.value}
                                    value={Path.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {Path.label}
                                    <CheckIcon
                                        className={cn(
                                            "ml-auto h-4 w-4",
                                            value === Path.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
            
            <div className="ml-auto flex items-center">
                <Separator
                    className="h-8 bg-zinc-300 dark:bg-zinc-700"
                    decorative
                    orientation="vertical"
                    style={{ margin: '0 15px' }}
                    color=""
                />
                <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none" asChild>
                        <button className="w-full text-md font-semibold px-3 flex items-center h-12 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
                            {/* {notifications.length > 0 ? (
                                <div className="relative">
                                    <Bell className="mx-2"/>
                                    <span className="bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center absolute -top-1 -right-1">{notifications.length}</span>
                                </div>
                            ) : (
                                <Bell className=" mx-2"/>
                            )} */}
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        style={{ zIndex: 900 }}
                        className="w-56 mr-12 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px] bg-zinc-700 dark:bg-zinc-900"
                    >
                        {/* {data?.pages.length > 0 ? (
                            <>
                                <DropdownMenuLabel>Pending requests</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm">
                                    <div className="mb-2">
                                        <div className="space-y-[2px} ">
                                            {data?.pages.map(user => (
                                                <div key={user.id} className="border-t border-zinc-200 dark:border-zinc-700">
                                                    <DmsUser profile={user} type={"Pending3"}/>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            </>
                        ) : (
                            <DropdownMenuItem className="text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer">
                                <span>No notifications</span>
                            </DropdownMenuItem>
                        )} */}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    )
}

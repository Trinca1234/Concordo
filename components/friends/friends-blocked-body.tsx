"use client"

import { ScrollArea } from "../ui/scroll-area";
import { DmsUser } from "../dms/dms-user";
import qs from "query-string";
import axios from "axios";
import { useEffect, useState } from "react";
import { Loader2, Search } from "lucide-react";
import { Input } from "../ui/input";
import { useFriendQuery } from "@/hooks/friends/use-friend-query";
import { useFriendBlockSocket } from "@/hooks/friends/use-friendBlock-socket";

interface FriendsAllProps {
    profileId: string;
}

export const FriendsBlockedBody = ({
    profileId 
}: FriendsAllProps) => {
    const [searchQuery, setSearchQuery] = useState("");

    const queryKey = `block:`;
    const acceptedKey = `friends:${profileId}:accepted`;
    const deniedKey = `friends:${profileId}:denied`;
    const blockedKey = `friends:${profileId}:blocked`;
    const apiUrl = "/api/friends/getUsers";
    const paramKey = "status";
    const paramValue = "BLOCKED";

    const { 
        data, 
        status 
    } = useFriendQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue
    });
    useFriendBlockSocket({ queryKey, deniedKey, acceptedKey, blockedKey });

    const filteredUsers = data?.pages.flat().filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (status === "pending") {
        return (
            <div className="text-md mt-4 font-semibold px-3 h-14 ">
                <div>
                    <div className="relative flex items-center">
                        <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name" className="group px-2 py-4 rounded-md flex items-center gap-x-2 w-full bg-zinc-600/10 dark:bg-zinc-800 hover:bg-zinc-700/20 dark:hover:bg-zinc-700/50 transition"/>
                        <Search className="absolute w-4 h-4 text-zinc-500 dark:text-zinc-400 right-2 top-1/2 transform -translate-y-1/2"/>
                    </div>
                    <p className="my-5 font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                        BLOCKED USERS
                    </p>
                    <div className="flex flex-col justify-center items-center">
                        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Loading ...
                        </p>
                    </div>
                </div>
            </div>
        );
    }
  
    return (
        <div className="text-md mt-4 font-semibold px-3 h-14 ">
            <div>
                <div className="relative flex items-center">
                    <Input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name" className="group px-2 py-4 rounded-md flex items-center gap-x-2 w-full bg-zinc-600/10 dark:bg-zinc-800 hover:bg-zinc-700/20 dark:hover:bg-zinc-700/50 transition"/>
                    <Search className="absolute w-4 h-4 text-zinc-500 dark:text-zinc-400 right-2 top-1/2 transform -translate-y-1/2"/>
                </div>
                <p className="my-5 font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                    BLOCKED FRIENDS
                </p>
                <ScrollArea className="flex px-3">
                    {!!filteredUsers.length ? (
                        <div className="mb-2">
                            <div className="space-y-[2px]">
                                {filteredUsers.map(user => (
                                    <div key={user.id} className="border-t border-zinc-200 dark:border-zinc-700">
                                        <DmsUser profile={user} type={"Blocked"} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center text-zinc-500 dark:text-zinc-400 mt-20">
                            <p>No matching users found.</p>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    );
};

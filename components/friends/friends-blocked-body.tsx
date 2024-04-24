"use client"

import { redirect, useRouter } from "next/navigation";
import { FriendSearch } from "./friends-search";
import { ScrollArea } from "../ui/scroll-area";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { DmsUser } from "../dms/dms-user";
import qs from "query-string";
import axios from "axios";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export const FriendsBlockedBody = () => {
    const [users, setUsers] = useState<{ id: string; name: string; imageUrl: string; }[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchUsers() {
        try {
            const url = qs.stringifyUrl({
                url: "/api/friends/getUsers",
                query: {
                    status: "BLOCKED"
                }
            });
        
            const users = await axios.get(url);
            setUsers(users.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            setLoading(false);
        }
    }

    useEffect(() => {
        const intervalId = setInterval(fetchUsers, 2000);

        return () => clearInterval(intervalId);
    }, []);

    if (loading == true) {
        return (
            <div className="text-md font-semibold px-3 h-14 ">
                <div>
                    <FriendSearch/>
                    <p className="my-5 font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                        BLOCKED FRIENDS
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

    if (users.length === 0 && loading == false) {
        return (
            <div className="text-md font-semibold px-3 h-full ">
                <div>
                    <FriendSearch/>
                    <p className="my-5 font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                        BLOCKED FRIENDS
                    </p>
                    <div className="flex flex-col justify-center items-center text-zinc-500 dark:text-zinc-400 mt-20">
                        <p>You have no blocked friends.</p>
                    </div>
                </div>
            </div>
        );
    }
 
    return (
        <div className="text-md font-semibold px-3 h-14 ">
            <div>
                <FriendSearch/>
                <p className="my-5 font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                    BLOCKED FRIENDS
                </p>
                <ScrollArea className="flex px-3">
                    {!!users?.length &&(
                        <div className="mb-2">
                            <div className="space-y-[2px]">
                                {users.map((user) => {
                                    return (
                                        <div key={user.id} className="border-t border-zinc-200 dark:border-zinc-700">
                                            <DmsUser profile={user} type={"Blocked"}/>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    );
};

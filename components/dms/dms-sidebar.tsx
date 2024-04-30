"use client"
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DmsSearch } from "./dms-search";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { DmsUser } from "./dms-user";
import { useEffect, useState } from "react";
import qs from "query-string";
import axios from "axios";
import { Loader2 } from "lucide-react";

export const DmsSidebar = () =>{
    const [users, setUsers] = useState<{ id: string; name: string; imageUrl: string; }[]>([]);
    const [loading, setLoading] = useState(true);

    async function fetchUsers() {
        try {
            const url = qs.stringifyUrl({
                url: "/api/friends/getUsers",
                query: {
                    status: "ACCEPTED"
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
        return(
            <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
                <DmsSearch
                    data={[
                        {
                            label: "All friends",
                            data: users?.map((user)=>({
                                id: user.id,
                                name: user.name,
                            }))
                        },
                    ]}
                />
                <ScrollArea className="flex px-3">
                    <div className="mt-2">
                    </div>
                    <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
                    <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Loading ...
                    </p>
                </ScrollArea>
            </div>
        )
    }

    if (users.length === 0 && loading == false) {
        return(
            <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
                <DmsSearch
                    data={[
                        {
                            label: "All friends",
                            data: users?.map((user)=>({
                                id: user.id,
                                name: user.name,
                            }))
                        },
                    ]}
                />
                <ScrollArea className="flex px-3">
                    <div className="mt-2">
                    </div>
                    <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        You have no friends ;-;
                    </p>
                </ScrollArea>
            </div>
        )
    }

    return(
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <DmsSearch
                data={[
                    {
                        label: "All friends",
                        data: users?.map((user)=>({
                            id: user.id,
                            name: user.name,
                        }))
                    },
                ]}
            />
            <ScrollArea className="flex px-3">
                <div className="mt-2">
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
                {!!users?.length &&(
                    <div className="mb-2">
                        <div className="flex items-center justify-between py-2">
                            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                                Friends
                            </p>
                        </div>
                        <div className="space-y-[2px}">
                            {users.map((users) => (
                                <DmsUser
                                    key={users.id}
                                    profile={users}
                                    type="users"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}
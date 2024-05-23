"use client"
import { DmsSearch } from "./dms-search";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { DmsUser } from "./dms-user";
import { Fragment, useEffect, useState } from "react";
import { Loader2, ServerCrash } from "lucide-react";
import { SocketIndicator } from "../socket-indicator";
import { useFriendQuery } from "@/hooks/friends/use-friend-query";
import { useFriendSocket } from "@/hooks/friends/use-friend-socket";

type users = {
    id: string,
    name: string,
    imageUrl: string
}

interface DmsSidebarProps {
    profileId: string;
}

export const DmsSidebar = ({
    profileId,
}: DmsSidebarProps) =>{
    const [users, setUsers] = useState<{ id: string; name: string; imageUrl: string; }[]>([]);

    const queryKey = `friends:`;
    const acceptedKey = `friends:${profileId}:accepted`;
    const deniedKey = `friends:${profileId}:denied`;
    const blockedKey = `friends:${profileId}:blocked`;
    const apiUrl = "/api/friends/getUsers";
    const paramKey = "status";
    const paramValue = "ACCEPTED"

    const {
        data,
        status
    } = useFriendQuery({
        queryKey,
        apiUrl,
        paramKey,
        paramValue
    })
    useFriendSocket({ queryKey, deniedKey, acceptedKey, blockedKey})

    useEffect(() => {
        if (data) {
            const updatedUsers = data.pages.flat();
            setUsers(updatedUsers);
        }
    }, [data]);

    if(status === "pending"){
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
                    <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4 "/>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Loading messages ...
                    </p>
                    <SocketIndicator/>
                </ScrollArea>
            </div>
        )
    }

    if (status === "error") {
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
                    <ServerCrash className="h-7 w-7 text-zinc-500 my-4 "/>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Something went wrong
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
            <ScrollArea className="flex px-3 mb-2">
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
                <SocketIndicator/>
                    <div className="mb-2">
                        <div className="flex items-center justify-between py-2">
                            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                                Friends
                            </p>
                        </div>
                        <div className="space-y-[2px}">
                        {data?.pages?.length ? (
                            data.pages.map((page, i) => (
                                <Fragment key={i}>
                                    {page?.map((user: users) => (
                                        <DmsUser
                                            key={user.id}
                                            profile={user}
                                            type="users"
                                        />
                                    ))}
                                </Fragment>
                            ))
                        ) : (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                You have no friends ;-;
                            </p>
                        )}
                        </div>
                    </div>
            </ScrollArea>
        </div>
    )
}
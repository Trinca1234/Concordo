"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { CommandDialog, CommandEmpty, CommandInput, CommandList, CommandGroup, CommandItem } from "@/components/ui/command";
import { useParams, useRouter } from "next/navigation";

interface FriendsSearchProps{
    data: {
        label: string;
        type: "all" | "pending" | "blocked",
        data: {
            name: string;
            id: string;
        }[] | undefined
    }[]
}

export const FriendSearch = ({
    data
}: FriendsSearchProps) =>{
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const params = useParams();

    const onClick = ({id, type}: {id: string, type:"all" | "pending" | "blocked"}) =>{
        setOpen(false);
        if(type === "all"){
            return router.push(`/servers/${params?.serverId}/conversations/${id}`);
        }

        if(type === "pending"){
            return router.push(`/servers/${params?.serverId}/channels/${id}`);
        }
    }

    return(
        <>
        <button  
        onClick={()=>setOpen(true)}
        className="group px-2 py-4 rounded-md flex items-center gap-x-2 w-full bg-zinc-800 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition">
            <p className="font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                Search
            </p>
            <Search className="w-4 h-4 text-zinc-500 dark:text-zinc-400 mr-2 ml-auto flex items-center"/>
        </button>
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Search your friends"/>
            <CommandList>
                <CommandEmpty>
                    No results found
                </CommandEmpty>
                {data.map(({label, type, data})=>{
                    if(!data?.length) return null;

                    return (
                        <CommandGroup key={label} heading={label}>
                            {data?.map(({id, name})=>{
                                return(
                                    <CommandItem key={id} onSelect={()=> onClick({id, type})}>
                                        <span>{name}</span>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    )
                })}
            </CommandList>
        </CommandDialog>
        </>
    )
}
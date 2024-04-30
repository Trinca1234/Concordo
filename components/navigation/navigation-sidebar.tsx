"use client"

import { currentProfile } from "@/lib/current-profile"

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { redirect } from "next/navigation"
import { db } from "@/lib/db";
import axios from 'axios';
import qs from "query-string";

import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";
import { UserButton } from "@clerk/nextjs";
import { NavigationDm } from "./navigation-dm";
import { useEffect, useState } from "react";

interface Server {
    id: string;
    name: string;
    imageUrl: string;
}

export const NavigationSidebar = () => {
    const [servers, setServers] = useState<Server[]>([]);
    
    async function fetchServers() {
        try {
            const url = qs.stringifyUrl({
                url: "/api/servers",
            });
            
            const response = await axios.get(url);
            setServers(response.data);
        } catch (error) {
            console.error("Error fetching servers", error);
        }
    }
    useEffect(() => {
        const intervalId = setInterval(fetchServers, 2000);
        fetchServers()
        return () => clearInterval(intervalId);
    }, []);

    return(
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
            <NavigationDm/>
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"/>
            <ScrollArea className="flex-1 w-full">
                {servers.map((server) => (
                    <div key={server.id} className="mb-4">
                        <NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl}/>
                    </div>
                ))}
                <NavigationAction/>
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle />
                <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                        elements:{
                            avatarBox:"h-[48px] w-[48px]"
                        }
                    }}
                />
            </div>
        </div>
    )
}
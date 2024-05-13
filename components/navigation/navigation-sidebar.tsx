"use client"

import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ModeToggle } from "@/components/mode-toggle";
import { NavigationAction } from "./navigation-action";
import { NavigationItem } from "./navigation-item";
import { UserButton } from "@clerk/nextjs";
import { NavigationDm } from "./navigation-dm";
import { Fragment } from "react";
import { useServerQuery } from "@/hooks/servers/use-server-query";
import { Loader2, ServerCrash } from "lucide-react";
import { useServerSocket } from "@/hooks/servers/use-server-socket";

interface Server {
    id: string;
    name: string;
    imageUrl: string;
}

interface NavigationSidebarProps {
    profileId: string;
}

export const NavigationSidebar = ({
    profileId,
}: NavigationSidebarProps) => { 
    const queryKey = `servers:`;
    const addKey = `servers:${profileId}:add`;
    const updateKey = `servers:${profileId}:update`;
    const apiUrl = "/api/servers";

    const {
        data,
        status
    } = useServerQuery({
        queryKey,
        apiUrl,
    });
    useServerSocket({queryKey, addKey, updateKey});

    if(status === "pending"){
        return(
            <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
                <NavigationDm/>
                <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"/>
                <ScrollArea className="flex-1 w-full flex flex-col justify-center items-center">
                    <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4 ml-auto mr-auto" />
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

    if (status === "error") {
        return(
            <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
                <NavigationDm/>
                <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"/>
                <ScrollArea className="flex-1 w-full">
                    <ServerCrash className="h-7 w-7 text-zinc-500 my-4 ml-auto mr-auto"/>
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

    return(
        <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
            <NavigationDm/>
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"/>
            <ScrollArea className="flex-1 w-full">
                {data?.pages?.length && (
                    data.pages.map((page, i) => (
                        <Fragment key={i}>
                            {page?.map((server: Server) => (
                                <div key={server.id} className="mb-4">
                                    <NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl}/>
                                </div>
                            ))}
                        </Fragment>
                    ))
                )}
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
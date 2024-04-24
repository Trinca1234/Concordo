"use client"

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client"
import { Ban, Check, CircleEllipsis, CircleEllipsisIcon, Flag, Search, Settings, ShieldAlert, ShieldCheck, ShieldMinus, UserPlus, UserRoundX, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";
import { useModal } from "@/hooks/use-modal-store";
import qs from "query-string";
import axios from "axios";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface DmsUserProps {
    profile: {
        id: string;
        name: string;
        imageUrl: string;
    };
    type: string;
}

export const DmsUser = ({
    profile,
    type,
}: DmsUserProps) => {
    const params = useParams();
    const router = useRouter();

    const { onOpen } = useModal();

    const onClick = (type: string) => {
        if(type === "Accepted"){
            router.push(`/dms/conversations/${profile.id}`)
        }
        else{
            return
        }
    }

    async function onAccept() {

        console.log("entrou accept")
        try {
            const url =  qs.stringifyUrl({
                url: "/api/friends/acceptFriendRequest",
                query: {
                    TwoId: profile.id
                }
            });
    
            const response = await axios.patch(url);

            console.log(response);

            router.refresh();
        } catch (error) {
            console.log(error);
        }
    }

    async function onDecline() {

        console.log("entrou decline")
        try {
            const url =  qs.stringifyUrl({
                url: "/api/friends/declineFriendRequest",
                query: {
                    TwoId: profile.id
                }
            });
    
            const response = await axios.patch(url);

            console.log(response);

            router.refresh();
        } catch (error) {
            console.log(error);
        }
    }

    async function onBlock() {

        console.log("entrou block")
        try {
            const url =  qs.stringifyUrl({
                url: "/api/friends/blockFriendRequest",
                query: {
                    TwoId: profile.id
                }
            });

            const response = await axios.patch(url);

            console.log(response);

            router.refresh();
        } catch (error) {
            console.log(error);
        }
    }

    async function onUnblock() {

        console.log("entrou block")
        try {
            const url =  qs.stringifyUrl({
                url: "/api/friends/unblockFriendRequest",
                query: {
                    TwoId: profile.id
                }
            });

            const response = await axios.patch(url);

            console.log(response);

            router.refresh();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={cn("group px-2 py-2 rounded-mb flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1", params?.profileId === profile.id && "bg-zinc-700/20 dark:bg-zinc-700")}>
            <button onClick={() => onClick(type)} className="flex items-center">
                <UserAvatar src={profile.imageUrl} className="h-8 w-8 mr-2 md:h-8 md:w-8" />
                <p className={cn("font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition", params?.profileId === profile.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>
                    {profile.name}
                </p>
            </button> 
            {type === "Accepted" && (
                <>
                    <button onClick={() => onOpen("reportMessage", {
                        apiUrl: `/api/profile/reports`,
                        ids: profile.id
                    })}
                    className="ml-auto flex items-center hover:bg-zinc-800/10 dark:hover:bg-zinc-800/50 px-2 py-2 mr-0"
                    >
                        <Flag className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    </button>
                    <DropdownMenu>
                        <DropdownMenuTrigger
                        className="focus:outline-none"
                        asChild
                        >
                            <button
                            className="flex items-center hover:bg-zinc-800/10 dark:hover:bg-zinc-800/50 px-2 py-2 mr-2"
                            >
                                <Settings className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                        className="w-auto text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
                        >
                            <DropdownMenuItem
                            onClick={onDecline}
                            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                            >
                                Remove Friend
                                <UserRoundX
                                className="h-4 w-4 ml-2"
                                />
                            </DropdownMenuItem>
                            <DropdownMenuItem
                            onClick={onBlock}
                            className="text-rose-500 px-3 py-2 text-sm cursor-pointer"
                            >
                                Block
                                <Ban
                                className="h-4 w-4 ml-2"
                                />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )}
            {type === "Pending1" && (
                <>
                    <button onClick={onDecline} 
                    className="ml-auto flex items-center hover:bg-zinc-800/10 dark:hover:bg-zinc-800/50 px-2 py-2 mr-0"
                    >
                        <X className="w-5 h-5 text-red-700 dark:text-red-700" />
                    </button>
                </>
            )}
            {type === "Pending2" && (
                <>
                    <button onClick={onAccept} 
                    className="ml-auto flex items-center hover:bg-zinc-800/10 dark:hover:bg-zinc-800/50 px-2 py-2 mr-0"
                    >
                        <Check className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    </button>
                    <button onClick={onDecline}
                    className="flex items-center hover:bg-zinc-800/10 dark:hover:bg-zinc-800/50 px-2 py-2 mr-2"
                    >
                        <X className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    </button>
                </>
            )}
            {type === "Blocked" && (
                <>
                    <button 
                    onClick={onUnblock}
                    className="ml-auto flex items-center hover:bg-zinc-800/10 dark:hover:bg-zinc-800/50 px-2 py-2 mr-0"
                    >
                        <ShieldMinus className="w-4 h-4 text-green-500 dark:text-green-400" />
                    </button>
                </>
            )}
        </div>
    )
}

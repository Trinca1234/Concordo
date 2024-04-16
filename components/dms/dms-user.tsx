"use client"

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client"
import { Check, CircleEllipsis, CircleEllipsisIcon, Flag, Search, Settings, ShieldAlert, ShieldCheck, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";
import { useModal } from "@/hooks/use-modal-store";
import qs from "query-string";
import axios from "axios";

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

    const onClick = () => {
        router.push(`/dms/conversations/${profile.id}`)
    }

    async function onAccept() {
        try {
            const url =  qs.stringifyUrl({
                url: "/api/friends/acceptFriendRequest",
                query: {
                    TwoId: profile.id
                }
            });
    
            const response = await axios.patch(url);
            router.refresh();
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={cn("group px-2 py-2 rounded-mb flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1", params?.profileId === profile.id && "bg-zinc-700/20 dark:bg-zinc-700")}>
            <button onClick={onClick} className="flex items-center">
                <UserAvatar src={profile.imageUrl} className="h-8 w-8 mr-2 md:h-8 md:w-8" />
                <p className={cn("font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition", params?.profileId === profile.id && "text-primary dark:text-zinc-200 dark:group-hover:text-white")}>
                    {profile.name}
                </p>
            </button>
            {type === "friends" && (
                <>
                    <button onClick={() => onOpen("reportMessage", {
                        apiUrl: `/api/profile/reports`,
                        ids: profile.id
                    })} 
                    className="ml-auto flex items-center hover:bg-zinc-800/10 dark:hover:bg-zinc-800/50 px-2 py-2 mr-0"
                    >
                        <Flag className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    </button>
                    <button onClick={() => onOpen("reportMessage", {
                        apiUrl: `/api/profile/reports`,
                        ids: profile.id
                    })} 
                    className="flex items-center hover:bg-zinc-800/10 dark:hover:bg-zinc-800/50 px-2 py-2 mr-2"
                    >
                        <Settings className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    </button>
                </>
            )}
            {type === "Pending" && (
                <>
                    <button onClick={onAccept} 
                    className="ml-auto flex items-center hover:bg-zinc-800/10 dark:hover:bg-zinc-800/50 px-2 py-2 mr-0"
                    >
                        <Check className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    </button>
                    <button onClick={() => onOpen("reportMessage", {
                        apiUrl: `/api/profile/reports`,
                        ids: profile.id
                    })} 
                    className="flex items-center hover:bg-zinc-800/10 dark:hover:bg-zinc-800/50 px-2 py-2 mr-2"
                    >
                        <X className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                    </button>
                </>
            )}
        </div>
    )
}

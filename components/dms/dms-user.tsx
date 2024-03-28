"use client"

import { cn } from "@/lib/utils";
import { Member, MemberRole, Profile, Server } from "@prisma/client"
import { CircleEllipsis, CircleEllipsisIcon, Search, Settings, ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { UserAvatar } from "../user-avatar";

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

    const onClick = () => {
        router.push(`/dms/conversations/${profile.id}`)
    }

    const onClickSettings = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        router.push(`/dms/conversations/${profile.id}`)
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
                <button onClick={onClickSettings} className="ml-auto flex items-center hover:bg-zinc-800/10 dark:hover:bg-zinc-800/50 px-2 py-2 mr-2">
                    <Settings className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                </button>
            )}
        </div>
    )
}

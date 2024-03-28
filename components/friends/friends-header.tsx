"use client"

import { Hash, HelpCircle, Inbox } from "lucide-react";
import { MobileTogle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { SocketIndicator } from "@/components/socket-indicator";
import { UserRound } from "lucide-react";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
export const FriendsHeader = () => {

    const router = useRouter();

    const onClickButton = (route: string) => {
        router.push(`/dms/friends/${route}`);
    }

    const onClickHelpButton = (route: string) => {
        router.push(`${route}`);
    }

    const onClickInbox = () =>{
        
    }

    return (
        <div className="text-md font-semibold px-3 flex items-center h-14 border-neutral-200 dark:border-neutral-800 border-b-2">
            <div className="h-8 w-8 mr-2 mt-1">
                <UserRound />
            </div>
            <p className="font-semibold text-md text-black dark:text-white">
                Friends
            </p>
            <Separator
                className="h-8 bg-zinc-300 dark:bg-zinc-700"
                decorative
                orientation="vertical"
                style={{ margin: '0 15px' }}
                color=""
            />
            <button
                onClick={() => onClickButton('all')}
                className={"group px-2 py-2 mx-5 rounded-mb flex items-center gap-x-2 w-auto hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 "}
            >
                <p className={"font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition"}>
                    All
                </p>
            </button>
            <button
                onClick={() => onClickButton('pending')}
                className={"group px-2 py-2 mx-5 rounded-mb flex items-center gap-x-2 w-auto hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 "}
            >
                <p className={"font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition"}>
                    Pending
                </p>
            </button>
            <button
                onClick={() => onClickButton('blocked')}
                className={"group px-2 py-2 mx-5 rounded-mb flex items-center gap-x-2 w-auto hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 "}
            >
                <p className={"font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition"}>
                    Blocked
                </p>
            </button>
            <button
                onClick={() => onClickButton('add')}
                className={"group px-2 py-2 mx-5 rounded-mb flex items-center gap-x-2 w-auto hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1 "}
            >
                <p className={"font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition"}>
                    Add Friend
                </p>
            </button>
            <div className="ml-auto flex items-center">
                <Separator
                    className="h-8 bg-zinc-300 dark:bg-zinc-700"
                    decorative
                    orientation="vertical"
                    style={{ margin: '0 15px' }}
                    color=""
                />
                <button
                    onClick={onClickInbox}
                >
                    <Inbox className=" mx-3"/>
                </button>
                <button
                    onClick={() => onClickHelpButton('https://www.radix-ui.com/primitives/docs/components/separator#separator')}
                >
                    <HelpCircle className=" mx-3 " />
                </button>
            </div>
        </div>
    )
}

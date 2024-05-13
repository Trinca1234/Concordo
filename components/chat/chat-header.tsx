import { Hash } from "lucide-react";
import { MobileTogle } from "@/components/mobile-toggle";
import { UserAvatar } from "@/components/user-avatar";
import { SocketIndicator } from "@/components/socket-indicator";
import { ChatVideoButton } from "./chat-video-button";
import { DmMobileTogle } from "../mobile-toggle-dm";

interface ChatHeaderProps{
    serverId: string;
    name: string;
    type: "channel" | "conversation";
    imageUrl?:string;
    profileId: string;
}

export const ChatHeader = ({
    serverId,
    name,
    type,
    imageUrl,
    profileId
}: ChatHeaderProps) =>{
    return( 
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
            {type === "channel" && (
                <>
                    <MobileTogle serverId={serverId}/>
                    <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2"/>
                    <p className="font-semibold text-md text-black dark:text-white">
                        {name}
                    </p>
                </>
            )}
            {type === "conversation" && (
                <>
                    <DmMobileTogle profileId={profileId}/>
                    <UserAvatar 
                    src={imageUrl}
                    className="h-8 w-8 mr-2"
                    />
                    <p className="font-semibold text-md text-black dark:text-white">
                        {name.split(' ')[0]}
                    </p>
                </>
            )}
            <div className="ml-auto flex items-center">
                {type === "conversation" && (
                    <ChatVideoButton/>
                )}
                <SocketIndicator/>
            </div>
        </div>
    )
}
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface UserAvatarProps{
    src?: string;
    className?: String;
};

export const UseAvatar = ({
    src,
    className,
}: UserAvatarProps)=>{
    return(
        <Avatar className={cn(
            "h-7 w-7 md:h-10 md:w-10", className
        )}>
            <AvatarImage src={src} />
        </Avatar>
    )
}
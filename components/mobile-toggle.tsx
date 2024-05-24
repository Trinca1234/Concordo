import { Menu } from "lucide-react"

import{
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { ServerSidebar } from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";

export const MobileTogle = async ({
    serverId
}:{
    serverId: string;
}) =>{
    const profile = await currentProfile()
    if(!profile){
        return
    }
    return(
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu/> 
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0 z-50">
                <div className="w-[72px]">
                    <NavigationSidebar profileId={profile.id} />
                </div>
                <ServerSidebar serverId={serverId} profile={profile}/>
            </SheetContent>
        </Sheet>
    )
}
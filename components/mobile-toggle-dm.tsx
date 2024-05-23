import { Menu } from "lucide-react"

import{
    Sheet,
    SheetContent,
    SheetTrigger
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
import { DmsSidebar } from "./dms/dms-sidebar";
import { FriendsAllBody } from "./friends/friends-all-body";

interface DmMobileProps {
    profileId: string;
}

export const DmMobileTogle = ({
    profileId,
}: DmMobileProps) =>{
    return(
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu/> 
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex gap-0">
                <div className="w-[72px]">
                    <NavigationSidebar profileId={profileId} />
                </div>
                {/* <FriendsAllBody profileId={profile} /> */}
                <DmsSidebar profileId={profileId} />
            </SheetContent>
        </Sheet>
    )
}
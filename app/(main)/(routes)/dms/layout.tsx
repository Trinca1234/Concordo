import { DmsSidebar } from "@/components/dms/dms-sidebar";
import { currentProfile } from "@/lib/current-profile";
import React from "react";

const DmsLayout = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    const profile = await currentProfile()
    if(!profile){
        return
    }
    return ( 
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <DmsSidebar profileId={profile.id} />
            </div>
            <main className="h-full md:pl-60">
               {children}
            </main>
        </div>
     );
}
 
export default DmsLayout;
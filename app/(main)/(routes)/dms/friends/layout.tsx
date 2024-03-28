    import { DmsSidebar } from "@/components/dms/dms-sidebar";
    import { FriendsHeader } from "@/components/friends/friends-header";
    import { currentProfile } from "@/lib/current-profile";
    import React from "react";

    const FriendsLayout = async ({
        children
    }: {
        children: React.ReactNode;
    }) => {
        const profile = await currentProfile();


        return ( 
            
            <div className="h-full">
                <div className="bg-white dark:bg-[#313338] flex flex-col w-full h-16">
                    <FriendsHeader />
                </div>
                <main className="h-auto">
                    {children}
                </main>
            </div>
        );
    }
    
    export default FriendsLayout;
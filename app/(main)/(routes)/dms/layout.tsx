import { DmsSidebar } from "@/components/dms/dms-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const DmsIdLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params : {serverId: string};
}) => {
    const profile = await currentProfile();


    return ( 
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <DmsSidebar serverId = {params.serverId} />
            </div>
            <main className="h-full md:pl-60">
               {children}
            </main>
        </div>
     );
     
}
 
export default DmsIdLayout;
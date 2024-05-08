import { DmsSidebar } from "@/components/dms/dms-sidebar";
import React from "react";

const DmsLayout = async ({
    children
}: {
    children: React.ReactNode;
}) => {
    return ( 
        <div className="h-full">
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                <DmsSidebar/>
            </div>
            <main className="h-full md:pl-60">
               {children}
            </main>
        </div>
     );
}
 
export default DmsLayout;
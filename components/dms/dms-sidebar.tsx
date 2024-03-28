import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { redirect } from "next/navigation";
import { DmsSearch } from "./dms-search";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { DmsUser } from "./dms-user";

export const DmsSidebar = async () =>{
    const profile = await currentProfile();

    if(!profile){
        return redirect("/");
    }

    const users = await db.profile.findMany({
        where:{
            id: {
                not: profile.id
            }
        },
        select: {
            id: true,
            name: true,
            imageUrl: true
        }
    });

    const role = "ADMIN";

    return(
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            <DmsSearch/>
            <ScrollArea className="flex px-3">
                <div className="mt-2">
                </div>
                <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2"/>
                {!!users?.length &&(
                    <div className="mb-2">
                        <div className="flex items-center justify-between py-2">
                            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                                Users
                            </p>
                        </div>
                        <div className="space-y-[2px}">
                            {users.map((users) => (
                                <DmsUser
                                    key={users.id}
                                    profile={users}
                                    type="users"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}
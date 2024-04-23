import { redirect, useRouter } from "next/navigation";
import { FriendSearch } from "./friends-search";
import { ScrollArea } from "../ui/scroll-area";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { DmsUser } from "../dms/dms-user";
import { Search } from "lucide-react";

export const FriendsPendingBody = async () => {

    const profile = await currentProfile();

    if(!profile){
        return redirect("/");
    }
    
    const pending1 = await db.friends.findMany({
        where:{
            friendOneId: profile.id,
            status: "PENDING"
        },
        select:{
            friendTwoId: true,
        }
    })

    const pendingIds = pending1.map(p => p.friendTwoId);

    const pending2 = await db.friends.findMany({
        where:{
            friendTwoId: profile.id,
            status: "PENDING"
        },
        select:{
            friendOneId: true,
        }
    })

    const pending2Ids = pending2.map(p => p.friendOneId);
    
    const users = await db.profile.findMany({
        where:{
            id: {
                in: [...pendingIds, ...pending2Ids]
            }
        },
        select: {
            id: true,
            name: true,
            imageUrl: true
        }
    });
 
    return (
        <div className="text-md font-semibold px-3 h-14 ">
            <div>
                <FriendSearch/>
                <p className=" my-5 font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition">
                    Pending Requests
                </p>
                <ScrollArea className="flex px-3">
                    {!!users?.length &&(
                        <div className="mb-2">
                            <div className="space-y-[2px] ">
                                {users.map((user) => {
                                    const type = pendingIds.includes(user.id) ? "Pending1" : "Pending2";
                                    return (
                                        <div key={user.id} className="border-t border-zinc-200 dark:border-zinc-700">
                                            <DmsUser profile={user} type={type}/>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    )
}

import { redirect, useRouter } from "next/navigation";
import { FriendSearch } from "./friends-search";
import { ScrollArea } from "../ui/scroll-area";
import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { DmsUser } from "../dms/dms-user";

export const FriendsAllBody = async () => {

    const profile = await currentProfile();

    if(!profile){
        return redirect("/");
    }
    
    const accepted1 = await db.friends.findMany({
        where:{
            friendOneId: profile.id,
            status: "ACCEPTED"
        },
        select:{
            friendTwoId: true,
        }
    })

    const acceptedIds = accepted1.map(p => p.friendTwoId);

    const accepted2 = await db.friends.findMany({
        where:{
            friendTwoId: profile.id,
            status: "ACCEPTED"
        },
        select:{
            friendOneId: true,
        }
    })

    const accepted2Ids = accepted2.map(p => p.friendOneId);
    
    const users = await db.profile.findMany({
        where:{
            id: {
                in: [...acceptedIds, ...accepted2Ids]
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
                    ALL FRIENDS
                </p>
                <ScrollArea className="flex px-3">
                    {!!users?.length &&(
                        <div className="mb-2">
                            <div className="space-y-[2px} ">
                            {users.map((user) => (
                                <div key={user.id} className="border-t border-zinc-200 dark:border-zinc-700">
                                    <DmsUser profile={user} type={"Accepted"}/>
                                </div>
                            ))}
                            </div>
                        </div>
                    )}
                    {!users &&(
                        <div>
                            <p>You dont have any friends ;-;</p>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    )
}

import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { FriendshipStatus } from "@prisma/client";
 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
){
    if(req.method !== "PATCH"){
        return res.status(405).json({error: "Method not allowed"});
    }
    try{
        const { friendTwoId, status } = req.query;

        const profile = await currentProfilePages(req)

        if (!profile) {
            return res.status(400).json({error: "Profile missing"});
        }

        if (!friendTwoId) {
            return res.status(400).json({error: "Friend two missing"});
        }

        if (!status) {
            return res.status(400).json({error: "Status missing"});
        }

        const friendship = await db.friends.findFirst({
            where: {
                OR: [
                    {
                        friendOneId: profile.id,
                        friendTwoId: friendTwoId.toString()
                    },
                    {
                        friendOneId: friendTwoId.toString(),
                        friendTwoId: profile.id
                    }
                ]
            }
        });

        if(!friendship){
            return res.status(400).json({error: "Friendship non existent"});
        }

        await db.friends.update({
            where:{
                id: friendship.id
            },
            data:{
                status: status as FriendshipStatus,
                /* senderId: profile.id */
            }
        })

        if(status == "ACCEPTED"){
            const friendtwo = await db.profile.findFirst({
                where: {
                    id: friendTwoId.toString()
                },
                select:{
                    id: true,
                    name: true,
                    imageUrl: true
                }
            })
            
            const profileKey = `friends:${profile.id}:update`;
            res?.socket?.server?.io?.emit(profileKey, friendtwo);

            return res.status(200).json(friendship);
        }

        const profileKey = `friends:${profile.id}:update`;

        res?.socket?.server?.io?.emit(profileKey, friendship);
        
        return res.status(200).json(friendship);
    }catch(error){
        console.log("[DIRECT_MESSAGES_POST]", error);
        return res.status(500).json({message: "Internal Error"});
    }
}
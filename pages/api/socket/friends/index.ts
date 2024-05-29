import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { FriendshipStatus } from "@prisma/client";
 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
){
    if(req.method !== "POST"){
        return res.status(405).json({error: "Method not allowed"});
    }
    try{
        const { friendTwoId } = req.query;

        const profile = await currentProfilePages(req)

        if (!profile) {
            return res.status(400).json({error: "Profile missing"});
        }

        if (!friendTwoId) {
            return res.status(400).json({error: "Friend two missing"});
        }

        const friendship = await db.friends.create({
            data:{
                friendOneId: profile.id,
                friendTwoId: friendTwoId.toString(),
                status: "PENDING",
                senderId: profile.id
            }
        })

        return res.status(200).json(friendship);
    }catch(error){
        console.log("[DIRECT_MESSAGES_POST]", error);
        return res.status(500).json({message: "Internal Error"});
    }
}
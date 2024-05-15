import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { FriendshipStatus } from "@prisma/client";
import axios from "axios";
 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
){
    if(req.method !== "GET"){
        return res.status(405).json({error: "Method not allowed"});
    }
    try{
        const { friendTwoId } = req.query;

        const profile = await currentProfilePages(req);

        const Profile = await db.profile.findFirst({
            where:{
                id: profile?.id
            },
            select:{
                id: true,
                name: true,
                imageUrl: true
            }
        })

        const friendKey = `friends:${friendTwoId}:update`;

        res?.socket?.server?.io?.emit(friendKey, Profile);
        
        return res.status(200).json(Profile);
    }catch(error){
        console.log("[DIRECT_MESSAGES_POST]", error);
        return res.status(500).json({message: "Internal Error"});
    }
}
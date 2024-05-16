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
        const { friendTwoId, status } = req.query;

        if(!friendTwoId){
            return res.status(400).json({error: "FriendTwoId missing"});
        }

        if(!status){
            return res.status(400).json({error: "Status missing"});
        }

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

        if(status === "ACCEPTED"){
            const acceptedKey = `friends:${friendTwoId}:accepted`;

            res?.socket?.server?.io?.emit(acceptedKey, Profile);
        }else if(status === "DENIED"){
            const deniedKey = `friends:${friendTwoId}:denied`;
            console.log("entrou denied");
            console.log(friendTwoId);
            console.log(deniedKey);


            res?.socket?.server?.io?.emit(deniedKey, Profile);
        }else if(status === "BLOCKED"){
            const blockedKey = `friends:${friendTwoId}:blocked`;

            res?.socket?.server?.io?.emit(blockedKey, Profile);
        }
        
        return res.status(200).json(Profile);
    }catch(error){
        console.log("[DIRECT_MESSAGES_POST]", error);
        return res.status(500).json({message: "Internal Error"});
    }
}
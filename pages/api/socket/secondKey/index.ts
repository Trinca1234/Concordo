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

        let eventKey = '';
        let dataToEmit = Profile;

        switch (status) {
            case "ACCEPTED":
                eventKey = `friends:${friendTwoId}:accepted`;
                break;
            case "DENIED":
                eventKey = `friends:${friendTwoId}:denied`;
                break;
            case "BLOCKED":
                eventKey = `friends:${friendTwoId}:blocked`;
                dataToEmit = { ...Profile, type: "Bloqueado" } as typeof Profile & { type: string };
                break;
            case "PENDING":
                eventKey = `friends:${friendTwoId}:pending`;
                dataToEmit = { ...Profile, type: "Pending2" } as typeof Profile & { type: string };
                break;
            default:
                return res.status(400).json({ error: "Invalid status" });
        }

        res?.socket?.server?.io?.emit(eventKey, dataToEmit);

        
        return res.status(200).json(Profile);
    }catch(error){
        console.log("[DIRECT_MESSAGES_POST]", error);
        return res.status(500).json({message: "Internal Error"});
    }
}
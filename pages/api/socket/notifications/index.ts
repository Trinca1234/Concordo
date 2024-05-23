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

        const profile = await currentProfilePages(req)

        if (!profile) {
            return res.status(400).json({error: "Profile missing"});
        }

        const notifications = await db.notifications.findMany({
            where:{
                recipientId: profile.id,
                status: "UNREAD"
            }
        })

        if(!notifications){
            return res.status(200).json("this user has no notifications");
        }

        const notificationsWithSenderProfiles = [];

        for (const notification of notifications) {
            const senderProfile = await db.profile.findFirst({
                where: {
                    id: notification.senderId
                }
            });
            if(senderProfile)
            notificationsWithSenderProfiles.push({
                id: notification.id,
                name: senderProfile.name,
                imageUrl: senderProfile.imageUrl,
                content: notification.content
            });
        }

        if(!notificationsWithSenderProfiles){
            return res.status(401).json("Error fetching sender profile");
        }

        return res.status(401).json(notificationsWithSenderProfiles);
    }catch(error){
        console.log("[DIRECT_MESSAGES_POST]", error);
        return res.status(500).json({message: "Internal Error"});
    }
}
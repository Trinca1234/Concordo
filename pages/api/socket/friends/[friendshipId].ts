import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
){
    if(req.method !== "PATCH"){
        return res.status(405).json({error: "Method not allowed"});
    }
    try{
        const { OneId, TwoId, sender } = req.query;

        if (!OneId || typeof OneId !== 'string') {
            return res.status(400).json({error: "Friend one id missing or invalid"});
        }
        
        if (!TwoId || typeof TwoId !== 'string') {
            return res.status(400).json({error: "Friend two id missing or invalid"});
        }
        
        if (!sender || typeof sender !== 'string') {
            return res.status(400).json({error: "Sender missing or invalid"});
        }

        const friendship = await db.friends.findFirst({
            where: {
                friendOneId: OneId,
                friendTwoId: TwoId
            },
        });

        if(!friendship){
            const friendship = await db.friends.findFirst({
                where: {
                    friendOneId: TwoId,
                    friendTwoId: OneId
                },
            });
    
            if(!friendship){
                return res.status(400).json({error: "Non existent friendship"});
            }

            const update = await db.friends.update({
                where:{
                    id: friendship.id,
                },
                data:{
                    status: "PENDING",
                    senderId: sender
                }
            })

            if(update){
                if(OneId == sender){
                    const notification = await db.notifications.create({
                        data:{
                            recipientId: TwoId,
                            status: "UNREAD",
                            senderId: sender,
                            content: "pending"
                        }
                    })
                }else{
                    const notification = await db.notifications.create({
                        data:{
                            recipientId: OneId,
                            status: "UNREAD",
                            senderId: sender,
                            content: "pending"
                        }
                    })
                }
            }

            return res.status(200).json(friendship);
        }

        const update = await db.friends.update({
            where:{
                id: friendship.id,
            },
            data:{
                status: "PENDING",
                senderId: sender
            }
        })

        if(update){
            if(OneId == sender){
                const notification = await db.notifications.create({
                    data:{
                        recipientId: TwoId,
                        status: "UNREAD",
                        senderId: sender,
                        content: "pending"
                    }
                })
            }else{
                const notification = await db.notifications.create({
                    data:{
                        recipientId: OneId,
                        status: "UNREAD",
                        senderId: sender,
                        content: "pending"
                    }
                }) 
            }
        }

        const friendKey = `friends:${friendship.id}`;

        res?.socket?.server?.io?.emit(friendKey, friendship);
        
        return res.status(200).json(friendship);
    }catch(error){
        console.log("[DIRECT_MESSAGES_POST]", error);
        return res.status(500).json({message: "Internal Error"});
    }
}
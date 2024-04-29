import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request
) {
    try {

        const {searchParams} = new URL(req.url);
        const friendOneId = searchParams.get("OneId");
        const friendTwoId = searchParams.get("TwoId");
        const senderId = searchParams.get("sender");

        if (!friendOneId) {
            return new NextResponse("Friend One ID missing", { status: 400 });
        }

        if (!friendTwoId) {
            return new NextResponse("Friend One ID missing", { status: 400 });
        }

        if (!senderId) {
            return new NextResponse("Sender ID missing", { status: 400 });
        }

        const friendship = await db.friends.findFirst({
            where: {
                friendOneId: friendOneId,
                friendTwoId: friendTwoId
            },
        });

        if(!friendship){
            const friendship = await db.friends.findFirst({
                where: {
                    friendOneId: friendTwoId,
                    friendTwoId: friendOneId
                },
            });
    
            if(!friendship){
                return new NextResponse("Non existent friendship", { status: 200 });
            }

            const update = await db.friends.update({
                where:{
                    id: friendship.id,
                },
                data:{
                    status: "PENDING",
                    senderId: senderId
                }
            })

            if(update){
                if(friendOneId == senderId){
                    const notification = await db.notifications.create({
                        data:{
                            recipientId: friendTwoId,
                            status: "UNREAD",
                            senderId: senderId,
                            content: "pending"
                        }
                    })
                }else{
                    const notification = await db.notifications.create({
                        data:{
                            recipientId: friendOneId,
                            status: "UNREAD",
                            senderId: senderId,
                            content: "pending"
                        }
                    })
                }
            }

            return NextResponse.json(friendship);
        }

        const update = await db.friends.update({
            where:{
                id: friendship.id,
            },
            data:{
                status: "PENDING",
                senderId: senderId
            }
        })

        if(update){
            if(friendOneId == senderId){
                const notification = await db.notifications.create({
                    data:{
                        recipientId: friendTwoId,
                        status: "UNREAD",
                        senderId: senderId,
                        content: "pending"
                    }
                })
            }else{
                const notification = await db.notifications.create({
                    data:{
                        recipientId: friendOneId,
                        status: "UNREAD",
                        senderId: senderId,
                        content: "pending"
                    }
                })
            }
        }
        
        return NextResponse.json(friendship);
    } catch (error) {
        console.log("Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

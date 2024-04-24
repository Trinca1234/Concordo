import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { useSearchParams } from "next/navigation";
import { NextResponse } from "next/server";

enum FriendshipStatus {
    ACCEPTED = 'ACCEPTED',
    BLOCKED = 'BLOCKED',
    PENDING = 'PENDING',
    DENIED = 'DENIED'
}

export async function GET(
    req: Request
) {
    try {
        const {searchParams} = new URL(req.url);
        const profile = await currentProfile();
        const senderId = profile?.id;
        const statusParam = searchParams.get("status");
        let blockedIds

        if (!senderId) {
            return new NextResponse("Sender id missing", { status: 400 });
        }

        if (!statusParam) {
            return new NextResponse("Status missing", { status: 400 });
        }

        const status: FriendshipStatus = statusParam as FriendshipStatus;

        if(statusParam == "ACCEPTED"){
            const blocked1 = await db.friends.findMany({
                where:{
                    status: status
                },
                select:{ 
                    friendTwoId: true,
                }
            })
            
            blockedIds = blocked1.map(p => {
                return p.friendTwoId;
            });
        }else if(statusParam == "PENDING"){
            let blockedIDS: { friendtwo: string; type: string; }[] = [];
            const blocked1 = await db.friends.findMany({
                where:{
                    senderId: senderId,
                    status: status
                },
                select:{ 
                    friendTwoId: true,
                    friendOneId: true
                }
            })
            
            blockedIDS = blocked1.map(p => {
                if (p.friendOneId === senderId) {
                    const repo = {
                        friendtwo: p.friendTwoId,
                        type: "Pending1"
                    }
                    return repo;
                } else {
                    const repo = {
                        friendtwo: p.friendOneId,
                        type: "Pending2"
                    }
                    return repo;
                }
            });
            const users = await db.profile.findMany({
                where: {
                    id: {
                        in: blockedIDS.map(item => item.friendtwo),
                    }
                },
                select: {
                    id: true,
                    name: true,
                    imageUrl: true
                }
            });
    
            if (!users) {
                return new NextResponse("No users found", { status: 401 });
            }
    
            const usersWithType = users.map(user => {
                const pendingInfo = blockedIDS.find(item => item.friendtwo === user.id);
                return { ...user, type: pendingInfo ? pendingInfo.type : undefined };
            });
    
            return NextResponse.json(usersWithType);
        }else{
            const blocked1 = await db.friends.findMany({
                where:{
                    senderId: senderId,
                    status: status
                },
                select:{ 
                    friendTwoId: true,
                    friendOneId: true
                }
            })
            
            blockedIds = blocked1.map(p => {
                if (p.friendOneId === senderId) {
                    return p.friendTwoId;
                } else {
                    return p.friendOneId;
                }
            });
        }

        
        const users = await db.profile.findMany({
            where:{
                id: {
                    in: blockedIds,
                }
            },
            select: {
                id: true,
                name: true,
                imageUrl: true
            }
        });

        if(!users){
            return new NextResponse("No users found", { status: 401 });
        }
        
        
        return NextResponse.json(users);
    } catch (error) {
        console.log("Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

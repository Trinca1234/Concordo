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
        const statusParam = searchParams.get("status");
        let blockedIds

        if (!statusParam) {
            return new NextResponse("Status missing", { status: 400 });
        }

        if (!profile) {
            return new NextResponse("Profile missing", { status: 400 });
        }

        const status: FriendshipStatus = statusParam as FriendshipStatus;

        if(statusParam == "ACCEPTED"){
            const blocked1 = await db.friends.findMany({
                where:{
                    status: status,
                    OR: [
                        { friendOneId: profile.id },
                        { friendTwoId: profile.id }
                    ]
                },
                select:{ 
                    friendTwoId: true,
                    friendOneId: true
                }
            })
            
            blockedIds = blocked1.map(p => {
                if (p.friendOneId === profile.id) {
                    return p.friendTwoId;
                } else {
                    return p.friendOneId;
                }
            });
        }else if(statusParam == "PENDING"){
            let blockedIDS: { friendtwo: string; type: string; }[] = [];
            const blocked1 = await db.friends.findMany({
                where:{
                    status: status,
                    OR: [
                        { friendOneId: profile.id },
                        { friendTwoId: profile.id }
                    ]
                },
                select:{ 
                    friendTwoId: true,
                    friendOneId: true,
                    senderId: true
                }
            })
            
            blockedIDS = blocked1.map(p => {
                if (p.friendOneId === profile.id && profile.id === p.senderId) {
                    const repo = {
                        friendtwo: p.friendTwoId,
                        type: "Pending1"
                    }
                    return repo;
                } else if(p.friendOneId === profile.id && profile.id != p.senderId) {
                    const repo = {
                        friendtwo: p.friendTwoId,
                        type: "Pending2"
                    }
                    return repo;
                } else if(p.friendTwoId === profile.id && profile.id === p.senderId) {
                    const repo = {
                        friendtwo: p.friendOneId,
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
                    senderId: profile.id,
                    status: status
                },
                select:{ 
                    friendTwoId: true,
                    friendOneId: true
                }
            })
            
            blockedIds = blocked1.map(p => {
                if (p.friendOneId === profile.id) {
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

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { useSearchParams } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(
    req: Request
): Promise<NextResponse> {
    try {
        const {searchParams} = new URL(req.url);
        const profile = await currentProfile();
        const userId = searchParams.get("id");

        if (!userId) {
            return new NextResponse("Id missing", { status: 400 });
        }

        if (!profile) {
            return new NextResponse("Profile missing", { status: 400 });
        }

        const profileFriends = await db.friends.findMany({
            where:{
                status: "ACCEPTED",
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
        
        const profileFriendIds = profileFriends.map(p => {
            if (p.friendOneId === profile.id) {
                return p.friendTwoId;
            } else {
                return p.friendOneId;
            }
        });

        console.log(profile.id);
        console.log(profileFriendIds);

        const userFriends = await db.friends.findMany({
            where:{
                status: "ACCEPTED",
                OR: [
                    { friendOneId: userId },
                    { friendTwoId: userId }
                ]
            },
            select:{ 
                friendTwoId: true,
                friendOneId: true
            }
        })
        
        const userFriendIds = userFriends.map(p => {
            if (p.friendOneId === userId) {
                return p.friendTwoId;
            } else {
                return p.friendOneId;
            }
        });

        console.log(userId);
        console.log(userFriendIds);

        const mutualFriendIds = userFriendIds.filter(id => profileFriendIds.includes(id));

        if (mutualFriendIds.length === 0) {
            return new NextResponse("No mutual friends found", { status: 201 });
        }
        
        const users = await db.profile.findMany({
            where:{
                id: {
                    in: mutualFriendIds,
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


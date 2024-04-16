import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { useSearchParams } from "next/navigation";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request
) {
    try {

        const {searchParams} = new URL(req.url);
        const friendTwoId = searchParams.get("TwoId");

        const profile = await currentProfile()

        if (!profile) {
            return new NextResponse("Friend One ID missing", { status: 400 });
        }

        if (!friendTwoId) {
            return new NextResponse("Friend Two ID missing", { status: 400 });
        }

        const friendship = await db.friends.findFirst({
            where: {
                friendOneId: profile.id ,
                friendTwoId: friendTwoId ,
            },
        });

        if(!friendship){
            const friendship = await db.friends.findFirst({
                where: {
                    friendOneId: friendTwoId ,
                    friendTwoId: profile.id ,
                },
            });
    
            if(!friendship){
                return new NextResponse("Non existent friendship", { status: 200 });
            }

            await db.friends.update({
                where:{
                    id: friendship.id,
                },
                data:{
                    status: "ACCEPTED"
                }
            })
        }
        
        return NextResponse.json(friendship);
    } catch (error) {
        console.log("Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

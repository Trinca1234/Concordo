import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { useSearchParams } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(
    req: Request
) {
    try {

        const {searchParams} = new URL(req.url);

        const friendOneId = searchParams.get("OneId");
        const friendTwoId = searchParams.get("TwoId");

        if (!friendOneId) {
            return new NextResponse("Friend One ID missing", { status: 400 });
        }

        if (!friendTwoId) {
            return new NextResponse("Friend Two ID missing", { status: 400 });
        }

        const friendship = await db.friends.findFirst({
            where: {
                AND: [
                    { friendOneId: friendOneId },
                    { friendTwoId: friendTwoId },
                ]
            },
        });

        if(!friendship){
            return new NextResponse("Non existent friendship", { status: 200 });
        }
 
        if(friendship?.status == "BLOCKED"){
            return new NextResponse("User blocked", { status: 200 });
        }
        else if(friendship?.status == "PENDING"){
            return new NextResponse("Already sent friend request", { status: 200 });
        }
        else if(friendship?.status == "ACCEPTED"){
            return new NextResponse("Hes already your friend", { status: 200 })
        }
        
        
        return NextResponse.json(friendship);
    } catch (error) {
        console.log("Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { useSearchParams } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(
    req: Request
) {
    try {

        const {searchParams} = new URL(req.url);
        const friendTwoEmail = searchParams.get("email");

        if (!friendTwoEmail) {
            return new NextResponse("Friend Two Email missing", { status: 400 });
        }

        const id = await db.profile.findFirst({
            where: {
                email: friendTwoEmail
            },
        });

        console.log(id);

        if(!id){
            return new NextResponse("This email does not have an account", { status: 401 });
        }
        
        
        return NextResponse.json(id);
    } catch (error) {
        console.log("Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

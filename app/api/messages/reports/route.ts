import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
) {
    try{
        const profile = await currentProfile();
        const {searchParams} = new URL(req.url);

        const dmId = searchParams.get("id");

        if(!profile){
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!dmId){
            return new NextResponse("Direct Message ID missing", {status: 400});
        }



        const report = await db.directMessageReport.create({
            data: { 
                directMessageId: dmId,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        {name: "general", profileId: profile.id}
                    ]
                },
                members: {
                    create: [
                        {profileId: profile.id, role: MemberRole.ADMIN}
                    ]
                }
            }
        })
        return NextResponse.json(server);

    }catch(error){
        console.log("CHANNELS_POST", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}
import {v4 as uuidv4} from "uuid";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
  
// criar servidor

export async function POST(req: Request){
    try{
        const {name, imageUrl} = await req.json();
        const profile = await currentProfile();

        if (!profile){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const server = await db.server.create({
            data: {
                profileId: profile.id,
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
        console.log("[SERVERS_POST]", error);
        return new NextResponse("Internal Error", {status:500})
    }
}

export async function GET(req: Request){
    try{
        const profile = await currentProfile();

        if (!profile){
            return new NextResponse("Unauthorized", {status: 401})
        }

        const servers = await db.server.findMany({
            where:{
                members:{
                    some:{
                        profileId: profile.id,
                        status: true,
                    }
                }
            }
        });
        
        return NextResponse.json(servers);
    }catch(error){
        console.log("[SERVERS_POST]", error);
        return new NextResponse("Internal Error", {status:500})
    }
}
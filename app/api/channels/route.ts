import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
) {
    try{
        const profile = await currentProfile();
        const {name, type} = await req.json();
        const {searchParams} = new URL(req.url);

        const serverId = searchParams.get("serverId");

        if(!profile){
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!serverId){
            return new NextResponse("Server ID missing", {status: 400});
        }

        if(name === "general"){
            return new NextResponse("Name cannot be 'general'", {status: 400});
        }

        const server = await db.server.update({
            where:{
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        status: true,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    create: {
                        profileId: profile.id,
                        name,
                        type,
                    }
                }
            }
        });

        return NextResponse.json(server);

    }catch(error){
        console.log("CHANNELS_POST", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}

export async function GET(
    req: Request
) {
    try{
        const profile = await currentProfile();
        const {searchParams} = new URL(req.url);

        const serverId = searchParams.get("serverId");

        if(!profile){
            return new NextResponse("Unauthorized", {status: 401});
        }

        if(!serverId){
            return new NextResponse("Server ID missing", {status: 400});
        }

        const server = await db.server.findUnique({
            where:{
                id: serverId,
            },
            include:{
                channels:{
                    orderBy:{
                        createdAt:"asc",
                    },
                },
                members: {
                    include:{
                        profile: true,
                    },
                    orderBy:{
                        role: "asc",
                    }
                }
            }
        });

        return NextResponse.json(server);

    }catch(error){
        console.log("CHANNELS_GET", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}
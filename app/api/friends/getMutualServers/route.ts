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

        const profileServers = await db.member.findMany({
            where:{
                profileId: profile.id,
                status: true
            },
            select:{
                serverId: true
            }
        })

        const userServers = await db.member.findMany({
            where:{
                profileId: userId,
                status:true
            },
            select:{
                serverId: true
            }
        })

        const profileServerIds = profileServers.map(server => server.serverId);
        const userServerIds = userServers.map(server => server.serverId);

        const mutualServerIds = profileServerIds.filter(id => userServerIds.includes(id));


        if (mutualServerIds.length === 0) {
            return new NextResponse("No mutual friends found", { status: 201 });
        }
        
        const Servers = await db.server.findMany({
            where:{
                id: {
                    in: mutualServerIds,
                }
            },
            select: {
                id: true,
                name: true,
                imageUrl: true
            }
        });

        if(!Servers){
            return new NextResponse("No users found", { status: 401 });
        }
        
        
        return NextResponse.json(Servers);
    } catch (error) {
        console.log("Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}


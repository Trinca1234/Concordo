import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    {params}: {params: {memberId: string}}
){
    try{
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const serverId = searchParams.get("serverId");

        if (!profile) {
            return new NextResponse("Unauthorized", {status: 401});
        }

        if (!serverId) {
            return new NextResponse("Server ID missing", {status: 400});
        }

        if (!params.memberId) {
            return new NextResponse("Member ID missing", {status: 400});
        }

        const member = await db.member.findFirst({
            where: {
                profileId: params.memberId,
                status: true,
                serverId: serverId,
            },
        });

        if (member) {
            await db.member.update({
                where: {
                    id: member.id,
                },
                data: {
                    status: false,
                },
            });
        }

        const server = await db.server.findUnique({
            where: {
                id: serverId,
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    },
                },
            },
        });

        return NextResponse.json(server);
    } catch (error) {
        console.log("[MEMBER_ID_DELETE]", error);
        return new NextResponse("Internal Error", {status: 500});
    }
}
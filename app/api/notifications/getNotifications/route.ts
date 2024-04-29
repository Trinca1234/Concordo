import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request
) {
    try {
        const {searchParams} = new URL(req.url);
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Profile missing", { status: 400 });
        }

        const notifications = await db.notifications.findMany({
            where:{
                recipientId: profile.id,
                status: "UNREAD"
            }
        })

        if(!notifications){
            return new NextResponse("this user has no notifications", { status: 200 });
        }

        const notificationsWithSenderProfiles = [];

        for (const notification of notifications) {
            const senderProfile = await db.profile.findFirst({
                where: {
                    id: notification.senderId
                }
            });
            if(senderProfile)
            notificationsWithSenderProfiles.push({
                id: notification.id,
                name: senderProfile.name,
                imageUrl: senderProfile.imageUrl,
                content: notification.content
            });
        }

        if(!notificationsWithSenderProfiles){
            return new NextResponse("Error fetching sender profile", { status: 401 });
        }

        return NextResponse.json(notificationsWithSenderProfiles);
    } catch (error) {
        console.log("Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

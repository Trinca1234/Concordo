import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
    req: Request
) {
    try {
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);
        const dmId = searchParams.get("id");
        const reason = searchParams.get("reason");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!dmId) {
            return new NextResponse("Direct Message ID missing", { status: 400 });
        }

        if (!reason) {
            return new NextResponse("Reason missing", { status: 400 });
        }

        const report = await db.directMessageReport.create({
            data: {
                directMessageId: dmId,
                reason: reason,
                status: "Pending",
                reporterId: profile.id,
            }
        });
        
        return NextResponse.json(report);
    } catch (error) {
        console.log("Error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

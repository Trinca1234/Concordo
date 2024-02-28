// ELEMINAR

import { currentProfile } from "@/lib/current-profile";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { serverId: string } }
  ) {
    try {
      const profile = await currentProfile();
  
      if (!profile) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
  
      if (!params.serverId) {
        return new NextResponse("Server Id missing", { status: 400 });
      }

      const server = await axios.patch(`http://localhost:80/api/leave-server.php?server_id=${params.serverId}&id=${profile.id}`);
  
      /* const server = await db.server.update({
        where: {
          id: params.serverId,
          profileId: {
            not: profile.id,
          },
          members: {
            some: {
              profileId: profile.id,
              status: true,
            },
          },
        },
        data: {
          members: {
            updateMany: {
              data: {
                status: false,
              },
              where: {
                profileId: profile.id,
                status: true,
              },
            },
          },
        },
      }); */
  
      return NextResponse.json(server);
    } catch (error) {
      console.error("[SERVER_ID_LEAVE]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }
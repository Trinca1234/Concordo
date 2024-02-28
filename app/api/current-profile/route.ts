// api/current-profile.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { NextResponse } from 'next/server';

export async function GET(req: NextApiRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
        return new NextResponse("User not authenticated", {status: 401});
    }

    const profile = await db.profile.findUnique({
      where: {
        userId,
      },
    });

    return NextResponse.json(profile);

  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", {status: 500});
  }
}

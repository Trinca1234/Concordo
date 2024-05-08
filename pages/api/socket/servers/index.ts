import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { MemberRole } from "@prisma/client";
import {v4 as uuidv4} from "uuid";
 
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
){
    if(req.method !== "GET" && req.method !== "POST"){
        return res.status(405).json({error: "Method not allowed"});
    }
    try{
        const profile = await currentProfilePages(req);

        if (!profile) {
            return res.status(400).json({error: "Profile missing or invalid"});
        }

        if(req.method === "GET"){
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
    
            const serverKey = `server:${profile.id}`;
    
            res?.socket?.server?.io?.emit(serverKey, servers);
            
            return res.status(200).json(servers);
        }

        if(req.method === "POST"){
            const { name, imageUrl } = req.query;

            if(!name || !imageUrl){
                return res.status(400).json({error: "missing name or imageUrl"});
            }

            const serverName = Array.isArray(name) ? name[0] : name.toString();
            const serverImageUrl = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl.toString();
        
            const server = await db.server.create({
                data: {
                    profileId: profile.id,
                    name: serverName,
                    imageUrl: serverImageUrl,
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
            const addKey = `server:${profile.id}:add`;
    
            res?.socket?.server?.io?.emit(addKey, server);
            
            return res.status(200).json(server);
        }
        
    }catch(error){
        console.log("[SERVERS_GET]", error);
        return res.status(500).json({message: "Internal Error"});
    }
}
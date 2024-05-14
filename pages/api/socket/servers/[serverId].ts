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
    if(req.method !== "PATCH" && req.method !=="DELETE"){
        return res.status(405).json({error: "Method not allowed"});
    }
    try{
        const profile = await currentProfilePages(req);

        if (!profile) {
            return res.status(400).json({error: "Profile missing or invalid"});
        }

        if(req.method === "PATCH"){
            const { serverId, name, imageUrl } = req.query;

            if(!serverId){
                return res.status(400).json({error: "missing serverId"});
            }

            if(!name || !imageUrl){
                return res.status(400).json({error: "missing name or imageUrl"});
            }

            const serverName = Array.isArray(name) ? name[0] : name.toString();
            const serverImageUrl = Array.isArray(imageUrl) ? imageUrl[0] : imageUrl.toString();
            const sserverId = Array.isArray(serverId) ? serverId[0] : serverId.toString();
        
            const server = await db.server.update({
                where:{
                    id: sserverId
                },
                data: {
                    name: serverName,
                    imageUrl: serverImageUrl,
                }
            })
            const updateKey = `servers:${serverId}:update`;
            
            res?.socket?.server?.io?.emit(updateKey, server);
            
            return res.status(200).json(server);
        }
        
    }catch(error){
        console.log("[SERVERS_GET]", error);
        return res.status(500).json({message: "Internal Error"});
    }
}
import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { MemberRole, ChannelType } from "@prisma/client";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
){
    if(req.method !== "POST" && req.method !== "DELETE" && req.method !== "PATCH"){
        return res.status(405).json({error: "Method not allowed"});
    }
    try{
        const profile = await currentProfilePages(req);

        if (!profile) {
            return res.status(400).json({error: "Profile missing or invalid"});
        }

        if(req.method === "POST"){
            const {name, type, serverId} = req.query;

            if(!name || !type || !serverId){
                return res.status(400).json({error: "missing name or type or serverId"});
            }
        
            const server = await db.server.update({
                where:{
                    id: serverId.toString(),
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
                            name: name.toString(),
                            type: type as ChannelType,
                        }
                    }
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

            const updateKey = `channels:${serverId}:update`;
            
            res?.socket?.server?.io?.emit(updateKey, server);
            
            return res.status(200).json(server);
        }
        else if(req.method === "DELETE"){
            const { channelId, serverId } = req.query;

            if(!channelId || !serverId){
                return res.status(400).json({error: "missing channelId or serverId"});
            }
        
            const server = await db.server.update({
                where:{
                    id: serverId.toString(),
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
                        delete: {
                            id: channelId.toString(),
                            name: {
                                not: "general",
                            }
                        }
                    }
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

            const updateKey = `channels:${serverId}:update`;
            
            res?.socket?.server?.io?.emit(updateKey, server);
            
            return res.status(200).json(server);
        }
        else if(req.method == "PATCH"){
            const { name, type, channelId, serverId } = req.query;

            if(!channelId || !serverId || !name || !type){
                return res.status(400).json({error: "missing channelId or serverId or name or type"});
            }
        
            const server = await db.server.update({
                where:{
                    id: serverId.toString(),
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
                        update: {
                            where:{
                                id: channelId.toString(),
                            },
                            data:{
                                name: name.toString(),
                                type: type.toString() as ChannelType,
                            }
                        }
                    }
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

            const updateKey = `channels:${serverId}:update`;
            
            res?.socket?.server?.io?.emit(updateKey, server);
            
            return res.status(200).json(server);
        }
        
    }catch(error){
        console.log("[CHANNELS_UPDATE_DELETE]", error);
        return res.status(500).json({message: "Internal Error"});
    }
}
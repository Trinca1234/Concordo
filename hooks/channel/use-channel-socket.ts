import { useSocket } from "@/components/providers/socket-provider"
import { ChannelType, MemberRole } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

interface Member {
    id: string;
    role: MemberRole;
    status: boolean;
    profileId: string;
    serverId: string;
    createdAt: Date;
    updatedAt: Date;
    profile: {
        id: string;
        userId: string;
        name: string;
        imageUrl: string;
        email: string;
        createdAt: Date;
        updatedAt: Date;
    };
}

interface Channel {
    id: string; 
    name: string; 
    type: ChannelType; 
    profileId: string; 
    serverId: string; 
    createdAt: Date; 
    updatedAt: Date;
}

interface Server {
    id: string;
    name: string;
    imageUrl: string;
    inviteCode: string;
    profileId: string;
    createdAt: Date;
    updatedAt: Date;
    channels: Channel[];
    members: Member[];
}

type ChannelSocketProps = {
    queryKey: string,
    updateKey: string,
}

export const useChannelSocket = ({   
    queryKey,
    updateKey
}: ChannelSocketProps) =>{
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(()=>{
        if(!socket){
            return;
        }

        socket.on(updateKey, (server: Server) => {
            console.log(`Received update for server ${server.id}`);
            queryClient.setQueryData([queryKey], (oldData: any) =>{
                return{
                    ...oldData,
                    pages:{
                        0:server
                    },
                }
            })
        });

        /* socket.on(addKey, (server: Server)=>{
            console.log('Received updated server:', server);
            queryClient.setQueryData([queryKey], (oldData: any)=>{
                if(!oldData || !oldData.pages || oldData.pages.length === 0){
                    return{
                        pages:[[server],]
                    }
                }
                const newData = [...oldData.pages];

                newData[0].push(server);

                return {
                    ...oldData,
                    pages: newData,
                };
            });
        }); */

        return() =>{
            socket.off(updateKey);
        }

    }, [queryClient, queryKey, socket]);
}
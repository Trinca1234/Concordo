import { useSocket } from "@/components/providers/socket-provider"
import { Server } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
    addKey: string,
    deleteKey: string,
    queryKey: string,
    servers: Server[],
}

export const useServerSocket = ({   
    addKey,
    deleteKey,
    servers,
    queryKey,
}: ChatSocketProps) =>{
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(()=>{
        if(!socket || !servers || servers.length === 0){
            return;
        }

        socket.on(deleteKey, (server: Server) => {
            console.log(`Received delete for server ${server.id}`);
            queryClient.setQueryData([queryKey], (oldData: any) =>{
                if(!oldData || !oldData.pages || oldData.pages.length === 0){
                    return oldData;
                }
                const newData = oldData.pages.map((page: any) =>{
                    const updatedItems = page.map((item: any) => {
                        if (item.id === server.id) {
                            return server;
                        }
                        return item;
                    });
                    return updatedItems;
                });
                return{
                    ...oldData,
                    pages: newData,
                }
            })
        });

        socket.on(addKey, (server: Server)=>{
            console.log('Received add server:', server);
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
        });

        return() =>{
            socket.off(addKey);
            socket.off(deleteKey);
        }

    }, [queryClient, addKey, queryKey, socket, servers]);
}
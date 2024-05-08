import { useSocket } from "@/components/providers/socket-provider"
import { Server } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type ChatSocketProps = {
    addKey: string,
    updateKey: string,
    queryKey: string,
}

export const useServerSocket = ({
    addKey,
    updateKey,
    queryKey,
}: ChatSocketProps) =>{
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(()=>{
        if(!socket){
            return;
        }

        socket.on(updateKey, (server: Server)=>{
            console.log('Received updated server:', server);
            queryClient.setQueryData([queryKey], (oldData: any) =>{
                if(!oldData || !oldData.pages || oldData.pages.length === 0){
                    return oldData;
                }
                const newData = oldData.pages.map((page: any) =>{
                    return{
                        ...page,
                        items: page.items.map((item: Server)=>{
                            if(item.id === server.id){
                                return server;
                            }
                            return item;
                        })
                    }
                });
                return{
                    ...oldData,
                    pages: newData,
                }
            })
        });

        socket.on(addKey, (server: Server)=>{
            console.log('Received updated server:', server);
            queryClient.setQueryData([queryKey], (oldData: any)=>{
                if(!oldData || !oldData.pages || oldData.pages.length === 0){
                    return{
                        pages:[{
                            items: [server],
                        }]
                    }
                }
                const newData = [...oldData.pages];

                newData[0] ={
                    ...newData[0],
                    items:[
                        server,
                        ...newData[0].items,
                    ]
                };

                return {
                    ...oldData,
                    pages: newData,
                };
            });
        });

        return() =>{
            socket.off(addKey);
            socket.off(updateKey);
        }

    }, [queryClient, addKey, queryKey, socket, updateKey]);
}
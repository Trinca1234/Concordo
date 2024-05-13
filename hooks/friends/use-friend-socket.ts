import { useSocket } from "@/components/providers/socket-provider"
import { Server } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type FriendSocketProps = {
    addKey: string,
    updateKey: string,
    queryKey: string,
}

export const useFriendSocket = ({   
    addKey,
    updateKey,  
    queryKey,
}: FriendSocketProps) =>{
    const { socket } = useSocket();
    const queryClient = useQueryClient();

    useEffect(()=>{
        if(!socket){
            return;
        }

        console.log(addKey);
        console.log(updateKey);
        console.log(queryKey);
        console.log(socket);

        socket.on(updateKey, (server: Server)=>{
            console.log('Received updated server:', server);
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
        });

        return() =>{
            socket.off(addKey);
            socket.off(updateKey);
        }

    }, [queryClient, addKey, queryKey, socket, updateKey]);
}
import { useSocket } from "@/components/providers/socket-provider"
import { Friends, Server } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

type FriendSocketProps = {
    addKey: string,
    queryKey: string,
    updateKey: string,
}

export const useFriendSocket = ({   
    addKey,
    queryKey,
    updateKey,
}: FriendSocketProps) =>{
    const { socket } = useSocket(); 
    const queryClient = useQueryClient();

    useEffect(()=>{
        if(!socket){
            return;
        }

        console.log(updateKey)

        socket.on(updateKey, (friend: Friends) => {
            console.log(`Received update for server ${friend.id}`);
            queryClient.setQueryData([queryKey], (oldData: any) =>{
                console.log(oldData);
                console.log(friend);
                if(!oldData || !oldData.pages || oldData.pages.length === 0){
                    return oldData;
                }
                const newData = [...oldData.pages];
                
                const isFriendAlreadyThere = newData[0].some((existingFriend: Friends) => existingFriend.id === friend.id);
                
                if (!isFriendAlreadyThere) {
                    newData[0].push(friend);
                }

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
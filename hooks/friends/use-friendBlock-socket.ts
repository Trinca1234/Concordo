import { useSocket } from "@/components/providers/socket-provider"
import { Friends, Server } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type FriendSocketProps = {
    queryKey: string,
    acceptedKey: string,
    deniedKey: string,
    blockedKey: string,
}

export const useFriendBlockSocket = ({   
    queryKey,
    acceptedKey,
    deniedKey,
    blockedKey,
}: FriendSocketProps) =>{
    const { socket } = useSocket(); 
    const queryClient = useQueryClient();
    const router = useRouter();

    useEffect(()=>{
        if(!socket){
            return;
        }

        socket.on(blockedKey, (friend: Friends) => {
            console.log(`Received block for friend ${friend.id}`);
            queryClient.setQueryData([queryKey], (oldData: any) =>{
                if(!oldData || !oldData.pages || oldData.pages.length === 0){
                    return oldData;
                }
                const newData = [...oldData.pages];
                
                const isFriendAlreadyThere = newData[0].some((existingFriend: Friends) => existingFriend.id === friend.id);
                
                if (!isFriendAlreadyThere) {
                    newData[0].push(friend);
                }

                console.log(newData);
                router.refresh();

                return{
                    ...oldData,
                    pages: newData,
                }
            })
        });

        socket.on(deniedKey, (friend: Friends) => {
            console.log(`Received denie for friend ${friend.id}`);
            queryClient.setQueryData([queryKey], (oldData: any) => {
        
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return oldData;
                }
        
                const newData = [...oldData.pages];
                
                const pageIndex = newData[0].findIndex((existingFriend: Friends) => existingFriend.id === friend.id);
                
                if (pageIndex !== -1) {
                    newData[0].splice(pageIndex, 1);
                }

                console.log(newData);
                router.refresh();
        
                return {
                    ...oldData,
                    pages: newData,
                };
            });
        });

        socket.on(acceptedKey, (friend: Friends) => {
            console.log(`Received accept for friend ${friend.id}`);
            queryClient.setQueryData([queryKey], (oldData: any) => {
        
                if (!oldData || !oldData.pages || oldData.pages.length === 0) {
                    return oldData;
                }
        
                const newData = [...oldData.pages];
                
                const pageIndex = newData[0].findIndex((existingFriend: Friends) => existingFriend.id === friend.id);
                
                if (pageIndex !== -1) {
                    newData[0].splice(pageIndex, 1);
                }

                console.log(newData);
                router.refresh();
        
                return {
                    ...oldData,
                    pages: newData,
                };
            });
        });
        

        return() =>{
            socket.off(acceptedKey);
            socket.off(deniedKey);
            socket.off(blockedKey);
        }

    }, [queryClient, acceptedKey, queryKey, socket, deniedKey, blockedKey]);
}
import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps{
    queryKey: string;
    apiUrl: string;
    serverId: string;
};

export const useChannelQuery = ({
    queryKey,
    apiUrl,
    serverId
}: ChatQueryProps) =>{
    const { isConnected } = useSocket();

    const fetchChannels = async () =>{
        const url = qs.stringifyUrl({
            url: apiUrl,
            query:{
                serverId
            }
        }, {skipNull: true});

        const res = await fetch(url, {
            method: 'GET',
        });
        return res.json();
    };
    
    const {
        data,
        status,
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchChannels,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 100000,
        initialPageParam: undefined,
    });

    return{
        data,
        status,
    };
}
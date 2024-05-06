import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps{
    queryKey: string;
    apiUrl: string;
    paramKey: string;
    paramValue: string;
};

export const useFriendQuery = ({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
}: ChatQueryProps) =>{
    const { isConnected } = useSocket();

    const fetchFriends = async () =>{
        const url = qs.stringifyUrl({
            url: apiUrl,
            query:{
                [paramKey]: paramValue
            }
        }, {skipNull: true});

        const res = await fetch(url);
        return res.json();
    };
    
    const {
        data,
        status,
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchFriends,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 1000,
        initialPageParam: undefined,
    });

    return{
        data,
        status,
    };
}
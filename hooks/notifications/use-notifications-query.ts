import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSocket } from "@/components/providers/socket-provider";

interface ChatQueryProps{
    queryKey: string;
    apiUrl: string;
};

export const useServerQuery = ({
    queryKey,
    apiUrl,
}: ChatQueryProps) =>{
    const { isConnected } = useSocket();

    const fetchServers = async () =>{
        const url = qs.stringifyUrl({
            url: apiUrl,
        }, {skipNull: true});

        const res = await fetch(url);
        return res.json();
    };
    
    const {
        data,
        status,
    } = useInfiniteQuery({
        queryKey: [queryKey],
        queryFn: fetchServers,
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        refetchInterval: isConnected ? false : 1000,
        initialPageParam: undefined,
    });

    return{
        data,
        status,
    };
}
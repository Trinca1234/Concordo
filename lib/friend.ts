import { db } from "@/lib/db";
import axios from "axios";
import qs from "query-string";
import { AxiosError } from 'axios';


export const getOrCreateFriendship = async (friendOneId: string, friendTwoId: string) =>{
    console.log(friendOneId, friendTwoId)
    let friendship = await findFriendship(friendOneId, friendTwoId) || await findFriendship(friendTwoId, friendOneId);
    
    if(friendship == "Non existent friendship"){
        const resultado = await createNewFriendship(friendOneId, friendTwoId);
        return resultado;
    }

    return friendship;
}

const findFriendship = async (friendOneId: string, friendTwoId: string) => {
    /* try {
        const friendship = await db.friends.findFirst({
            where: {
                AND: [
                    { friendOneId: friendOneId },
                    { friendTwoId: friendTwoId },
                ]
            },
        });

        console.log('Friendship found:', friendship);
        return friendship;
    } catch (error) {
        console.error('Error finding friendship:', error);
        return null;
    } */
    try{
        const url =  qs.stringifyUrl({
            url: "/api/friends/findFriendship",
            query: {
                OneId: friendOneId,
                TwoId: friendTwoId
            }
        });

        const response = await axios.get(url);

        return response.statusText;

    } catch (error: any) {
        console.error("Error creating friendship:", error);
        if (axios.isAxiosError(error)) {
            return error;
        } else {
            return 'Unknown Error';
        }
    }
}


export const acceptFriendshipRequest = async (friendshipId: string) => {
   /*  try {
        return await db.friends.update({
            where: { id: friendshipId },
            data: { status: "ACCEPTED" },
            include: { friendOne: true, friendTwo: true }
        });
    } catch (error) {
        console.error("Error accepting friendship request:", error);
        return null;
    } */
    
}

export const denyFriendshipRequest = async (friendshipId: string) => {
    try {
        return await db.friends.update({
            where: { id: friendshipId },
            data: { status: "DENIED" },
            include: { friendOne: true, friendTwo: true }
        });
    } catch (error) {
        console.error("Error denying friendship request:", error);
        return null;
    }
}

export const blockFriendshipRequest = async (friendshipId: string) => {
    try {
        return await db.friends.update({
            where: { id: friendshipId },
            data: { status: "BLOCKED" },
            include: { friendOne: true, friendTwo: true }
        });
    } catch (error) {
        console.error("Error blocking friendship request:", error);
        return null;
    }
}

const createNewFriendship = async (friendOneId: string, friendTwoId: string) =>{
    try{
        console.log(friendOneId, friendTwoId);

        const url =  qs.stringifyUrl({
            url: "/api/friends",
            query: {
                OneId: friendOneId,
                TwoId: friendTwoId
            }
        });

        const response = await axios.post(url);

        return response;

    } catch (error: any) {
        console.error("Error creating friendship:", error);
        if (axios.isAxiosError(error)) {
            return error;
        } else {
            return 'Unknown Error';
        }
    }

}
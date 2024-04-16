import { db } from "@/lib/db";
import axios from "axios";
import qs from "query-string";
import { AxiosError } from 'axios';
import { currentProfile } from "./current-profile";


export const getOrCreateFriendship = async (friendOneId: string, friendTwoEmail: string) =>{
    console.log(friendOneId, friendTwoEmail)
    try{
        const url =  qs.stringifyUrl({
            url: "/api/friends/findId",
            query: {
                email: friendTwoEmail
            }
        });

        const response = await axios.get(url);

        if(response.status == 200){
            let friendship = await findFriendship(friendOneId, response.data.id) || await findFriendship(response.data.id, friendOneId);
            console.log(friendship);
            if(friendship == "OK"){
                const resultado = await createNewFriendship(friendOneId, response.data.id);
                return resultado;
            }

            return friendship;
        }
    } catch (error: any) {
        console.error("This email does not have an account", error);
        if (axios.isAxiosError(error)) {
            return error;
        } else {
            return 'Unknown Error';
        }
    }

    
    
}

const findFriendship = async (friendOneId: string, friendTwoId: string) => {
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


export const acceptFriendshipRequest = async (friendTwoId: string) => {
    const profile = await currentProfile();
    if(!profile){
        return null;
    }
    let friendship = await findFriendship(profile.id, friendTwoId) || await findFriendship(friendTwoId, profile.id);
    console.log(friendship);
    /* if(friendship == "OK"){
        const url =  qs.stringifyUrl({
            url: "/api/friends/acceptFriendRequest",
            query: {
                OneId: friendOneId,
                TwoId: friendTwoId
            }
        });

        const response = await axios.patch(url);
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
import { db } from "@/lib/db";
import axios from "axios";
import qs from "query-string";

export const getOrCreateConversation = async (profileOneId: string, profileTwoId: string) =>{
    let friendship = await findFriendship(profileOneId, profileTwoId)
    console.log("entrou aqui 1");
    if(friendship != "Hes already your friend"){
        const friendship2 = await findFriendship(profileTwoId, profileOneId);
        console.log("entrou aqui 2");
        if(friendship2 != "Hes already your friend"){
            return null;
        }else{
            let conversation = await findConversation(profileOneId, profileTwoId) || await findConversation(profileTwoId, profileOneId);
            if(!conversation){
                conversation = await createNewConversation(profileOneId, profileTwoId);
            }
            return conversation;
        }
    }
    let conversation = await findConversation(profileOneId, profileTwoId) || await findConversation(profileTwoId, profileOneId);

    if(!conversation){
        conversation = await createNewConversation(profileOneId, profileTwoId);
    }

    return conversation;
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

        return response.data;

    } catch (error: any) {
        console.error("Error creating friendship:", error);
        if (axios.isAxiosError(error)) {
            return error;
        } else {
            return 'Unknown Error';
        }
    }
}

const findConversation = async (profileOneId: string, profileTwoId: string) =>{
    try{
        return await db.conversation.findFirst({
            where:{
                AND:[
                    { profileOneId: profileOneId},
                    { profileTwoId: profileTwoId},
                ]
            },
            include: {
                profileOne: true,
                profileTwo: true
            }
        });
    }catch{
        return null;
    }
    
}

const createNewConversation = async (profileOneId: string, profileTwoId: string) =>{
    try{
        return await db.conversation.create({
            data:{
                profileOneId,
                profileTwoId,
            },
            include: {
                profileOne: true,
                profileTwo: true
            }
        });

    }catch{
        return null;
    }

}
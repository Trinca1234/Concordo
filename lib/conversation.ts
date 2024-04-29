import { db } from "@/lib/db";
import axios from "axios";
import qs from "query-string";

export const getOrCreateConversation = async (profileOneId: string, profileTwoId: string) =>{
    let friendship = await findFriendship(profileOneId, profileTwoId)
    let type = 1
    if (typeof friendship === 'string') {
        console.log("é string")
        return null;
    }
    if(!friendship){
        friendship = await findFriendship(profileTwoId, profileOneId);
        if (typeof friendship === 'string') {
            return null;
        }
        type = 2
    }
    if(!friendship){
        return null;
    }
    if(friendship.status == "ACCEPTED"){
        if(type == 1){
            let conversation = await findConversation(profileOneId, profileTwoId);
            if(!conversation){
                conversation = await createNewConversation(profileOneId, profileTwoId);
            }
        
            return conversation;    
        }else{
            let conversation = await findConversation(profileTwoId, profileOneId);
            if(!conversation){
                conversation = await createNewConversation(profileTwoId, profileOneId);
            }
        
            return conversation; 
        }
    }else{
        return null
    }
}

const findFriendship = async (friendOneId: string, friendTwoId: string) => {
    try{
        const friendship = await db.friends.findFirst({
            where: {
                AND: [
                    { friendOneId: friendOneId },
                    { friendTwoId: friendTwoId },
                ]
            },
        });

        return friendship

    } catch (error: any) {
        console.error("Error finding friendship:", error);
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
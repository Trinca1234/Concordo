import { db } from "@/lib/db";
import axios from "axios";
import qs from "query-string";
import { AxiosError } from 'axios';
import { currentProfile } from "./current-profile";


export const getOrCreateFriendship = async (friendOneId: string, friendTwoEmail: string, sender: string) =>{
    console.log(friendOneId, friendTwoEmail)
    try{
        const url =  qs.stringifyUrl({
            url: "/api/friends/findId",
            query: {
                email: friendTwoEmail 
            } 
        });

        const response = await axios.get(url);

        console.log(response);
        
        if(response.status == 200){
            console.log(response.data.id);
            let friendship = await findFriendship(friendOneId, response.data.id);
            console.log(friendship)

            if(friendship && friendship  != "User blocked" && friendship  != "Hes already your friend" && friendship  != "Non existent friendship" && friendship  != "Already sent friend request" ){
                console.log("entrou aqui");
                const resultado = await updateFriendship(friendOneId, response.data.id, sender);
                return resultado;
            }
            console.log("nao entrou");

            if(friendship && friendship  == "Non existent friendship"){
                let friendship2 = await findFriendship(response.data.id, friendOneId);
                console.log(friendship2)

                if(friendship2 &&friendship2  != "User blocked" && friendship2  != "Hes already your friend" && friendship2  != "Non existent friendship" && friendship2  != "Already sent friend request"){
                    const resultado = await updateFriendship(friendOneId, response.data.id, sender);
                    return resultado;
                }else if(friendship2 && friendship2  == "Non existent friendship"){
                    const resultado = await createNewFriendship(friendOneId, response.data.id, sender);
                    return resultado;
                }
                return friendship2;
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

const createNewFriendship = async (friendOneId: string, friendTwoId: string, sender: string) =>{
    try{
        console.log(friendOneId, friendTwoId);

        const url =  qs.stringifyUrl({
            url: "/api/friends",
            query: {
                OneId: friendOneId,
                TwoId: friendTwoId,
                sender: sender
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

const updateFriendship = async (friendOneId: string, friendTwoId: string, sender: string) =>{
    try{
        console.log(friendOneId, friendTwoId);

        const url =  qs.stringifyUrl({
            url: "/api/friends/updateFriendRequest",
            query: {
                OneId: friendOneId,
                TwoId: friendTwoId,
                sender: sender
            }
        });

        const response = await axios.patch(url);

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
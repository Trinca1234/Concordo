import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ServerIdPageProps{
    params:{
        serverId: string;
    }
};

const ServerIdPage = async ({
    params
}: ServerIdPageProps) => {

    const profile = await currentProfile();

    if(!profile){
        return redirectToSignIn();
    }
}
 
export default ServerIdPage;
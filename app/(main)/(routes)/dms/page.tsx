import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";

const ServerIdPage = async () => {

    const profile = await currentProfile();

    if(!profile){
        return redirectToSignIn();
    }
}
 
export default ServerIdPage;
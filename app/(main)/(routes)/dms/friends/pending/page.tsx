import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { FriendsPendingBody } from "@/components/friends/friends-pending-body";

const FriendAllPage = async () => {
    const profile = await currentProfile();
  
    if (!profile) {
      return redirectToSignIn();
    }

    return ( 
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <FriendsPendingBody/>
        </div> 
     );
}
 
export default FriendAllPage;
import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { FriendsBlockedBody } from "@/components/friends/friends-blocked-body";

const FriendBlockPage = async () => {
    const profile = await currentProfile();
  
    if (!profile) {
      return redirectToSignIn();
    }

    return ( 
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <FriendsBlockedBody/>
        </div>
     );
}
 
export default FriendBlockPage;
import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { FriendsAllBody } from "@/components/friends/friends-all-body";
import { FriendsHeader } from "@/components/friends/friends-header";

const FriendAllPage = async () => {
    const profile = await currentProfile();
  
    if (!profile) {
      return redirectToSignIn();
    }

    return ( 
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <FriendsHeader 
              profile={profile}
            />
            <FriendsAllBody 
              profile={profile}
            />
        </div> 
     );
}
 
export default FriendAllPage;
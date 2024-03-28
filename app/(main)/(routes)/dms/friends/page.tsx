import { currentProfile } from "@/lib/current-profile";
import { redirectToSignIn } from "@clerk/nextjs";
import { FriendsHeader } from "@/components/friends/friends-header";

const MemberIdPage = async () => {
    const profile = await currentProfile();
  
    if (!profile) {
      return redirectToSignIn();
    }

    return ( 
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <FriendsHeader/>
        </div>
     );
}
 
export default MemberIdPage;
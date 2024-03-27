import { ChatConversationMessages } from "@/components/chat/dms-chat-messages";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps{
    params: {
        profileId: string;
    },
    searchParams: {
      video?:boolean,
    }
}

const MemberIdPage = async ({
    params,
    searchParams,
  }: MemberIdPageProps) => {
    const profile = await currentProfile();
  
    if (!profile) {
      return redirectToSignIn();
    }
  
    const CurrentProfile = await db.profile.findFirst({
      where: {
        id: profile.id,
      }
  });
  
    if (!CurrentProfile) {
      return redirect("/");
    }
  
    const conversation = await getOrCreateConversation(profile.id, params.profileId);
  
    if (!conversation) {
      return redirect(`/dms`);
    }
  
    const { profileOne, profileTwo } = conversation;
  
    const otherMember = profileOne.id === profile.id ? profileTwo : profileOne;

    return ( 
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader
            imageUrl={otherMember.imageUrl}
            name={otherMember.name}
            serverId={""}
            type="conversation"
            />
            {searchParams.video && (
              <MediaRoom
              chatId={conversation.id}
              video={true}
              audio={true}
              />
            )}
            {!searchParams.video && (
              <>
              <ChatConversationMessages
              profile={CurrentProfile}
              name={otherMember.name}
              chatId={conversation.id}
              type="conversation"
              apiUrl="/api/direct-messages"
              paramKey="conversationId"
              paramValue={conversation.id}
              socketUrl="/api/socket/direct-messages"
              socketQuery={{
                conversationId: conversation.id,
              }}
              />
              <ChatInput
              name={otherMember.name}
              type="conversation"
              apiUrl="/api/socket/direct-messages"
              query={{
                conversationId: conversation.id,
              }}
              />
              </>
            )}
            
        </div>
     );
}
 
export default MemberIdPage;
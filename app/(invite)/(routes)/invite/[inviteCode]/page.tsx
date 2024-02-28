import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePageProps{
    params:{
        inviteCode: string; 
    };
};

const InviteCodePage = async ({
    params
}: InviteCodePageProps) => {

    const profile = await currentProfile();

    if(!profile){
        return redirectToSignIn();
    }

    if(!params.inviteCode){
        return redirect("/");
    }
    
    //http://localhost:3000/invite/a2eb888e-9bd8-45b8-9f7d-b829af542b19

    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id,
                    status: true,
                }
            }
        }
    });

    if(existingServer){
        return redirect(`/servers/${existingServer.id}`);
    }

    const existingServerFalse = await db.server.findFirst({
        where: {
            inviteCode: params.inviteCode,
            members: {
                some: {
                    profileId: profile.id,
                    status: false,
                }
            }
        }
    });

    if(existingServerFalse){
        const server = await db.server.update({
            where: {
                inviteCode: params.inviteCode
            },
            data: {
                members: {
                    updateMany: {
                        where: {
                            profileId: profile.id
                        },
                        data: {
                            status: true
                        }
                    }
                }
            }
        });
        
        
        if(server){
            return redirect(`/servers/${server.id}`);
        }
    }
    else{
        const server = await db.server.update({
            where: {
                inviteCode: params.inviteCode,
            },
            data: {
                members: {
                    create: {
                        profileId: profile.id,
                        status: true
                    },
                },
            },
        });
        if(server){
            return redirect(`/servers/${server.id}`);
        }
    }
    
}
 
export default InviteCodePage;
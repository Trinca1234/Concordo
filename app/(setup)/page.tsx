import { redirect } from "next/navigation";

import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { InitialModal } from "@/components/models/initial-modal";

const SetupPage = async () => {
    const profile = await initialProfile();

    const server = await db.server.findFirst({
        where:{
            members:{
                some:{
                    profileId: profile.id,
                    status: true
                }
            }
        }
    })

    if(server){
        return redirect(`/servers/${server.id}`);
    }

    return redirect(`/dms/friends/all`);
}
 
export default SetupPage;
"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Member, MemberRole, Profile } from "@prisma/client";
import { UserAvatar } from "../user-avatar";
import { ActionTooltip } from "../action-tooltip";
import { Edit, FileIcon, Flag, ShieldAlert, ShieldCheck, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { useRouter, useParams } from "next/navigation";

import {
    Form,
    FormControl,
    FormField,
    FormItem
}from "@/components/ui/form"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

interface ChatItemProps{
    id: string;
    content: string;
    member: Member & {
        profile: Profile;
    };
    timestamp: string;
    fileUrl: string | null;
    deleted: boolean;
    currentMember: Member;
    isUpdated: boolean;
    socketUrl: string;
    socketQuery: Record<string, string>;
};

const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    "ADMIN": <ShieldAlert className="h-4 w-4 ml-2 text-rose-500"/>
};

const formSchema = z.object({
    content: z.string().min(1),
});
 
export const ChatItem = ({
    id,
    content,
    member,
    timestamp,
    fileUrl,
    deleted,
    currentMember,
    isUpdated,
    socketUrl,
    socketQuery 
}: ChatItemProps) =>{
    const [ isEditing, setIsEditing ] = useState(false);
    const { onOpen } = useModal();

    function containsEmoji(text: string) {
        const emojiPattern = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;
    
        return emojiPattern.test(text);
    }

    if (content !== null && content !== undefined) {
        if(!containsEmoji(content)){
            var Filter = require('bad-words'),
            filter = new Filter();
            filter.addWords(
                "aborto",
                "fodase",
                "caralho",
                "badalhoca",
                "badalhoco",
                "badalhoquices",
                "badamerda",
                "cabra",
                "cabrao",
                "cabrão",
                "cagalhao",
                "cagalhão",
                "caganeira",
                "cocó",
                "anal",
                "ânus",
                "bunda",
                "rabuda",
                "asses",
                "idiota",
                "idiotas",
                "testiculos",
                "culhao",
                "colhão",
                "culhões",
                "colhões",
                "culhoes",
                "colhoes",
                "desgraçado",
                "bellend",
                "bestial",
                "bestialidade",
                "cadela",
                "cadelas",
                "putaria",
                "sangrento",
                "boquete",
                "bollok",
                "peitos",
                "buceta",
                "vagabundo",
                "comedor de tapetes",
                "fenda",
                "cipa",
                "clitóris",
                "galo",
                "otário",
                "galos",
                "coon",
                "porcaria",
                "porra",
                "gozada",
                "cunillingus",
                "boceta",
                "droga",
                "pinto",
                "dildo",
                "dildos",
                "dink",
                "dog-filho da puta",
                "sapatona",
                "ejacular",
                "ejaculado",
                "ejacula",
                "ejaculação",
                "bicha",
                "fagging",
                "bichas",
                "fanny",
                "felching",
                "felação",
                "fodido",
                "fodida",
                "fudido",
                "fudida",
                "filhos da puta",
                "merdas",
                "fode",
                "fode-te",
                "fodete",
                "empacotador de fudge",
                "maldito",
                "maldita",
                "inferno",
                "hore",
                "tesão",
                "bate uma",
                "bater uma",
                "kock",
                "luxúria",
                "cobiçoso",
                "masoquista",
                "masturbar",
                "filho da puta",
                "nazista",
                "negro",
                "niggers",
                "orgasim",
                "orgasmo",
                "orgasmos",
                "pau",
                "pênis",
                "xixi",
                "puto",
                "pisser",
                "mijar",
                "mijando",
                "não me chateies",
                "cocô",
                "cona",
                "piriquita",
                "pachacha",
                "pornô",
                "porno",
                "pornografia",
                "pica",
                "pila",
                "picadas",
                "pube",
                "bichanos",
                "bichano",
                "estupro",
                "estuprador",
                "reto",
                "retardar",
                "rimming",
                "sádico",
                "aparafusar",
                "escroto",
                "sêmen",
                "sexo",
                "trepada",
                "transando",
                "transsexual",
                "merda",
                "shite",
                "calçado",
                "cagando",
                "skank",
                "vagabunda",
                "vadias",
                "smegma",
                "sujeira",
                "arrebatar",
                "spac",
                "coragem",
                "testículo",
                "peituda",
                "tetas",
                "mamas",
                "titt",
                "vagina",
                "viagra",
                "vulva",
                "punheta",
                "prostituta",
                "xxx"
            );
        
            if (content !== null) {
                content = filter.clean(content);
            }
        }
    }


    if(deleted == true){
        content = "This message has been deleted";
    }
    

    const params = useParams();
    const router = useRouter();

    const onMemberClick = () =>{
        if(member.id === currentMember.id){
            return;
        }

        router.push(`/servers/${params?.serverId}/conversations/${member.id}`);
    }

    useEffect(() =>{
        const handleKeyDown = (event: any)=>{
            if(event.key === "Escape" || event.keyCode === 27){
                setIsEditing(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            content: content,
        }
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) =>{
        try{
            const url = qs.stringifyUrl({
                url: `${socketUrl}/${id}`,
                query: socketQuery,
            });

            await axios.patch(url, values)

            form.reset();
            setIsEditing(false);
        }catch(error){
            console.log(error);
        }
    }

    useEffect(()=>{
        form.reset({
            content: content,
        })
    }, [content]);

    const fileType = fileUrl?.split(".").pop();
    const isAdmin = currentMember.role === MemberRole.ADMIN;
    const isModerator = currentMember.role === MemberRole.MODERATOR
    const isOwner = currentMember.id === member.id;
    const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
    const canEditMessage = !deleted && isOwner && !fileUrl;
    const isPdf = fileType === "pdf" && fileUrl;
    const isImage = !isPdf && fileUrl;

    return(
        <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
            <div className="group flex gap-x-2 items-start w-ful">
                <div onClick={onMemberClick} className="cursor-pointer hvoer:drop-shadow-md transition">
                    <UserAvatar src={member.profile.imageUrl} />
                </div>
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-x-2">
                        <div className="flex item-center">
                            <p onClick={onMemberClick} className="font-semibold text-sm hover:underline cursor-pointer">
                                {member.profile.name}
                            </p>
                            <ActionTooltip label={member.role}>
                                {roleIconMap[member.role]}
                            </ActionTooltip>
                        </div>
                        <span className="text-xm text-zinc-500 dark:text-zinc-400">
                            {timestamp}
                        </span>
                    </div>
                    {isImage && (
                        <a 
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                        >
                            <Image
                            src={fileUrl}
                            alt={content}
                            fill
                            className="object-cover"
                            />
                        </a>
                    )}
                    {isPdf && (
                        <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
                            <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400"/>
                            <a 
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
                            >
                                PDF File
                            </a>
                        </div>
                    )}
                    {!fileUrl && !isEditing && (
                        <p className={cn(
                            "text-sm text-zinc-600 dark:text-zinc-300",
                            deleted && "italic text-zinc-500 dark:text-zinc-400 text-xm mt-1 "
                        )}>
                            {content}
                            {isUpdated && !deleted && (
                                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                                    (edited)
                                </span>
                            )}
                        </p>
                    )}
                    {!fileUrl && isEditing && (
                        <Form {...form}>
                            <form 
                            className="flex items-center w-full gap-x-2 pt-2"
                            onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <FormField
                                control={form.control}
                                name="content"
                                render={({ field })=>(
                                    <FormItem
                                    className="flex-1"
                                    >
                                        <FormControl>
                                            <div className="relative w-full ">
                                                <Input
                                                disabled={isLoading}
                                                className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200 "
                                                placeholder="Edited message"
                                                {...field}
                                                />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                                />
                                <Button disabled={isLoading} size="sm" variant="primary">
                                    save
                                </Button>
                            </form>
                            <span className="text-[10px] mt-1 text-zinc-400 ">
                                Press escape to cancel, enter to save 
                            </span>
                        </Form>
                    )}
                </div>
            </div>
            {canDeleteMessage && (
                <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
                    {canEditMessage && (
                        <ActionTooltip label="Edit">
                            <Edit
                            onClick={() => setIsEditing(true)}
                            className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                            />
                        </ActionTooltip>
                    )}
                    <ActionTooltip label="Delete">
                        <Trash
                        onClick={()=> onOpen("deleteMessage", {
                            apiUrl: `${socketUrl}/${id}`,
                            query: socketQuery
                        })}
                        className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                    <ActionTooltip label="Report">
                        <Flag
                        onClick={() => onOpen("reportMessage", {
                            apiUrl: `/api/messages/reports`,
                            query: socketQuery,
                            ids: id
                        })}
                        className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                        />
                    </ActionTooltip>
                </div>
            )}
        </div>
    )
}
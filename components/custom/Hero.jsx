"use client";
import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup';
import { ArrowRight, Link, Sparkles } from 'lucide-react';
import React, { useContext, useState } from 'react';
import SignInDialog from './SignInDialog';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';

function Hero() {
    const [userInput, setUserInput] = useState("");
    const { messages, setMessages } = useContext(MessagesContext);
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const [openDialog, setOpenDialog] = useState(false);
    const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onGenerate = async (input) => {
        if (!userDetail?.name) {
            setOpenDialog(true);
            return;
        }
        if (userDetail?.token<10){
            toast("You don't have enough token!")
            return;
        }

        setIsLoading(true);
        const msg = {
            role: 'user',
            content: input
        };

        setMessages(msg);

        try {
            const workspaceId = await CreateWorkspace({
                user: userDetail._id,
                messages: [msg]
            });

            if (!workspaceId) {
                throw new Error("Workspace creation failed");
            }

            router.push(`/workspace/${workspaceId}`);
        } catch (error) {
            console.error("Error in onGenerate:", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen max-w-6xl px-4 mt-12">
            <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-6 w-6 text-blue-500" />
                <span className="px-3 py-1 text-sm bg-blue-500/10 text-blue-500 rounded-full">
                    AI-Powered Workspace
                </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-gray-200 to-gray-100 bg-clip-text text-transparent">
                {Lookup.HERO_HEADING}
            </h2>
            
            <p className="text-gray-400 text-lg text-center max-w-2xl mb-8">
                {Lookup.HERO_DESC}
            </p>

            <div className="w-full max-w-2xl p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
                <div className="relative">
                    <textarea
                        className="w-full min-h-[120px] p-4 rounded-lg bg-gray-950/50 border border-gray-800 
                                 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none 
                                 transition-all resize-none text-gray-200"
                        onChange={(event) => setUserInput(event.target.value)}
                        placeholder={Lookup.INPUT_PLACEHOLDER}
                        disabled={isLoading}
                    />
                    {userInput && (
                        <button
                            onClick={() => onGenerate(userInput)}
                            disabled={isLoading}
                            className="absolute bottom-4 right-4 bg-blue-500 hover:bg-blue-600 
                                     disabled:bg-blue-500/50 disabled:cursor-not-allowed
                                     p-2 rounded-lg transition-colors"
                        >
                            <ArrowRight className="h-5 w-5 text-white" />
                        </button>
                    )}
                </div>
                
                <div className="flex items-center gap-2 mt-3 text-gray-400">
                    <Link className="h-4 w-4" />
                    <span className="text-sm">Attach files or links (coming soon)</span>
                </div>
            </div>

            {Lookup?.SUGGSTIONS?.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-2xl px-4">
                    {Lookup.SUGGSTIONS.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => onGenerate(suggestion)}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm text-gray-400 border border-gray-800 
                                     rounded-full hover:text-white hover:border-gray-700 
                                     transition-colors disabled:opacity-50 
                                     disabled:cursor-not-allowed"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}

            <SignInDialog openDialog={openDialog} closeDialog={() => setOpenDialog(false)} />
        </div>
    );
}

export default Hero;
"use client";
import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup';
import Prompt from '@/data/Prompt';
import axios from 'axios';
import { useConvex, useMutation } from 'convex/react';
import { ArrowRight, LinkIcon, Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useSidebar } from '../ui/sidebar';
import { toast } from 'sonner';

export const countToken = (inputText) => {
    return inputText.trim().split(/\s+/).filter(word => word).length;
};

function ChatView() {
    const { id } = useParams();
    const convex = useConvex();
    const { userDetail, setUserDetail } = useContext(UserDetailContext);
    const { messages, setMessages } = useContext(MessagesContext);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const UpdateMessages = useMutation(api.workspace.UpdateMessages);
    const { toggleSidebar } = useSidebar();
    const UpdateTokens = useMutation(api.users.UpdateToken);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const GetWorkspaceData = async () => {
        const result = await convex.query(api.workspace.GetWorkspace, {
            workspaceId: id
        });
        setMessages(result?.messages);
    };

    const GetAiResponse = async () => {
        setLoading(true);
        try {
            const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;
            const result = await axios.post('/api/ai-chat', {
                prompt: PROMPT
            });

            const aiResp = {
                role: 'ai',
                content: result.data.result
            };
            setMessages(prev => [...prev, aiResp]);
            await UpdateMessages({
                messages: [...messages, aiResp],
                workspaceId: id
            });
            const token = Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)));
            setUserDetail(prev => ({
                ...prev,
                token: token
            }))
            await UpdateTokens({
                userId: userDetail?._id,
                token: token
            })
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    const onGenerate = (input) => {
        if (userDetail?.token < 10) {
            toast("You don't have enough token!");
            return;
        }
    
        setMessages(prev => [...(prev || []), { role: 'user', content: input }]);
        setUserInput("");
    };
    

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onGenerate(userInput);
        }
    };

    useEffect(() => {
        id && GetWorkspaceData();
    }, [id]);

    useEffect(() => {
        if (messages?.length > 0) {
            const role = messages[messages?.length - 1].role;
            if (role === 'user') {
                GetAiResponse();
            }
            scrollToBottom();
        }
    }, [messages]);

    return (
        <div className="h-[calc(100vh-4rem)] mt-12 flex flex-col bg-black">
            <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 scrollbar-hide">
                {messages?.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex gap-4 max-w-3xl mx-auto ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.role === 'user' && (
                            <div className="flex flex-row-reverse items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                    <Image
                                        src={userDetail?.picture}
                                        alt="User"
                                        width={32}
                                        height={32}
                                        className="rounded-full ring-2 ring-blue-500/20"
                                    />
                                </div>
                                <div className="bg-blue-500/10 text-gray-200 rounded-2xl rounded-tr-none px-4 py-2 max-w-xl">
                                    <ReactMarkdown className="prose prose-invert">{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        )}
                        {msg.role === 'ai' && (
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">AI</span>
                                    </div>
                                </div>
                                <div className="bg-gray-900 text-gray-200 rounded-2xl rounded-tl-none px-4 py-2 max-w-xl border border-gray-800">
                                    <ReactMarkdown className="prose prose-invert">{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {loading && (
                    <div className="flex items-start gap-3 max-w-3xl mx-auto">
                        <div className="flex-shrink-0 mt-1">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                                <span className="text-white text-sm font-bold">AI</span>
                            </div>
                        </div>
                        <div className="bg-gray-900 text-gray-300 rounded-2xl rounded-tl-none px-4 py-2 border border-gray-800">
                            <div className="flex items-center gap-2">
                                <Loader2Icon className="animate-spin h-4 w-4" />
                                <span>Generating response...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-gray-800 bg-black px-4 py-4">
                <div className="max-w-3xl mx-auto flex gap-4">
                    {userDetail && (
                        <div className="flex-shrink-0">
                            <Image
                                src={userDetail?.picture}
                                alt="user"
                                className="rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500/20 transition-all"
                                onClick={toggleSidebar}
                                width={40}
                                height={40}
                            />
                        </div>
                    )}
                    <div className="flex-1 relative">
                        <textarea
                            value={userInput}
                            className="w-full min-h-[80px] max-h-[200px] p-3 pr-12 rounded-lg bg-gray-900 border border-gray-800 
                                     focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none text-gray-200
                                     placeholder-gray-500 transition-all"
                            onChange={(event) => setUserInput(event.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={Lookup.INPUT_PLACEHOLDER}
                            rows={1}
                        />
                        <div className="absolute right-3 bottom-3 flex gap-2">
                            <button
                                className="p-2 text-gray-500 hover:text-gray-400 transition-colors"
                                title="Attach files (coming soon)"
                            >
                                <LinkIcon className="h-5 w-5" />
                            </button>
                            {userInput && (
                                <button
                                    onClick={() => onGenerate(userInput)}
                                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                                >
                                    <ArrowRight className="h-5 w-5" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChatView;
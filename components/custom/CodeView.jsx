"use client"
import React, { useContext, useEffect, useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from '@/data/Lookup';
import { MessagesContext } from '@/context/MessagesContext';
import axios from 'axios';
import Prompt from '@/data/Prompt';
import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useParams } from 'next/navigation';
import { Code2Icon, EyeIcon, Loader2Icon } from 'lucide-react';
import { countToken } from './ChatView';
import { UserDetailContext } from '@/context/UserDetailContext';
import SandpackPreviewClient from './SandpackPreviewClient';
import { ActionContext } from '@/context/ActionContext';

function CodeView() {
  const { id } = useParams();
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [activeTab, setActiveTab] = useState('code');
  const [files, setFiles] = useState(Lookup?.DEFAULT_FILE);
  const { messages, setMessages } = useContext(MessagesContext);
  const {action,setAction}=useContext(ActionContext);
  const UpdateFiles = useMutation(api.workspace.UpdateFiles)
  const convex = useConvex();
  const [loading, setLoading] = useState(false)
  const UpdateTokens = useMutation(api.users.UpdateToken);

  const GenrateAiCode = async () => {
    setLoading(true)
    const PROMPT = JSON.stringify(messages) + "" + Prompt.CODE_GEN_PROMPT
    const result = await axios.post('/api/gen-ai', {
      prompt: PROMPT
    });
    const aiResp = result.data;
    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...aiResp?.files }
    setFiles(mergedFiles);
    await UpdateFiles({
      workspaceId: id,
      files: aiResp?.files
    });
    const token = Number(userDetail?.token) - Number(countToken(JSON.stringify(aiResp)));
    await UpdateTokens({
      userId: userDetail?._id,
      token: token
    })
    setUserDetail(prev => ({
      ...prev,
      token: token
    }))
    setActiveTab('code')
    setLoading(false)
  }

  const GetFiles = async () => {
    setLoading(true)
    const result = await convex.query(api.workspace.GetWorkspace, {
      workspaceId: id
    });
    const mergedFiles = { ...Lookup.DEFAULT_FILE, ...result?.fileData }
    setFiles(mergedFiles);
    setLoading(false)
  }

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages?.length - 1].role;
      if (role == 'user') {
        GenrateAiCode();
      }
    }
  }, [messages])

  useEffect(() => {
    id && GetFiles();
  }, [id])

  useEffect(()=>{
    setActiveTab('preview')
  },[action])

  return (
    <div className='flex-1 overflow-y-auto mt-12 px-4 py-2'>
      <div className='bg-[#181818] w-full p-2 border'>
        <div className="flex items-center gap-1 bg-gray-950 rounded-full p-1">
          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${activeTab === 'code'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'}`}
          >
            <Code2Icon className="h-4 w-4" />
            Code
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${activeTab === 'preview'
                ? 'bg-blue-500 text-white'
                : 'text-gray-400 hover:text-white'}`}
          >
            <EyeIcon className="h-4 w-4" />
            Preview
          </button>
        </div>
      </div>

      {/* Code View Box with Loader */}
      <div className="relative">
        <SandpackProvider files={files} template="react" theme={'dark'} customSetup={{ dependencies: { ...Lookup.DEPENDANCY } }} options={{ externalResources: ['https://cdn.tailwindcss.com'] }}>
          <SandpackLayout>
            {activeTab === 'code' ? (
              <>
                <SandpackFileExplorer style={{ height: '80vh' }} />
                <SandpackCodeEditor style={{ height: '80vh' }} />
              </>
            ) : (
              <SandpackPreviewClient />
            )}
          </SandpackLayout>
        </SandpackProvider>

        {/* Loader inside the CodeView Box */}
        {loading && (
          <div className="absolute inset-0 bg-gray-900/90 flex items-center justify-center rounded-md">
            <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-gray-800/50 border border-gray-700">
              <Loader2Icon className="animate-spin w-8 h-8 text-blue-500" />
              <p className="text-gray-200 font-medium">Generating your files...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CodeView;
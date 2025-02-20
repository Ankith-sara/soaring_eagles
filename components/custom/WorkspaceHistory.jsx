"use client"
import { UserDetailContext } from '@/context/UserDetailContext'
import { useConvex } from 'convex/react'
import React, { useContext, useEffect, useState } from 'react'
import { useSidebar } from '../ui/sidebar'
import Link from 'next/link'
import { api } from '@/convex/_generated/api'
import { MessageSquare } from 'lucide-react'

function WorkspaceHistory() {
    const { userDetail } = useContext(UserDetailContext)
    const [workspaceList, setWorkspaceList] = useState([])
    const { toggleSidebar } = useSidebar()
    const convex = useConvex()

    const GetAllWorkspace = async () => {
        if (!userDetail?._id) return

        try {
            const result = await convex.query(api.workspace.GetAllWorkspace, {
                userId: userDetail._id
            })
            setWorkspaceList(result || [])
            console.log(result)
        } catch (error) {
            console.error("Error fetching workspaces:", error)
        }
    }

    useEffect(() => {
        if (userDetail?._id) {
            GetAllWorkspace()
        }
    }, [userDetail])

    return (
        <div className="space-y-4">
            <h2 className="font-semibold text-lg text-gray-200 px-2">Your Chats</h2>
            <div className="space-y-2">
                {workspaceList?.length > 0 ? (
                    workspaceList.map((workspace) => (
                        <Link
                            href={'/workspace/' + workspace?._id}
                            key={workspace?._id}
                            className="block"
                        >
                            <div
                                onClick={toggleSidebar}
                                className="flex items-center gap-3 px-2 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-all cursor-pointer group"
                            >
                                <MessageSquare className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                                <span className="text-sm font-medium truncate">
                                    {workspace?.messages?.[0]?.content || "Untitled Chat"}
                                </span>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="px-2 py-3 text-gray-500 text-sm flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 opacity-70" />
                        <span>No chats found</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WorkspaceHistory
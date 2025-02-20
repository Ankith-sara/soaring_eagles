"use client"
import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { MessageCircleCode } from 'lucide-react'
import WorkspaceHistory from './WorkspaceHistory'
import SideBarFooter from './SideBarFooter'

function AppSideBar() {
    return (
        <Sidebar className="bg-gray-900 border-r border-gray-800 h-screen">
            <SidebarHeader className="p-2 border-b border-gray-800">
                <div className="">
                    <Image 
                        src={'/logo.png'} 
                        alt='logo' 
                        width={75} 
                        height={75}
                        className="opacity-90 hover:opacity-100 transition-opacity"
                    />
                </div>
                <Button 
                    className="w-full mt-1 bg-blue-600 hover:bg-blue-700 text-white border-0"
                >
                    <MessageCircleCode className="mr-2 h-5 w-5" />
                    Start New Chat
                </Button>
            </SidebarHeader>
            
            <SidebarContent className="p-2 bg-gray-900">
                <SidebarGroup className="space-y-4">
                    <WorkspaceHistory />
                </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter className="border-t border-gray-800 bg-gray-900 p-1">
                <SideBarFooter />
            </SidebarFooter>
        </Sidebar>
    )
}

export default AppSideBar
import { HelpCircle, LogOut, Settings, Wallet } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation';

function SideBarFooter() {
    const router = useRouter();
    const options = [
        {
            name: 'Settings',
            icon: Settings,
        },
        {
            name: 'Help',
            icon: HelpCircle,
        },
        {
            name: 'My Subscription',
            icon: Wallet,
            path:'/pricing'
        },
        {
            name: 'Sign Out',
            icon: LogOut,
        },
    ]

    const onOptionClick=(option)=>{
        router.push(option.path)
    }
    
    return (
        <div className="space-y-1 px-3 pb-8">
            {options.map((option, index) => (
                <Button
                    key={index}
                    onClick={()=>onOptionClick(option)}
                    variant="ghost"
                    className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                >
                    <option.icon 
                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-white" 
                    />
                    <span className="text-sm font-medium">{option.name}</span>
                </Button>
            ))}
        </div>
    )
}

export default SideBarFooter
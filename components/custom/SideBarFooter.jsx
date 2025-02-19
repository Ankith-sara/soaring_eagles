import { HelpCircle, LogOut, Settings, Wallet } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'

function SideBarFooter() {
    const options=[
        {
            name:'Settings',
            icon:Settings
        },
        {
            name:'Help',
            icon:HelpCircle
        },
        {
            name:'My Subscription',
            icon:Wallet
        },
        {
            name:'Sign Out',
            icon:LogOut
        },
    ]
  return (
    <div className='p-5 mb-10'>
        {options.map((option,index)=>(
            <Button key={index} variant='ghost' className='w-full flex justify-start'>
                <option.icon size={20} color="#fff"/>
                {option.name}
            </Button>
        ))}
    </div>
  )
}

export default SideBarFooter
"use client"
import PricingModel from '@/components/custom/PricingModel';
import { UserDetailContext } from '@/context/UserDetailContext';
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup';
import React, { useContext } from 'react';

function Pricing() {
    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    const tokenCount = userDetail && !isNaN(userDetail?.token) && userDetail?.token !== undefined ? userDetail.token : 0;

    return (
        <div className='mt-10 flex flex-col items-center w-full p-10 md:px-32 lg:px-40 mx-auto'>
            <h2 className='font-bold text-4xl'>Pricing</h2>
            <p className='text-gray-400 max-w-xl text-center mt-2'>{Lookup.PRICING_DESC}</p>
            <div className='p-5 w-full flex justify-between mt-7 items-center border rounded-xl' style={{ backgroundColor: Colors.BACKGROUND }}>
                <h2 className='text-lg'>
                    <span className='font-bold'>{tokenCount}</span> Token Left
                </h2>
                <div className=''>
                    <h2>Need more token?</h2>
                    <p>Upgrade your plan below</p>
                </div>
            </div>
            <PricingModel />
        </div>
    )
}

export default Pricing;

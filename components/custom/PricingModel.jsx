import React, { useContext, useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Lookup from '@/data/Lookup';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

function PricingModel() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [selectedOption, setSelectedOption] = useState(null);
  const UpdateToken = useMutation(api.users.UpdateToken);

  const onPaymentSuccess = async (pricing) => {
    const currentTokens = userDetail?.token || 0; // Ensure `token` is always a number
    const newTokenCount = currentTokens + Number(pricing.tokens); // Use `pricing.tokens` directly

    console.log("Updated Token Count:", newTokenCount);
    
    await UpdateToken({
      token: newTokenCount,
      userId: userDetail?._id
    });

    // Optionally, update user context state if needed
    setUserDetail(prev => ({ ...prev, token: newTokenCount }));
  };

  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "" }}>
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {Lookup.PRICING_OPTIONS.map((pricing, index) => (
          <div key={index} className="border p-4 rounded-xl flex flex-col gap-3">
            <h2 className="font-bold text-2xl">{pricing.name}</h2>
            <h2 className="font-medium text-lg">{pricing.tokens} Tokens</h2>
            <p className="text-gray-400">{pricing.desc}</p>
            <h2 className="font-bold text-2xl text-center mt-6">
              ₹{pricing.price} <span className="font-medium text-1xl">/month</span>
            </h2>
            <PayPalButtons
              style={{ layout: "horizontal" }}
              disabled={!userDetail}
              // onApprove={() => onPaymentSuccess(pricing)}
              // onCancel={() => console.log("Payment Canceled")}
              // createOrder={(data, actions) => {
              //   return actions.order.create({
              //     purchase_units: [
              //       {
              //         amount: {
              //           value: pricing.price.toString(),
              //           currency_code: 'INR',
              //         },
              //       },
              //     ],
              //   });
              // }}
            />
          </div>
        ))}
      </div>
    </PayPalScriptProvider>
  );
}

export default PricingModel;

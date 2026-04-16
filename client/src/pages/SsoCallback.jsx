import React from "react";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";

const SsoCallbackComponent = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Authenticating via Google...</p>
      </div>
      <AuthenticateWithRedirectCallback 
        signInForceRedirectUrl="/"
        signUpForceRedirectUrl="/" 
      />
    </div>
  );
};

export default SsoCallbackComponent;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '../../components/Common/Button';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F9F7F7] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white border border-[#DBE2EF] rounded-2xl p-8 shadow-lg space-y-6 relative overflow-hidden">
        {/* Top visual accents */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 to-amber-500" />
        
        <div className="w-20 h-20 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto shadow-sm animate-pulse">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-extrabold text-3xl text-[#112D4E]">
            403 - Access Denied
          </h1>
          <p className="text-sm text-[#3F72AF] uppercase tracking-wider font-semibold">
            Restricted System Directory
          </p>
        </div>

        <p className="text-sm text-gray-500 font-light leading-relaxed">
          You do not have the required permissions or role validation to access this administrative module. If you believe this is in error, please contact the system administrator.
        </p>

        <hr className="border-[#DBE2EF]" />

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            variant="secondary" 
            onClick={() => navigate(-1)} 
            className="w-full sm:w-auto gap-2 py-2.5 px-4 justify-center"
          >
            <ArrowLeft className="w-4 h-4 text-[#3F72AF]" />
            <span>Go Back</span>
          </Button>
          <Button 
            variant="primary" 
            onClick={() => navigate('/')} 
            className="w-full sm:w-auto gap-2 py-2.5 px-4 justify-center"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

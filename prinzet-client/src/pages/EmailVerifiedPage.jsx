import React from 'react';
import { Link } from 'react-router-dom';
import {greenChecked} from '@/assets';

const EmailVerifiedPage = () => {
    return (
        <div className="bg-gradient-to-tr from-blue-400 to-rose-300 flex items-center justify-center h-screen text-center px-4">
            <div className="bg-white py-12 px-6 sm:px-8 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] 
                            w-11/12 sm:w-4/5 md:w-3/5 lg:w-1/2 xl:w-[50%] max-w-3xl mx-auto">
                <h1 className="xl:text-4xl font-bold text-green-600 sm:text-3xl text-xl flex justify-center items-center gap-2">
                    <img src={greenChecked} className="w-6 sm:w-11" alt="Verified" />
                    Email Verified!
                </h1>
                <p className="mt-4 text-lg font-bold">
                    Your account has been successfully verified. You can now log in.
                </p>
                <Link to="/login">
                    <button className="bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2 rounded mt-4">
                        Log In
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default EmailVerifiedPage;

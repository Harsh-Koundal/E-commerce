import React from 'react';
import { Link } from 'react-router-dom';
import {crossIcon} from '@/assets';

const EmailVerificationFailedPage = () => {
    return (
        <div className="bg-gradient-to-tr from-blue-400 to-rose-300 flex items-center justify-center h-screen text-center px-4">
            <div className="bg-white w-11/12 sm:w-4/5 md:w-3/5 lg:w-1/2 max-w-xl p-6 sm:p-10 md:p-16 rounded-lg shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex flex-col items-center">
                <div className="flex items-center justify-center gap-1 mb-4">
                    <img src={crossIcon} alt="Verification Failed" className="w-5 sm:w-10" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-red-600">Verification Failed</h1>
                </div>
                <p className="text-base sm:text-lg text-gray-700">
                    The email verification link is invalid or has expired.
                </p>
                <p className="text-sm sm:text-md text-gray-600 mt-2">
                    Please try signing up again or request a new verification email.
                </p>
                <Link to="/signup" className="mt-6">
                    <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow-md transition duration-200">
                        Back to Signup
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default EmailVerificationFailedPage;
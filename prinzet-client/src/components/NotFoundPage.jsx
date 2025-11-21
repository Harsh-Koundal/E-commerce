import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <p className="text-xl text-gray-700 mt-4">Oops! Page not found.</p>
        <p className="text-lg text-gray-500 mt-2">
          Sorry, the page you're looking for does not exist.
        </p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700"
        >
          Go back to Home
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;

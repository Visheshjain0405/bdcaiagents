import React from 'react';

const UnauthorizedPage = () => {
  return (
    <div className="text-center mt-20">
      <h1 className="text-3xl font-bold text-red-600">Unauthorized</h1>
      <p className="text-gray-600 mt-4">
        You don't have permission to access this page.
      </p>
    </div>
  );
};

export default UnauthorizedPage;

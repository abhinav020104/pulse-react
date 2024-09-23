import React from 'react';

export const PrimaryButton = ({ children, onClick }) => {
  return (
    <button
      type="button"
      className="text-center font-semibold rounded-lg focus:ring-blue-200 focus:outline-none hover:opacity-90 disabled:opacity-80 disabled:hover:opacity-80 relative overflow-hidden h-[32px] text-sm px-3 py-1.5 mr-4"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-blue-500 z-0" />
      <div className="flex flex-row items-center justify-center gap-4 z-10 relative">
        <p className="text-white">{children}</p>
      </div>
    </button>
  );
};


export const SuccessButton = ({ children, onClick }) => {
  return (
    <button
      type="button"
      className="text-center font-semibold rounded-lg focus:ring-green-200 focus:outline-none hover:opacity-90 disabled:opacity-80 disabled:hover:opacity-80 relative overflow-hidden h-[32px] text-sm px-3 py-1.5 mr-4"
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-green-500 z-0" />
      <div className="flex flex-row items-center justify-center gap-4 z-10 relative">
        <p className="text-black">{children}</p>
      </div>
    </button>
  );
};

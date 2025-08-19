import React from 'react';

const MobileFilterButton = ({ onClick, filterCount = 0, isActive = false }) => {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full shadow-lg border transition-all duration-300 hover:scale-105 active:scale-95 ${
        isActive
          ? 'bg-purple-600 text-white border-purple-600 shadow-purple-600/30'
          : 'bg-white text-gray-700 border-gray-200 shadow-gray-900/10 hover:bg-gray-50 hover:shadow-gray-900/20'
      }`}
    >
      {/* Filter Icon */}
      <div className="relative">
        <svg
          className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-600'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z"
          />
        </svg>
        
        {/* Filter Count Badge */}
        {filterCount > 0 && (
          <div
            className={`absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center transition-all duration-300 ${
              isActive
                ? 'bg-white text-purple-600'
                : 'bg-purple-600 text-white'
            }`}
          >
            {filterCount}
          </div>
        )}
      </div>
    </button>
  );
};

export default MobileFilterButton;

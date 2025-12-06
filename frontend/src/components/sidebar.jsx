import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 bg-white h-screen border-r flex flex-col hidden md:flex">
      <div className="p-6 border-b flex items-center gap-3">
        <div className="bg-black text-white p-1 rounded w-8 h-8 flex items-center justify-center font-bold">Tru</div>
        <div>
           <h1 className="font-bold text-gray-800">TruEstate</h1>
           <span className="text-xs text-gray-500 block">Dashboard</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 text-sm text-gray-600">
        <div className="p-2 hover:bg-gray-50 rounded cursor-pointer flex items-center gap-3 font-semibold text-gray-900 bg-gray-50">
            Dashboard
        </div>
        <div className="mt-6 mb-2 uppercase text-xs font-bold text-gray-400 px-2">Services</div>
        <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">Archived</div>
        <div className="p-2 hover:bg-gray-50 rounded cursor-pointer bg-blue-50 text-blue-600 font-semibold border-r-2 border-blue-600">Active</div>
        <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">Blocked</div>
        <div className="p-2 hover:bg-gray-50 rounded cursor-pointer">Closed</div>
      </nav>
    </div>
  );
};

export default Sidebar;
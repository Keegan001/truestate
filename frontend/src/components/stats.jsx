import React from 'react';

const Card = ({ label, value, subtext }) => (
  <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex-1 min-w-[220px]">
    <div className="flex justify-between items-start mb-2">
        <div className="text-gray-500 text-xs font-bold uppercase tracking-wide">
        {label}
        </div>
        <div className="text-gray-300 text-xs border rounded-full w-4 h-4 flex items-center justify-center font-serif">i</div>
    </div>
    <div className="text-2xl font-bold text-gray-900 mb-1">
      {value}
    </div>
    {subtext && <div className="text-xs text-gray-500 font-medium">{subtext}</div>}
  </div>
);

const StatsCards = ({ stats }) => {
  if (!stats) return null;
  return (
    <div className="flex flex-wrap gap-6 mb-8">
      <Card label="Total Units Sold" value={stats.units?.toLocaleString()} subtext="Calculated from filtered results" />
      <Card label="Total Amount" value={`Rs ${stats.amount?.toLocaleString()}`} subtext="Total Revenue" />
      <Card label="Total Discount" value={`Rs ${stats.discount?.toLocaleString()}`} subtext="Total Discount Given" />
    </div>
  );
};

export default StatsCards;
import React, { useState } from 'react';

// SVG Icon for Chevron Down
const ChevronDown = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

const FilterDropdown = ({ label, active, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative inline-block">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1.5 text-sm border rounded flex items-center gap-2 hover:bg-gray-50 transition-colors ${active ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 bg-white'}`}
      >
        {label}
        <ChevronDown />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-1 left-0 bg-white border shadow-xl rounded-lg p-3 w-64 z-20">
            {children}
          </div>
        </>
      )}
    </div>
  );
};

const FilterBar = ({ filters, setFilters, clearFilters }) => {
  const toggleFilter = (key, value) => {
    const current = filters[key] ? filters[key].split(',') : [];
    const updated = current.includes(value) 
      ? current.filter(item => item !== value)
      : [...current, value];
    setFilters(prev => ({ ...prev, [key]: updated.join(',') }));
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-wrap gap-2 items-center mb-6">
      <button onClick={clearFilters} className="px-3 py-1 text-sm text-red-500 hover:bg-red-50 rounded border border-transparent hover:border-red-100 transition-colors">
        Reset
      </button>

      {/* Region */}
      <FilterDropdown label="Region" active={filters.regions}>
        {['North', 'South', 'East', 'West'].map(r => (
          <label key={r} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded text-sm cursor-pointer">
            <input type="checkbox" checked={filters.regions?.split(',').includes(r)} onChange={() => toggleFilter('regions', r)} className="rounded text-blue-600"/>
            {r}
          </label>
        ))}
      </FilterDropdown>

      {/* Gender */}
      <FilterDropdown label="Gender" active={filters.genders}>
        {['Male', 'Female'].map(g => (
          <label key={g} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded text-sm cursor-pointer">
            <input type="checkbox" checked={filters.genders?.split(',').includes(g)} onChange={() => toggleFilter('genders', g)} className="rounded text-blue-600"/>
            {g}
          </label>
        ))}
      </FilterDropdown>

      {/* Age Range (NEW) */}
      <FilterDropdown label="Age Range" active={filters.minAge || filters.maxAge}>
         <div className="flex gap-2 p-1">
            <div>
                <span className="text-xs text-gray-500 font-bold uppercase block mb-1">Min Age</span>
                <input type="number" name="minAge" className="border p-1 text-sm rounded w-full" value={filters.minAge} onChange={handleInput} />
            </div>
            <div>
                <span className="text-xs text-gray-500 font-bold uppercase block mb-1">Max Age</span>
                <input type="number" name="maxAge" className="border p-1 text-sm rounded w-full" value={filters.maxAge} onChange={handleInput} />
            </div>
          </div>
      </FilterDropdown>

      {/* Product Category */}
      <FilterDropdown label="Category" active={filters.categories}>
        {['Electronics', 'Clothing', 'Beauty', 'Home', 'Books'].map(c => (
          <label key={c} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded text-sm cursor-pointer">
            <input type="checkbox" checked={filters.categories?.split(',').includes(c)} onChange={() => toggleFilter('categories', c)} className="rounded text-blue-600"/>
            {c}
          </label>
        ))}
      </FilterDropdown>

      {/* Tags (NEW) */}
      <FilterDropdown label="Tags" active={filters.tags}>
        <div className="p-1">
            <span className="text-xs text-gray-500 font-bold uppercase block mb-1">Search Tags</span>
            <input 
              type="text" 
              name="tags" 
              placeholder="e.g. sale, new" 
              className="border p-1 text-sm rounded w-full" 
              value={filters.tags} 
              onChange={handleInput} 
            />
            <p className="text-[10px] text-gray-400 mt-1">Separate with commas</p>
        </div>
      </FilterDropdown>

      {/* Payment Method (NEW) */}
      <FilterDropdown label="Payment" active={filters.paymentMethods}>
        {['Credit Card', 'PayPal', 'Debit Card', 'Cash'].map(p => (
          <label key={p} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded text-sm cursor-pointer">
            <input type="checkbox" checked={filters.paymentMethods?.split(',').includes(p)} onChange={() => toggleFilter('paymentMethods', p)} className="rounded text-blue-600"/>
            {p}
          </label>
        ))}
      </FilterDropdown>

       {/* Date Range */}
       <FilterDropdown label="Date" active={filters.startDate}>
          <div className="flex flex-col gap-2 p-1">
            <span className="text-xs text-gray-500 font-bold uppercase">Start Date</span>
            <input type="date" name="startDate" className="border p-1 text-sm rounded w-full" value={filters.startDate} onChange={handleInput} />
            <span className="text-xs text-gray-500 font-bold uppercase mt-2">End Date</span>
            <input type="date" name="endDate" className="border p-1 text-sm rounded w-full" value={filters.endDate} onChange={handleInput} />
          </div>
      </FilterDropdown>
    </div>
  );
};

export default FilterBar;
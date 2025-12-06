import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDebounce } from './hooks/debounce';
import Sidebar from './components/sidebar';
import FilterBar from './components/filter';
import StatsCards from './components/stats';
import TransactionTable from './components/transactionTable';

function App() {
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);

  // Initialize all filter states
  const [filters, setFilters] = useState({
    regions: '',
    genders: '',
    categories: '',
    paymentMethods: '',
    tags: '',
    minAge: '',
    maxAge: '',
    startDate: '',
    endDate: ''
  });
  
  const [sortBy, setSortBy] = useState('customerName');

  useEffect(() => {
    const fetchSales = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:5000/api/sales', {
          params: { page, limit: 10, search: debouncedSearch, sortBy, ...filters }
        });
        setSales(res.data.data);
        setTotalPages(res.data.pagination.pages);
        setStats(res.data.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, [debouncedSearch, filters, sortBy, page]);

  return (
    <div className="flex h-screen bg-white font-sans text-gray-800 overflow-hidden">
      
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
        
        {/* Header */}
        <header className="bg-white p-6 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">Sales Management System</h2>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Name, Phone no." 
              className="bg-gray-100 border-none rounded-lg py-2.5 px-4 pl-4 text-sm w-72 focus:ring-2 focus:ring-gray-200 outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-white">
          
          <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4 mb-2">
            <FilterBar 
               filters={filters} 
               setFilters={(f) => { setFilters(f); setPage(1); }} 
               clearFilters={() => setFilters({ 
                 regions: '', genders: '', categories: '', 
                 paymentMethods: '', tags: '', minAge: '', maxAge: '',
                 startDate: '', endDate: '' 
               })}
            />
            
            <div className="flex items-center gap-2 mb-6 xl:mb-0">
               <span className="text-sm text-gray-500">Sort by:</span>
               <div className="relative">
                 <select 
                   value={sortBy} 
                   onChange={(e) => setSortBy(e.target.value)}
                   className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-3 pr-8 rounded text-sm font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500"
                 >
                   <option value="customerName">Customer Name (A-Z)</option>
                   <option value="date">Date (Newest)</option>
                   <option value="amount">Amount (Highest)</option>
                 </select>
               </div>
            </div>
          </div>

          <StatsCards stats={stats} />

          <TransactionTable sales={sales} loading={loading} />

          {/* Pagination */}
          <div className="mt-6 flex justify-end gap-2">
            <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border rounded text-sm disabled:opacity-30"
            >
                Prev
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, i) => {
              let pNum = i + 1;
              if (page > 3) pNum = page - 2 + i;
              if (pNum > totalPages) return null;

              return (
              <button 
                key={pNum}
                onClick={() => setPage(pNum)}
                className={`w-8 h-8 rounded text-sm font-bold transition-colors ${page === pNum ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {pNum}
              </button>
            )})}
             <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 border rounded text-sm disabled:opacity-30"
            >
                Next
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}

export default App;
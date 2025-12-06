import React from 'react';

const TransactionTable = ({ sales, loading }) => {
  if (loading) return <div className="p-20 text-center text-gray-500">Loading data...</div>;
  if (!sales || sales.length === 0) return <div className="p-20 text-center text-gray-500">No records found.</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
      <table className="min-w-full text-left">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Transaction ID</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer ID</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Customer Name</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Phone Number</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Gender</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Age</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product Category</th>
            <th className="p-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Quantity</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sales.map((sale) => (
            <tr key={sale._id} className="hover:bg-gray-50 transition-colors">
              <td className="p-4 text-sm text-gray-500 font-mono">#{sale._id.slice(-6)}</td>
              <td className="p-4 text-sm text-gray-600">{new Date(sale.date).toISOString().split('T')[0]}</td>
              <td className="p-4 text-sm text-gray-900 font-medium">{sale.customerId || 'CUST-001'}</td>
              <td className="p-4 text-sm text-gray-900 font-bold">{sale.customerName}</td>
              <td className="p-4 text-sm text-gray-600 flex items-center gap-1">
                {sale.phoneNumber}
              </td>
              <td className="p-4 text-sm text-gray-600">{sale.gender}</td>
              <td className="p-4 text-sm text-gray-600">{sale.age}</td>
              <td className="p-4">
                 <span className="font-semibold text-sm text-gray-800">{sale.productCategory}</span>
              </td>
              <td className="p-4 text-sm font-bold text-gray-900">{sale.quantity?.toString().padStart(2, '0')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
# TruEstate Retail Sales Management System

Live Deployment[(https://truestate-one.vercel.app/)]

## 1. Overview
A high-performance Retail Sales Dashboard designed to handle large datasets (1M+ records). It features advanced multi-select filtering, fuzzy search, real-time aggregation stats, and efficient server-side pagination. The system is optimized for speed using compound database indexing, server-side caching, and Gzip compression.

## 2. Tech Stack
- **Frontend:** React.js (Vite), Tailwind CSS, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Performance:** node-cache, compression (Gzip)
- **Deployment:** Vercel (Frontend), Render (Backend)

## 3. Search Implementation Summary
Search utilizes a tokenized approach where the input string is split by spaces. A regex-based `$or` condition is applied across `customerName`, `phoneNumber`, and `email` fields. This allows for flexible queries (e.g., "John 987") to match specific records. Client-side debouncing (500ms) prevents API flooding.

## 4. Filter Implementation Summary
The system supports 7 distinct filter types, including Multi-Select (Region, Gender, Category, Payment, Tags) and Range-Based (Date, Age). Filters are processed conjunctively (AND logic) on the backend using MongoDB `$in`, `$gte`, and `$lte` operators. State is managed centrally in React to ensure filters persist across pagination.

## 5. Sorting Implementation Summary
Sorting is dynamic and intelligent. While the default sort is by Date (Newest), the system automatically adjusts sort direction based on the field type:
- **Ascending (A-Z):** Customer Name
- **Descending (High-Low):** Date, Total Amount, Quantity
This logic is enforced in the backend controller to ensure consistent UX.

## 6. Pagination Implementation Summary
To handle 1 million records efficiently, pagination is implemented server-side. The backend accepts `page` and `limit` parameters to calculate database `skip` logic. The frontend UI includes "Next/Previous" controls and retains all active filter/search states when navigating between pages.

## 7. Setup Instructions
1. **Clone the Repository**
   ```bash
   git clone https://github.com/Keegan001/truestate.git
   cd truestate-assignment
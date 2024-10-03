import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './dashboard';
import { format, startOfMonth, endOfMonth } from 'date-fns'; // For date manipulation
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported
import 'font-awesome/css/font-awesome.min.css'; // Ensure Font Awesome is imported

// Register necessary ChartJS components for Bar chart
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const Dashboard = () => {
  // State variables
  const [totalSales, setTotalSales] = useState(0);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalShipedOrders, setTotalShipedOrders] = useState(0);
  const [dailySalesData, setDailySalesData] = useState([]);

  // Fetch daily sales totals
  const fetchDailySalesTotals = async () => {
    try {
      const response = await axios.get('https://inventory-server-eight.vercel.app/sale');
      const completedSales = (response.data || []).filter(order => order.saleStatus === 'completed');
      
      // Group sales by date
      const salesByDate = {};
      completedSales.forEach(order => {
        const date = format(new Date(order.createdAt), 'yyyy-MM-dd'); // Format to YYYY-MM-DD
        salesByDate[date] = (salesByDate[date] || 0) + order.totalAmount;
      });
      
      setDailySalesData(salesByDate);
    } catch (err) {
      setError('Failed to fetch daily sales totals');
    }
  };

  // Fetch total sales, customers, items, and orders
  const fetchTotalSales = async () => {
    try {
      const response = await axios.get('https://inventory-server-eight.vercel.app/sale'); // Fetch all sales
      const completedSales = (response.data || []).filter(
        (order) => order.saleStatus === 'completed' && isDateInCurrentMonth(order.createdAt)
      );
      setTotalSales(completedSales.length); // Set the total number of completed sales for this month
    } catch (err) {
      setError('Failed to fetch total sales');
    }
  };

  const fetchTotalCustomers = async () => {
    try {
      const response = await axios.get('https://inventory-server-eight.vercel.app/customer');
      setTotalCustomers(response.data.length); // Set the total number of customers
    } catch (err) {
      setError('Failed to fetch total customers');
    }
  };

  const fetchTotalItems = async () => {
    try {
      const response = await axios.get('https://inventory-server-eight.vercel.app/inventory');
      setTotalItems(response.data.data.length); // Set the total number of items
    } catch (err) {
      setError('Failed to fetch total items');
    }
  };

  const FetchtoBeShiftOrders = async () => {
    try {
      const response = await axios.get('https://inventory-server-eight.vercel.app/sale');
      const toBeShiftOrders = (response.data || []).filter(order => order.saleStatus === 'To be Shift');
      setTotalOrders(toBeShiftOrders.length); // Set the total number of "To be Shift" orders
    } catch (err) {
      setError('Failed to fetch "To be Shift" orders');
    }
  };

  const FetchShipedOrders = async () => {
    try {
      const response = await axios.get('https://inventory-server-eight.vercel.app/sale');
      const shipedOrders = (response.data || []).filter(order => order.saleStatus === 'Shiped');
      setTotalShipedOrders(shipedOrders.length); // Set the total number of shiped orders
    } catch (err) {
      setError('Failed to fetch "Shiped" orders');
    }
  };

  // Get current month's start and end date
  const startDate = startOfMonth(new Date()); // First day of the current month
  const endDate = endOfMonth(new Date()); // Last day of the current month

  // Helper function to check if a date is within the current month
  const isDateInCurrentMonth = (dateString) => {
    const date = new Date(dateString);
    return date >= startDate && date <= endDate;
  };

  // useEffect hooks to fetch data on component mount
  useEffect(() => {
    fetchDailySalesTotals();
  }, []);

  useEffect(() => {
    fetchTotalSales();
    fetchTotalCustomers();
    fetchTotalItems();
    FetchtoBeShiftOrders();
    FetchShipedOrders();
  }, []);

  // Prepare data for the Bar chart
  const barChartData = {
    labels: Object.keys(dailySalesData), // Dates as labels
    datasets: [
      {
        label: 'Daily Sales Total',
        data: Object.values(dailySalesData), // Sales totals as data points
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Semi-transparent blue
        borderColor: 'rgba(54, 162, 235, 1)', // Solid blue border
        borderWidth: 1,
      },
    ],
  };

  // Bar chart options for better aesthetics
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#333', // Legend text color
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#555', // X-axis labels color
        },
        grid: {
          display: false, // Hide X-axis grid lines
        },
      },
      y: {
        ticks: {
          color: '#555', // Y-axis labels color
          beginAtZero: true,
        },
        grid: {
          color: '#eee', // Y-axis grid lines color
        },
      },
    },
  };

  return (
    <Sidebar>
      <div className="container mt-4">
        <div className="row">
          {/* To Be Shift Orders Card */}
          <div className="col-md-3 mb-4">
            <div className="card h-100 text-center bg-warning text-dark shadow">
              <div className="card-body">
                <i className="fas fa-box-open fa-2x mb-2"></i>
                <h3>{totalOrders}</h3>
                <h5>To Be Shift Orders</h5>
              </div>
            </div>
          </div>

          {/* Completed Orders Card */}
          <div className="col-md-3 mb-4">
            <div className="card h-100 text-center bg-success text-white shadow">
              <div className="card-body">
                <i className="fas fa-shopping-cart fa-2x mb-2"></i>
                <h3>{totalSales}</h3>
                <h5>Completed Orders</h5>
              </div>
            </div>
          </div>

          {/* Shiped Orders Card */}
          <div className="col-md-3 mb-4">
            <div className="card h-100 text-center bg-info text-white shadow">
              <div className="card-body">
                <i className="fas fa-truck fa-2x mb-2"></i>
                <h3>{totalShipedOrders}</h3>
                <h5>Shiped Orders</h5>
              </div>
            </div>
          </div>

          {/* Total Customers Card */}
          <div className="col-md-3 mb-4">
            <div className="card h-100 text-center bg-primary text-white shadow">
              <div className="card-body">
                <i className="fas fa-users fa-2x mb-2"></i>
                <h3>{totalCustomers}</h3>
                <h5>Total Customers</h5>
              </div>
            </div>
          </div>

          {/* Total Items Card */}
          <div className="col-md-3 mb-4">
            <div className="card h-100 text-center bg-danger text-white shadow">
              <div className="card-body">
                <i className="fas fa-box fa-2x mb-2"></i>
                <h3>{totalItems}</h3>
                <h5>Total Items</h5>
              </div>
            </div>
          </div>
        </div>

        {/* Display error message if any */}
        {error && <p className="text-danger">{error}</p>}
      </div>

      {/* Daily Sales Totals */}
      <div className="container mt-5">
        <div className="row">
          {/* Bar Chart for Daily Sales Totals */}
          <div className="col-md-8 mb-6 mx-auto"> {/* Center card in the middle */}
            <div className="card shadow">
              <div className="card-body">
                <h5 className="card-title text-center mb-4">Daily Sales </h5>
                {Object.keys(dailySalesData).length > 0 ? (
                  <Bar data={barChartData} options={barChartOptions} />
                ) : (
                  <p className="text-center">No sales data available for this period.</p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Optionally, display error again if needed */}
        {error && <p className="text-danger text-center">{error}</p>}
      </div>
    </Sidebar>
  );
};

export default Dashboard;

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(localStorage.getItem('selectedStore') || 'store1');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleStoreChange = async (e) => {
    const store = e.target.value;
    setSelectedStore(store);
    localStorage.setItem('selectedStore', store);
  
    try {
      // Inform the server to switch the store
      const response = await fetch('https://inventory-server-eight.vercel.app/set-store', {  // Update the URL to point to the correct backend port
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ store }),
      });
  
      if (response.ok) {
        // Only reload the page after the server confirms the DB switch is successful
        window.location.reload();
      } else {
        console.error('Failed to switch stores on the server.');
      }
    } catch (error) {
      console.error('Error switching store:', error);
    }
  };
  

  useEffect(() => {
    // Check if store is saved in localStorage and apply that
    const savedStore = localStorage.getItem('selectedStore');
    if (savedStore) {
      setSelectedStore(savedStore);
    }
  }, []);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <nav
        className={`bg-primary ${isOpen ? 'd-block' : 'd-none d-lg-block'} p-3`}
        style={{ minHeight: '100vh', minWidth: '250px' }}
      >
        <ul className="mb-3">
          <label className="text-white">Select Store:</label>
          <select className="form-select" value={selectedStore} onChange={handleStoreChange}>
            <option value="store1">Store 1</option>
            <option value="store2">Store 2</option>
          </select>
        </ul>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link text-white d-flex align-items-center" href="/content" style={{ borderBottom: '1px solid black' }}>
              <i className="fas fa-tachometer-alt me-2"></i> Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white d-flex align-items-center" href="/inventory" style={{ borderBottom: '1px solid black' }}>
              <i className="fas fa-boxes me-2"></i> Inventory
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white d-flex align-items-center" href="/suplier" style={{ borderBottom: '1px solid black' }}>
              <i className="fas fa-truck me-2"></i> Suppliers
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white d-flex align-items-center" href="/expense" style={{ borderBottom: '1px solid black' }}>
              <i className="fas fa-receipt me-2"></i> Expenses
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white d-flex align-items-center" href="/customer" style={{ borderBottom: '1px solid black' }}>
              <i className="fas fa-users me-2"></i> Customer
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white d-flex align-items-center" href="/sales" style={{ borderBottom: '1px solid black' }}>
              <i className="fas fa-dollar-sign me-2"></i> Sales
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white d-flex align-items-center" href="/shipping" style={{ borderBottom: '1px solid black' }}>
              <i className="fas fa-shipping-fast me-2"></i> Pending
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white d-flex align-items-center" href="/shifted" style={{ borderBottom: '1px solid black' }}>
              <i className="fas fa-check-circle me-2"></i> Shipped
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white d-flex align-items-center" href="/report" style={{ borderBottom: '1px solid black' }}>
              <i className="fas fa-chart-bar me-2"></i> Report
            </a>
          </li>
        </ul>
      </nav>

      {/* Page Content */}
      <div className="flex-grow-1">
        <nav className="navbar navbar-light bg-light">
          <button className="btn btn-primary d-lg-none" type="button" onClick={toggleSidebar}>
            <i className="fas fa-bars"></i> Menu
          </button>
        </nav>
        <div className="container mt-4">
          {/* Injected Page Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

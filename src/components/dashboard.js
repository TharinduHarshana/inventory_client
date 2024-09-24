import React, { useState } from 'react';

const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <nav className={`bg-primary ${isOpen ? 'd-block' : 'd-none d-lg-block'} p-3`} style={{ minHeight: '100vh', minWidth: '250px' }}>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link text-white" href="#">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="/inventory">Inventory</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="/suplier">Suppliers</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="/expense">Expenses</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">Contact</a>
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

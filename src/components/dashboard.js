import React, { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <nav className={`bg-primary ${isOpen ? 'd-block' : 'd-none d-lg-block'} p-3`} style={{ minHeight: '100vh', minWidth: '250px' }}>
        <h2 className="text-white">Splash</h2>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link text-white" href="#">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">About</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">Pages</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">Portfolio</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">Contact</a>
          </li>
        </ul>
      </nav>

      {/* Page Content */}
      <div className="flex-grow-1">
        <nav className="navbar navbar-light bg-light">
          {/* Try removing d-lg-none if testing on large screens */}
          <button
            className="btn btn-primary d-lg-none"
            type="button"
            onClick={toggleSidebar}
          >
            <i className="fas fa-bars"></i> Menu
          </button>
          <h2>Sidebar #02</h2>
        </nav>

        <div className="container mt-4">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

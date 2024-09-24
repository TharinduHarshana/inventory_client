import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Sidebar from '../components/dashboard'; // Import Sidebar

const AddItemPage = () => {
    const navigate = useNavigate(); // Initialize useNavigate for navigation
    const [item, setItem] = useState({
        name: '',
        description: '',
        tag: '',
        costPrice: '',
        sellingPrice: '',
        volumeWeight: '',
        supplier: '', // This will store the selected supplier ID or name
        quantity: '',
        status: '',
        createdAt: '',
        updatedAt: ''
    }); // State to hold the new item details

    const [suppliers, setSuppliers] = useState([]); // State to hold fetched suppliers
    const [error, setError] = useState(null); // Error state

    // Handle form input changes
    const handleChange = (e) => {
        setItem({
            ...item,
            [e.target.name]: e.target.value // Update the item state when the user types
        });
    };

    // Fetch data from the backend for suppliers
    const fetchSuppliers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/suplier'); // Fetch suppliers from backend
            setSuppliers(response.data || []); // Set the suppliers data to state
        } catch (err) {
            setError('Failed to fetch suppliers'); // Show error if fetching fails
        }
    };

    useEffect(() => {
        fetchSuppliers(); // Fetch suppliers when the component loads
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://inventory-server-eight.vercel.app/inventory/add', item); // Add the new item
            navigate('/inventory'); // Navigate back to the inventory list after adding the item
        } catch (err) {
            console.error(err); // Log error in case of failure
            setError('Failed to add new item'); // Show error message to the user
        }
    };

    return (
        <Sidebar>
            <div className="container mt-5">
                <h2>Add New Item</h2>
                {error && <p className="text-danger">{error}</p>} {/* Display error if any */}
                <form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={item.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Description Field */}
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            value={item.description}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>

                    {/* Tag Field */}
                    <div className="form-group">
                        <label htmlFor="tag">Tag</label>
                        <input
                            type="text"
                            className="form-control"
                            id="tag"
                            name="tag"
                            value={item.tag}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Price Field */}
                    <div className="form-group">
                        <label htmlFor="costPrice">Cost Price</label>
                        <input
                            type="number"
                            className="form-control"
                            id="costPrice"
                            name="costPrice"
                            value={item.costPrice}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Selling Price Field */}
                    <div className="form-group">
                        <label htmlFor="sellingPrice">Selling Price</label>
                        <input
                            type="number"
                            className="form-control"
                            id="sellingPrice"
                            name="sellingPrice"
                            value={item.sellingPrice}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {/* Volume Weight Field */}
                    <div className="form-group">
                        <label htmlFor="volumeWeight">Volume Weight</label>
                        <input
                            type="text"
                            className="form-control"
                            id="volumeWeight"
                            name="volumeWeight"
                            value={item.volumeWeight}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Supplier Field as Dropdown */}
                    <div className="form-group">
                        <label htmlFor="supplier">Supplier</label>
                        <select
                            className="form-control"
                            id="supplier"
                            name="supplier"
                            value={item.supplier}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier._id} value={supplier.supplierName}>
                                    {supplier.supplierName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Quantity Field */}
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity</label>
                        <input
                            type="number"
                            className="form-control"
                            id="quantity"
                            name="quantity"
                            value={item.quantity}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Status Field */}
                    <div className="form-group">
                        <label htmlFor="status">Status</label>
                        <input
                            type="text"
                            className="form-control"
                            id="status"
                            name="status"
                            value={item.status}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Created At Date Field */}
                    <div className="form-group">
                        <label htmlFor="createdAt">Created At</label>
                        <input
                            type="date"
                            className="form-control"
                            id="createdAt"
                            name="createdAt"
                            value={item.createdAt}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Updated At Date Field */}
                    <div className="form-group">
                        <label htmlFor="updatedAt">Updated At</label>
                        <input
                            type="date"
                            className="form-control"
                            id="updatedAt"
                            name="updatedAt"
                            value={item.updatedAt}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary mt-3">
                        Add Item
                    </button>
                </form>
            </div>
        </Sidebar>
    );
};

export default AddItemPage;

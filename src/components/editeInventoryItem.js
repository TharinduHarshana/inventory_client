import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom'; // Import useParams and useNavigate
import Sidebar from '../components/dashboard'; // Import Sidebar

const EditItemPage = () => {
    const { id } = useParams(); // Get the item ID from the URL parameters
    const navigate = useNavigate(); // Initialize useNavigate for navigation
    const [item, setItem] = useState(null); // State to hold the item details
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch the item details when the component loads
    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await axios.get(`https://inventory-server-eight.vercel.app/inventory/${id}`);
                setItem(response.data.data);
                setLoading(false); // Set loading to false after fetching the data
            } catch (err) {
                setError('Failed to fetch item details'); // Handle error
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]); // The effect will run every time the `id` changes

    // Handle form input changes
    const handleChange = (e) => {
        setItem({
            ...item,
            [e.target.name]: e.target.value // Update the item state when the user types
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://inventory-server-eight.vercel.app/inventory/${id}`, item); // Update the item
            navigate('/inventory'); // Navigate back to the inventory list after updating
        } catch (err) {
            console.error(err); // Log error in case of failure
            setError('Failed to update item'); // Show error message to the user
        }
    };

    if (loading) {
        return <p>Loading item...</p>; // Show a loading message while fetching data
    }

    if (error) {
        return <p>{error}</p>; // Show an error message if there is a problem fetching data
    }

    return (
        <Sidebar>
            <div className="container mt-5">
                <h2>Edit Item</h2>
                <form onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={item.name || ''} // Default to empty if item is null
                            onChange={handleChange}
                        />
                    </div>

                    {/* Description Field */}
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            className="form-control"
                            id="description"
                            name="description"
                            value={item.description || ''} // Default to empty if item is null
                            onChange={handleChange}
                            rows="4" // Set the number of rows
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
                            value={item.tag || ''} // Default to empty if item is null
                            onChange={handleChange}
                        />
                    </div>

                    {/* Price Field */}
                    <div className="form-group">
                        <label htmlFor="price">Price</label>
                        <input
                            type="number"
                            className="form-control"
                            id="price"
                            name="price"
                            value={item.price || ''} // Default to empty if item is null
                            onChange={handleChange}
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
                            value={item.volumeWeight || ''} // Default to empty if item is null
                            onChange={handleChange}
                        />
                    </div>

                    {/* Supplier Field */}
                    <div className="form-group">
                        <label htmlFor="supplier">Supplier</label>
                        <input
                            type="text"
                            className="form-control"
                            id="supplier"
                            name="supplier"
                            value={item.supplier || ''} // Default to empty if item is null
                            onChange={handleChange}
                        />
                    </div>

                    {/* Quantity Field */}
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity</label>
                        <input
                            type="number"
                            className="form-control"
                            id="quantity"
                            name="quantity"
                            value={item.quantity || ''} // Default to empty if item is null
                            onChange={handleChange}
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
                            value={item.status || ''} // Default to empty if item is null
                            onChange={handleChange}
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
                            value={item.createdAt ? item.createdAt.split('T')[0] : ''} // Convert date to "YYYY-MM-DD"
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
                            value={item.updatedAt ? item.updatedAt.split('T')[0] : ''} // Convert date to "YYYY-MM-DD"
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3 " >
                        Save Changes
                    </button>
                   
                </form>
            </div>
        </Sidebar>
    );
};

export default EditItemPage;

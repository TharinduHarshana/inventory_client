import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './dashboard';

const AddCustomer = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [customer, setCustomer] = useState({
        cusID: '',        // Customer ID
        cusName: '',      // Customer Name
        cusEmail: '',     // Customer Email
        cusPhone1: '',    // Primary Phone
        cusPhone2: '',    // Secondary Phone (optional)
        cusAddress: {
            street: '',
            city: '',
            state: '',
            zip: ''
        }
    });
    const [error, setError] = useState(null); // State to store any error messages

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://inventory-server-gamma.vercel.app//customer/add', customer);
            navigate('/customer'); // Redirect to the customer list page
        } catch (err) {
            console.error(err);
            setError('Failed to add new customer');
        }
    };

    // Handle input changes for form fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    // Handle input changes for address fields
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ 
            ...customer, 
            cusAddress: {
                ...customer.cusAddress,
                [name]: value
            }
        });
    };

    return (
        <Sidebar>
            <div className="container mt-5">
                <h2>Add Customer</h2>
                <form onSubmit={handleSubmit}>
                    {/* Customer Name */}
                    <div className="form-group">
                        <label htmlFor="cusName">Name</label>
                        <input
                            type="text"
                            name="cusName"
                            id="cusName"
                            className="form-control"
                            value={customer.cusName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Customer Email */}
                    <div className="form-group">
                        <label htmlFor="cusEmail">Email</label>
                        <input
                            type="email"
                            name="cusEmail"
                            id="cusEmail"
                            className="form-control"
                            value={customer.cusEmail}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Customer Primary Phone */}
                    <div className="form-group">
                        <label htmlFor="cusPhone1">Primary Phone</label>
                        <input
                            type="text"
                            name="cusPhone1"
                            id="cusPhone1"
                            className="form-control"
                            value={customer.cusPhone1}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    {/* Customer Secondary Phone (optional) */}
                    <div className="form-group">
                        <label htmlFor="cusPhone2">Secondary Phone</label>
                        <input
                            type="text"
                            name="cusPhone2"
                            id="cusPhone2"
                            className="form-control"
                            value={customer.cusPhone2}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Customer Address */}
                    <div className="form-group">
                        <label>Address</label>
                        <div className="form-row">
                            <div className="col">
                                <input
                                    type="text"
                                    name="street"
                                    className="form-control"
                                    placeholder="Street"
                                    value={customer.cusAddress.street}
                                    onChange={handleAddressChange}
                                />
                            </div>
                            <div className="col">
                                <input
                                    type="text"
                                    name="city"
                                    className="form-control"
                                    placeholder="City"
                                    value={customer.cusAddress.city}
                                    onChange={handleAddressChange}
                                />
                            </div>
                            <div className="col">
                                <input
                                    type="text"
                                    name="state"
                                    className="form-control"
                                    placeholder="State"
                                    value={customer.cusAddress.state}
                                    onChange={handleAddressChange}
                                />
                            </div>
                            <div className="col">
                                <input
                                    type="text"
                                    name="zip"
                                    className="form-control"
                                    placeholder="ZIP Code"
                                    value={customer.cusAddress.zip}
                                    onChange={handleAddressChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary mt-3">
                        Add Customer
                    </button>
                    {error && <p className="text-danger mt-2">{error}</p>} {/* Display error if any */}
                </form>
            </div>
        </Sidebar>
    );
}

export default AddCustomer;

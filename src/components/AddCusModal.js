import React, { useState } from 'react';
import axios from 'axios';

const AddCustomer = ({ onClose, onCustomerAdded }) => {
    const [customer, setCustomer] = useState({
        cusName: '',
        cusEmail: '',
        cusPhone1: '',
        cusPhone2: '',
        cusAddress: {
            street: '',
            city: '',
            state: '',
            zip: ''
        }
    });
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://inventory-server-eight.vercel.app/customer/add', customer);
            onCustomerAdded(response.data);  // Notify parent with the new customer
            
        } catch (err) {
            setError('Failed to add new customer');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ ...customer, [name]: value });
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setCustomer({ 
            ...customer, 
            cusAddress: { ...customer.cusAddress, [name]: value }
        });
    };

    return (
        <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add Customer</h5>
                        <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="cusName">Name</label>
                                <input type="text" name="cusName" id="cusName" className="form-control" value={customer.cusName} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cusEmail">Email</label>
                                <input type="email" name="cusEmail" id="cusEmail" className="form-control" value={customer.cusEmail} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cusPhone1">Primary Phone</label>
                                <input type="text" name="cusPhone1" id="cusPhone1" className="form-control" value={customer.cusPhone1} onChange={handleInputChange} required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="cusPhone2">Secondary Phone</label>
                                <input type="text" name="cusPhone2" id="cusPhone2" className="form-control" value={customer.cusPhone2} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <div className="form-row">
                                    <input type="text" name="street" placeholder="Street" value={customer.cusAddress.street} onChange={handleAddressChange} className="form-control mb-2" />
                                    <input type="text" name="city" placeholder="City" value={customer.cusAddress.city} onChange={handleAddressChange} className="form-control mb-2" />
                                    <input type="text" name="state" placeholder="State" value={customer.cusAddress.state} onChange={handleAddressChange} className="form-control mb-2" />
                                    <input type="text" name="zip" placeholder="ZIP Code" value={customer.cusAddress.zip} onChange={handleAddressChange} className="form-control" />
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary mt-3">Add Customer</button>
                            {error && <p className="text-danger mt-2">{error}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCustomer;

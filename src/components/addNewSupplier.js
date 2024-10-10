import React, { useState } from 'react';
import axios from 'axios';
import Dashboard from "./dashboard";
import { useParams, useNavigate } from "react-router-dom";

const AddSupplierForm = () => {
    const [supplierName, setSupplierName] = useState('');
    const [supplierAddress, setSupplierAddress] = useState('');
    const [suplierPhone, setSuplierPhone] = useState('');
    const [supplierEmail, setSupplierEmail] = useState('');
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const newSupplier = {
            supplierName,
            supplierAddress,
            suplierPhone,
            supplierEmail
        };

        try {
            const response = await axios.post('https://inventory-server-gamma.vercel.app//suplier/add', newSupplier);
            setMessage({ type: 'success', text: response.data.message });
            navigate('/suplier');

        } catch (error) {
            setMessage({ type: 'error', text: error.response.data.message });
        }

        // Clear form
        setSupplierName('');
        setSupplierAddress('');
        setSuplierPhone('');
        setSupplierEmail('');
    };

    return (
        <Dashboard>
        <div className="container mt-5">
            <h2>Add New Supplier</h2>
            {message && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="supplierName" className="form-label">Supplier Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="supplierName"
                        value={supplierName}
                        onChange={(e) => setSupplierName(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="supplierAddress" className="form-label">Supplier Address</label>
                    <input
                        type="text"
                        className="form-control"
                        id="supplierAddress"
                        value={supplierAddress}
                        onChange={(e) => setSupplierAddress(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="suplierPhone" className="form-label">Supplier Phone</label>
                    <input
                        type="text"
                        className="form-control"
                        id="suplierPhone"
                        value={suplierPhone}
                        onChange={(e) => setSuplierPhone(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="supplierEmail" className="form-label">Supplier Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="supplierEmail"
                        value={supplierEmail}
                        onChange={(e) => setSupplierEmail(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Add Supplier</button>
            </form>
        </div>
        </Dashboard>
    );
};

export default AddSupplierForm;

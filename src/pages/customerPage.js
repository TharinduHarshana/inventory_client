import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from '../components/dashboard'; // Import Sidebar component
import { useNavigate } from 'react-router-dom';

const CustomerPage = () => {
    const [customers, setCustomers] = useState([]); // State to store customers
    const [error, setError] = useState(null); // State to store errors
    const [searchTerm, setSearchTerm] = useState(''); // State to store search term

    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch all customers from backend
    const fetchCustomers = async () => {
        try {
            const response = await axios.get('https://inventory-server-gamma.vercel.app/customer');
            setCustomers(response.data || []);
        } catch (err) {
            setError('Failed to fetch customers');
        }
    };

    useEffect(() => {
        fetchCustomers(); // Fetch customers when component loads
    }, []);

    // Delete customer with confirmation
    const deleteCustomer = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`https://inventory-server-gamma.vercel.app/customer/${id}`);
                    Swal.fire('Deleted!', 'Customer has been deleted.', 'success');
                    fetchCustomers(); // Refresh list after deletion
                } catch (err) {
                    Swal.fire('Error!', 'Failed to delete the customer.', 'error');
                }
            }
        });
    };

    // Edit customer (Navigate to edit page)
    const editCustomer = (id) => {
        navigate(`/customer/${id}`);
    };

    // Filter customers based on search term
    const filteredCustomers = customers && customers.length > 0
        ? customers.filter(customer =>
            customer.cusName && customer.cusName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    return (
        <Sidebar>
            <div className="container mt-5">
                <h2>Customer List</h2>

                {/* Search Bar */}
                <div className="d-flex justify-content-between mb-3">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                    />
                    <button className="btn btn-primary" onClick={() => navigate('/customer/add')}>
                        Add Customer
                    </button>
                </div>

                {error && <p>{error}</p>} {/* Display error if any */}
                {/* Customer Table */}
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Customer ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map((customer) => (
                            <tr key={customer._id}>
                                <td>{customer.cusID}</td>
                                <td>{customer.cusName}</td>
                                <td>{customer.cusEmail}</td>
                                <td>{customer.cusPhone1}</td>
                                <td>
                                    {customer.cusAddress
                                        ? `${customer.cusAddress.street}, ${customer.cusAddress.city}`
                                        : 'Not Available'}
                                </td>
                                <td>
                                    <button
                                        className="btn btn-warning m-1"
                                        onClick={() => editCustomer(customer._id)}
                                    >
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => deleteCustomer(customer._id)}
                                    >
                                         <i className="fas fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Sidebar>
    );
};

export default CustomerPage;

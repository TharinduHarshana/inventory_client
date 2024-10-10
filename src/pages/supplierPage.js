import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from '../components/dashboard'; // Import the Sidebar component
import { useNavigate } from 'react-router-dom';

const SupplierPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State to hold the search term

    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch data from the backend
    const fetchSuppliers = async () => {
        try {
            const response = await axios.get('https://inventory-server-gamma.vercel.app/suplier');
            setSuppliers(response.data || []);
        } catch (err) {
            setError('Failed to fetch suppliers');
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    // Delete Supplier Function with SweetAlert confirmation
    const deleteSupplier = (id) => {
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
                    await axios.delete(`https://inventory-server-gamma.vercel.app/suplier/${id}`); 
                    Swal.fire('Deleted!', 'Your supplier has been deleted.', 'success');
                    fetchSuppliers(); // Refresh the list after deletion
                } catch (err) {
                    console.error(err);
                    Swal.fire('Error!', 'Failed to delete the supplier.', 'error');
                }
            }
        });
    };

    // Edit Supplier Function (Navigates to the edit page)
    const editSupplier = (id) => {
        navigate(`/suplier/${id}`); // Navigate to the edit page
    };

    // Filter suppliers based on search term
    const filteredSuppliers = suppliers && suppliers.length > 0 
        ? suppliers.filter(supplier =>
            supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    return (
        <Sidebar>
            <div className="container mt-5">
                <h2>Supplier List</h2>

                {/* Search Bar */}
                <div className="d-flex justify-content-between mb-3">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                    />
                    <button className="btn btn-primary" onClick={() => navigate('/suplier/add')}>
                        Add Supplier
                    </button>
                </div>

                {error && <p>{error}</p>} {/* Display error if any */}

                {/* Supplier Table */}
                    <table className="table table-striped">
                        <thead className="thead-dark">
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSuppliers.map((supplier) => (
                                <tr key={supplier._id}>
                                    <td>{supplier.supplierName}</td>
                                    <td>{supplier.supplierAddress}</td>
                                    <td>{supplier.suplierPhone || "Not Available"}</td>
                                    <td>{supplier.supplierEmail}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning mr-2"
                                            onClick={() => editSupplier(supplier._id)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <span style={{ margin: "0 8px" }}></span>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => deleteSupplier(supplier._id)}
                                        >
                                            <i className="fas fa-edit"></i>
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

export default SupplierPage;

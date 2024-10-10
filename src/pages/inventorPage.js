import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import Sidebar from '../components/dashboard'; // Import the Sidebar component
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const InventoryPage = () => {
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // State to hold the search term

    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch data from the backend
    const fetchItems = async () => {
        try {
            const response = await axios.get('https://inventory-server-gamma.vercel.app//inventory');
            setItems(response.data.data);
        } catch (err) {
            setError('Failed to fetch items');
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    // Delete Item Function with SweetAlert confirmation
    const deleteItem = (id) => {
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
                    await axios.delete(`https://inventory-server-gamma.vercel.app//inventory/${id}`);
                    Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
                    fetchItems(); // Refresh the list after deletion
                } catch (err) {
                    console.error(err);
                    Swal.fire('Error!', 'Failed to delete the item.', 'error');
                }
            }
        });
    };

    // Edit Item Function (Navigates to the edit page)
    const editItem = (id) => {
        navigate(`/inventory/${id}`); // Navigate to the edit page
    };

    // Filter items based on search term
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) // Filter by name (case insensitive)
    );

    return (
        <Sidebar>
            <div className="container mt-5">
                <h2>Inventory List</h2>

                {/* Search Bar */}
                <div className="d-flex justify-content-between mb-3">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                    />
                    <button className="btn btn-primary" onClick={() => navigate('/inventory/add')}>
                        Add Item
                    </button>
                </div>

                {error && <p>{error}</p>} {/* Display error if any */}

                {/* Inventory Table */}
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Tag</th>
                            <th>Cost Price</th>
                            <th>Selling Price</th>
                            <th>Volume Weight</th>
                            <th>Supplier</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.tag}</td>
                                <td>Rs:{item.costPrice}</td>
                                <td>Rs:{item.sellingPrice}</td>
                                <td>{item.volumeWeight}</td>
                                <td>{item.supplier}</td>
                                <td>{item.quantity}</td>
                                <td>{item.status}</td>
                                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="btn btn-warning m-2"
                                        onClick={() => editItem(item.id)}
                                    >
                                        <i className="fas fa-edit"></i>
                                        
                                    </button>
                                    <button
                                        className="btn btn-danger m-2"
                                        onClick={() => deleteItem(item.id)}
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

export default InventoryPage;

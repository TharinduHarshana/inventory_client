import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import Sidebar from '../components/dashboard'; // Import the Sidebar component

const InventoryPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingItem, setEditingItem] = useState(null); // For tracking the item being edited

    // Fetch data from the backend
    const fetchItems = async () => {
        try {
            const response = await axios.get('https://inventory-server-eight.vercel.app/inventory');
            setItems(response.data.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch items');
            setLoading(false);
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
                    await axios.delete(`https://inventory-server-eight.vercel.app/inventory/${id}`);
                    Swal.fire('Deleted!', 'Your item has been deleted.', 'success');
                    fetchItems(); // Refresh the list after deletion
                } catch (err) {
                    console.error(err);
                    Swal.fire('Error!', 'Failed to delete the item.', 'error');
                }
            }
        });
    };

    // Edit Item Function (To trigger the edit form/modal)
    const editItem = (item) => {
        setEditingItem(item);
    };

    const handleEditSubmit = async (id, updatedData) => {
        try {
            await axios.put(`https://inventory-server-eight.vercel.app/inventory/${id}`, updatedData);
            setEditingItem(null); // Reset editing state
            fetchItems(); // Refresh the list after editing
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return <p>Loading items...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <Sidebar>
            <div className="container mt-5">
                <h2>Inventory List</h2>
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Tag</th>
                            <th>Price</th>
                            <th>Volume Weight</th>
                            <th>Supplier</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.tag}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>{item.volumeWeight}</td>
                                <td>{item.supplier}</td>
                                <td>{item.quantity}</td>
                                <td>{item.status}</td>
                                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="btn btn-warning mr-2"
                                        onClick={() => editItem(item)}
                                    >
                                        Edit
                                    </button>
                                    <span style={{ margin: "0 8px" }}></span>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => deleteItem(item.id)}
                                    >
                                        Delete
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

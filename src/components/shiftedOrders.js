import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from '../components/dashboard'; // Import Sidebar component
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]); // State to store orders
    const [error, setError] = useState(null); // State to store errors
    const [searchTerm, setSearchTerm] = useState(''); // State to store search term
    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch all orders from backend
    const fetchOrders = async () => {
        try {
            const response = await axios.get('https://inventory-server-eight.vercel.app/sale');
            const filteredOrders = (response.data || []).filter(order => order.saleStatus === 'Shiped');
            setOrders(filteredOrders); // Set only the filtered orders
        } catch (err) {
            setError('Failed to fetch orders');
        }
    };

    useEffect(() => {
        fetchOrders(); // Fetch orders when component loads
    }, []);

    // Delete order with confirmation
    const deleteOrder = (id) => {
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
                    await axios.delete(`https://inventory-server-eight.vercel.app/sale/${id}`);
                    Swal.fire('Deleted!', 'Order has been deleted.', 'success');
                    fetchOrders(); // Refresh list after deletion
                } catch (err) {
                    Swal.fire('Error!', 'Failed to delete the order.', 'error');
                }
            }
        });
    };

    // Update order status to "Completed"
    const completeOrder = (id) => {
        Swal.fire({
            title: 'Mark order as completed?',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Yes, complete it',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.put(`https://inventory-server-eight.vercel.app/sale/${id}`, { saleStatus: 'completed' });
                    Swal.fire('Completed!', 'Order status updated to Completed.', 'success');
                    fetchOrders(); // Refresh list after status update
                } catch (err) {
                    Swal.fire('Error!', 'Failed to complete the order.', 'error');
                }
            }
        });
    };

    // View tracking number (Navigate to tracking details page or show tracking)
    const viewTrackingNumber = (order) => {
        Swal.fire({
            title: 'Tracking Information',
            text: `Tracking Number: ${order.trackingNumber || 'N/A'}`,
            icon: 'info',
            confirmButtonText: 'OK'
        });
    };

    const filteredOrders = orders && orders.length > 0
        ? orders.filter(order =>
            order.customers[0]?.cusName && order.customers[0].cusName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    return (
        <Sidebar>
            <div className="container mt-5">
                <h2>Orders List</h2>

                {/* Search Bar */}
                <div className="d-flex justify-content-between mb-3">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Search by customer name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                    />
                </div>

                {error && <p>{error}</p>} {/* Display error if any */}
                {/* Orders Table */}
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Customer Details</th>
                            <th>Item Details</th>
                            <th>Total Amount</th>
                            <th>Sale Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order._id}>
                                <td>
                                    <strong>Name:</strong> {order.customers[0]?.cusName} <br />
                                    <strong>Email:</strong> {order.customers[0]?.cusEmail} <br />
                                    <strong>Phone 1:</strong> {order.customers[0]?.cusPhone1} <br />
                                    <strong>Phone 2:</strong> {order.customers[0]?.cusPhone2 || 'N/A'} <br />
                                    <strong>Address:</strong> 
                                    {order.customers[0]?.cusAddress
                                        ? `${order.customers[0]?.cusAddress.street}, ${order.customers[0]?.cusAddress.city}`
                                        : 'Not Available'}
                                </td>
                                <td>
                                    {order.items.map((item, index) => (
                                        <div key={index}>
                                            <strong>Item Name:</strong> {item.name} <br />
                                            <strong>Quantity:</strong> {item.quantity} <br />
                                            <strong>Price:</strong> ${item.sellingPrice} <br />
                                            <strong>Discount:</strong> {item.discount || '0'}% <br />
                                            <strong>Total:</strong> ${item.total} <br />
                                            <hr />
                                        </div>
                                    ))}
                                </td>
                                
                                <td>{order.totalAmount}</td>
                                <td>
                                    {order.saleStatus} <br />
                                    {new Date(order.updatedAt).toLocaleDateString()}
                                </td>

                                <td>
                                    <button
                                        className="btn btn-success m-1"
                                        onClick={() => completeOrder(order._id)}
                                    >
                                        Complete Order
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => deleteOrder(order._id)}
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

export default OrdersPage;

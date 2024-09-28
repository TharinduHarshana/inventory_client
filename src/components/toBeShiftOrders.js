import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from './dashboard'; // Import Sidebar component
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]); // State to store orders
    const [error, setError] = useState(null); // State to store errors
    const [searchTerm, setSearchTerm] = useState(''); // State to store search term
    const printRef = useRef(null); // Ref for printable area

    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch all orders from backend
    const fetchOrders = async () => {
        try {
            const response = await axios.get('https://inventory-server-eight.vercel.app/sale');
            // Filter orders with status "To be Shift"
            const filteredOrders = (response.data || []).filter(order => order.saleStatus === 'To be Shift');
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

    // View tracking number (Navigate to tracking details page or show tracking)
    const viewTrackingNumber = (order) => {
        Swal.fire({
            title: 'Tracking Information',
            text: `Tracking Number: ${order.trackingNumber || 'N/A'}`,
            icon: 'info',
            confirmButtonText: 'OK'
        });
    };

    // Handle entering tracking number and updating status
    const enterTrackingNumber = (order) => {
        Swal.fire({
            title: 'Enter Tracking Number',
            input: 'text',
            inputPlaceholder: 'Enter tracking number',
            showCancelButton: true,
            confirmButtonText: 'Submit',
            preConfirm: (trackingNumber) => {
                if (!trackingNumber) {
                    Swal.showValidationMessage('You need to enter a tracking number');
                }
                return trackingNumber;
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const trackingNumber = result.value;

                try {
                    // Update the order status to "Shifted" and set the tracking number
                    await axios.put(`https://inventory-server-eight.vercel.app/sale/${order._id}`, {
                        trackingNumber,
                        saleStatus: 'Shifted'
                    });

                    Swal.fire('Success!', 'Order status updated to Shifted.', 'success');
                    fetchOrders(); // Refresh the orders after updating
                } catch (err) {
                    Swal.fire('Error!', 'Failed to update order status.', 'error');
                }
            }
        });
    };

    // Handle printing of "To be Shift" orders customer details
    const printAddresses = () => {
        const printContent = printRef.current.innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Print</title></head><body>');
        printWindow.document.write(printContent);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };

    // Filter orders based on search term
    const filteredOrders = orders && orders.length > 0
        ? orders.filter(order =>
            order.customers[0]?.cusName && order.customers[0].cusName.toLowerCase().includes(searchTerm.toLowerCase())||
            order.customers[0]?.cusName && order.customers[0].cusPhone1.toLowerCase().includes(searchTerm.toLowerCase())||
            order.customers[0]?.cusName && order.customers[0].cusPhone2.toLowerCase().includes(searchTerm.toLowerCase())
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
                        placeholder="Search by customer name or phone number"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                    />
                    <button className="btn btn-primary" onClick={printAddresses}>
                        Print Address
                    </button>
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
                                {/* Customer Details */}
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
                                
                                {/* Item Details */}
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
                                <td>{order.saleStatus}</td>
                                <td>
                                    <button
                                        className="btn btn-info m-1"
                                        onClick={() => enterTrackingNumber(order)}
                                    >
                                        Enter Tracking Number
                                    </button>
                                    <button
                                        className="btn btn-danger m-1"
                                        onClick={() => deleteOrder(order._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Printable Area for Customer Addresses */}
                <div ref={printRef} style={{ display: 'none' }}>
                    <h3>Customer Address List for "To be Shift" Orders</h3>
                    {orders.map((order) => (
                        <div key={order._id} style={{ marginBottom: '20px' }}>
                            <p><strong>Customer Name:</strong> {order.customers[0]?.cusName || 'N/A'}</p>
                            <p>
                                <strong>Address:</strong> {order.customers[0]?.cusAddress
                                    ? `${order.customers[0]?.cusAddress.street}, ${order.customers[0]?.cusAddress.city}`
                                    : 'Not Available'}
                            </p>
                            <p><strong>Phone Number 1:</strong> {order.customers[0]?.cusPhone1 || 'N/A'}</p>
                            <p><strong>Phone Number 2:</strong> {order.customers[0]?.cusPhone2 || 'N/A'}</p>
                            <hr />
                        </div>
                    ))}
                </div>
            </div>
        </Sidebar>
    );
};

export default OrdersPage;

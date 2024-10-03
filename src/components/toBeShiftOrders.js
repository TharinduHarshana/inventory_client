import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from './dashboard'; // Import Sidebar component
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
    const [orders, setOrders] = useState([]); // State to store orders
    const [error, setError] = useState(null); // State to store errors
    const [searchTerm, setSearchTerm] = useState(''); // State to store search term
    const [storeAddress, setStoreAddress] = useState(''); // State for store address

    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch all orders from backend
    const fetchOrders = async () => {
        try {
            const response = await axios.get('https://inventory-server-eight.vercel.app/sale');
            const filteredOrders = (response.data || []).filter(order => order.saleStatus === 'To be Shift');
            setOrders(filteredOrders); // Set only the filtered orders
        } catch (err) {
            setError('Failed to fetch orders');
        }
    };

    useEffect(() => {
        fetchOrders(); // Fetch orders when component loads

        // Fetch store from localStorage
        const selectedStore = localStorage.getItem('selectedStore') || 'store1';
        if (selectedStore === 'store1') {
            setStoreAddress('W.M.K.P.Kumara, Ceycent, Mi-Ella, Matara, 078 911 6273');
        } else if (selectedStore === 'store2') {
            setStoreAddress('W.M.K.P.Kumara, Goldenaroma, Mi-Ella, Matara, 078 911 6273');
        }
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
                    await axios.delete(`http://localhost:8000/sale/${id}`);
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
                    // Update the order status to "Shiped" and set the tracking number
                    await axios.put(`https://inventory-server-eight.vercel.app/sale/${order._id}`, {
                        trackingNumber,
                        saleStatus: 'Shiped'
                    });

                    Swal.fire('Success!', 'Order status updated to Shiped.', 'success');
                    fetchOrders(); // Refresh the orders after updating
                } catch (err) {
                    Swal.fire('Error!', 'Failed to update order status.', 'error');
                }
            }
        });
    };

    const printOrders = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write('<html><head><title>Print Orders</title><style>');
        printWindow.document.write(`
            body { font-family: Arial, sans-serif; margin: 20px; }
            .order-box { border: 1px solid #000; padding: 15px; margin-bottom: 20px; page-break-inside: avoid; }
            .address-section { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .to-address, .from-address { width: 48%; font-size: 18px; }
            .to-address { text-align: right; font-weight: bold; } /* Changed to align right */
            .from-address { text-align: left; } /* Changed to align left */
            .customer-info { font-size: 16px; }
            .items-table { width: 100%; margin-bottom: 10px; border-collapse: collapse; }
            .items-table th, .items-table td { border: 1px solid #000; padding: 5px; text-align: left; }
            .total-amount, .cod { font-size: 18px; font-weight: bold; text-align: center; margin-top: 10px; }
            @media print {
                .order-box { page-break-inside: avoid; }
            }
        `);
        printWindow.document.write('</style></head><body>');
    
        // Loop through each order and format the details for printing
        orders.forEach(order => {
            printWindow.document.write('<div class="order-box">');
    
            // Address Section: "To Address" on the right and "From Address" on the left
            printWindow.document.write('<div class="address-section">');
    
            // From Address (Store Address) - Now on the left
            printWindow.document.write('<div class="from-address">');
            printWindow.document.write(`<div><strong>From:</strong></div>`);
            printWindow.document.write(`<div>${storeAddress || 'Store Address N/A'}</div>`);
            printWindow.document.write('</div>');
    
            // To Address (Customer Address) - Now on the right
            printWindow.document.write('<div class="to-address">');
            printWindow.document.write(`<div><strong>To:</strong></div>`);
            printWindow.document.write(`<div class="customer-info"><strong>${order.customers[0]?.cusName || 'N/A'}</strong><br>`);
            printWindow.document.write(`${order.customers[0]?.cusAddress?.street || 'N/A'},<br>`);
            printWindow.document.write(`${order.customers[0]?.cusAddress?.city || 'N/A'},<br>`);
            printWindow.document.write(`${order.customers[0]?.cusPhone1 || 'N/A'}</div>`);
            printWindow.document.write('</div>');
    
            printWindow.document.write('</div>'); // End of Address Section
    
            // COD and Total Price
            printWindow.document.write('<div class="cod">');
            printWindow.document.write(`<div>COD</div><div>Rs-${order.totalAmount}</div>`);
            printWindow.document.write('</div>');
    
            printWindow.document.write('</div>'); // End of Order Box
        });
    
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        printWindow.print();
    };
    
    
    

    // Filter orders based on search term
    const filteredOrders = orders && orders.length > 0
        ? orders.filter(order =>
            order.customers[0]?.cusName && order.customers[0].cusName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customers[0]?.cusPhone1 && order.customers[0].cusPhone1.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customers[0]?.cusPhone2 && order.customers[0].cusPhone2.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : [];

    return (
        <Sidebar>
            <div className="container mt-5">
                <h2>Pending Orders List</h2>

                {/* Search Bar */}
                <div className="d-flex justify-content-between mb-3">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Search by customer name or phone number"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                    />
                    <button className="btn btn-primary" onClick={printOrders}>
                        Print Orders
                    </button>
                </div>

                {error && <p>{error}</p>} {/* Display error if any */}

                {/* Orders Table */}
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Customer Details</th>
                            <th>Item Details</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map(order => (
                            <tr key={order._id}>
                                <td>
                                    {order.customers[0]?.cusName}<br />
                                    {order.customers[0]?.cusAddress?.street}, {order.customers[0]?.cusAddress?.city}<br />
                                    {order.customers[0]?.cusPhone1}
                                </td>
                                <td>
                                    {order.items.map(item => (
                                        <div key={item._id}>
                                            {item.name} - {item.quantity} x Rs:{item.sellingPrice}
                                        </div>
                                    ))}
                                </td>
                                <td>Rs:{order.totalAmount}</td>
                                <td>
                                    <button className="btn btn-primary btn-sm m-1" onClick={() => enterTrackingNumber(order)}>
                                        Enter Tracking
                                    </button>
                                    <button className="btn btn-danger btn-sm m-1" onClick={() => deleteOrder(order._id)}>
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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './dashboard';
import Swal from 'sweetalert2'; // Import SweetAlert
import AddCustomer from './AddCusModal'; // Import AddCustomer form modal

const InventorySearch = () => {
    const [items, setItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredItems, setFilteredItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [error, setError] = useState('');

    const [customers, setCustomers] = useState([]);
    const [customerSearchTerm, setCustomerSearchTerm] = useState('');
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    const [showAddCustomerModal, setShowAddCustomerModal] = useState(false); // State for modal visibility

    const navigate = useNavigate(); // Initialize useNavigate for navigation

    // Fetch data from the backend
    const fetchItems = async () => {
        try {
            const response = await axios.get('https://inventory-server-eight.vercel.app/inventory');
            setItems(response.data.data);
        } catch (err) {
            setError('Failed to fetch items');
        }
    };

    const fetchCustomers = async () => {
        try {
            const response = await axios.get('https://inventory-server-eight.vercel.app/customer/');
            setCustomers(response.data || []);
        } catch (err) {
            setError('Failed to fetch customers');
        }
    };

    useEffect(() => {
        fetchItems();
        fetchCustomers();

        // Load selected items from localStorage
        const savedItems = localStorage.getItem('selectedItems');
        if (savedItems) {
            setSelectedItems(JSON.parse(savedItems));
        }
    }, []);

    // Update localStorage whenever selectedItems changes
    useEffect(() => {
        localStorage.setItem('selectedItems', JSON.stringify(selectedItems));
    }, [selectedItems]);

    // Search function for items (Main Search Bar)
    useEffect(() => {
        const results = items.filter(
            item =>
                (item.name && item.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (item.itemID && item.itemID.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredItems(results);
    }, [searchTerm, items]);

    // Search function for customers (Customer Search Bar)
    useEffect(() => {
        const results = customers.filter(
            customer =>
                (customer.cusName && customer.cusName.toLowerCase().includes(customerSearchTerm.toLowerCase())) ||
                (customer.cusPhone1 && customer.cusPhone1.toLowerCase().includes(customerSearchTerm.toLowerCase()))
        );
        setFilteredCustomers(results);
    }, [customerSearchTerm, customers]);

    // Add selected item to the table and clear search result
    const addItemToTable = (item) => {
        setSelectedItems([...selectedItems, { ...item, quantity: 1, discount: 0 }]);
        setSearchTerm(''); // Clear search term to reset search results
        setFilteredItems([]); // Clear filtered results
    };

    const addCustomer = (customer) => {
        setSelectedCustomer(customer);
        setCustomerSearchTerm(''); // Clear customer search term
        setFilteredCustomers([]); // Clear filtered customer results
    };

    // Remove item from selected items list
    const removeSelectedItem = (index) => {
        const updatedItems = selectedItems.filter((_, i) => i !== index);
        setSelectedItems(updatedItems);
    };

    // Handle quantity and discount changes
    const handleQuantityChange = (index, value) => {
        const updatedItems = [...selectedItems];
        updatedItems[index].quantity = value;
        setSelectedItems(updatedItems);
    };

    const handleDiscountChange = (index, value) => {
        const updatedItems = [...selectedItems];
        updatedItems[index].discount = value;
        setSelectedItems(updatedItems);
    };

    // Calculate total price for an item
    const calculateTotal = (item) => {
        const totalBeforeDiscount = item.sellingPrice * item.quantity;
        const discountAmount = (totalBeforeDiscount * item.discount) / 100;
        return totalBeforeDiscount - discountAmount;
    };

    // Calculate total bill
    const calculateBillTotal = () => {
        return selectedItems.reduce((total, item) => total + calculateTotal(item), 0).toFixed(2);
    };

    // Function to handle adding a new customer
    const handleAddNewCustomer = () => {
        setShowAddCustomerModal(true); // Open Add Customer modal
    };

    // Function to handle sale completion
    const handleCompleteSale = async () => {
        try {
            // Prepare sale data object
            const saleData = {
                customerId: selectedCustomer._id, // Use the selected customer's ID
                customerDetails: {
                    name: selectedCustomer.cusName,
                    email: selectedCustomer.cusEmail,
                    phone1: selectedCustomer.cusPhone1,
                    phone2: selectedCustomer.cusPhone2,
                    address: `${selectedCustomer.cusAddress.street}, ${selectedCustomer.cusAddress.city}, ${selectedCustomer.cusAddress.state}, ${selectedCustomer.cusAddress.zip}`
                },
                items: selectedItems.map(item => ({
                    itemID: item.itemID,
                    name: item.name,
                    sellingPrice: item.sellingPrice,
                    quantity: item.quantity,
                    discount: item.discount,
                    total: calculateTotal(item)
                })),
                totalAmount: calculateBillTotal(), // Total bill amount
                date: new Date() // Include the date of the sale
            };

            // POST request to save the sale to the backend
            await axios.post('https://inventory-server-eight.vercel.app/sale/add', saleData);

            // Show success message with SweetAlert
            Swal.fire({
                title: 'Sale Completed!',
                text: 'The sale has been successfully completed and saved.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                window.location.reload(); // Refresh the page after successful sale completion
            });
        } catch (error) {
            // Handle error during sale completion
            Swal.fire({
                title: 'Error',
                text: 'Failed to complete and save the sale. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    };

    // Function to close AddCustomer modal and update the customer list with the newly added customer
    const handleCustomerAdded = (newCustomer) => {
        setCustomers([...customers, newCustomer]);
        setShowAddCustomerModal(false); // Close the modal after successful addition
        setSelectedCustomer(newCustomer); // Automatically select the newly added customer
        
    };

    return (
        <Sidebar>
            <div className="container">
                <div className="row">
                    {/* Left Column for Items */}
                    <div className="col-md-8">
                        {/* Search Bar for Items */}
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search by Item ID or Name"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {/* Search Results for Items */}
                        {searchTerm && (
                            <div className="list-group mb-3">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map(item => (
                                        <button
                                            key={item.itemID}
                                            className="list-group-item list-group-item-action"
                                            onClick={() => addItemToTable(item)}
                                        >
                                            {item.name} (ID: {item.itemID}) - Selling Price: {item.sellingPrice}
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-center">No items found</p>
                                )}
                            </div>
                        )}

                        {/* Selected Items Table */}
                        <table className="table table-striped mt-4">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Selling Price</th>
                                    <th>Qty</th>
                                    <th>Discount %</th>
                                    <th>Total</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedItems.length > 0 ? (
                                    selectedItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td><input type="number" className="form-control" defaultValue={item.sellingPrice} readOnly /></td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={item.discount}
                                                    onChange={(e) => handleDiscountChange(index, parseInt(e.target.value))}
                                                />
                                            </td>
                                            <td>{calculateTotal(item).toFixed(2)}</td>
                                            <td>
                                                <button className="btn btn-danger" onClick={() => removeSelectedItem(index)}><i className="fas fa-times"></i> {/* Close icon */}</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center">No items selected</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Right Column for Customer Search */}
                    <div className="col-md-4">
                        {/* Search Bar for Customers */}
                        <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="Search by Customer Name or Phone"
                            value={customerSearchTerm}
                            onChange={(e) => setCustomerSearchTerm(e.target.value)}
                        />

                        {/* Search Results for Customers */}
                        {customerSearchTerm && (
                            <div className="list-group mb-3">
                                {filteredCustomers.length > 0 ? (
                                    filteredCustomers.map(customer => (
                                        <button
                                            key={customer._id}
                                            className="list-group-item list-group-item-action"
                                            onClick={() => addCustomer(customer)}
                                        >
                                            {customer.cusName} (Phone: {customer.cusPhone1})
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-center">No customers found</p>
                                )}
                            </div>
                        )}
                        {/* Selected Customer Details */}
                        {selectedCustomer ? (
                            <div className="card mt-3">
                                <div className="card-body">
                                    <h5 className="text-primary">Selected Customer</h5>
                                    <p>Name: {selectedCustomer.cusName}</p>
                                    <p>Email: {selectedCustomer.cusEmail}</p>
                                    <p>Phone: {selectedCustomer.cusPhone1} {selectedCustomer.cusPhone2 && `/ ${selectedCustomer.cusPhone2}`}</p>
                                    <p>Address: {selectedCustomer.cusAddress?.street}, {selectedCustomer.cusAddress?.city}, {selectedCustomer.cusAddress?.state}, {selectedCustomer.cusAddress?.zip}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center">No customer selected</p>
                        )}

                        {/* Total Price */}
                        <div className="text-right mt-4">
                            <h5 className="text-success font-weight-bold" style={{ fontSize: '1.5rem' }}>
                                Total: <span className="text-warning">Rs:{calculateBillTotal()}</span>
                            </h5>
                        </div>

                        {/* Button to Add New Customer */}
                        <div className="text-right mt-4">
                            <button className="btn btn-info" onClick={handleAddNewCustomer}>Add New Customer</button>
                        </div>

                        {/* Complete Sale Button */}
                        <div className="text-right mt-4">
                            <button className="btn btn-success" onClick={handleCompleteSale}>Complete Sale</button>
                        </div>

                    </div>
                </div>
            </div>

            {/* AddCustomer Modal */}
            {showAddCustomerModal && (
                <AddCustomer
                onClose={() => setShowAddCustomerModal(false)}
                onCustomerAdded={handleCustomerAdded}
                />
            )}
        </Sidebar>
    );
};

export default InventorySearch;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Sidebar from '../components/dashboard'; // Import Sidebar component
import { useNavigate } from 'react-router-dom';

const ExpensePage = () => {
    const [expenses, setExpenses] = useState([]); // State to store expenses
    const [error, setError] = useState(null); // State to store errors
    const [searchTerm, setSearchTerm] = useState(''); // State to store search term
    const [formData, setFormData] = useState({ name: '', price: '', description: '', date: '' }); // State for form data

    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch all expenses from backend
    const fetchExpenses = async () => {
        try {
            const response = await axios.get('https://inventory-server-eight.vercel.app/expense');
            setExpenses(response.data || []);
        } catch (err) {
            setError('Failed to fetch expenses');
        }
    };

    useEffect(() => {
        fetchExpenses(); // Fetch expenses when component loads
    }, []);

    // Handle input change for the form
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Delete expense with confirmation
    const deleteExpense = (id) => {
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
                    await axios.delete(`https://inventory-server-eight.vercel.app/expense/${id}`);
                    Swal.fire('Deleted!', 'Expense has been deleted.', 'success');
                    fetchExpenses(); // Refresh list after deletion
                } catch (err) {
                    Swal.fire('Error!', 'Failed to delete the expense.', 'error');
                }
            }
        });
    };

    // Edit expense (Navigate to edit page)
    const editExpense = (id) => {
        navigate(`/expense/${id}`);
    };

// Filter expenses based on search term
const filteredExpenses = expenses && expenses.length > 0
    ? expenses.filter(expense =>
        expense.name && expense.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];


    return (
        <Sidebar>
            <div className="container mt-5">
                <h2>Expense List</h2>

                {/* Search Bar */}
                <div className="d-flex justify-content-between mb-3">
                    <input
                        type="text"
                        className="form-control w-50"
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)} // Update search term
                    />
                    <button className="btn btn-primary" onClick={() => navigate('/expense/add')}>
                        Add Expense
                    </button>
                </div>

                {error && <p>{error}</p>} {/* Display error if any */}
                {/* Expense Table */}
                <table className="table table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExpenses.map((expense) => (
                            <tr key={expense._id}>
                                <td>{expense.name}</td>
                                <td>{expense.price}</td>
                                <td>{expense.description || 'Not Available'}</td>
                                <td>{new Date(expense.date).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        className="btn btn-warning m-1"
                                        onClick={() => editExpense(expense._id)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => deleteExpense(expense._id)}
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

export default ExpensePage;

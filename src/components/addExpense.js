import React,{useState, useEffect}from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './dashboard';

const AddExpense = () => {
    const navigation = useNavigate();
    const [expense, setExpense] = useState({
        name: '',
        description: '',
        price : '',
        date: ''
    });
    const [error, setError] = useState(null);

    // Handle form input changes
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://inventory-server-eight.vercel.app/expense/add', expense);
            navigation('/expense');
        } catch (err) {
            console.error(err);
            setError('Failed to add new expense');
        }
    };

    return (
        <Sidebar>
            <div className="container mt-5">
                <h2>Add Expense</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="form-control"
                            onChange={(e) => setExpense({ ...expense, name: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                            name="description"
                            id="description"
                            className="form-control"
                            rows="4" // Optional: Set the number of rows for the textarea
                            onChange={(e) => setExpense({ ...expense, description: e.target.value })}
                    ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">Price</label>
                        <input
                            type="number"
                            name="price"
                            id="price"
                            className="form-control"
                            onChange={(e) => setExpense({ ...expense, price: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">Date</label>
                        <input
                            type="date"
                            name="date"
                            id="date"
                            className="form-control"
                            onChange={(e) => setExpense({ ...expense, date: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary mt-3">
                        Add Expense
                    </button>
                    {error && <p className="text-danger mt-2">{error}</p>}
                </form>
            </div>
        </Sidebar>
    );
}

export default AddExpense;
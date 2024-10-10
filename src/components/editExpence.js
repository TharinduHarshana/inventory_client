import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./dashboard"; // Assuming you have a sidebar layout

const EditExpense = () => {
  const { id } = useParams(); // Get the expense ID from the URL
  const navigate = useNavigate();
  const [expense, setExpense] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the existing expense details on component mount
  useEffect(() => {
    const fetchExpense = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://inventory-server-gamma.vercel.app/expense/${id}`);
        console.log("API Response:", response);

        if (response.data) {
          setExpense(response.data); // Set the expense data
        } else {
          setError("Failed to fetch expense details");
        }
        setLoading(false);
      } catch (err) {
        console.error("Fetch Expense Error:", err);
        setError("Failed to fetch expense details");
        setLoading(false);
      }
    };
    fetchExpense();
  }, [id]);

  // Handle form field changes
  const handleChange = (e) => {
    setExpense({
      ...expense,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission to update the expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://inventory-server-gamma.vercel.app/expense/${id}`, expense);
      navigate("/expense");
    } catch (err) {
      console.error(err);
      setError("Failed to update expense");
    }
  };

  // Display loading state
  if (loading) {
    return <p>Loading expense...</p>;
  }

  // Display error message
  if (error) {
    return <p>{error}</p>;
  }

  // Check if the expense is found
  if (!Object.keys(expense).length) {
    return <p>Expense not found</p>;
  }

  return (
    <Sidebar>
      <div className="container mt-5">
        <h2>Edit Expense</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={expense.name || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="price" className="form-label">Price</label>
            <input
              type="number"
              className="form-control"
              id="price"
              name="price"
              value={expense.price || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="4"
              value={expense.description || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="date" className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              id="date"
              name="date"
              value={expense.date ? new Date(expense.date).toISOString().split('T')[0] : ""}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">Update Expense</button>
        </form>
      </div>
    </Sidebar>
  );
};

export default EditExpense;

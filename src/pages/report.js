import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Table } from "react-bootstrap";
import Sidebar from "../components/dashboard";

const MonthlyReport = () => {
  const [sales, setSales] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [profit, setProfit] = useState(0);

  // Fetch sales, expenses, and profit data
  const fetchData = async () => {
    try {
      // Fetch total sales
      const salesResponse = await axios.get("https://inventory-server-eight.vercel.app/report/sales");
      setSales(salesResponse.data);

      // Fetch total expenses
      const expensesResponse = await axios.get("https://inventory-server-eight.vercel.app/report/expenses");
      setExpenses(expensesResponse.data);

      // Fetch total profit
      const profitResponse = await axios.get("https://inventory-server-eight.vercel.app/report/profit");
      setProfit(profitResponse.data.totalProfit);
    } catch (err) {
      console.error("Error fetching report data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Sidebar>
    <div className="container mt-4">
      <h2>Monthly Sales & Expenses Report</h2>
      
      {/* Sales Table */}
      <h3>Sales Report</h3>
      <Table striped bordered hover className="mb-4">
        <thead>
          <tr>
            <th>Date</th>
            <th>Items Sold</th>
            <th>Sales (Rs)</th>
            
          </tr>
        </thead>
        <tbody>
          {sales.map((sale, index) => (
            <tr key={index}>
              <td>{moment(sale.createdAt).format("YYYY-MM-DD")}</td>
              <td>{sale.itemNames.map((item, idx) => (
                <span key={idx}>{item}<br /></span>
            ))}</td>
              <td>{sale.totalAmount}</td>
           

            </tr>
          ))}
        </tbody>
      </Table>

      {/* Expenses Table */}
      <h3>Expenses Report</h3>
      <Table striped bordered hover className="mb-4">
        <thead>
          <tr>
            <th>Date</th>
            <th>Expense Name</th>
            <th>Expenses (Rs)</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense, index) => (
            <tr key={index}>
              <td>{moment(expense.date).format("YYYY-MM-DD")}</td>
              <td>{expense.name}</td>
              <td>{expense.price}</td>
            </tr>
          ))}
        </tbody>
      </Table>

            {/* Total Profit */}
        <div className="mt-4" style={{ backgroundColor: 'gray', padding: '10px', borderRadius: '5px' }}>
            <h4>Total Profit for the Month: Rs {profit}</h4>
        </div>



    </div>
    </Sidebar>
  );
};

export default MonthlyReport;

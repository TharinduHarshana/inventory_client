import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./dashboard";

const EditSupplierDetails = () => {
  const { _id } = useParams();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSupplier = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/suplier/${_id}`);
        console.log("API Response:", response);

        // Fix for the typo in the response data
        if (response.data) {
          setSupplier(response.data); // Directly assign response data
        } else {
          setError("Failed to fetch supplier details");
        }
        setLoading(false);
      } catch (err) {
        console.error("Fetch Supplier Error:", err);
        setError("Failed to fetch supplier details");
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [_id]);

  const handleChange = (e) => {
    setSupplier({
      ...supplier,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8000/suplier/${_id}`, supplier);
      navigate("/suplier");
    } catch (err) {
      console.error(err);
      setError("Failed to update supplier");
    }
  };

  if (loading) {
    return <p>Loading supplier...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!Object.keys(supplier).length) {
    return <p>Supplier not found</p>;
  }

  return (
    <Sidebar>
      <div className="container mt-5">
        <h2>Edit Supplier</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="supplierName" className="form-label">
              Supplier Name
            </label>
            <input
              type="text"
              className="form-control"
              id="supplierName"
              name="supplierName"
              value={supplier.supplierName || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="supplierAddress" className="form-label">
              Supplier Address
            </label>
            <input
              type="text"
              className="form-control"
              id="supplierAddress"
              name="supplierAddress"
              value={supplier.supplierAddress || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="suplierPhone" className="form-label">
              Supplier Phone
            </label>
            <input
              type="text"
              className="form-control"
              id="suplierPhone" // use the field as it is in the API response
              name="suplierPhone" // use the field as it is in the API response
              value={supplier.suplierPhone || ""} // ensure this matches the typo in the response
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="supplierEmail" className="form-label">
              Supplier Email
            </label>
            <input
              type="email"
              className="form-control"
              id="supplierEmail"
              name="supplierEmail"
              value={supplier.supplierEmail || ""}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Update Supplier
          </button>
        </form>
      </div>
    </Sidebar>
  );
};

export default EditSupplierDetails;

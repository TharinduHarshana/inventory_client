import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://inventory-server-eight.vercel.app/user/login', { username, password });
      if (res.data.status === 'success') {
        setSuccess('Login successful!');
        setError('');
        localStorage.setItem('token', res.data.token);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Login successful!',
        });
        navigate('/dashboard');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      setSuccess('');
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: errorMessage,
      });
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow" style={{ width: '400px' }}>
        <div className="card-header bg-primary text-center">
          <h5 className="text-white">One Place Software Solution</h5>
          <p className="text-white-50">Customer Support: 077 8570 388</p>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              LOGIN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
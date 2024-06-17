import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import '../components/SignUpStylesModal.css';

const SignUpModal = ({ handleModal }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);

    const endpoint = isLogin ? '/api/login' : '/api/register';
    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log('Response from server:', result);

      if (response.ok) {
        console.log('Success:', result);
        if (isLogin) {
          console.log('Login successful, setting token...');
          localStorage.setItem('token', result.token);
          handleModal();
          navigate('/'); // 홈 화면으로 리디렉션
          window.location.reload(); // 페이지 새로고침
        } else {
          alert('User registered successfully!');
        }
      } else {
        console.error('Error:', result);
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error: ' + error.message);
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay" onClick={handleModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <span className="close-btn" onClick={handleModal}>
          &times;
        </span>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </>
          )}
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        <p onClick={toggleForm} className="toggle-form">
          {isLogin
            ? "Don't have an account? Sign Up"
            : 'Already have an account? Login'}
        </p>
      </div>
    </div>,
    document.getElementById('modal-root'),
  );
};

export default SignUpModal;

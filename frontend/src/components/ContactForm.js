import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import '../components/ContactFormStyles.css';

function ContactForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Title and Content are required!');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in.');
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // 현재 시간을 초 단위로 변환
      if (decodedToken.exp < currentTime) {
        alert('Token has expired. Please log in again.');
        setLoading(false);
        return;
      }
    } catch (error) {
      alert('Invalid token. Please log in again.');
      setLoading(false);
      return;
    }

    console.log('Sending fetch request to server...');
    console.log('Title:', title, 'Content:', content, 'Token:', token);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const result = await response.json();
      console.log('Server response:', result);

      setLoading(false);
      if (response.ok) {
        setSuccessMessage('Post created successfully!');
        setTitle('');
        setContent('');
      } else {
        setError(result.error || 'Error creating post');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="form-container">
      <h1>게시글을 작성해주세요!</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          rows="16"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        ></textarea>
        <button type="submit" disabled={loading}>
          {loading ? '작성 중...' : '작성 완료'}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
    </div>
  );
}

export default ContactForm;

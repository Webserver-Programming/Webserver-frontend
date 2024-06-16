import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SignUpModal from './SignUpModal';
import './NavbarStyles.css';
import { MenuItems } from './MenuItems';

const Navbar = () => {
  const [clicked, setClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleClicked = () => {
    setClicked(!clicked);
  };

  const handleModal = () => {
    setShowModal(!showModal);
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.location.href = '/'; // 홈 화면으로 리디렉션
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('useEffect - token:', token);
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      console.log('handleStorageChange - token:', token);
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <nav className="NavbarItems">
      <h1 className="navbar-logo">사랑愛에 더하다</h1>

      <div className="menu-icons" onClick={handleClicked}>
        <i className={clicked ? 'fas fa-times' : 'fas fa-bars'}></i>
      </div>

      <ul className={clicked ? 'nav-menu active' : 'nav-menu'}>
        {MenuItems.map((item, index) => (
          <li key={index}>
            <Link className={item.cName} to={item.url}>
              <i className={item.icon}></i>
              {item.title}
            </Link>
          </li>
        ))}
        {isLoggedIn ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={handleModal}>Sign Up / Login</button>
        )}
      </ul>
      {showModal && <SignUpModal handleModal={handleModal} />}
    </nav>
  );
};

export default Navbar;

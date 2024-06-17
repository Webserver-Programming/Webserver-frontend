import './App.css';
import Navbar from './components/Navbar';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './routes/Home';
import About from './routes/About';
import Service from './routes/Service';
import Contact from './routes/Contact';
import ContactList from './routes/ContactList';
import ContactForm from './components/ContactForm';
import SignUpModal from './components/SignUpModal';
import { useState } from 'react';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" />;
  };

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/service" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/contactList"
          element={
            <ProtectedRoute>
              <ContactList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-post"
          element={
            <ProtectedRoute>
              <ContactForm />
            </ProtectedRoute>
          }
        />
      </Routes>
      <button onClick={toggleModal}>Sign Up / Login</button>
      {isModalOpen && <SignUpModal handleModal={toggleModal} />}
    </div>
  );
}

export default App;

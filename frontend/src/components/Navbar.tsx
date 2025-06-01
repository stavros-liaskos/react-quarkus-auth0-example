import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const handleLogin = async () => {
    console.log('Login button clicked');
    try {
      console.log('Attempting to login with Auth0...');
      await loginWithRedirect();
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Auth0 Demo</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/protected-api">Protected API</Link>
                </li>
              </>
            )}
          </ul>
          <div className="d-flex">
            {!isAuthenticated ? (
              <button 
                className="btn btn-outline-light" 
                onClick={handleLogin}
              >
                Log In
              </button>
            ) : (
              <button 
                className="btn btn-outline-light" 
                onClick={() => logout()}
              >
                Log Out
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
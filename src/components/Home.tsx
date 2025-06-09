import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="text-center">
      <h1>Welcome to Auth0 POC</h1>
      {!isAuthenticated && (
        <p>Please log in to access protected features.</p>
      )}
    </div>
  );
};

export default Home; 
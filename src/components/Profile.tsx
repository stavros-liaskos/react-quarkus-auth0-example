import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile: React.FC = () => {
  const { user, isAuthenticated } = useAuth0();

  if (!isAuthenticated || !user) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Profile</h2>
        <img
          src={user.picture}
          alt={user.name}
          className="rounded-circle mb-3"
          style={{ width: '100px', height: '100px' }}
        />
        <h3>{user.name}</h3>
        <p>{user.email}</p>
        <pre className="bg-light p-3 rounded">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default Profile; 
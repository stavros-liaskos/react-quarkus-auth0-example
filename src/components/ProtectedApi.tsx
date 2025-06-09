import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const ProtectedApi: React.FC = () => {
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();
  const [apiResponse, setApiResponse] = useState<string>('');
  const [error, setError] = useState<string>('');

  const callProtectedApi = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/secured`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setApiResponse(JSON.stringify(response.data, null, 2));
      setError('');
    } catch (err) {
      setError('Error calling protected API');
      setApiResponse('');
      console.error(err);
    }
  };

  if (!isAuthenticated) {
    return <div>Please log in to access the protected API</div>;
  }

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Protected API Demo</h2>
        <button className="btn btn-primary mb-3" onClick={callProtectedApi}>
          Call Protected API
        </button>
        {error && <div className="alert alert-danger">{error}</div>}
        {apiResponse && (
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">API Response</h5>
              <pre className="bg-light p-3 rounded">{apiResponse}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProtectedApi;

 
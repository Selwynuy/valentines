'use client';

import { useEffect, useState } from 'react';
import './admin.css';

interface Response {
  id: string;
  created_at: string;
  accepted: boolean;
  chosen_plan_id: number | null;
  chosen_plan_title: string | null;
  suggestions: string | null;
  user_agent: string | null;
  ip_address: string | null;
}

export default function AdminPage() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const response = await fetch('/api/get-responses');
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        setResponses(data.responses);
      }
    } catch (err) {
      setError('Failed to fetch responses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>💕 Valentine Response Dashboard</h1>
        <p>Secret Admin Panel - {responses.length} Response(s)</p>
      </div>

      {error && (
        <div className="error-banner">{error}</div>
      )}

      {responses.length === 0 ? (
        <div className="no-responses">
          <p>No responses yet... waiting for her to say YES! 💕</p>
        </div>
      ) : (
        <div className="responses-grid">
          {responses.map((response) => (
            <div key={response.id} className="response-card">
              <div className="response-header">
                <span className={`status-badge ${response.accepted ? 'accepted' : 'pending'}`}>
                  {response.accepted ? '✅ Accepted' : '⏳ Pending'}
                </span>
                <span className="timestamp">
                  {new Date(response.created_at).toLocaleString()}
                </span>
              </div>

              {response.chosen_plan_title && (
                <div className="response-detail">
                  <strong>📅 Chosen Plan:</strong>
                  <p>{response.chosen_plan_title}</p>
                </div>
              )}

              {response.suggestions && (
                <div className="response-detail">
                  <strong>💡 Her Suggestions:</strong>
                  <p className="suggestions-text">{response.suggestions}</p>
                </div>
              )}

              <div className="response-meta">
                <small>IP: {response.ip_address}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="refresh-section">
        <button onClick={fetchResponses} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>
    </div>
  );
}

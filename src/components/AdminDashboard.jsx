import React, { useEffect, useState } from "react";

function AdminDashboard({ user }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "https://0iei6obzt6.execute-api.ap-south-1.amazonaws.com/requests";

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, role: user.role }),
      });

      const data = await response.json();
      if (data.requests) {
        setRequests(data.requests);
      } else {
        setError("Failed to fetch requests.");
      }
    } catch (err) {
      setError("Error fetching requests.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      setError("");
      const response = await fetch("https://e5znu89hme.execute-api.ap-south-1.amazonaws.com/default/UpdateRequestStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          action,
          approvedBy: user.username
        }),
      });
      const result = await response.json();
      alert(result.message || "Action completed");
      fetchRequests();
    } catch (err) {
      setError("Action failed. Try again.");
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)",
      padding: "40px 20px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    },
    header: {
      maxWidth: "1200px",
      margin: "0 auto 40px",
      textAlign: "center"
    },
    title: {
      fontSize: "32px",
      fontWeight: "600",
      color: "#1e293b",
      marginBottom: "8px"
    },
    welcome: {
      fontSize: "16px",
      color: "#64748b"
    },
    content: {
      maxWidth: "1200px",
      margin: "0 auto"
    },
    section: {
      background: "#ffffff",
      borderRadius: "12px",
      padding: "24px",
      marginBottom: "24px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)"
    },
    sectionTitle: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#1e293b",
      marginBottom: "20px",
      paddingBottom: "12px",
      borderBottom: "2px solid #e2e8f0"
    },
    table: {
      width: "100%",
      borderCollapse: "collapse"
    },
    th: {
      textAlign: "left",
      padding: "12px",
      fontSize: "14px",
      fontWeight: "600",
      color: "#64748b",
      borderBottom: "1px solid #e2e8f0"
    },
    td: {
      padding: "16px 12px",
      fontSize: "14px",
      color: "#334155",
      borderBottom: "1px solid #f1f5f9"
    },
    buttonGroup: {
      display: "flex",
      gap: "8px"
    },
    approveButton: {
      padding: "6px 16px",
      fontSize: "13px",
      fontWeight: "500",
      color: "#ffffff",
      background: "#10b981",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background 0.2s"
    },
    rejectButton: {
      padding: "6px 16px",
      fontSize: "13px",
      fontWeight: "500",
      color: "#ffffff",
      background: "#ef4444",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background 0.2s"
    },
    revokeButton: {
      padding: "6px 16px",
      fontSize: "13px",
      fontWeight: "500",
      color: "#ffffff",
      background: "#f59e0b",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "background 0.2s"
    },
    emptyState: {
      textAlign: "center",
      padding: "40px",
      color: "#94a3b8",
      fontSize: "14px"
    },
    loading: {
      textAlign: "center",
      padding: "60px",
      fontSize: "16px",
      color: "#64748b"
    },
    error: {
      textAlign: "center",
      padding: "20px",
      color: "#ef4444",
      background: "#fee2e2",
      borderRadius: "8px",
      fontSize: "14px",
      maxWidth: "600px",
      margin: "0 auto"
    }
  };

  if (loading) return (
    <div style={styles.container}>
      <div style={styles.loading}>Loading...</div>
    </div>
  );

  if (error) return (
    <div style={styles.container}>
      <div style={styles.error}>{error}</div>
    </div>
  );

  const pendingRequests = requests.filter(r => r.status === "PENDING");
  const approvedRequests = requests.filter(r => r.status === "APPROVED");

  return (
    <div style={styles.container}>
      <style>{`
        button:hover.approve { background: #059669 !important; }
        button:hover.reject { background: #dc2626 !important; }
        button:hover.revoke { background: #d97706 !important; }
      `}</style>

      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.welcome}>Welcome back, {user.username}</p>
      </div>

      <div style={styles.content}>
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Pending Requests</h3>
          {pendingRequests.length === 0 ? (
            <div style={styles.emptyState}>No pending requests at the moment</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>Reason</th>
                  <th style={styles.th}>Timestamp</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map(req => (
                  <tr key={req.requestId}>
                    <td style={styles.td}>{req.username}</td>
                    <td style={styles.td}>{req.reason}</td>
                    <td style={styles.td}>{new Date(req.timestamp).toLocaleString()}</td>
                    <td style={styles.td}>
                      <div style={styles.buttonGroup}>
                        <button 
                          className="approve"
                          style={styles.approveButton}
                          onClick={() => handleAction(req.requestId, "approve")}
                        >
                          Approve
                        </button>
                        <button 
                          className="reject"
                          style={styles.rejectButton}
                          onClick={() => handleAction(req.requestId, "reject")}
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Approved Contributors</h3>
          {approvedRequests.length === 0 ? (
            <div style={styles.emptyState}>No approved contributors yet</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Username</th>
                  <th style={styles.th}>Reason</th>
                  <th style={styles.th}>Approved By</th>
                  <th style={styles.th}>Timestamp</th>
                  <th style={styles.th}>Action</th>
                </tr>
              </thead>
              <tbody>
                {approvedRequests.map(req => (
                  <tr key={req.requestId}>
                    <td style={styles.td}>{req.username}</td>
                    <td style={styles.td}>{req.reason}</td>
                    <td style={styles.td}>{req.approvedBy || "-"}</td>
                    <td style={styles.td}>{new Date(req.timestamp).toLocaleString()}</td>
                    <td style={styles.td}>
                      <button 
                        className="revoke"
                        style={styles.revokeButton}
                        onClick={() => handleAction(req.requestId, "revoke")}
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;
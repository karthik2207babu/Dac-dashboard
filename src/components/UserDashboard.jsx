import React, { useEffect, useState } from "react";

// 1. Accept the onLogout function from App.jsx
function UserDashboard({ user, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reason, setReason] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // --- NO CHANGES TO YOUR API URLS ---
  const API_FETCH_URL = "https://0iei6obzt6.execute-api.ap-south-1.amazonaws.com/requests";
  const API_SUBMIT_URL = "https://e5znu89hme.execute-api.ap-south-1.amazonaws.com/default/ConRequest";

  const fetchRequests = async () => {
    try {
      // Don't set loading(true) for background refreshes
      // setLoading(true);
      setError("");
      const response = await fetch(API_FETCH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, role: user.role }),
      });

      // Add a check for response.ok
      if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Failed to fetch");
      }

      const data = await response.json();
      if (data.requests) {
        const userRequests = data.requests.filter(req => req.username === user.username);
        setRequests(userRequests);
      } else {
        setError("Failed to fetch requests.");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(`Error fetching requests: ${err.message}`);
    } finally {
      // Only set loading to false on the *first* load
      setLoading(false);
    }
  };
  
  // --- 2. ADDED POLLING ---
  useEffect(() => {
    // 1. Fetch data immediately when the page loads
    fetchRequests();

    // 2. Set up an interval to re-fetch every 10 seconds
    const intervalId = setInterval(fetchRequests, 10000); // 10000ms = 10s
    console.log("Polling interval set up.");

    // 3. This is critical: When the component closes,
    //    stop the interval to prevent memory leaks.
    return () => {
        console.log("Cleaning up polling interval.");
        clearInterval(intervalId);
    }
  }, [user.username]); // Re-run if the user changes (though it shouldn't in this component)
  // --- END OF POLLING FIX ---


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
      setSubmitError("Reason cannot be empty.");
      return;
    }

    try {
      setSubmitLoading(true);
      setSubmitError("");
      setSubmitSuccess("");
        console.log("Submitting request for:", user.username);
      const response = await fetch(API_SUBMIT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: user.username, reason }),
      });

      // Add a check for response.ok
      if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || "Failed to submit");
      }

      const data = await response.json();
      if (data.message === "Request submitted successfully") {
        setSubmitSuccess("Request submitted successfully.");
        setReason("");
        fetchRequests(); // refresh requests after submission
      } else {
        setSubmitError(data.message || "Failed to submit request.");
      }
    } catch (err) {
        console.error("Submit Error:", err);
      setSubmitError(`Error submitting request: ${err.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const baseStyle = {
      padding: "4px 12px",
      borderRadius: "12px",
      fontSize: "13px",
      fontWeight: "500",
      display: "inline-block",
    };
    switch (status) {
      case "PENDING":
        return { ...baseStyle, background: "#fef3c7", color: "#92400e" };
      case "APPROVED":
        return { ...baseStyle, background: "#d1fae5", color: "#065f46" };
      case "REJECTED":
        return { ...baseStyle, background: "#fee2e2", color: "#991b1b" };
      // --- 3. ADDED "USED" STATUS ---
      case "USED":
        return { ...baseStyle, background: "#e0e7ff", color: "#3730a3" };
      default:
        return { ...baseStyle, background: "#e2e8f0", color: "#475569" };
    }
  };

  const styles = {
    container: { minHeight: "100vh", background: "linear-gradient(to bottom right, #f8fafc, #e2e8f0)", padding: "40px 20px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" },
    // 4. UPDATED HEADER FOR LOGOUT BUTTON
    header: { maxWidth: "1200px", margin: "0 auto 40px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    headerLeft: { textAlign: "left" }, // Added this
    title: { fontSize: "32px", fontWeight: "600", color: "#1e293b", marginBottom: "8px" },
    welcome: { fontSize: "16px", color: "#64748b" },
    content: { maxWidth: "1200px", margin: "0 auto" },
    section: { background: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)", marginBottom: "20px" },
    sectionTitle: { fontSize: "20px", fontWeight: "600", color: "#1e293b", marginBottom: "20px", paddingBottom: "12px", borderBottom: "2px solid #e2e8f0" },
    table: { width: "100%", borderCollapse: "collapse" },
    th: { textAlign: "left", padding: "12px", fontSize: "14px", fontWeight: "600", color: "#64748b", borderBottom: "1px solid #e2e8f0" },
    td: { padding: "16px 12px", fontSize: "14px", color: "#334155", borderBottom: "1px solid #f1f5f9" },
    emptyState: { textAlign: "center", padding: "40px", color: "#94a3b8", fontSize: "14px" },
    input: { width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", marginBottom: "12px", fontSize: "14px" },
    button: { padding: "12px 16px", borderRadius: "8px", border: "none", background: "#3b82f6", color: "#ffffff", fontWeight: "600", cursor: "pointer" },
    logoutButton: { padding: "10px 16px", borderRadius: "8px", border: "none", background: "#ef4444", color: "#ffffff", fontWeight: "600", cursor: "pointer" }, // 4. ADDED LOGOUT BUTTON STYLE
    error: { textAlign: "center", padding: "12px", color: "#ef4444", background: "#fee2e2", borderRadius: "8px", fontSize: "14px", marginBottom: "12px" },
    success: { textAlign: "center", padding: "12px", color: "#065f46", background: "#d1fae5", borderRadius: "8px", fontSize: "14px", marginBottom: "12px" },
  };

  if (loading) return <div style={styles.container}><div style={styles.emptyState}>Loading your requests...</div></div>;
  if (error) return <div style={styles.container}><div style={styles.error}>{error}</div></div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>User Dashboard</h1>
          <p style={styles.welcome}>Welcome back, {user.username}</p>
        </div>
        {/* 4. ADDED LOGOUT BUTTON */}
        <button onClick={onLogout} style={styles.logoutButton}>Log Out</button>
      </div>

      <div style={styles.content}>
        {/* My Access Requests */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>My Access Requests</h3>
          {requests.length === 0 ? (
            <div style={styles.emptyState}>You have no requests yet.</div>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Reason</th>
                  <th style={styles.th}>Approved By</th>
                  <th style={styles.th}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.requestId}>
                    <td style={styles.td}><span style={getStatusStyle(req.status)}>{req.status}</span></td>
                    <td style={styles.td}>{req.reason}</td>
                    <td style={styles.td}>{req.approvedBy || "-"}</td>
                    <td style={styles.td}>{new Date(req.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        {/* Submit New Request */}
        <section style={styles.section}>
          <h3 style={styles.sectionTitle}>Submit New Request</h3>
          
          {/* 5. KEPT YOUR ORIGINAL LOGIC */}
          {requests.length > 0 ? (
            <div style={styles.emptyState}>You already have a request. Only one request is allowed per user.</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Enter reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={styles.input}
              />
              <button type="submit" style={styles.button} disabled={submitLoading}>
                {submitLoading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          )}
          {submitError && <div style={styles.error}>{submitError}</div>}
          {submitSuccess && <div style={styles.success}>{submitSuccess}</div>}
        </section>
      </div>
    </div>
  );
}

export default UserDashboard;
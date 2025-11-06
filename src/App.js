import React, { useState } from "react";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  return user.role === "admin" ? (
    <AdminDashboard user={user} />
  ) : (
    <UserDashboard user={user} />
  );
}

export default App;

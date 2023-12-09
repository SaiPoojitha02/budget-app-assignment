import "./App.css";
import CreateCategoryForm from "./components/CreateCategory";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CreateExpenseForm from "./components/CreateExpense";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import RegisterForm from "./components/Register";
import LoginForm from "./components/Login";
import { AuthContext } from "./contexts/AuthContext";
import { Modal, Button } from "react-bootstrap";

function App() {
  const [authDetails, setAuthDetails] = useState({
    isLoggedIn: false,
    token: null,
    expiration: null,
  });

  const navigate = useNavigate();

  const { pathname } = useLocation();

  const [expirationTime, setExpirationTime] = useState(null);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    let token = localStorage.getItem("app-token");
    let expiration = localStorage.getItem("app-token-expiration");
    expiration = new Date(expiration);
    const current = new Date();

    if (expiration < current) {
      localStorage.removeItem("token");
      localStorage.removeItem("app-token-expiration");
      if (pathname !== "/register") navigate("/login");
    } else {
      setAuthDetails({
        token: token,
        expiration: expiration,
        isLoggedIn: true,
      });
      if (pathname === "/register" || pathname === "/login") navigate("/");
    }
  }, [authDetails.isLoggedIn, authDetails.token, navigate, pathname]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: authDetails.isLoggedIn,
        token: authDetails.token,
        setAuthDetails,
      }}
    >
      <div
        style={{
          background: "#eff0f4",
          minHeight: "100vh",
          width: "100vw",
          boxSizing: "border-box",
          padding: "15px 80px",
          textAlign: "center",
        }}
      >
        <Link to="/">
          <h2
            style={{
              cursor: "pointer",
              color: "black",
              textDecoration: "none !important",
            }}
          >
            Personal Budget Application
            {authDetails.isLoggedIn && (
              <span
                style={{ float: "right", fontSize: "25px" }}
                onClick={() => {
                  localStorage.removeItem("app-token");
                  localStorage.removeItem("app-token-expiration");
                  window.location = "/login";
                }}
              >
                Logout
              </span>
            )}
          </h2>
        </Link>
        {authDetails.isLoggedIn && (
          <h3>
            <Link to="/create/category" style={{ margin: "10px" }}>
              <span>Create Category</span>
            </Link>
            <Link to="/create/expense" style={{ margin: "10px" }}>
              <span>Create Expense</span>
            </Link>
          </h3>
        )}
        <div
          style={{
            width: "60%",
            margin: "auto",
            textAlign: "left",
            marginTop: "100px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard />}></Route>
            <Route
              path="/create/category"
              element={<CreateCategoryForm />}
            ></Route>
            <Route
              path="/create/expense"
              element={<CreateExpenseForm />}
            ></Route>
            <Route path="/register" element={<RegisterForm />}></Route>
            <Route path="/login" element={<LoginForm />}></Route>
          </Routes>
        </div>
      </div>
      {/* <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Alert!!!</Modal.Title>
        </Modal.Header>
        <Modal.Body>Token is expiring in less than 20 seconds</Modal.Body>
        <Button variant="primary" onClick={() => refreshToken()}>
          Refresh Token
        </Button>
      </Modal> */}
    </AuthContext.Provider>
  );
}

export default App;

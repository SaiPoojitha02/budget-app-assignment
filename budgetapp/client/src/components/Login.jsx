import React, { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setAuthDetails } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the LoginModel object
    const loginData = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch("/api/authenticate/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        const expiration = data.expiration;
        setAuthDetails({
          isLoggedIn: true,
          token: token,
          expiration: expiration,
        });
        localStorage.setItem("app-token", token);
        localStorage.setItem("app-token-expiration", expiration);
        toast.success("User logged in successfully!");
        setTimeout(() => {
          // eslint-disable-next-line no-restricted-globals
          if (confirm("Token is going to expire, do you want to refresh it?")) {
            fetch("/api/authenticate/refresh-token", {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("app-token"),
              },
            })
              .then((data) => {
                return data.json();
              })
              .then((data) => {
                console.log(data);
                localStorage.setItem("app-token", data.token);
                localStorage.setItem("app-token-expiration", data.expiration);
              });
          } else {
            localStorage.removeItem("app-token");
            localStorage.removeItem("app-token-expiration");
            window.location = "/login";
          }
        }, 38000);
        navigate("/");
      } else {
        toast.error("User login failed!");
      }
    } catch (error) {
      toast.error("An error occurred during login:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="username">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="password">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Login
      </Button>
      <div>
        New here? <Link to="/register">Register</Link>
      </div>
    </Form>
  );
};

export default LoginForm;

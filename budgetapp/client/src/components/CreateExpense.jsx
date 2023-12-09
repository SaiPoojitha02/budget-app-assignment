import React, { useState, useEffect, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";

export const data = {};

const CreateExpenseForm = () => {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          setErrorMessage("Failed to fetch categories");
        }
      } catch (error) {
        setErrorMessage("Failed to fetch categories");
      }
    };
    if (token) fetchCategories();
  }, [token]);

  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ categoryId, name, amount }),
      });

      if (response.ok) {
        setCategoryId("");
        setName("");
        setAmount(0);
        setErrorMessage("");
        toast.success("Expense created successfully");
      } else {
        const data = await response.json();
        setErrorMessage(data.error || "Failed to create expense");
      }
    } catch (error) {
      setErrorMessage("Failed to create expense");
    }
  };

  return (
    <div>
      <h2>Create Expense</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={handleNameChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="amount">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            value={amount}
            onChange={handleAmountChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="category">
          <Form.Label>Category</Form.Label>
          <Form.Control
            as="select"
            value={categoryId}
            onChange={handleCategoryChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Create Expense
        </Button>
      </Form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default CreateExpenseForm;

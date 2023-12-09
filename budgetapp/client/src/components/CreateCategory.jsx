import React, { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";
const CreateCategoryForm = () => {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState(0);

  const { token } = useContext(AuthContext);

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleBudgetChange = (event) => {
    setBudget(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ name, budget }),
      });

      if (response.ok) {
        setName("");
        setBudget(0);
        toast.success("Category created successfully");
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to create category");
      }
    } catch (error) {
      toast.error("Failed to create category");
    }
  };

  return (
    <div className="w-100 ">
      <h3 className="text-center">Create Category</h3>
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
        <Form.Group controlId="budget">
          <Form.Label>Budget</Form.Label>
          <Form.Control
            type="number"
            value={budget}
            onChange={handleBudgetChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="mt-3">
          Create Category
        </Button>
      </Form>
    </div>
  );
};

export default CreateCategoryForm;

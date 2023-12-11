import React from "react";
import { render, screen } from "@testing-library/react";
import Login from "./components/Login";
import { MemoryRouter } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("Login Component rendered", () => {
  it("renders login component without crashing", async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  });
});

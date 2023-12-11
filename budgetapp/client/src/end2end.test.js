import React from "react";
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from "@testing-library/react";
import Login from "./components/Login";
import { MemoryRouter } from "react-router-dom";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("Login Component", () => {
  it("submits the form and navigates to dashboard on success", async () => {
    const mockResponse = { ok: true };
    jest.spyOn(window, "fetch").mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "testusername" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "testpassword" },
    });

    await act(async () => {
      fireEvent.submit(screen.getByRole("button", { name: /Login/i }));
    });
    await waitFor(() => expect(window.location.pathname).toBe("/"));
  });
});

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import CategoryPage from "./CategoryPage";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { useSelector } from "react-redux";
import '@testing-library/jest-dom';


// Mock child components (avoid rendering huge UI)
jest.mock("../components/UploadCategoryModel", () => () => <div>UploadCategoryModel</div>);
jest.mock("../components/EditCategory", () => () => <div>EditCategoryModal</div>);
jest.mock("../components/CofirmBox", () => ({ confirm }) => (
  <div data-testid="confirm-box">
    ConfirmBox
    <button onClick={confirm}>Confirm</button>
  </div>
));
jest.mock("../components/NoData", () => () => <div>NoData</div>);
jest.mock("../components/Loading", () => () => <div>Loading...</div>);

// Mock Axios & SummaryApi
jest.mock("../utils/Axios");
jest.mock("../common/SummaryApi", () => ({
  getCategory: { url: "/category", method: "GET" },
  deleteCategory: { url: "/deleteCategory", method: "DELETE" },
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

describe("CategoryPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("shows NoData when API returns empty list", async () => {
    Axios.mockResolvedValue({
      data: { success: true, data: [] },
    });

    render(<CategoryPage />);

    await waitFor(() => {
      expect(screen.getByText("NoData")).toBeInTheDocument();
    });
  });

  test("renders category cards when API returns data", async () => {
    Axios.mockResolvedValue({
      data: {
        success: true,
        data: [
          { _id: "1", name: "Fruits", image: "fruit.jpg", username: undefined },
        ],
      },
    });

    render(<CategoryPage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Fruits")).toBeInTheDocument();
    });
  });

  test("clicking Edit button opens EditCategory modal", async () => {
    Axios.mockResolvedValue({
      data: {
        success: true,
        data: [{ _id: "1", name: "Fruits", image: "fruit.jpg" }],
      },
    });

    render(<CategoryPage />);

    await waitFor(() => screen.getByText("Fruits"));

    fireEvent.click(screen.getByText("Edit"));

    expect(screen.getByText("EditCategoryModal")).toBeInTheDocument();
  });

  test("clicking Delete opens ConfirmBox", async () => {
    Axios.mockResolvedValue({
      data: {
        success: true,
        data: [{ _id: "1", name: "Fruits", image: "fruit.jpg" }],
      },
    });

    render(<CategoryPage />);

    await waitFor(() => screen.getByText("Fruits"));

    fireEvent.click(screen.getByText("Delete"));

    expect(screen.getByTestId("confirm-box")).toBeInTheDocument();
  });

  test("confirm delete calls API", async () => {
    Axios.mockResolvedValueOnce({
      data: {
        success: true,
        data: [{ _id: "1", name: "Fruits", image: "fruit.jpg" }],
      },
    });

    Axios.mockResolvedValueOnce({
      data: { success: true, message: "Deleted" },
    });

    render(<CategoryPage />);

    await waitFor(() => screen.getByText("Fruits"));

    fireEvent.click(screen.getByText("Delete"));

    const confirmBtn = screen.getByText("Confirm");
    fireEvent.click(confirmBtn);

    expect(Axios).toHaveBeenCalledTimes(2);
  });
});

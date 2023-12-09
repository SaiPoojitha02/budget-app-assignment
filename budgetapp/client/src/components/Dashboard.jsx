import React, { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { AuthContext } from "../contexts/AuthContext";
function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const { isLoggedIn, token, expiration } = useContext(AuthContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories", {
          headers: { Authorization: "Bearer " + token },
        });
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        } else {
          toast.error("Failed to fetch categories");
        }
      } catch (error) {
        toast.error("Failed to fetch categories");
      }
    };

    const fetchExpenses = async () => {
      try {
        const response = await fetch("/api/expenses", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setExpenses(data);
        } else {
          toast.error("Failed to fetch expenses");
        }
      } catch (error) {
        toast.error("Failed to fetch expenses");
      }
    };
    if (token) {
      fetchCategories();
      fetchExpenses();
    }
  }, [token]);

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;

  const totalExpensesByCategoryOfCurrentMonth = expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      const expenseMonth = expenseDate.getMonth() + 1;
      return expenseMonth === currentMonth;
    })
    .reduce((acc, expense) => {
      const { budgetCategoryId, amount } = expense;
      if (acc[budgetCategoryId]) {
        acc[budgetCategoryId] += amount;
      } else {
        acc[budgetCategoryId] = amount;
      }
      return acc;
    }, {});

  // Prepare data for the chart
  const chartData = categories.map((category) => ({
    name: category.name,
    budget: category.budget,
    expenses: totalExpensesByCategoryOfCurrentMonth[category.id] || 0,
  }));

  const totalExpensesByCategory = expenses.reduce((acc, expense) => {
    const { budgetCategoryId, amount } = expense;
    if (acc[budgetCategoryId]) {
      acc[budgetCategoryId] += amount;
    } else {
      acc[budgetCategoryId] = amount;
    }
    return acc;
  }, {});

  const pieChartData = Object.entries(totalExpensesByCategory).map(
    ([categoryId, amount]) => ({
      name: expenses.find(
        (expense) => expense.budgetCategoryId === parseInt(categoryId)
      ).budgetCategory.name,
      amount,
    })
  );

  const totalExpensesSum = expenses.reduce((acc, expense) => {
    acc += expense.amount;
    return acc;
  }, 0);

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#f68e5f",
    "#b9c2df",
    "#98df8a",
    "#ffcc99",
    "#c2c2d6",
    "#b3e6ff",
    "#e6ac00",
  ];

  if (!categories.length && !expenses.length) {
    return <div>No Categories or expenses found</div>;
  }

  return (
    <div>
      <div style={{}}>
        <h3 className="text-center">Categories Budget Comparison</h3>
        <BarChart
          width={600}
          height={300}
          data={categories}
          style={{ margin: "auto" }}
        >
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="budget" fill="#8884d8" />
        </BarChart>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
        className="mt-5"
      >
        <h3 className="text-center">Current Month Expenses vs Budgets</h3>
        <div
          style={{
            display: "flex",
          }}
        >
          <div className="mt-3">
            <BarChart width={600} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="budget" fill="#8884d8" name="Budget" />
              <Bar dataKey="expenses" fill="#82ca9d" name="Expenses" />
            </BarChart>
          </div>
          <div className="mt-3">
            <LineChart width={600} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="budget"
                stroke="#8884d8"
                name="Budget"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#82ca9d"
                name="Expenses"
              />
            </LineChart>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <h3 className="text-center">Total Expenses by Category</h3>
        <PieChart
          width={600}
          height={300}
          style={{
            margin: "auto",
          }}
        >
          <Pie
            data={pieChartData}
            dataKey="amount"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {pieChartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              `${value} (${((value / totalExpensesSum) * 100).toFixed(2)}%)`,
              name,
            ]}
          />
          <Legend />
        </PieChart>
      </div>
    </div>
  );
}

export default Dashboard;

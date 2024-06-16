import { Line, Pie } from "@ant-design/charts";
import React from "react";
import "./styles.css";

const Charts = ({ sortedTransactions }) => {
  const data = sortedTransactions.map((item) => {
    return { date: item.date, amount: item.amount };
  });

  const spendingData = sortedTransactions.filter((transaction) => {
    if (transaction.type === "expense") {
      return { tag: transaction.tag, amount: transaction.amount };
    }
  });

  const config = {
    data: data,
    width: 800,
    height: 400,
    autoFit: false,
    xField: "date",
    yField: "amount",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
  };

  const spendingConfig = {
    data: Object.values(spendingData),
    width: 500,
    height: 400,
    angleField: "amount",
    colorField: "tag",
    
  };

  return (
    <div className="charts-wrapper">
      <div className="chart-section">
        <h2>Finance Statistic</h2>
        <Line {...config} />
      </div>
      <div className="chart-section">
        <h2>All Expenses</h2>
        <Pie {...spendingConfig} />
      </div>
    </div>
  );
};

export default Charts;

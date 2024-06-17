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

  const getWidth = () => {
    if (window.innerWidth <= 600) return 400;
    if (window.innerWidth <= 800) return 600;

    return 800;

  };

  const getHeight = () => {
    if (window.innerWidth <= 600) return 200;
    if (window.innerWidth <= 800) return 300;

    return 400;
    
  };

  const config = {
    data: data,
    width: getWidth(),
    height: getHeight(),
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
    width: getWidth()/2,
    height: getHeight(),
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

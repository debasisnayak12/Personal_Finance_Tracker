import React, { useState } from "react";
import "./styles.css";
import { Radio, Select, Table } from "antd";
import { Option } from "antd/es/mentions";
import Button from "../Button";

const TransactionsTable = ({ transactions }) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
  ];

  let filteredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      item.type.includes(typeFilter)
  );

  let sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  return (
    <div className="transaction-table">
      <div className="search-area">
        <div className="input-flex">
          <span class="material-icons search-icon">search</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name"
          />
        </div>
        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>
      <div className="my-table">
        <div
          className="table-head"
        >
          <h2>My Transactions</h2>
          <Radio.Group
            className="input-field"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by date</Radio.Button>
            <Radio.Button value="amount">Sort by amount</Radio.Button>
          </Radio.Group>
          <div
            className="imp-exp-section"
          >
            <Button text="Export to CSV" />
            <label for="file-csv" className="btn btn-blue">
              Import from CSV
            </label>
            <input
              id="file-csv"
              type="file"
              accept=".csv"
              required
              style={{ display: "none" }}
            />
          </div>
        </div>
        <Table dataSource={sortedTransactions} columns={columns} />
      </div>
    </div>
  );
};

export default TransactionsTable;

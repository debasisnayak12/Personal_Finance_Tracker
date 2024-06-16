import React, { useState } from "react";
import "./styles.css";
import { Radio, Select, Table } from "antd";
import { Option } from "antd/es/mentions";
import Button from "../Button";
import { parse, unparse } from "papaparse";
import { toast } from "react-toastify";

const TransactionsTable = ({ transactions , addTransaction, fetchTransactions}) => {
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

  function exportCSV() {
    let csv = unparse({
      fields: ["name", "amount", "tag", "type", "date"],
      data: transactions,
    });
    let blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    let url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function importFromCsv(event){
    event.preventDefault();
    try{
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          const validTransactions = results.data.filter(transaction => {
            // Check if all required fields are present and non-empty
            return transaction.name && transaction.amount && transaction.tag && transaction.type && transaction.date;
          });
          // Now results.data is an array of objects representing your CSV rows
          for(let transaction of validTransactions){
            // Write each transaction to firebase, you can use the addTransaction function here
            const newTransaction = {
              ...transaction, amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          } 
        }
      });
      toast.success("All Transaction Added");
      fetchTransactions();
      event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  }


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
        <div className="table-head">
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
          <div className="imp-exp-section">
            <Button text="Export to CSV" onClick={exportCSV} />
            <label for="file-csv" className="btn btn-blue">
              Import from CSV
            </label>
            <input
              id="file-csv"
              type="file"
              accept=".csv"
              required
              onChange={importFromCsv}
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

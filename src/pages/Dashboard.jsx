import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import AddExpense from "../components/Modal/AddExpense";
import AddIncome from "../components/Modal/AddIncome";
import { addDoc, collection, doc, getDocs, query, writeBatch } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import TransactionsTable from "../components/TransactionsTable";
import Charts from "../components/Charts";
import NoTransaction from "../components/NoTransaction";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [user] = useAuthState(auth);

  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [currentBalance, setCurrentBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if(!many) toast.success("Transaction Added!");
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document: ", e);
      if(!many) toast.error("Couldn't add transaction");
    }
  }

  useEffect(() => {
    // Get all Docs from a collection 
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expenseTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setCurrentBalance(incomeTotal - expenseTotal);
  };

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapShot = await getDocs(q);
      let transactionsArray = [];
      querySnapShot.forEach((doc) => {
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      // console.log(transactionsArray);
      toast.success("Transaction fetched!");
    }
    setLoading(false);
  }

  async function resetBalance(){
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapShot = await getDocs(q);
      let batch = writeBatch(db);
      querySnapShot.forEach((docSnapshot) => {
        const docRef = doc(db, `users/${user.uid}/transactions`, docSnapshot.id);
        batch.delete(docRef);
      });
      await batch.commit();
      setTransactions([]);
      setIncome(0);
      setExpense(0);
      setCurrentBalance(0);
      toast.success("Balance reset Successdully!");
    }
    setLoading(false);
  }

  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });


  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            currentBalance={currentBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
            resetBalance={resetBalance}
          />
          {transactions.length !== 0 ? <Charts sortedTransactions={sortedTransactions} /> : <NoTransaction /> }
          <AddExpense
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncome
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />
        <TransactionsTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions}/>
        </>
      )}
    </div>
  );
};

export default Dashboard;

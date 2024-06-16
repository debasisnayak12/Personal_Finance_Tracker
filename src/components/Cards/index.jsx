import React from 'react'
import "./styles.css";
import { Card, Row } from 'antd';
import Button from '../Button';

const Cards = ({income, expense, currentBalance, showExpenseModal, showIncomeModal, resetBalance}) => {
  return (
    <div>
        <Row className='my-row'>
            <Card className="my-card" title="Current Balance">
                <p>₹ {currentBalance}</p>
                <Button text="Reset Balance" blue={true} onClick={resetBalance}/>
            </Card>
            <Card className="my-card" title="Total Income">
                <p>₹ {income}</p>
                <Button text="Add Income" blue={true} onClick={showIncomeModal} />
            </Card>
            <Card className="my-card" title="Total Expenses">
                <p>₹ {expense}</p>
                <Button text="Add Expense" blue={true} onClick={showExpenseModal} />
            </Card>
        </Row>
    </div>
  )
}

export default Cards
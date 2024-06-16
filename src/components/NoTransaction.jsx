import React from 'react'
import transaction from "../assets/notransaction.png";

const NoTransaction = () => {
  return (
    <div
     style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        flexDirection: "column",
        marginBottom: "2rem",
     }}>
        <img src={transaction} style={{ width: "400px", margin: "3rem" }}/>
        <p style={{ textAlign: "center", fontSize: "1.2rem" }}>You have No Transactions Currently</p>
    </div>
  )
}

export default NoTransaction
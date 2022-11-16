import React, {useContext} from "react";
import './welcome.css';

import {TransactionContext} from "../context/TransactionContext";
import {shortenAddress} from "../utils/shortenAddress";
var Web3 = require('web3');
var moment = require('moment');

const hexToDecimal = hex => parseInt(hex, 16);

const Welcome = () => {
    const {connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, isLoading, transactionCount, allTransactions} = useContext(TransactionContext);
    console.log("allTransactions", allTransactions);
    console.log(moment.unix(1668606036).format('LLLL'));
    const handleSubmit = (e) => {
        const { addressTo, amount, keyword, message } = formData;
        console.log( addressTo, amount, keyword, message);
        e.preventDefault();
        if (!addressTo || !amount || !keyword || !message) {
            alert("all field are required");
            return;
        }
        sendTransaction();
    }
    return (
        <div className='main'>
            <div className="web-title">
                Welcome to Fronted App
            </div>
            <hr></hr>
            <div className="connect-wallet">
                {!currentAccount && (
                    <button className="connect-wallet-btn" onClick={ connectWallet }>Connect Wallet</button>
                )}
            </div>

            <div className="wallet-id"> 
                {!currentAccount && (
                    <span> Connect Wallet to start transaction and to see all transactions </span>
                )}
                {currentAccount && (
                    <span> Wallet Connected, Account Id: { shortenAddress(currentAccount) } </span>
                )}
            </div>

            {currentAccount && (
                transactionForm(handleChange, handleSubmit, isLoading)
            )}

            <hr></hr>
            {currentAccount && (
                <div className="web-title"> All transactions </div>
            )}
            <div className="wallet-id"> 
                {currentAccount && (
                    <span> Total Transaction: { transactionCount } </span>
                )}
            </div>

            <div className="table-view">
                { transactionList(allTransactions) }
            </div>
            
        </div>
    )
}

const transactionForm = (handleChange, handleSubmit, isLoading) => {
    return (
        <div className="transaction-form">
            <div>
                Address To: 
                <input type="text" name="addressTo" placeholder="Set receiver account id" onChange={handleChange} />
            </div>

            <div>
                Amount (ETH): 
                <input type="number" min={0.00001} step=".00001" name="amount" placeholder="Enter amount to transfer" onChange={handleChange} />
            </div>
            
            <div>
                Keyword:
                <input type="text" name="keyword" placeholder="Enter the keyword" onChange={handleChange} />
            </div>

            <div>
                Message: 
                <input type="text" name="message" placeholder="Enter an message" onChange={handleChange} />
            </div>

            <div>
                {!isLoading && (
                    <button className="connect-wallet-btn" onClick={ handleSubmit }>Send</button>
                )}
                {isLoading && (
                    <button disabled className="connect-wallet-btn color-grey"> Processing ... </button>
                )}
            </div>
        </div>
    )
}

const transactionList = (allTransactions) => {
    return (
        <table className="transaction-list" id="transactions">
            <thead>
                <tr>
                    <th>Transaction From</th>
                    <th>Transaction To</th>
                    <th>Amount(ETH)</th>
                    <th>Message</th>
                    <th>Keyword</th>
                    <th>Transaction Time</th>
                </tr>
            </thead>
            
            <tbody>
                {
                    allTransactions.map(dataObj => ( 
                        <tr>
                            <td>{ shortenAddress(dataObj.sender) }</td>
                            <td>{ shortenAddress(dataObj.receiver) }</td>
                            {/* https://piyopiyo.medium.com/how-to-convert-ether-from-wei-and-vice-versa-with-web3-1-0-0-3e3e691e3f0e */}
                            <td>{ Web3.utils.fromWei(String(hexToDecimal(dataObj.amount._hex)), 'ether') }
                            </td>
                            <td>{ dataObj.message }</td>
                            <td>{ dataObj.keyword }</td>
                            <td>{ moment.unix(hexToDecimal(dataObj.timestamp._hex)).format('LLLL') }</td>
                        </tr>
                    ))
                }
            </tbody>
        </table>
    )
}

export default Welcome
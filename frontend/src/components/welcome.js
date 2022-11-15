import React, {useContext} from "react";
import './welcome.css';

import {TransactionContext} from "../context/TransactionContext";
import {shortenAddress} from "../utils/shortenAddress";

const Welcome = () => {
    const {connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction} = useContext(TransactionContext);
    const handleSubmit = (e) => {
        console.log(formData);
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

            <div className="connect-wallet">
                {!currentAccount && (
                    <button className="connect-wallet-btn" onClick={ connectWallet }>Connect Wallet</button>
                )}
            </div>

            <div className="wallet-id"> 
                {currentAccount && (
                    <span> Wallet Connected, Account: { shortenAddress(currentAccount) } </span>
                )}
            </div>

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
                    <button className="connect-wallet-btn" onClick={ handleSubmit }>Send</button>
                </div>
            </div>
        </div>
    )
}

export default Welcome
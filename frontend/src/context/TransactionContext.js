import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractAbi, contractAddress } from "../constant/constant";

export const TransactionContext = React.createContext();
const { ethereum } = window;

//https://docs.ethers.io/v4/cookbook-providers.html
const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractAbi, signer);
    return transactionContract;
}

export const TransactionProvider = ({children}) => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [formData, setFormData] = useState({ senderName: "", addressTo: "", receiverName: "", amount: "", message: "" })
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [allTransactions, setAllTransactions] = useState([]);

    const handleChange = (e, name) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
            isError: false
        });
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if (!ethereum) return alert("Please install metamask to your browser");
            const accounts = await ethereum.request({ method : "eth_accounts"});
            if (accounts.length) {
                setCurrentAccount(accounts[0]);
                checkIfTransactionExists();
                getAllTransactions();
            }
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object");
        }
    }
    
    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install metamask to your browser");
            const accounts = await ethereum.request({ method : "eth_requestAccounts"});
            setCurrentAccount(accounts[0]);
            checkIfTransactionExists();
            getAllTransactions();
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object");
        }
    }

    const sendTransaction = async() => {
        try {
            if (!ethereum) return alert("Please install metamask to your browser");
            const { senderName, addressTo, receiverName, amount, message } = formData;
            setIsLoading(true);
            const transactionContract = getEthereumContract ();
            const parseAmount = ethers.utils.parseEther(amount);
            console.log(senderName, addressTo, receiverName, amount, message);
            // https://docs.metamask.io/guide/sending-transactions.html#example
            await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0xC350', //50000 GWEI
                    value: parseAmount._hex
                }]
            });
            const transactionHash = await transactionContract.addToBlockchain(senderName, addressTo, receiverName, parseAmount, message);
            await transactionHash.wait();
            setIsLoading(false);
            console.log("transactionHash", transactionHash);

            const transactionCount = await transactionContract.getTransactionCount();
            console.log("transactionCount after transaction", transactionCount, transactionCount.toNumber());
            setTransactionCount(transactionCount.toNumber());
            getAllTransactions();
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            throw new Error("No Ethereum object");
        }
    }

    const checkIfTransactionExists = async () => {
        try {
            const transactionContract = getEthereumContract();
            const transactionCount = await transactionContract.getTransactionCount();
            window.localStorage.setItem("transactionCount", transactionCount);
            setTransactionCount(transactionCount.toNumber());
            console.log("transactionCount onload", transactionCount, transactionCount.toNumber());
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object");
        }
    }

    const getAllTransactions = async () => {
        try {
            if (!ethereum) return alert("Please install metamask to your browser");
            const transactionContract = getEthereumContract();
            const availableTransactions = await transactionContract.getAllTransactions();
            setAllTransactions(availableTransactions);
            //console.log("availableTransactions", availableTransactions);
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object");
        }
    }

    return(
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, isLoading, transactionCount, allTransactions }}>
            {children}
        </TransactionContext.Provider>
    );
}
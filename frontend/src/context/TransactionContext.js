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
    const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" })
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    
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
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object");
        }
    }

    const sendTransaction = async() => {
        console.log("sendTransaction working");
        try {
            if (!ethereum) return alert("Please install metamask to your browser");
            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract ();
            const parseAmount = ethers.utils.parseEther(amount);
            
            await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', //21000 GWEI
                    value: parseAmount._hex
                }]
            });
            console.log(addressTo, parseAmount, message, keyword);
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parseAmount, message, keyword);
            console.log("transactionHash", transactionHash);
            setIsLoading(true);
            await transactionHash.wait();
            setIsLoading(false);

            const transactionCount = await transactionContract.getTransactionCount();
            setTransactionCount(transactionCount.toNumber());
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object");
        }
    }

    const checkIfTransactionExists = async () => {
        try {
            const transactionContract = getEthereumContract();
            const transactionCount = await transactionContract.getTransactionCount();
            window.localStorage.setItem("transactionCount", transactionCount);
            console.log("transactionCount", transactionCount);
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
            console.log("availableTransactions", availableTransactions);
        } catch (error) {
            console.log(error);
            throw new Error("No Ethereum object");
        }
    }

    return(
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction }}>
            {children}
        </TransactionContext.Provider>
    );
}
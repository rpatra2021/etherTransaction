//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Transactions {
    uint256 totalTransactionCount=0;
    event Transfer(address form, string senderName, address receiver, string receiverName, uint amount, string message, uint256 timestamp, bytes32 blockChainId, uint blockNumber);
   
    struct TransferStruct {
        address sender;
        string senderName;
        address receiver;
        string receiverName;
        uint amount;
        string message;
        uint256 timestamp;
        bytes32 blockChainId;
        uint blockNumber;
    }

    // https://www.geeksforgeeks.org/array-of-structures-vs-array-within-a-structure-in-c-and-cpp/
    TransferStruct[] transactionList;

    function addToBlockchain(string memory senderName, address payable receiver, string memory receiverName, uint amount, string memory messsage) public {
        totalTransactionCount = totalTransactionCount+1;
        transactionList.push(TransferStruct(msg.sender, senderName, receiver, receiverName, amount, messsage, block.timestamp, blockhash(totalTransactionCount), block.number ));
        emit Transfer(msg.sender, senderName, receiver, receiverName, amount, messsage, block.timestamp, blockhash(totalTransactionCount), block.number );
    }

    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transactionList;
    }

    function getTransactionCount() public view returns (uint256) {
        return totalTransactionCount;
    }
}
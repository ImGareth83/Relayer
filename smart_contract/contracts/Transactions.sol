// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Transactions {
  address admin;

  constructor(){
    admin = msg.sender;
  }

  struct Transfer{
    address from;
    address to;
    uint id;
    uint value;
    uint last_updated;
  }

  mapping(uint=>Transfer) public transfers;
}

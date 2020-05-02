pragma solidity >=0.4.21 <0.7.0;
contract HelloWorld {
address owner;
string greeting = "Hello World";
    // Constructor function
constructor HelloWorld () public {

owner = msg.sender; }
    function greet ()  public returns (string memory) {
    return greeting;
}
function kill () 
public { 
require(owner == msg.sender); 
selfdestruct(owner);
} 
}
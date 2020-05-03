pragma solidity >=0.4.16 <0.7.0;

interface CardGame {
    

    function changeCardSuit(uint16 _suit) external returns (uint16);

    function revealCardValue(uint16 _index) external view returns(uint16);

    function revealCardSuit(uint16 _index) external view returns(string);

    function revealFullCard(uint16 _index) external view returns(uint16,uint16);

    function commitCard(uint16 _card_committed, uint16 _quantity) external;

}
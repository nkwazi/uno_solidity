pragma solidity >=0.4.16 <0.7.0;

import 'uno-lib.sol';
import 'card-game.sol'


contract Uno is CardGame{
    
    using CardLib for *;

    uint16 cards = 8;

    CardLib.Card[8] hand;


    byter32[8] blind_hand;

    CardLib.Rules rules;


    constructor(uint8 max_player) public payable {

    rules = CardLib.Rules(8, 4, max_player, true);

    }

    function changeCardSuit(uint16 _suit) external returns(uint16);

    function commitCard(uint16 _card_commited, uint16 _quantity) external;
    
    function revealFullCard(uint16 _index) external view returns (uint16, uint16);
}
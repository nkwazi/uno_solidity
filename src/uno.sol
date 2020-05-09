/* Bachelor Thesis
Distributed card game on the blockchain
Luka Vucenovic & Janek de Kock
*/
pragma solidity >=0.4.16 <0.7.0;

enum Suit {Red, Blue, Yellow, Green, Black}
enum Value {Zero, One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Skip, Switch, PlusTwo, ChooseColor, PlusFourColor}

struct Card {
    Value value;
    Type type;
}

struct Deck {
    Card[108] deck_state;
    Card[108] card_used;
    Card[108] card_player;
    Card[108] card_left;
    bool full_deck;
    bool empty_deck;
}

struct Rules {
    uint16 min_player;
    uint16 max_player;
    bool ready;

}

struct Player {
    string player_name;
    address player_address;
    // if turn is true , the user is able to put his card on the table.
    bool turn; 
    byte32 secret_nonce;

}

contract uno {
    
    address private _player;

    bool private _roundInProgress;
    bool private _displayUpdate;

    uint256 private _ethLimit = 10000000 wei;
    uint256 private _dUnoBalance;
    uint256 private _origBalance;
    uint256 private _gameBalance;
    uint256 private _newCardTable;
    uint256 private _rngCounter;
    uint256 private _randNum;
    uint[]  private _cardsTable;
    uint[24] private _cards;
    uint[12] private _players;
    uint256 private _playerBet;
    uint256 pricate _playersPot;
    uint8 private _playersCount;
    uint8 private _cardsCount;

    string private _msg;

    //events for betting eth and then withdrawing it after winning
    event PlayerDeposit(address Contract, address Player, uint256 Amount);
    event PlayerWithdrawal(address Contract, address Player, uint256 Amount);


    // Make sure the address is Valid.
    modifier isValidAddr() {
        require(msg.sender != 0x0, "Invalid Address.");
        _;
    }

    //Make sure address is connected Player
    modifier isPlayer() {
        require(msg.sender == _player, "Only Player can use this function.");
        _;
    }
    
    //Make sure function can only be used while round in progress
    modifier playerTurn() {
        require(_roundInProgress == true, "This Function can only be used while round is in progress.");
        _;
    }

    modifier isValidDrop{
        require(_card.value)
    }

//TODO: Make possible playing again, after finishing a game.
    function () isValidAddr newRound public payable {
        //Players must use PayContract function to pay
        revert("Please use PayContract Function to pay.");
    }

    //Pay the contract or in our world place the bet. 
    function payContract() isValidAddr newRound public payable returns (string) {

    if(_origBalance >0)
        require(_player == msg.sender, "Player ready to play(pay)");
        require((_origBalance + msg.value) <= _ethLimit, "Too much Ether!");

        _origBalance += msg.value;
        _gameBalance = _origBalance;

        //Setting players address
        _player = msg.sender;

        emit PlayerDeposit(address(this), msg.sender, msg.value);

        _msg = "Contract Paid, Bet placed. Enjoy playing dUno!"
        return _msg;
    }

    function randomNr() internal returns (uint randomNumber){
        uint seed;
        _rngCounter *= 2;
        seed = now - _rngCounter;
        _randNum = (uint(keccak256(abi.encodePacked(blockhash(block.number -1), seed)))%14 +1);

        // Here we need to define the special card(switch, color). They will be numbers higher than 9. How can this be intilialized right? Should this be done in generateCards(); ??
        if(_randNum = 10)
            _randNum = Value.Skip;

        if(_randNum = 11)
            _randNum = Value.Switch;

        if(_randNum = 12)
            _randNum = Value.PlusTwo;

         if(_randNum = 13)
            _randNum = Value.ChooseColor;

         if(_randNum = 14)
            _randNum = Value.PlusFourColor;


        // reset the RNG Counter, to prevent unecessary large number and overflow
        if(_rngCounter > 420000000)
            _rngCounter = _randNum;

            return _randNum;

    }

    function generateCards() 

    function hashCard(Card memory _your_card, bytes32 secret_nonce) internal pure returns
    (bytes32) {
        (Suit _suit, Value _value) = (your_card.suit, your_card.value);
        return keccak256(abi.encode(_suit, _value, secret_nonce));
    }


    function placeBet(uint256 bet) isValidAddr isPlayer newRound public returns (string) {
        uint256 betEth;
        betEth = bet;

        require(betEth >= 1 wei && betEth <= 1000 wei, "Limit of Bets; 1-1000 wei");
        require(betEth <= _gameBalance, "Sorry, not enough eth!");

        //Update players deposit
        _gameBalance -= betEth;

        _roundInProgress = true;
    }

    function takeBetMoney() isValidAddr isPlayer newRound public returns(string){

        uint256 tempBalance = 0;

        if(_gameBalance < _origBalance)
            _Msg = "You lost your Ether!"

        emit PlayerWithdrawal(this, msg.sender, tempBalance);

        address(msg.sender).trasfer(_dUnoBalance);

        return _Msg;
    }

    //TODO: Filling the array with the different cards?
    // How is this going to be implemented? 
    function deal() internal returns(string){

        _cards = 0
    }

    function cardTable() public view 
        returns(string Message, uint[] players, uint playersPot, 
        uint[] playersCards, uint[] tableCards){

         return (_msg,_players, _playersPot, _cards, _cardsTable)
       
       }

    function pickCardFromDeck() public returns (Card memory) {
        require(deck.length != 0, "no more card on the deck");
        uint last_card = deck.length -1 ;
        Card memory picked_cafd = deck[last_card];

        deck.pop();

        return picked_card;

    }



}
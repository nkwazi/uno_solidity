/* Bachelor Thesis
Distributed card game on the blockchain
Luka Vucenovic & Janek de Kock
*/
pragma solidity >=0.4.16 <0.7.0;

contract uno {
    
    address private _player;

    bool private _roundInProgress;
    bool private _displayUpdate;

    uint256 private _ethLimit = 10000000 wei;
    uint256 private _dUnoBalance;
    uint256 private _origBalance;
    uint256 private _gameBalance;
    uint[24] private _cards;
    uint[12] private _players
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



}
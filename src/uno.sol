pragma solidity ^0.5.17;

contract Ownable {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev The Ownable constructor sets the original `owner` of the contract to the sender
     * account.
     */
    constructor () internal {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), _owner);
    }

    /**
     * @return the address of the owner.
     */
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(isOwner());
        _;
    }

    /**
     * @return true if `msg.sender` is the owner of the contract.
     */
    function isOwner() public view returns (bool) {
        return msg.sender == _owner || tx.origin == _owner;
    }

    /**
     * @dev Allows the current owner to relinquish control of the contract.
     * @notice Renouncing to ownership will leave the contract without an owner.
     * It will not be possible to call the functions with the `onlyOwner`
     * modifier anymore.
     */
    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers control of the contract to a newOwner.
     * @param newOwner The address to transfer ownership to.
     */
    function _transferOwnership(address newOwner) internal {
        require(newOwner != address(0));
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}


/**
 * @title SafeMath
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {

  /**
  * @dev Multiplies two numbers, throws on overflow.
  */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    /**
    * @dev Integer division of two numbers, truncating the quotient.
    */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }

    /**
    * @dev Substracts two numbers, throws on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    /**
    * @dev Adds two numbers, throws on overflow.
    */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

contract Uno is Ownable {
    using SafeMath for uint256;
    
    address[] public players;
    uint256 public nextMover = 0;
    bool public gameStarted = false;
    uint256 public lastTimeMoved;
    
    // Events
    event GameStarted();
    event PlayerJoined(address player);
    event PlayerMoved(address player, string hash);
    event WinnerChosen(address player);

    //A new player joins the game
    function joinGame() public payable {
        require(!gameStarted, "Game already started");
        require(isPlaying(msg.sender) == false, "Already joined");
        require(msg.value == 0.1 ether, "You must send 0.1 eth");
        
        players.push(msg.sender);
        
        emit PlayerJoined(msg.sender);
    }
    
    //The platform initiates a new game. No more players can join
    function startGame() external onlyOwner {
        require(!gameStarted, "Game already started");
        require(players.length > 1, "At least 2 players are required");
        
        gameStarted = true;
        lastTimeMoved = now;
    }
    
    //Each player moves on their turn and send the hash representing the movement
    function move(string calldata _hash) external {
        require(isPlaying(msg.sender), "Invalid player");
        require(players[nextMover] == msg.sender, "Wrong mover");
        lastTimeMoved = now;

        setNextPlayer();
        
        emit PlayerMoved(msg.sender, _hash);
    }
    
    //The platform defines a player as the winner, transfes him the ETH and reinitializes the game
    function chooseWinner(address payable _player) public onlyOwner payable {
        require(isPlaying(_player), "The player is not part of the game");
        require(gameStarted, "Game not started");
        
        delete players;
        gameStarted = false;
        nextMover = 0;
        _player.transfer(address(this).balance);
        
        emit WinnerChosen(_player);
    }
    
    function expulsePlayer(address player) public onlyOwner {
        _removePlayerByValue(player);
        
        nextMover = nextMover % players.length;
        lastTimeMoved = now;
    }
    
    
    function expulsePlayerForTimeout(address _player) public {
        require(isPlaying(_player), "Invalid player");
        require(players[nextMover] == _player, "Not current mover");
        require(isTimeout(), "Not enough time passed for timeout");
        
        _removePlayerByValue(_player);
        
        nextMover = nextMover % players.length;
        lastTimeMoved = now;
    }
    
    function setNextPlayer() internal {
        nextMover = (nextMover.add(1)) % players.length;
    }

    function isPlaying(address _player) public view returns(bool) {
        for (uint256 i = 0; i < players.length; i++) {
            if (players[i] == _player) {
                return true;
            }
        }
        
        return false;
    }
    
    function isTimeout() public view returns (bool) {
        return now - lastTimeMoved > 3 minutes;
    }

    function _findPlayer(address _value) internal view returns(uint) {
        uint i = 0;
        while (players[i] != _value) {
            i++;
        }
        return i;
    }

    function _removePlayerByValue(address _value) internal {
        uint i = _findPlayer(_value);
        _removePlayerByIndex(i);
    }

    function _removePlayerByIndex(uint _i) internal {
        while (_i<players.length-1) {
            players[_i] = players[_i+1];
            _i++;
        }
        players.length--;
    }
    
    //This avoids player sending ETH to the contract by mistake
    function() external payable {
        revert();
    } 
}
pragma solidity >=0.4.16 <0.7.0;

library CardLib {
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
	bool ready;
	uint16 min_player;
	uint16 max_player;

}

struct Player {
	string player_name;
	address player_address;
	// bool turn; Do we need this? Or how do we implement allowing players to place the cards.
	byte32 secret_nonce;

}

	function setPlayer(string calldata _player_name, string calldata passphrase) external view returns(string memory, address, bool, byte32){
		Player memory new_player = Player({
		player_name: _player_name,
		player_address = msg.sender,
		turn: false,
		speed_turn: false,
		secret_nonce: keccak256(abi.encode(passphrase))
		});
	return(new_player.player_name, new_player.player_address, new_player.turn, new_player.speed_turn, new_player.secret_nonce);
}
 
	function shuffleDeck() public pure;

    function hashCard(Card memory your_card, bytes32 secret_nonce) internal pure returns (bytes32) {
        (Suit _suit, Value _value) = (your_card.suit, your_card.value);
        return keccak256(abi.encode(_suit, _value, secret_nonce));
    }

    function getSuitKeyByValue(Suit _suit) internal pure returns (string memory) {
        // Error handling for input
        require(uint8(_suit) <= 5, "Suit does not exist");
        // Loop through possible options
        if (Suit.Red == _suit) return "Red";
        if (Suit.Blue == _suit) return "Blue";
        if (Suit.Yellow == _suit) return "Yellow";
        if (Suit.Green == _suit) return "Green";
        if (Suit.Black == _suit) return "Black";
    }

    function checkSuitValueByKey (string memory _mySuit) internal pure returns (Suit) {
        // keccak256() only accept bytes as arguments, so we need explicit conversion
        bytes memory mySuit = bytes(_mySuit);
        bytes32 Hash = keccak256(mySuit);
        // Loop to check
        if (Hash == keccak256("Red") || Hash == keccak256("red")) return Suit.Red;
        if (Hash == keccak256("Blue") || Hash == keccak256("blue")) return Suit.Blue;
        if (Hash == keccak256("Yellow") || Hash == keccak256("yellow")) return Suit.Yellow;
        if (Hash == keccak256("Green") || Hash == keccak256("green")) return Suit.Green;
        if (Hash == keccak256("Black") || Hash == keccak256("black")) return Suit.Black;
        revert("error in value provided");
    }

}

	contract UnoGame {

	using CardLib for *;

	CardLib.Card[] public deck;


	constructor() public{

	}
    function pickCardFromDeck() public returns(CardLib.Card memory) {
        require(deck.length != 0, "no more card on the deck");
        uint last_card = deck.length - 1;
        CardLib.Card memory picked_card = deck[last_card];
        
        // .pop() the last card from the top card stack
        deck.pop();
        
        return picked_card;
    }

	}
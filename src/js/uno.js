var cards = new Array(108), players = new Array(5);

function new_game() {
  make_deck()
  shuffle(cards)
  show_players()
}

function Player(name, card1, card2) {
  this.name = name;
  this.card1 = card1;
  this.card2 = card2;
}

function Card(number, colour) {
  this.number = number;
  this.colour = colour;
}

function show_players() {
  str = "";
  for (i = 0; i < 5; i++) {
    players[i] = new Player("Player" + i, "", "");
    str += "Player: " + players[i].name + "\n";
  }
  update_game_text('game', str);
  update_game_text('stack', "")
}

function start_game() {
  top_card = cards.pop();
  update_game_text('stack', top_card)
}

function deal_cards() {
  str = "";
  for (i = 0; i < 5; i++) {
    card1 = cards.pop();
    card2 = cards.pop();
    players[i] = new Player("Player" + i, card1, card2);
    str += "Player: " + players[i].name + "\t" + players[i].card1 + "\t" + players[i].card2 + "\n";
  }
  update_game_text('game', str);
}

function make_deck() {
  var i, j = 0;
  for(i = 0; i < 15; i++) {
    switch (i) {
      case 0:
        cards[j++] = new Card("Red", i);
        cards[j++] = new Card("Blue", i);
        cards[j++] = new Card("Green", i);
        cards[j++] = new Card("Yellow", i);
        break;
      case 10:
        cards[j++] = new Card("Red", "Skip");
        cards[j++] = new Card("Blue", "Skip");
        cards[j++] = new Card("Green", "Skip");
        cards[j++] = new Card("Yellow", "Skip");
        cards[j++] = new Card("Red", "Skip");
        cards[j++] = new Card("Blue", "Skip");
        cards[j++] = new Card("Green", "Skip");
        cards[j++] = new Card("Yellow", "Skip");
        break;
      case 11:
        cards[j++] = new Card("Red", "Turn");
        cards[j++] = new Card("Blue", "Turn");
        cards[j++] = new Card("Green", "Turn");
        cards[j++] = new Card("Yellow", "Turn");
        cards[j++] = new Card("Red", "Turn");
        cards[j++] = new Card("Blue", "Turn");
        cards[j++] = new Card("Green", "Turn");
        cards[j++] = new Card("Yellow", "Turn");
        break;
      case 12:
        cards[j++] = new Card("Red", "+2");
        cards[j++] = new Card("Blue", "+2");
        cards[j++] = new Card("Green", "+2");
        cards[j++] = new Card("Yellow", "+2");
        cards[j++] = new Card("Red", "+2");
        cards[j++] = new Card("Blue", "+2");
        cards[j++] = new Card("Green", "+2");
        cards[j++] = new Card("Yellow", "+2");
        break;
      case 13:
        cards[j++] = new Card("Black", "Chooser");
        cards[j++] = new Card("Black", "Chooser");
        cards[j++] = new Card("Black", "Chooser");
        cards[j++] = new Card("Black", "Chooser");
        break;
      case 14:
        cards[j++] = new Card("Black", "+4");
        cards[j++] = new Card("Black", "+4");
        cards[j++] = new Card("Black", "+4");
        cards[j++] = new Card("Black", "+4");
        break;
      default:
        cards[j++] = new Card("Red", i);
        cards[j++] = new Card("Blue", i);
        cards[j++] = new Card("Green", i);
        cards[j++] = new Card("Yellow", i);
        cards[j++] = new Card("Red", i);
        cards[j++] = new Card("Blue", i);
        cards[j++] = new Card("Green", i);
        cards[j++] = new Card("Yellow", i);
    }
  }
}

// Fisher-Yates (aka Knuth) Shuffle
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function print_cards() {
  var i = 0;
  var str = "Cards: ";
  while (i < 108) {
    str += "\n";
    str += cards[i];
    i++;
  }
  update_game_text(str);
}

function update_game_text(id, text) {
  game = document.getElementById(id);
  game.textContent = text;
}

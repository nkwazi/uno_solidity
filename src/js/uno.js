'use strict';
var cards = [];
var dropped_cards = [];
var players = [];

function new_game() {
  make_deck();
  dropped_cards = [];
  update_game_text('stack', "");
  shuffle(cards);
  generate_players(3);
  show_players();
  heap_count();
}

function Card(number, colour) {
  this.number = number;
  this.colour = colour;
}

function drop_allowed(card) {
  // TODO: check if card can be dropped  
}

function generate_players(no_of_players) {
  for (var i = 0; i < no_of_players; i++) {
    players[i] = {
      name: "Player " + i,
      pl_cards: []
    }
  }
}

function get_cards(p) {
  var cards_str = "";
  var no_of_cards = players[p].pl_cards.length;
  for (let j = 0; j < no_of_cards; j++) {
    cards_str += players[p].pl_cards[j].number + " " + players[p].pl_cards[j].colour + "\t";
  }
  return cards_str;
}

function show_players() {
  var player_str = "";
  var numb_of_players = players.length;
  for (let k = 0; k < numb_of_players; k++) {
    player_str += players[k].name + "\t" + get_cards(k) + "\n";
  }
  update_game_text('game', player_str);
}

function start_game() {
  var top_card = cards.pop();
  var text = top_card.colour + " " + top_card.number;
  dropped_cards.push(top_card);
  update_game_text('stack', text);
  heap_count();
}

function draw_card() {
  var p = prompt('Enter player number');
  if (cards.length > 0) {
    var new_card = cards.pop();
  }
  players[p].pl_cards.push(new_card);
  show_players();
}

function drop_card() {
  var p = prompt('Enter player number');
  if (players[p].pl_cards.length > 0) {
    var card = players[p].pl_cards.pop();
  }
  else if (players[p].pl_cards.length == 1) {
    won();
  }
  update_game_text('stack', card);
  dropped_cards.push(card);
  show_players();
}

function deal_cards(nmb_of_cards) {
  for (let i = 0; i < players.length; i++) {
    var j = 0;
    while (j < nmb_of_cards) {
      var popped_card = cards.pop();
      players[i].pl_cards.push(popped_card);
      j++;
    }
  }
  show_players();
  heap_count();
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

function won() {
  alert('Game over');
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
  while (i < cards.length) {
    str += "\n";
    str += cards[i].colour + " " + cards[i].number;
    i++;
  }
  update_game_text('game', str);
}

function update_game_text(id, text) {
  game = document.getElementById(id);
  game.textContent = text;
}

function heap_count() {
  update_game_text('heap', "Heap count: " + cards.length);
  update_game_text('dropped_cards', "Dropped cards: " + dropped_cards.length);
}

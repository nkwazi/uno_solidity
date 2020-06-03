import React, { Component } from 'react';
import { Game, Color, Value } from 'uno-engine';
import Web3 from 'web3';

export default class Uno extends Component {

  _player2 = 'Player 2';

  constructor(props) {
    super(props);
    this.state = {
      players: [],
      game: {},
      name: '',
      mainHand: [],
      account: '',
      gameReady: false,
      gameState: 'Waiting for players...',
    };
  }

  componentDidMount() {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      web3.eth.getAccounts((err, accounts) => {
        if (err) {
          throw err;
        }
        if (accounts.length == 0) {
          console.log('Locked');
        } else {
          this.isGameReady()
          this.setState({ account: accounts[0] })
          console.log('Connected');
        }
      });
    } else {
      this.couldNotConnect()
      console.log('Unavailable');
    }
    this.setState({ name: this.props.name})
    this.setState({ players: [this.props.name, this._player2] })
    this.pushPlayer(this.props.name)
    this.pushPlayer(this._player2)
    const newGame = new Game(this.state.players)
    console.log(newGame.deck)
    const p = newGame.getPlayer(this.props.name)
    this.setState({ game: newGame })
    this.prepareHand(p)
  }

  // update gameState to indicate Metamask connection failed
  couldNotConnect() {
    this.setState({ gameState: 'Could not connect to Metamask' })
  }

  isGameReady() {
    this.gameReady = !this.gameReady
  }

  pushPlayer(prop) {
    this.state.players.push(prop)
  }

  displayCard(cardToDisplay) {
    console.log('Card to display:' + cardToDisplay)
    const currentCard = '/images/' + this.cardToImageConverter(cardToDisplay) +'.png';
    return( <img src={currentCard} />)
  }

  prepareHand(p) {
    const hand = []
    p.hand.map(card => {
      hand.push(card)
    })
    this.setState({ mainHand: hand })
  }

  throwCard(_card) {
    try {
      console.log(this.state.game.currentPlayer)
      this.state.game.play(_card)
      this.state.mainHand.splice( this.state.mainHand.indexOf(_card), 1 )
    } catch (e) {
      alert('notPossible' + e)
    }
  }

  getCardColor(card) {
    if (card.color === 4) {
      return 'yellow'
    }
    else if (card.color === 1) {
      return 'red'
    }
    else if (card.color === 2) {
      return 'blue'
    }
    else if (card.color === 3) {
      return 'green'
    }
    else if (card.color === undefined){
      return 'black'
    }
  }

  updateUI() {
    this.forceUpdate()
  }

  cardToImageConverter(_card) {
    let img = ''
    if (_card.value < 10) {
      img = this.getCardColor(_card) + '_' + _card.value
    }
    else if (_card.value === 10) {
      img = this.getCardColor(_card) + '_+2'
    }
    else if (_card.value === 11) {
      img = this.getCardColor(_card) + '_reverse'
    }
    else if (_card.value === 12) {
      img = 'black' + '_wildcard'
    }
    else {
      img = this.getCardColor(_card) + '_+4'
    }
    return img
  }

  render() {
    if(this.gameReady) {
      return(
        <div className='Game'>
        <div className='aiPlayer'>
          <img  src='/images/back.png' alt='foob' />
          <p className='aiText'> [AI] </p>
        </div>
          <div className='image'>
            <p>Deck</p>
            <p>Current Player: {this.state.game.currentPlayer.name} </p>
            <img src='/images/back.png' className='image' alt='foob' />
            { this.displayCard(this.state.game.discardedCard) }
            <button onClick={() => this.state.game.draw()}>Draw</button>
            <button onClick={() => this.state.game.pass()}>Pass</button>
            <button onClick={() => this.updateUI()}>Update</button>
          </div>
          <div className='player'>
            <p> {this.state.name} [ {this.state.account} ] </p>
            <div className='images' alt='foo'>
              { this.state.mainHand.map(images => {
                return( <img key={images} src={ ('/images/' + this.cardToImageConverter(images) +'.png') } onClick={() => this.throwCard(images)} />)
                })
              }
            </div>
          </div>
        </div>
      )
    }
    else {
      console.log(this.state.gameState.toString());
      return(
        <div className='Game'>
          <p> {this.state.gameState} </p>
        </div>
      )
    }

  }

}

import React, { Component } from 'react';
import { Game } from 'uno-engine';
import UnoSOL from '../abis/contracts/Uno.json';
import Web3 from 'web3';

export default class Uno extends Component {

  _player2 = 'Player 2';
  _canGoAgain = true;

  constructor(props) {
    super(props);
    this.state = {
      players: [],
      game: {},
      name: '',
      mainHand: [],
      account: '',
      unoSOL: null,
      gameReady: false,
      gameState: 'Waiting for players...',
      gameOver: false
    };
  }

  componentDidMount() {
    this.loadWeb3()
    this.loadBlockchain()
    this.initGame()
  }

  initGame() {
    this.setState({ name: this.props.name})
    this.setState({ players: [this.props.name, this._player2] })
    this.pushPlayer(this.props.name)
    this.pushPlayer(this._player2)
    const newGame = new Game(this.state.players)
    console.log(newGame.deck)
    this.setState({ game: newGame })
  }

  loadWeb3() {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.enable();
      const web3 = new Web3(window.ethereum);
      web3.eth.getAccounts((err, accounts) => {
        if (err) {
          throw err;
        }
        if (accounts.length === 0) {
          console.log('Locked');
        } else {
          this.isGameReady()
          this.setState({ account: accounts[0] })
          console.log('Connected');
          console.log(accounts)
        }
      });
    } else {
      this.couldNotConnect()
      console.log('Unavailable');
    }
  }

  loadBlockchain() {
    window.ethereum.enable();
    const web3 = new Web3(window.ethereum);
    this.setState({ web3 })
    web3.eth.getAccounts((err, accounts) => {
      if(err) {
        throw err;
      }
      else {
        console.log('Accounts: ', accounts)
        web3.eth.net.getId((err, id) => {
          console.log('ID', id)
          const networkData = UnoSOL.networks[5777]
          console.log('Network', networkData)
          const unoSOL = new web3.eth.Contract(UnoSOL.abi, networkData.address)
          this.setState({ unoSOL })
          console.log('SUCCESS!!!', networkData.address)
        })
      }
    })
  }

  // TODO once game is over should be called
  chooseWinner(address) {
    let val = this.state.unoSOL.methods.chooseWinner(address).send({ 'from': this.state.account, 'gas': '1000000', 'value': this.state.web3.utils.toWei('0.5', 'ether') })
    console.log('Winner', val)
  }

  joinGame() {
    this.state.unoSOL.methods.joinGame().call((err, ok) => {
      console.log('Joined Game', ok)
    })
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
    return( <img src={currentCard} alt='currentCard'/>)
  }

  getNumber(input) {
    let uniform = input.toLowerCase()
    switch(uniform) {
      case 'red':
        return 1
      case 'blue':
        return 2
      case 'green':
        return 3
      case 'yellow':
        return 4
      default:
        console.log('Not a valid input')
    }
  }

  // TODO +2 should change player
  throwCard(_card) {
    try {
      if (_card.color === undefined) {
        let colour = prompt('Please enter a color')
        _card.color = this.getNumber(colour)
      }
      this.state.game.play(_card)
    } catch (e) {
      console.log(e)
    } finally {
      this.forceUpdate()
    }
  }

  checkAllCards(player) {
    for (let i=0; i<player.hand.length; i++) {
      if(this.state.game.discardedCard.color === player.hand[i].color || this.state.game.discardedCard.value === player.hand[i].value) {
        this.throwCard(player.hand[i])
        break
      } else {
        console.log(player.hand[i].name + ' ' + player.hand[i].value)
      }
    }
  }

  aiPlayer() {
    const player = this.state.game.currentPlayer
    this._canGoAgain = true
    console.log('AI starting...', player.name)
    if(player.name === this._player2) {
      this.checkAllCards(player)
    } else if (this._canGoAgain) {
      this.drawCard()
      this.checkAllCards(player)
    } else {
      this.pass()
      console.log('Not my turn')
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

  cardToImageConverter(_card) {
    let img = ''
    if (_card.value < 10) {
      img = this.getCardColor(_card) + '_' + _card.value
    }
    else if (_card.value === 10) {
      img = this.getCardColor(_card) + '_+2'
    }
    else if (_card.value === 11) {
      img = this.getCardColor(_card) + '_skip'
    }
    else if (_card.value === 12) {
      img = this.getCardColor(_card) + '_reverse'
    }
    else if (_card.value === 13) {
      img = 'black_wildcard'
    }
    else {
      img = 'black_+4'
    }
    return img
  }

  skipPlayer2() {
    let newCard = this.state.game.draw()
    console.log('Picked Up', newCard)
    //this.state.mainHand.push(newCard)
    this.state.game.pass()
    this.forceUpdate()
  }

  drawCard() {
    console.log(this.state.game.drawn)
    if(!this.state.game.drawn) {
      this.state.game.draw()
      this.forceUpdate()
    }
  }

  pass()  {
    this.state.game.pass()
    this.forceUpdate()
  }

  render() {
    if(this.gameReady && !this.gameOver) {
      return(
        <div className='Game'>
        <div className='aiPlayer'>
          <div className='images' alt='foo'>
            { this.state.game.getPlayer(this._player2).hand.map(images => {
              return( <img key={images} src={ ('/images/' + this.cardToImageConverter(images) +'.png') } onClick={() => this.throwCard(images)} alt='aiCard'/>)
              })
            }
          </div>
        </div>
          <div className='image'>
            <p>Deck</p>
            <p>Current Player: {this.state.game.currentPlayer.name} </p>
            <img src='/images/back.png' className='image' alt='foob' onClick={() => this.drawCard()} />
            { this.displayCard(this.state.game.discardedCard) }
            <button onClick={() => this.pass()}>Pass</button>
            <button onClick={() => console.log(this.state.game.getPlayer(this.props.name).hand)}>Show real Hand</button>
            <button onClick={() => this.chooseWinner(this.state.account)}>Winner</button>
          </div>
          <div className='player'>
            <p> {this.state.name} [ {this.state.account} ] </p>
            <div className='images' alt='foo'>
              { this.state.game.getPlayer(this.props.name).hand.map((images, element) => {
                return( <img key={element} src={ ('/images/' + this.cardToImageConverter(images) +'.png') } onClick={() => this.throwCard(images)} alt='playersCard'/>)
                })
              }
            </div>
          </div>
        </div>
      )
    }
    if (this.gameOver) {
      return(
        <div>
          <p>Winner winner chicken dinner</p>
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

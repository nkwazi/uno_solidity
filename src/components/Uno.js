import React, { Component } from 'react';
import { Game, Color, Value } from 'uno-engine';
import UnoSOL from '../abis/contracts/Uno.json';
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
      unoSOL: null,
      gameReady: false,
      gameState: 'Waiting for players...',
      gameOver: false
    };
  }

  async componentDidMount() {
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
    const p = newGame.getPlayer(this.props.name)
    this.setState({ game: newGame })
    this.prepareHand(p)
  }

  loadWeb3() {
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
    const accounts = web3.eth.getAccounts((err, accounts) => {
      if(err) {
        throw err;
      }
      else {
        console.log('Accounts: ', accounts)
        let networkId = web3.eth.net.getId((err, id) => {
          console.log('ID', id)
          const networkData = UnoSOL.networks[5777]
          console.log('Network', networkData)
          const unoSOL = new web3.eth.Contract(UnoSOL.abi, networkData.address)
          this.setState({ unoSOL })
          console.log('SUCCESS!!!', networkData.address)
        })
      }
    })

    // const networkId = web3.eth.net.getId((err, id) => {
    //   if(err) {
    //     throw err;
    //   }
    //   else {
    //     console.log('ID: ', id)
    //     return id
    //   }
    // })

    // this.setState({ account: accounts[0] })
    // // Network ID
    // const networkId = await web3.eth.net.getId()
    // const networkData = UnoSOL.networks[networkId]
    // if(networkData) {
    //   const unoSOL = web3.eth.Contract(UnoSOL.abi, networkData.address)
    //   this.setState({ unoSOL })
    //   const postCount = await unoSOL.methods.postCount().call()
    //   this.setState({ postCount })
    //   // Load Posts
    //   for (var i = 1; i <= postCount; i++) {
    //     const post = await unoSOL.methods.posts(i).call()
    //     this.setState({
    //       posts: [...this.state.posts, post]
    //     })
    //   }
    //   // Sort posts. Show highest tipped posts first
    //   this.setState({
    //     posts: this.state.posts.sort((a,b) => b.tipAmount - a.tipAmount )
    //   })
    //   this.setState({ loading: false})
    // } else {
    //   window.alert('UnoSOL contract not deployed to detected network.')
    // }
  }

  chooseWinner(address) {
    let val = this.state.unoSOL.methods.chooseWinner(address).send({ 'from': '0x1DC6A6882c9C1B380EBc206180C735a34aeED553', 'gas': '1000000', 'value': this.state.web3.utils.toWei('0.5', 'ether') })
    console.log('Winner', val)
  }

  joinGame() {
    let val = this.state.unoSOL.methods.joinGame().call((err, ok) => {
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
    this.setState({ gameOver: false })
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

  drawCard() {
    this.state.game.draw()
    this.setState({ gameOver: true })
    console.log('Game state:', this.state.gameOver)
  }

  render() {
    if(this.gameReady && !this.gameOver) {
      return(
        <div className='Game'>
        <div className='aiPlayer'>
          <img  src='/images/back.png' alt='foob' />
          <p className='aiText'> [AI] </p>
        </div>
          <div className='image'>
            <p>Deck</p>
            <p>Current Player: {this.state.game.currentPlayer.name} </p>
            <img src='/images/back.png' className='image' alt='foob' onClick={() => this.state.game.draw()} />
            { this.displayCard(this.state.game.discardedCard) }
            <button onClick={() => this.drawCard()}>Draw</button>
            <button onClick={() => this.joinGame()}>Join</button>
            <button onClick={() => this.state.game.pass()}>Pass</button>
            <button onClick={() => this.updateUI()}>Update</button>
            <button onClick={() => this.chooseWinner(this.state.account)}>Winner</button>
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

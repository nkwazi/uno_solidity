import React, { Component } from 'react';
import Web3 from 'web3';

export default class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      isGame: false
    };

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
          console.log('Connected');
        }
      });
    } else {
      console.log('Unavailable');
    }
  };

  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;
  }

  handleOnChange = event => {
    this.setState({ name: event.target.value });
  };

  openGame() {
    if (this._isMounted) {
      this.setState({ isGame: true, name: this.state.name });
      this.props.liftStateUp(this.state);
    }
  }

  render() {
    return(
      <div className='App-header'>
        <p>DUNO</p>
        <input
          className="Login-input"
          placeholder="Name"
          onChange={event => this.handleOnChange(event)}
          value={this.state.name} />
        <button name='start' onClick={() => this.openGame()}>
          Start
        </button>
      </div>
    )
  }
}

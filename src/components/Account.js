import React, { Component } from 'react';
import Logo from '../logo.png';

export default class Account extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div>
        <p> {this.props.account} </p>
        <div className='PlayerInfo'>
          <p> {this.props.name} </p>
          <p> 150 ETH </p>
          <img src={Logo} alt='logo' style={{ height: 30, width: 30 }} />
        </div>
      </div>
    )
  }
}

import React, { Component } from 'react';

export default class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: 'red_5'
    }
  }

  render() {
    const logo = './images/' + this.state.name + '.png';
    return(
      <div className='Game'>
        <div className='player'>
          <p>Player 1</p>
          <img src={require('./images/red_skip.png')} className='image' alt='foob' />
        </div>
        <div className='player'>
          <p>Player 2</p>
          <img src={require('./images/blue_+2.png')} className='image' alt='foob'/>
        </div>
      </div>
    )
  }

}

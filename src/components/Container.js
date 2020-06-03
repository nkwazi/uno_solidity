import React, { Component } from 'react';
import Register from './Register';
import Uno from './Uno';

export default class Container extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      isGame: false
    }
  };

  liftStateUp = (data) => {
    this.setState({ name: data.name })
    this.setState({ isGame: data.isGame })
  };

  render() {
    console.log(this.state.name)
    if (!this.state.isGame) {
      return (
        <div className="dUNO">
          <Register
            liftStateUp={this.liftStateUp}
          />
        </div>
      );
    }
    else if (this.state.isGame) {
      return (
        <div>
          <Uno name={this.state.name} />
        </div>
      )
    }
  }

}

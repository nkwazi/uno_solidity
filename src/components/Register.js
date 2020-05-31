import React, { Component } from 'react';

export default class Register extends Component {

  _isMounted = false;

  state = {
    name: '',
    isGame: false
  };

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
      this.forceUpdate();
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

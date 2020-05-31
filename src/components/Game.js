import React, { Component } from 'react';

export default class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: ''
    }
  }

  render() {
    console.log(this.props.name)
    return(
      <div>
        <p> {this.props.name} </p>
      </div>
    )
  }

}

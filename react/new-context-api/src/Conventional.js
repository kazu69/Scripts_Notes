import React, { Component } from 'react';

// Data Flow
// Animal Component --> Homo Component --> Sapiens Component

const Sapiens = props => (
  <div className="sapiens">{props.name}</div>
)

const Homo = props => (
  <div className="homo">
      <Sapiens name={props.values.name} />
  </div>
)

class Animal extends Component {
  state = {
    values: {
      name: 'Lucy'
    }
  }
    
  render() {
    return (
      <div className="animal">
        state: {this.state.values.name}
        <Homo values={this.state.values} />
      </div>
    );
  }
}

export default Animal;

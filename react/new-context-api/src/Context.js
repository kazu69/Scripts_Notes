import React, { Component } from 'react';

const HomoSapinsesContext = React.createContext()

class HomoSapinsesProvider extends Component {
  state = {
    values: {
      name: 'Lucy'
    }
  }

  render() {
    return (
      <HomoSapinsesContext.Provider value={this.state.values}>
        {this.props.children}
      </HomoSapinsesContext.Provider>
    )
  }
}

const Sapiens = () => (
  <div className="sapiens">
    <HomoSapinsesContext.Consumer>
      {(context) => context.name}
    </HomoSapinsesContext.Consumer>
  </div>
)

const Homo = () => (
  <div className="homo">
    <Sapiens />
  </div>
)

class ContextAnimal extends Component {
  render() {
    return (
      <HomoSapinsesProvider>
        <div>
          <span>state: 
            <HomoSapinsesContext.Consumer>
              {(context) => context.name}
            </HomoSapinsesContext.Consumer>
          </span>
          <Homo />
        </div>
      </HomoSapinsesProvider>
    )
  }
}

export default ContextAnimal;

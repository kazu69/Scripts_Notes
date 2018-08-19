import React, { Component } from 'react';

const HomoSapinsesContext = React.createContext()

const reducer = (prevState, action) => {
  if (action.type === "UPDATE") {
    const values = prevState.values
    values.name = action.name
    return { ...prevState, values };
  }
};

class HomoSapinsesProvider extends Component {
  state = {
    values: {
      name: 'Lucy'
    }
  }

  dispatch(action)
  {
    this.setState(state => reducer(state, action))
  }

  render()
  {
    return (
      <HomoSapinsesContext.Provider
        value={
          {
            name: this.state.values.name,
            dispatch: this.dispatch.bind(this)
          }
        }>
        {this.props.children}
      </HomoSapinsesContext.Provider>
    )
  }
}

const Sapiens = props => (
  <div className="sapiens">
    <HomoSapinsesContext.Consumer>
      { ({name, dispatch}) => (
            <form>
              <input
                type='text'
                name='name'
                value={name}
                onChange={
                  (event) => {
                    event.preventDefault()
                    dispatch({
                      type: 'UPDATE',
                      name: event.target.value
                    })
                  }
                }
              />
            </form>
      )}
    </HomoSapinsesContext.Consumer>
  </div>
)

const Homo = props => (
  <div className="homo">
    <Sapiens />
  </div>
)

class UpdateContextAnimal extends Component {
  render() {
    return (
      <HomoSapinsesProvider>
        <div>
          <span>state: 
            <HomoSapinsesContext.Consumer>
              {
                ({name}) => name
              }
            </HomoSapinsesContext.Consumer>
          </span>
          <Homo />
        </div>
      </HomoSapinsesProvider>
    )
  }
}

export default UpdateContextAnimal;

import React from 'react'
import ReactDOM from 'react-dom'

type Messages = {
  messages: string[]
}

type Message = {
  message: string
}

const SFCComponent: React.SFC<Message> = props => <li>{props.message}</li>
// defineTtyped not support `memo`
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/29990
const MemoComponent = (React as any).memo(SFCComponent)

class ComponentMessage extends React.Component<Message, {}>  {
  render() {
    return (<li>{this.props.message}</li>)
  }
}

class PureMessage extends React.PureComponent<Message, {}> {
  render() {
    return (<li>{this.props.message}</li>)
  }
}

const InputHistory: React.SFC<Messages> = (props) => {
  return (
    <ul>
        {props.messages.map( (m, i) => {
            return (
              <React.Fragment>
                <ComponentMessage key={i} message={m} />
              </React.Fragment>
            )
        }
        )}
    </ul>
  )
}

const InputHistoryWithPure: React.SFC<Messages> = (props) => {
  return (
    <ul>
        {props.messages.map( (m, i) => {
            return (
              <React.Fragment>
                <PureMessage key={i} message={m} />
              </React.Fragment>
            )
        }
        )}
    </ul>
  )
}

const InputHistoryWithSFC: React.SFC<Messages> = (props) => {
  return (
    <ul>
        {props.messages.map( (m, i) => {
            return (
              <React.Fragment>
                <SFCComponent key={i} message={m} />
              </React.Fragment>
            )
        }
        )}
    </ul>
  )
}

const InputHistoryWithMemo: React.SFC<Messages> = (props) => {
  return (
    <ul>
        {props.messages.map( (m, i) => {
            return (
              <React.Fragment>
                <MemoComponent key={i} message={m} />
              </React.Fragment>
            )
        }
        )}
    </ul>
  )
}

class InputApp extends React.Component<{}, Messages> {
  constructor(props = {}) {
    super(props)
    this.state = { messages: [] }
    this._getLastMessage = this._getLastMessage.bind(this)
    this._onMessageChange = this._onMessageChange.bind(this)
  }

  _getLastMessage() {
    const lastMessage = this.state.messages[this.state.messages.length - 1]
    return lastMessage === undefined ? "" : lastMessage
  }

  _onMessageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const messages = [...this.state.messages]
    messages.push(event.target.value)
    this.setState({ messages })
  }

  render() {
    const componetnStyle = {
      display: 'inline-block',
      marginLeft: '30px',
    }

    const inputStyle = {
      display: 'inline-block',
      verticalAlign: 'top',
      marginLeft: '30px',
      top: '0'
    }

    return (
      <div>
        <div style={inputStyle} >
          <input
            type="text"
            value={this._getLastMessage()}
            onChange={this._onMessageChange}
          />
        </div>

        <div style={componetnStyle}>
          <strong>Compoennt</strong>
          <br />
          <InputHistory messages={this.state.messages} />
        </div>

        <div style={componetnStyle}>
          <strong>Pure Compoennt</strong>
          <br />
          <InputHistoryWithPure messages={this.state.messages} />
        </div>

        <div style={componetnStyle}>
          <strong>SFC Compoennt</strong>
          <br />
          <InputHistoryWithSFC messages={this.state.messages} />
        </div>

        <div style={componetnStyle}>
          <strong>Memo Compoennt</strong>
          <br />
          <InputHistoryWithMemo messages={this.state.messages} />
        </div>
      </div>
    );
  }
}

const rootElement: HTMLElement| null = document.getElementById(`memo`);
ReactDOM.render(<InputApp />, rootElement);

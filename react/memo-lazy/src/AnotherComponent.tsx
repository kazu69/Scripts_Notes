import React from 'react'

type Message = {
    message: string,
}

const AnotherComponent: React.SFC<Message> = props => <p><strong>this is another component with Props {props.message}</strong></p>

export default AnotherComponent

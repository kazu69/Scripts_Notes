import React from 'react'

type Message = {
    message: string,
}

const OtherComponent: React.SFC<Message> = props => <p><strong>this is other component with Props {props.message}</strong></p>

export default OtherComponent

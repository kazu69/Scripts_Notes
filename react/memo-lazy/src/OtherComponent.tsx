import React from 'react'

type Message = {
    message: string,
}

const OtherComponent: React.SFC<Message> = props => <strong>this is other component with Props {props.message}</strong>

export default OtherComponent

import React from 'react'

type ErrorBoundyPrpps = {
  children?: any,
}

type ErrorBoundyState = {
  hasError: boolean,
}

type ErrorInfo = NonNullable<object>

class ErrorBoundyComponent extends React.Component<ErrorBoundyPrpps, ErrorBoundyState> {
  constructor(props: ErrorBoundyPrpps) {
    super(props)

    this.state = {
      hasError: false
    }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info)
    // ... error loggin function
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children; 
  }
}
export default ErrorBoundyComponent

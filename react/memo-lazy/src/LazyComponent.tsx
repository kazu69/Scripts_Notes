import React from 'react'
import ReactDOM from 'react-dom'
// https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html
import ErrorboundyComponent from './ErrorboundyComponent'

// defineTyped not support `lazy`
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/30110
const OtherComponent = (React as any).lazy(() => import('./OtherComponent'));
const AnotherComponent = (React as any).lazy(() => import('./AnotherComponent'));

// defineTyped not support `Suspense`
const Suspense = (React as any).Suspense


const LazyComponent: React.SFC = _ => {
    return (
        // multiple lazy components with a single Suspense component.
        <ErrorboundyComponent>
            <Suspense fallback={<div>Loading...</div>}>
                <OtherComponent message="Hello" />
                <AnotherComponent message="Hola" />
            </Suspense>
        </ErrorboundyComponent>
    )
}

const rootElement: HTMLElement| null = document.getElementById(`lazy`);
ReactDOM.render(<LazyComponent />, rootElement);

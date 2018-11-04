import React from 'react'
import ReactDOM from 'react-dom'
// https://reactjs.org/blog/2017/07/26/error-handling-in-react-16.html
import ErrorboundyComponent from './ErrorboundyComponent'

// defineTyped not support `lazy`
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/30110
// Deliberately delay
const OtherComponent = (React as any).lazy(() => 
    new Promise(resolve => {
        setTimeout(
            () => resolve(import('./OtherComponent')),
            2000
        )
    })
);
// Do not consider dynamic import when bundled
const AnotherComponent = (React as any).lazy(() => import('./AnotherComponent'));


// defineTyped not support `Suspense`
const Suspense = (React as any).Suspense


const LazyComponent: React.SFC = _ => {
    return (
        // Provide fallback on component loading error.
        <ErrorboundyComponent>
            {/* multiple lazy components with a single Suspense component. */}
            <Suspense fallback={<div>Loading...</div>}>
                <OtherComponent message="Hello" />
                <AnotherComponent message="Hola" />
            </Suspense>
        </ErrorboundyComponent>
    )
}

const rootElement: HTMLElement| null = document.getElementById(`lazy`);
ReactDOM.render(<LazyComponent />, rootElement);

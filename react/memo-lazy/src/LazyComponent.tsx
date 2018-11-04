import React from 'react'
import ReactDOM from 'react-dom'

// defineTyped not support `lazy`
// https://github.com/DefinitelyTyped/DefinitelyTyped/pull/30110
const OtherComponent = (React as any).lazy(() => import('./OtherComponent'));

// defineTyped not support `Suspense`
const Suspense = (React as any).Suspense


const LazyComponent: React.SFC = props => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <OtherComponent message="Hello" />
        </Suspense>
    )
}

const rootElement: HTMLElement| null = document.getElementById(`lazy`);
ReactDOM.render(<LazyComponent />, rootElement);

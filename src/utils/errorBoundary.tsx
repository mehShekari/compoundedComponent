import { Component, ErrorInfo, ReactNode } from "react";

type TProps = {
    // using `interface` is also ok
    fallBack: React.ReactNode, children: 
    React.ReactNode
};

type TState = {
    hasError: boolean
}

export default class ErrorBoundary extends Component<TProps, TState>
{
    state: TState = { hasError: false }
    
    static getDerivedStateFromError()
    {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.log(error, errorInfo)
    }

    render(): ReactNode {
        if(this.state.hasError)
            return this.props.fallBack
        else return this.props.children
    }
}
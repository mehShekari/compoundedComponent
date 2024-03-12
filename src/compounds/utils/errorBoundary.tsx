import { Component, ErrorInfo, ReactNode } from "react";

type TProps = {
    // using `interface` is also ok
    fallBack: (message: string) =>  React.ReactNode, 
    children: React.ReactNode
};

type TState = {
    hasError: boolean
    errorMessage: any
}

export default class ErrorBoundary extends Component<TProps, TState>
{
    state: TState = { 
        hasError: false,
        errorMessage: null
    }

    static getDerivedStateFromError()
    {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        console.log(error.name)
        console.log(errorInfo)
        this.state.errorMessage = error.message
    }

    render(): ReactNode {
        if(this.state.hasError)
            return <>
                {this.props.fallBack(this.state.errorMessage)}
            </>
        else return this.props.children
    }
}
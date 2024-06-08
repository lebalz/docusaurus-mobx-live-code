import React from 'react';
import { StoresProvider, rootStore } from '../stores/rootStore';

export default function Root({children}) {
    React.useEffect(() => {
        (window as any).store = rootStore;
    }, []);
    return (
        <StoresProvider value={rootStore}>
            {children}
        </StoresProvider>
    )
}
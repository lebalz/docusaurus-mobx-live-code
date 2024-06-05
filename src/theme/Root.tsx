import React from 'react';
import { StoresProvider, rootStore } from '../stores/rootStore';

export default function Root({children}) {
    return (
        <StoresProvider value={rootStore}>
            {children}
        </StoresProvider>
    )
}
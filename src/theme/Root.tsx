import React from 'react';
import { StoresProvider, rootStore } from '../stores/rootStore';
import { usePluginData } from '@docusaurus/useGlobalData';

export default function Root({children}) {
    const {libDir, syncMaxOnceEvery} = usePluginData('docusaurus-live-brython') as { libDir: string; syncMaxOnceEvery: number; };
    React.useEffect(() => {
        (window as any).store = rootStore;
        rootStore.documentStore.syncMaxOnceEvery = syncMaxOnceEvery;
        rootStore.documentStore.libDir = libDir;
    }, [rootStore]);
    return (
        <StoresProvider value={rootStore}>
            {children}
        </StoresProvider>
    )
}
import Document from "@site/src/models/Document";
import { type Selector } from "docusaurus-live-brython/theme/CodeEditor/WithScript/Types";
import { useCallback, useSyncExternalStore } from "react";

export const useScript = <T extends keyof typeof Document>(store: Document, selector: T): typeof Document[T] => {
    return useSyncExternalStore(
        useCallback((callback) => {
            const disposer = store.subscribe(callback, selector);
            return () => {
                disposer()
            };
        }, [store, selector]),
        useCallback(
            () => {
                return (store as any)[selector];
            },
            [store, selector]
        )
    );
}
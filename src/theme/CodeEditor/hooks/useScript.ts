import Document from "@site/src/models/Document";
import { useCallback, useSyncExternalStore } from "react";
/**
 * A utility function to create a stable snapshot wrapper
 * it is meant to only track the length of the array and treats
 * two arrays with the same length as equal
 */
const useStableSnapshot = (getSnapshot: () => Array<any>) => {
    let prevLength: number = -1;
    let prevResult: Array<any>;
    return () => {
        const result = getSnapshot();
        if (result.length !== prevLength) {
            prevLength = result.length;
            prevResult = result.slice();
        }
        return prevResult;
    };
};


export const useScript = <T extends keyof Document>(store: Document, selector: T): Document[T] => {
    const isArray = Array.isArray(store[selector]);
    if (isArray) {
        return useSyncExternalStore(
            useCallback((callback) => {
                const disposer = store.subscribe(callback, selector);
                return () => {
                    disposer()
                };
            }, [store, selector]),
            useCallback(
                useStableSnapshot(() => {
                    return store[selector] as Array<any>;
                }) as () => Document[T],
                [store, selector]
            )
        );
    }
    return useSyncExternalStore(
        useCallback((callback) => {
            const disposer = store.subscribe(callback, selector);
            return () => {
                disposer()
            };
        }, [store, selector]),
        useCallback(
            () => {
                return store[selector];
            },
            [store, selector]
        )
    );
}
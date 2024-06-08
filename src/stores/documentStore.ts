import { action, computed, makeObservable, observable, override } from 'mobx';
import { RootStore } from './rootStore';
import { computedFn } from 'mobx-utils';
import Document from '../models/Document';

export class DocumentStore {
    readonly root: RootStore;

    @observable accessor clicks: number = 0;

    documents = observable.array<Document>([]);
    
    constructor(root: RootStore) {
        this.root = root;
    }

    @action
    setClicks(clicks: number) {
        this.clicks = clicks;
    }

    @action
    addDocument(document: Document) {
        this.documents.push(document);
    }

    find = computedFn(
        function (this: DocumentStore, id?: string): Document | undefined {
            if (!id) {
                return;
            }
            return this.documents.find((d) => d.id === id) as Document | undefined;
        },
        { keepAlive: true }
    );

}

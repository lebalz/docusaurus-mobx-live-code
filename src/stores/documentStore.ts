import { action, computed, makeObservable, observable, override } from 'mobx';
import { RootStore } from './rootStore';

export class DocumentStore {
    readonly root: RootStore;

    @observable accessor clicks: number = 0;
    
    constructor(root: RootStore) {
        this.root = root;
    }

    @action
    setClicks(clicks: number) {
        this.clicks = clicks;
    }

}

import { action, autorun, computed, makeObservable, observable, override, reaction } from 'mobx';
import { DocumentStore } from '../stores/documentStore';
import { v4 as uuidv4 } from 'uuid';
import { splitPreCode } from 'docusaurus-live-brython/theme/CodeEditor/WithScript/helpers';

export enum Status {
    IDLE = 'IDLE',
    SYNCING = 'SYNCING',
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS'
}

export interface LogMessage {
    type: 'done' | 'stdout' | 'stderr' | 'start';
    output: string;
    timeStamp: number;
}

export interface Version {
    code: string;
    createdAt: Date;
    version: number;
    pasted?: boolean;
}

export interface StoredScript {
    code: string;
    createdAt: Date;
    updatedAt: Date;
    versions: Version[];
}
export interface InitState {
    id: string | undefined;
    lang: 'py' | string;
    title: string;
    raw: string;
    readonly: boolean;
    versioned: boolean;
}

export interface DocumentProps extends StoredScript {
    /**
     * this is normally a uuid
     */
    id: string;
    /**
     * this is the codeId used to
     * - identify dom elements for this block
     * - setup the brython communicator with this id
     * - when using the default storage, this is the key used to 
     *   store the code to local storage
     */
    codeId: string;
    pristineCode: string;
    showRaw: boolean;
    isExecuting?: boolean;
    preCode: string;
    lang: 'py' | string;
    logs: LogMessage[];
    isGraphicsmodalOpen: boolean;
    hasGraphicsOutput: boolean;
    hasTurtleOutput: boolean;
    hasCanvasOutput: boolean;
    hasEdits: boolean;
    /**
     * Storage props
    */
    isLoaded: boolean;
    status: Status;
    versionsLoaded: boolean;
    isPasted: boolean;
}


export default class Document {
    readonly store: DocumentStore;
    readonly _pristineCode: string;
    readonly id: string;
    readonly codeId: string;
    readonly source: 'local' | 'remote';
    readonly _lang: 'py' | string;
    @observable accessor createdAt: Date;
    @observable accessor updatedAt: Date;
    @observable accessor code: string;
    @observable accessor preCode: string;
    @observable accessor isExecuting: boolean;
    @observable accessor showRaw: boolean;
    @observable accessor isLoaded: boolean;
    @observable accessor status: Status = Status.IDLE;
    versions = observable.array<Version>([]);
    logs = observable.array<LogMessage>([]);


    constructor(props: InitState, libDir: string, store: DocumentStore) {
        this.store = store;
        this.id = props.id || uuidv4();
        this.source = props.id ? 'remote' : 'local';
        this._lang = props.lang;
        this.isExecuting = false;
        this.showRaw = false;
        this.isLoaded = true;

        const {pre, code} = splitPreCode(props.raw) as {pre: string, code: string};
        this._pristineCode = code;
        this.code = code;
        this.preCode = pre;
        this.codeId = `code.${props.title || props.lang}.${this.id}`.replace(/(-|\.)/g, '_');
        this.updatedAt = new Date();
        this.createdAt = new Date();
    }

    @computed
    get props(): DocumentProps {
        return {
            id: this.id,
            codeId: this.codeId,
            code: this.code,
            pristineCode: this._pristineCode,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            preCode: this.preCode,
            lang: 'python',
            isExecuting: false,
            logs: [],
            isGraphicsmodalOpen: false,
            hasGraphicsOutput: false,
            hasTurtleOutput: false,
            hasCanvasOutput: false,
            hasEdits: false,
            isLoaded: this.isLoaded,
            status: Status.IDLE,
            versionsLoaded: false,
            isPasted: true,
            showRaw: false,
            versions: this.versions
        }
    }

    @action
    clearLogMessages() {
    }

    @action
    setExecuting(isExecuting: boolean) {
    }

    @action
    addLogMessage(message: LogMessage) {
    }

    @action
    setCode(raw: string, action?: 'insert' | 'remove' | string) {
        this.code = raw;
    }

    @action
    execScript() {
    }

    @action
    saveNow() {

    }

    @action
    stopScript() {

    }

    @computed
    get hasGraphicsOutput() {
        return false;
    }

    @computed
    get hasTurtleOutput() {
        return false;
    }


    @computed
    get hasCanvasOutput() {
        return false;
    }

    @computed
    get hasEdits() {
        return false;
    }

    @computed
    get isGraphicsmodalOpen() {
        return false;
    }

    @computed
    get isPasted() {
        return false;
    }

    @computed
    get versionsLoaded() {
        return false;
    }


    @action
    closeGraphicsModal() {
    }

    subscribe(listener: () => void, selector: keyof typeof Document) {
        return reaction(
            () => this[selector],
            listener
        );
    }

    @computed
    get pristineCode() {
        return this._pristineCode;
    }

    get lang() {
        if (this._lang === 'py') {
            return 'python';
        }
        return this._lang;
    }
}

import { action, autorun, computed, makeObservable, observable, override, reaction, toJS } from 'mobx';
import { DocumentStore } from '../stores/documentStore';
import { v4 as uuidv4 } from 'uuid';
import { sanitizePyScript, splitPreCode } from 'docusaurus-live-brython/theme/CodeEditor/WithScript/helpers';
import { DOM_ELEMENT_IDS } from 'docusaurus-live-brython/theme/CodeEditor/constants';

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
    @observable accessor isGraphicsmodalOpen: boolean;
    @observable accessor isPasted: boolean = false;
    versions = observable.array<Version>([], {deep: false});
    logs = observable.array<LogMessage>([], {deep: false});


    constructor(props: InitState, store: DocumentStore) {
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
        this.logs.clear();
    }

    @action
    setExecuting(isExecuting: boolean) {
        this.isExecuting = isExecuting;
    }

    @action
    addLogMessage(message: LogMessage) {
        this.logs.push({output: message.output, timeStamp: Date.now(), type: message.type});
    }

    @action
    setCode(raw: string, action?: 'insert' | 'remove' | string) {
        this.code = raw;
    }

    @action
    execScript() {
        const toExec = `${this.code}`;
        const lineShift = this.preCode.split(/\n/).length;
        const src = `from brython_runner import run
run("""${sanitizePyScript(toExec || '')}""", '${this.codeId}', ${lineShift})
`;
        if (!(window as any).__BRYTHON__) {
            alert('Brython not loaded');
            return;
        }
        if (this.hasGraphicsOutput) {
            this.isGraphicsmodalOpen = true;
        }
        this.isExecuting = true;
        const active = document.getElementById(DOM_ELEMENT_IDS.communicator(this.codeId));
        active.setAttribute('data--start-time', `${Date.now()}`);
        /**
         * ensure that the script is executed after the current event loop.
         * Otherwise, the brython script will not be able to access the graphics output.
         */
        setTimeout(() => {
            (window as any).__BRYTHON__.runPythonSource(
                src,
                {
                    pythonpath: [this.store.libDir]
                }
            );
        }, 0);
    }

    @action
    saveNow() {

    }

    @action
    stopScript() {
        const code = document?.getElementById(DOM_ELEMENT_IDS.communicator(this.codeId));
        if (code) {
            code.removeAttribute('data--start-time');
        }
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
    get versionsLoaded() {
        return false;
    }


    @action
    closeGraphicsModal() {
    }

    subscribe(listener: () => void, selector: keyof Document) {
        if (Array.isArray(this[selector])) {
            return reaction(
                () => (this[selector] as Array<any>).slice().length,
                (curr, prev) => {
                    listener();
                }
            );
        }
        return reaction(
            () => this[selector],
            listener
        );
    }

    @computed
    get pristineCode() {
        return this._pristineCode;
    }

    @computed
    get logsJS() {
        return toJS(this.logs);
    }

    @computed
    get versionsJS() {
        return toJS(this.versions);
    }

    
    @action
    setIsPasted(isPasted: boolean) {
        this.isPasted = isPasted;
    };
    @action
    setShowRaw(showRaw: boolean) {
        this.showRaw = showRaw;
    };
    @action
    setStatus(status: Status) {
        this.status = status;
    };

    get lang() {
        if (this._lang === 'py') {
            return 'python';
        }
        return this._lang;
    }
}

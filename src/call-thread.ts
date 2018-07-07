import { CallFlow, CallBack } from ".";

/**
 * @author Joseph Eniojukan
 * @description This class provides the context between callbacks in the call flow.
 */
export class CallThread {
    private before = new Array<string>();
    private started: boolean = false;
    constructor(private callflow: CallFlow) {
        ['_name', '_index'].forEach(key => {
            Object.defineProperty(this, key, { writable: true, enumerable: false })
        })
        this.setIndex(-1);
    }

    /** 
     * @author Joseph Eniojukan
     * @description This function executes the next callback. 
     */
    public next();

    /**
     * @author Joseph Eniojukan
     * @description This function executes the next callback in the call flow after a period of time.
     * @param delay The period, in milliseconds, to wait before executing the next callback in the call flow.
     */
    public next(delay: number);

    /** @hidden @ignore */
    public next(delay?: number) {
        this.setIndex(this.index + 1);
        let callback = this.getByIndex(this.index);

        if (callback)
            callback.execute(this, delay);
    }

    /**
     * @author Joseph Eniojukan
     * @description This function executes the previous callback in the call flow.
     */
    public previous();

    /**
     * @author Joseph Eniojukan
     * @description This function executes the previous callback in the call flow after a period of time.
     * @param delay The period, in milliseconds, to wait before executing the previous callback in the call flow.
     */
    public previous(delay: number);

    /** @hidden @ignore */
    public previous(delay?: number) {
        let before = this.before.pop();
        let callback = this.getByName(before);
        if (callback)
            callback.execute(this, delay);
    }

    /**
     * @author Joseph Eniojukan
     * @description This function executes a specific callback from a call flow.
     * @param name The name of the callback to execute.
     */
    public goto(name: string);

    /**
     * @author Joseph Eniojukan
     * @description This function executes a specific callback from a call flow after a period of time.
     * @param name The name of the callback to execute.
     * @param delay The period, in milliseconds, to wait before executing the specified callback in the call flow.
     */
    public goto(name: string, delay: number);

    /** @hidden @ignore */
    public goto(name: string, delay?: number) {
        let callback = this.getByName(name);
        if (callback) {
            this.history(callback.name);
            this.setIndex(this.indexOf(name));
            callback.execute(this);
        }
    }

    /**
     * @author Joseph Eniojukan
     * @description When in parallel mode, this function executes all callbacks in the call flow in parallel.
     * @param delay The period (in milliseconds) to wait before executing each callback in the call flow.
     */
    public executeAll(delay: number = -1){
        if(this.parallel){
            this.sequence.forEach( callback => callback.execute(this, delay))
        }
    }

    public accept(){
        let callflow = this.callflow;
        if(callflow.onExecute){
            callflow.onExecute(this);
        }
        if(callflow.onAccept){
            callflow.onAccept(this);
        }
    }

    /** indicates whether or not the tread is executed in parallel mode. */
    public get parallel(): boolean{
        return this.callflow.parallel;
    }

    private history(name: string) {
        this.before.push(name);
    }

    private getByName(name: string) {
        let result: CallBack;
        let sequence = this.sequence;

        sequence.forEach(callback => {
            if (callback.name === name) {
                result = callback;
                return;
            }
        })

        return result;
    }

    private getByIndex(index: number): CallBack {
        let sequence = this.sequence;
        if (index < sequence.length)
            return sequence[index];
    }

    private indexOf(name: string): number {
        let result: number;
        let sequence = this.sequence;

        for (let i = 0; i < sequence.length; i++) {
            let callback = sequence[i];
            if (callback.name === name) {
                return i;
            }
        }

        return result;
    }

    private hasName(name: string): boolean {
        let callback = this.getByName(name);
        if (callback)
            return true;

        return false;
    }

    private get sequence(): Array<CallBack> {
        return this.callflow['sequence'];
    }

    public get name(): string {
        return this['_name'];
    }

    public get index(): number {
        return this['_index'];
    }

    private setName(value: string) {
        this['_name'] = value;
    }

    private setIndex(value: number) {
        this['_index'] = value;
    }

}
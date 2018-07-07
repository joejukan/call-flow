import { uuid, ok } from "@joejukan/web-kit";
import { CallThread } from ".";
import { Argumenter } from "@joejukan/argumenter";

/**
 * @author Joseph Eniojukan
 * @description This class is used as a wrapper for call back functions
 */
export class CallBack {
    /**The name of the callback function */
    public name: string; 
    private callback: { (thread?: CallThread) }

    constructor();
    constructor(callback: { (thread?: CallThread) })
    constructor(name: string, callback: { (thread?: CallThread) });
    constructor(...args) {
        if (!ok(this.name))
            this.name = uuid();
    }

    public execute(thread: CallThread)
    public execute(thread: CallThread, delay: number)
    
    /**@hidden @ignore */
    public execute(...args) {
        let argue = new Argumenter(args);
        let thread: CallThread = argue.instance(CallThread); 
        let delay: number = argue.number;

        if(!ok(delay)){
            delay = -1;
        }

        if (delay > 0) {
            setTimeout(() => this.callback(thread), delay);
        }
        else
            this.callback(thread);
    }
}
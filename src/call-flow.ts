import { Argumenter } from "@joejukan/argumenter";
import { ok } from "@joejukan/web-kit";
import { CallBack, CallThread } from ".";
/**
 * @author Joseph Eniojukan
 * @description This class defines and orchestrates the call flow.
 */
export class CallFlow {
    /** This property sets the call flow in parallel mode */
    public parallel: boolean = false;

    /** The total number of callbacks that are executed. */
    public executed: number = 0;

    /** The number of callbacks that are considered to have executed successfully. */
    public accepted: number = 0;

    /** The number of callbacks that are considered to have executed unsuccessfully. */
    public rejected: number = 0;

    /** This property is used to hold shared data that can be passed from callback to callback in the call flow. */
    public data: any;

    public onComplete: {(thread?: CallThread)};
    public onExecute:{(thread?: CallThread)}; 
    public onAccept: {(thread?: CallThread)};
    public onReject: {(thread?: CallThread)}

    public constructor();
    public constructor(parallel: boolean);
    public constructor(...args){
        let argue = new Argumenter(args);
        this.parallel = argue.boolean;
        this.data = argue.object || {};
    }
    private sequence = new Array<CallBack>();

    /** This property can be used to set one or more callbacks for the call flow. */
    public set callback(value: { (thread?: CallThread) }) {
        this.push(value);
    }

    /**
     * @author Joseph Eniojukan
     * @description This function is used to push callbacks into the call flow.
     * @param name The name of the callback.
     * @param callback The implementation of the callback function.
     */
    public push(name: string, callback: { (thread?: CallThread) });

    /**
     * @author Joseph Eniojukan
     * @description This function is used to push callbacks into the call flow.
     * @param callback The implementation of the callback function.
     */
    public push(callback: { (thread?: CallThread) });

    /**
     * @author Joseph Eniojukan
     * @description This function is used to push callbacks into the call flow.
     * @param callback The implementation of the callback function.
     * @param name The name of the callback.
     */
    public push(callback: { (thread?: CallThread) }, name: string);

    /** @hidden @ignore */
    public push(...args) {
        let argument = new Argumenter(args);
        let name: string = argument.string;
        let callback: { (thread?: CallThread) } = argument.function;
        this.sequence.push(new CallBack(name, callback))
    }

    public start();
    public start(name: string);
    public start(name: string, delay: number);
    public start(delay: number);
    public start(delay: number, name: string);

    /** @hidden @ignore */
    public start(...args) {
        let thread = new CallThread(this);
        let param = new Argumenter(args);
        let name: string = param.string;
        let delay: number = param.number;

        if(this.parallel){
            
        }
        else if (ok(name))
            thread.goto(name, delay);
        else
            thread.next(delay);
    }
}
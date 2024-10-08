import Vuelite from "../viewmodel/vuelite";
import type { Visitor } from "./visitor";
declare abstract class Scanner {
    private visitor;
    constructor(visitor: Visitor);
    visit(action: Function, target: any): void;
    abstract scan(target: any): void;
}
export declare class VueScanner extends Scanner {
    private fragment;
    scan(vm: Vuelite): void;
    scanPartial(vm: Vuelite, el: HTMLElement, loopEffects: Function[]): HTMLElement;
    private replaceComponent;
}
export {};

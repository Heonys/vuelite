import Vuelite from "@/core/viewmodel/vuelite";
export declare function safeEvaluate(vm: Vuelite, exp: string): any;
export declare function unsafeEvaluate(context: object, expression: string): any;
export declare function evaluteTemplate(vm: Vuelite, exp: string): string;

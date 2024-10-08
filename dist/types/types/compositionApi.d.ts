import { HookNames } from "../core/viewmodel/lifecycle";
import type { Options } from "../core/viewmodel/option";
import Vuelite from "../core/viewmodel/vuelite";
type FilteredProps = "$watch" | "$forceUpdate" | "setHooks" | "callHook" | "clearTasks" | "$el";
export type AppInstance = Omit<Vuelite, FilteredProps> & {
    $fragment?: DocumentFragment;
    component(name: string, options: Options): AppInstance;
    mount(selector: string): void;
};
export interface Ref<T = any> {
    value: T;
    __v_exp: string;
}
type ComputedFn<T> = (oldValue: T | undefined) => T;
type ComputedOption<T> = {
    get: (oldValue: T | undefined) => T;
    set: (value: T) => void;
};
export type ComputedInput<T = any> = ComputedFn<T> | ComputedOption<T>;
export type WatchCallback<T = any> = (value: T, oldValue: T) => void;
export type StopHandle = () => void;
export type CompositionHookNames = Exclude<HookNames, "beforeCreate" | "created">;
export {};

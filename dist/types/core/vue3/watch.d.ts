import { Ref, WatchCallback } from "../../types/compositionApi";
import Vuelite from "../viewmodel/vuelite";
export declare function watch<T>(source: Ref<T>, callback: WatchCallback<T>): void;
export declare function createWacher(vm: Vuelite): void;

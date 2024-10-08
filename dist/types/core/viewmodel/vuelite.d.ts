import { ComponentMap, ComponentPublicInstance, WatchCallback, WatchOption, Options } from "./option";
import { Lifecycle } from "./lifecycle";
export default class Vuelite<Data = {}> extends Lifecycle<Data> implements ComponentPublicInstance<Data> {
    $data: object;
    $el: HTMLElement | DocumentFragment;
    $options: Options<Data>;
    $props: Record<string, any>;
    $parent: Vuelite | null;
    $refs: {
        [name: string]: Element;
    };
    $components: ComponentMap;
    componentsNames: Record<string, Options>;
    updateQueue: Function[];
    [custom: string]: any;
    static context?: Record<string, any>;
    constructor(options: Options<Data>);
    mount(selector?: string): void;
    private render;
    $watch(source: string, callback: WatchCallback, options?: WatchOption): void;
    $forceUpdate(): void;
    private setupDOM;
    private localComponents;
    static globalComponentsNames: Record<string, Options>;
    static globalComponents: ComponentMap;
    static component(name: string, options: Options): void;
}

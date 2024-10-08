import { Updater, updaters } from "./updaters";
import { extractPath, assignPath, isNonObserver, isDeferred } from "@utils/common";
import { extractDirective, isEventDirective, isValidDirective } from "@utils/directive";
import Vuelite from "../viewmodel/vuelite";
import { Observer } from "../reactive/observer";
import { Condition } from "./condition";
import { ForLoop } from "./forLoop";
import { unsafeEvaluate } from "@/utils/evaluate";
import { isComponent } from "@/utils/format";

export class Directive {
  name: string;
  modifier: string;
  constructor(
    name: string,
    public vm: Vuelite,
    public node: Node,
    public exp: any,
    loopEffects?: Function[],
  ) {
    const { key, modifier } = extractDirective(name);
    this.name = key;
    this.modifier = modifier;

    if (!isValidDirective(key)) return;
    if (isNonObserver(key, modifier)) return;
    if (isDeferred(key)) {
      this.scheduleTask(key, loopEffects);
    } else {
      if (isEventDirective(name)) this.on();
      else this[key]();

      if (node instanceof HTMLElement) node.removeAttribute(name);
    }
  }

  bind(updater?: Updater) {
    updater = this.selectUpdater(updater);

    new Observer(this.vm, this.exp, (newVal) => {
      if (isComponent(this.node)) {
        const childVM =
          this.vm.$components.get(this.node) || Vuelite.globalComponents.get(this.node);
        childVM.$parent = this.vm;
        childVM.$props[this.modifier] = newVal;
      } else {
        updater(this.node, newVal);
      }
    });
  }

  model() {
    const el = this.node as HTMLElement;
    switch (el.tagName) {
      case "INPUT": {
        const input = el as HTMLInputElement;
        if (input.type === "checkbox") {
          input.addEventListener("change", (event) => {
            const value = (event.target as HTMLInputElement).checked;
            assignPath(this.vm, this.exp, value);
          });
          this.bind(updaters.inputCheckbox);
        } else if (input.type === "radio") {
          input.name = this.exp;
          input.addEventListener("change", (event) => {
            const value = (event.target as HTMLInputElement).value;
            assignPath(this.vm, this.exp, value);
          });
          this.bind(updaters.inputRadio);
        } else {
          input.addEventListener("input", (event) => {
            const value = (event.target as HTMLInputElement).value;
            assignPath(this.vm, this.exp, value);
          });
          this.bind(updaters.inputValue);
        }
        break;
      }
      case "TEXTAREA": {
        el.addEventListener("input", (event) => {
          const value = (event.target as HTMLTextAreaElement).value;
          assignPath(this.vm, this.exp, value);
        });
        this.bind(updaters.inputValue);
        break;
      }
      case "SELECT": {
        const select = el as HTMLSelectElement;
        if (select.multiple) {
          select.addEventListener("change", (event) => {
            const target = event.target as HTMLSelectElement;
            const selectedValues = Array.from(target.selectedOptions).map((option) => option.value);
            assignPath(this.vm, this.exp, selectedValues);
          });
          this.bind(updaters.inputMultiple);
        } else {
          select.addEventListener("change", (event) => {
            const value = (event.target as HTMLSelectElement).value;
            assignPath(this.vm, this.exp, value);
          });
          this.bind(updaters.inputValue);
        }
        break;
      }
      default: {
        throw new Error(`Unsupported element type: ${el.tagName}`);
      }
    }
  }

  text() {
    this.bind(updaters.text.bind(this));
  }
  style() {
    this.bind(updaters.style);
  }
  class() {
    this.bind(updaters.class);
  }
  html() {
    this.bind(updaters.html);
  }
  show() {
    this.bind(updaters.show);
  }
  on() {
    if (this.vm.$props[this.exp] === null) {
      // 만약 들어온 표현식이 props로 받은거라면 이후에 이벤트가 등록되야함
      new Observer(this.vm, this.exp, (newVal) => {
        this.node.addEventListener(this.modifier, newVal);
      });
    } else {
      const fn = extractPath(this.vm, this.exp);
      if (typeof fn === "function") {
        this.node.addEventListener(this.modifier, fn);
      } else {
        const unsafeFn = unsafeEvaluate(this.vm, `function(){ ${this.exp} }`);
        this.node.addEventListener(this.modifier, unsafeFn);
      }
    }
  }

  scheduleTask(key: string, task?: Function[]) {
    const context = { ...Vuelite.context };
    const constructor = key === "if" ? Condition : ForLoop;
    const directiveFn = () => {
      return new constructor(this.vm, this.node as HTMLElement, this.exp, context);
    };
    if (task) task.push(directiveFn);
    else this.vm.deferredTasks.push(directiveFn);
  }

  selectUpdater(updater: Updater): Updater {
    const mod = this.modifier;
    if (mod === "text" || mod === "class" || mod === "style") {
      return updaters[mod].bind(this);
    }
    if (this.name === "bind" && mod === "checked") {
      return updaters.inputCheckbox;
    }

    if (updater) return updater;
    else return mod ? updaters.customBind.bind(this) : updaters.objectBind.bind(this);
  }
}

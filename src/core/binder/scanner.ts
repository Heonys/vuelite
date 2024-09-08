import Vuelite from "../viewmodel/vuelite";
import { Observable } from "./observable";
import type { Visitor } from "./visitor";
import { isReactiveNode } from "@utils/directive";

abstract class Scanner {
  constructor(private visitor: Visitor) {}
  visit(action: Function, target: any) {
    this.visitor.visit(action, target);
  }
  abstract scan(target: any): void;
}

export class VueScanner extends Scanner {
  private fragment: DocumentFragment;

  private node2Fragment(el: Element) {
    const fragment = document.createDocumentFragment();
    let child: Node;
    while ((child = el.firstChild)) fragment.appendChild(child);
    return fragment;
  }

  scan(vm: Vuelite) {
    const action = (node: Node) => {
      isReactiveNode(node) && new Observable(vm, node);
    };

    if (vm.template) {
      this.fragment = this.node2Fragment(vm.template);
      vm.el.innerHTML = "";
    } else {
      this.fragment = this.node2Fragment(vm.el);
    }

    action(this.fragment);
    this.visit(action, this.fragment);
    vm.el.appendChild(this.fragment);
    vm.clearTasks();
  }

  scanPartial(vm: Vuelite, el: HTMLElement, contextTask: Function[]) {
    const container = this.node2Fragment(el);
    const action = (node: Node) => {
      isReactiveNode(node) && new Observable(vm, node, contextTask);
    };
    action(container);
    this.visit(action, container);
    el.appendChild(container);
    return el;
  }
}

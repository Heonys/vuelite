export function isObjectFormat(str: string) {
  const regex = /^\{(\s*[a-zA-Z_$][a-zA-Z_$0-9]*\s*:\s*[^{}]+\s*,?\s*)+\}$/;
  return regex.test(str);
}

export function isFunctionFormat(str: string) {
  const regex = /^\s*(\w+(\.\w+)*)\(\)\s*$/;
  const match = str.match(regex);
  return match ? match[1] : null;
}

export function typeOf(value: any): string {
  return Object.prototype.toString //
    .call(value)
    .slice(8, -1)
    .toLowerCase();
}

export const isObject = (data: any): data is object => {
  return typeOf(data) === "object" || typeOf(data) === "array";
};

export const isPlainObject = (data: any): data is object => {
  return typeOf(data) === "object";
};

export const isFunction = (data: any): data is Function => {
  return typeOf(data) === "function";
};

// 문자열의 시작과 끝이 동일한 따옴표로 감싸져 있는지 확인
export function isQuotedString(str: string) {
  const regex = /^["'].*["']$/;
  return regex.test(str) && str[0] === str[str.length - 1];
}

export function isHtmlFormat(str: string) {
  const htmlTagPattern = /<\/?[a-z][\s\S]*>/i;
  return htmlTagPattern.test(str);
}

export const isElementNode = (node: Node): node is HTMLElement => {
  return node.nodeType === 1;
};

export const isTextNode = (node: Node) => {
  return node.nodeType === 3;
};

export const hasDirectiveBy = (name: string, node: HTMLElement) => {
  const attrs = node?.attributes;
  if (!attrs) return;
  return Array.from(attrs).some((v) => v.name === name);
};

// Regular expressions to match "x in y" and "x of y" formats
export function extractKeywords(str: string) {
  const regexIn = /^(.+?)\s+in\s+(.+)$/;
  const regexOf = /^(.+?)\s+of\s+(.+)$/;

  let match = str.match(regexIn);
  if (match) {
    return { key: match[1], list: match[2] };
  }

  match = str.match(regexOf);
  if (match) {
    return { key: match[1], list: match[2] };
  }
  return null;
}

export function extractAlias(str: string) {
  const match = str.match(/\(([^)]+)\)/);
  if (!match) return [str];

  const variables = match[1]
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item);

  return variables;
}

export function isPrimitive(value: any) {
  return value !== Object(value);
}

export function hasTemplate(str: string) {
  const pattern = /{{\s*.*?\s*}}/;
  return pattern.test(str);
}

export function isMethodsFormat(str: string) {
  return str.slice(-2) === "()";
}

export function isPathFormat(str: string) {
  if (!str.includes(".")) return false;
  const pattern = /^[a-zA-Z_$][a-zA-Z_$0-9]*(\.[a-zA-Z_$][a-zA-Z_$0-9]+)+$/;
  return pattern.test(str);
}

export function isNonStandard(node: Node): node is HTMLElement {
  if (!(node instanceof HTMLElement)) return;
  return node.tagName.includes("-");
}

export function isComponent(node: Node): node is HTMLElement {
  return node instanceof HTMLElement && node.isComponent;
}

export function isTemplateElement(el: HTMLElement): el is HTMLTemplateElement {
  return el instanceof HTMLTemplateElement;
}

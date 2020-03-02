/**
 * utils
 */

export function GetScrollTop(dom) {
  if (!dom) {
    dom = document;
  }
  return dom.documentElement.scrollTop || dom.body.scrollTop;
}

export function GetOffset(element, target = null) {
  const offset = {
    left: 0,
    top: 0
  };
  while (element !== target) {
    offset.left += element.offsetLeft;
    offset.top += element.offsetTop;
    element = element.offsetParent;
  }
  return offset;
}

export function RegisterStoreModule({ module, moduleName, store }) {
  const moduleIsRegistered = store._modules.root._children[moduleName] !== undefined;
  const stateExists = store.state[moduleName];
  if (!moduleIsRegistered) {
    store.registerModule(moduleName, module, { preserveState: stateExists });
  }
}

draft.proxy = function proxy(obj) {
  var access = function(target, prop) {
    if (typeof prop === 'string') {
      return access(target, prop.split('.'));
    }

    let p = prop.shift();

    if (prop.length > 0) {
      return access(target[p] || (target[p] = {}), prop);
    }

    return [target, p];
  };

  var handler = {
    get(target, prop) {
      var [t, p] = access(target, prop);
      return t[p];
    },
    set(target, prop, val) {
      var [t, p] = access(target, prop);
      t[p] = val;
      return true;
    },
    deleteProperty(target, prop) {
      var [t, p] = access(target, prop);
      delete t[p];
      return true;
    }
  };

  // BACKLOG: wait for browser support for ES6 proxies
  return typeof Proxy === 'function' ? new Proxy(obj, handler) : obj;
};

draft.proxy = function proxy(obj, setInit = true) {
  var access = function(target, prop, init) {
    if (typeof prop === 'string') {
      return access(target, prop.split('.'), init);
    }

    let p = prop.shift();

    if (prop.length && typeof target === 'object' && (init || p in target)) {
      // TODO: when init is false, setting obj['foo.bar'] will incorrectly set
      // obj['foo'] instead
      return access(p in target ? target[p] : (target[p] = {}), prop, init);
    }

    return [target, p];
  };

  // TODO: return null if the property does not exist or was not set/deleted?
  var handler = {
    has(target, prop) {
      var [t, p] = access(target, prop);
      return !!t[p];
    },
    get(target, prop) {
      var [t, p] = access(target, prop);
      return t[p];
    },
    set(target, prop, val) {
      var [t, p] = access(target, prop, setInit);
      t[p] = val;
      return true;
    },
    deleteProperty(target, prop) {
      var [t, p] = access(target, prop);
      return delete t[p];
    }
  };

  // BACKLOG: wait for browser support for ES6 proxies
  return new Proxy(obj, handler);
};

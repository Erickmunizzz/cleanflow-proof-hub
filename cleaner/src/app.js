import brandLogo from '../../public/cleanma-logo.png';
import {dayKey} from './supabase.js';
import {useCleaner} from './use-cleaner.js';
import {createPanels} from './panels.js';
var nd = Object.create;
var {
  getPrototypeOf: td,
  defineProperty: zu,
  getOwnPropertyNames: rd
} = Object;
var ld = Object.prototype.hasOwnProperty;
var Xe = (e, n, t) => {
  t = e != null ? nd(td(e)) : {};
  let r = n || !e || !e.__esModule ? zu(t, "default", {
    value: e,
    enumerable: !0
  }) : t;
  for (let l of rd(e)) if (!ld.call(r, l)) zu(r, l, {
    get: () => e[l],
    enumerable: !0
  });
  return r;
};
var el = (e, n) => () => (n || e((n = {
  exports: {}
}).exports, n), n.exports);
var ud = (e, n) => {
  for (var t in n) zu(e, t, {
    get: n[t],
    enumerable: !0,
    configurable: !0,
    set: r => n[t] = () => r
  });
};
var id = (e, n) => () => (e && (n = e(e = 0)), n);
var Rn = el(Ed => {
  var Ut = Symbol.for("react.element"),
    od = Symbol.for("react.portal"),
    ad = Symbol.for("react.fragment"),
    fd = Symbol.for("react.strict_mode"),
    sd = Symbol.for("react.profiler"),
    cd = Symbol.for("react.provider"),
    dd = Symbol.for("react.context"),
    pd = Symbol.for("react.forward_ref"),
    vd = Symbol.for("react.suspense"),
    md = Symbol.for("react.memo"),
    yd = Symbol.for("react.lazy"),
    ta = Symbol.iterator;
  function hd(e) {
    if (e === null || typeof e !== "object") return null;
    return e = ta && e[ta] || e["@@iterator"], typeof e === "function" ? e : null;
  }
  var ua = {
      isMounted: function () {
        return !1;
      },
      enqueueForceUpdate: function () {},
      enqueueReplaceState: function () {},
      enqueueSetState: function () {}
    },
    ia = Object.assign,
    oa = {};
  function bn(e, n, t) {
    this.props = e, this.context = n, this.refs = oa, this.updater = t || ua;
  }
  bn.prototype.isReactComponent = {};
  bn.prototype.setState = function (e, n) {
    if (typeof e !== "object" && typeof e !== "function" && e != null) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
    this.updater.enqueueSetState(this, e, n, "setState");
  };
  bn.prototype.forceUpdate = function (e) {
    this.updater.enqueueForceUpdate(this, e, "forceUpdate");
  };
  function aa() {}
  aa.prototype = bn.prototype;
  function Fu(e, n, t) {
    this.props = e, this.context = n, this.refs = oa, this.updater = t || ua;
  }
  var Ou = Fu.prototype = new aa();
  Ou.constructor = Fu;
  ia(Ou, bn.prototype);
  Ou.isPureReactComponent = !0;
  var ra = Array.isArray,
    fa = Object.prototype.hasOwnProperty,
    Ru = {
      current: null
    },
    sa = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    };
  function ca(e, n, t) {
    var r,
      l = {},
      u = null,
      i = null;
    if (n != null) for (r in n.ref !== void 0 && (i = n.ref), n.key !== void 0 && (u = "" + n.key), n) fa.call(n, r) && !sa.hasOwnProperty(r) && (l[r] = n[r]);
    var o = arguments.length - 2;
    if (o === 1) l.children = t;else if (1 < o) {
      for (var a = Array(o), c = 0; c < o; c++) a[c] = arguments[c + 2];
      l.children = a;
    }
    if (e && e.defaultProps) for (r in o = e.defaultProps, o) l[r] === void 0 && (l[r] = o[r]);
    return {
      $$typeof: Ut,
      type: e,
      key: u,
      ref: i,
      props: l,
      _owner: Ru.current
    };
  }
  function gd(e, n) {
    return {
      $$typeof: Ut,
      type: e.type,
      key: n,
      ref: e.ref,
      props: e.props,
      _owner: e._owner
    };
  }
  function Du(e) {
    return typeof e === "object" && e !== null && e.$$typeof === Ut;
  }
  function Sd(e) {
    var n = {
      "=": "=0",
      ":": "=2"
    };
    return "$" + e.replace(/[=:]/g, function (t) {
      return n[t];
    });
  }
  var la = /\/+/g;
  function Tu(e, n) {
    return typeof e === "object" && e !== null && e.key != null ? Sd("" + e.key) : n.toString(36);
  }
  function tl(e, n, t, r, l) {
    var u = typeof e;
    if (u === "undefined" || u === "boolean") e = null;
    var i = !1;
    if (e === null) i = !0;else switch (u) {
      case "string":
      case "number":
        i = !0;
        break;
      case "object":
        switch (e.$$typeof) {
          case Ut:
          case od:
            i = !0;
        }
    }
    if (i) return i = e, l = l(i), e = r === "" ? "." + Tu(i, 0) : r, ra(l) ? (t = "", e != null && (t = e.replace(la, "$&/") + "/"), tl(l, n, t, "", function (c) {
      return c;
    })) : l != null && (Du(l) && (l = gd(l, t + (!l.key || i && i.key === l.key ? "" : ("" + l.key).replace(la, "$&/") + "/") + e)), n.push(l)), 1;
    if (i = 0, r = r === "" ? "." : r + ":", ra(e)) for (var o = 0; o < e.length; o++) {
      u = e[o];
      var a = r + Tu(u, o);
      i += tl(u, n, t, a, l);
    } else if (a = hd(e), typeof a === "function") for (e = a.call(e), o = 0; !(u = e.next()).done;) u = u.value, a = r + Tu(u, o++), i += tl(u, n, t, a, l);else if (u === "object") throw n = String(e), Error("Objects are not valid as a React child (found: " + (n === "[object Object]" ? "object with keys {" + Object.keys(e).join(", ") + "}" : n) + "). If you meant to render a collection of children, use an array instead.");
    return i;
  }
  function nl(e, n, t) {
    if (e == null) return e;
    var r = [],
      l = 0;
    return tl(e, r, "", "", function (u) {
      return n.call(t, u, l++);
    }), r;
  }
  function wd(e) {
    if (e._status === -1) {
      var n = e._result;
      n = n(), n.then(function (t) {
        if (e._status === 0 || e._status === -1) e._status = 1, e._result = t;
      }, function (t) {
        if (e._status === 0 || e._status === -1) e._status = 2, e._result = t;
      }), e._status === -1 && (e._status = 0, e._result = n);
    }
    if (e._status === 1) return e._result.default;
    throw e._result;
  }
  var ae = {
      current: null
    },
    rl = {
      transition: null
    },
    kd = {
      ReactCurrentDispatcher: ae,
      ReactCurrentBatchConfig: rl,
      ReactCurrentOwner: Ru
    };
  function da() {
    throw Error("act(...) is not supported in production builds of React.");
  }
  Ed.Children = {
    map: nl,
    forEach: function (e, n, t) {
      nl(e, function () {
        n.apply(this, arguments);
      }, t);
    },
    count: function (e) {
      var n = 0;
      return nl(e, function () {
        n++;
      }), n;
    },
    toArray: function (e) {
      return nl(e, function (n) {
        return n;
      }) || [];
    },
    only: function (e) {
      if (!Du(e)) throw Error("React.Children.only expected to receive a single React element child.");
      return e;
    }
  };
  Ed.Component = bn;
  Ed.Fragment = ad;
  Ed.Profiler = sd;
  Ed.PureComponent = Fu;
  Ed.StrictMode = fd;
  Ed.Suspense = vd;
  Ed.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = kd;
  Ed.act = da;
  Ed.cloneElement = function (e, n, t) {
    if (e === null || e === void 0) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + e + ".");
    var r = ia({}, e.props),
      l = e.key,
      u = e.ref,
      i = e._owner;
    if (n != null) {
      if (n.ref !== void 0 && (u = n.ref, i = Ru.current), n.key !== void 0 && (l = "" + n.key), e.type && e.type.defaultProps) var o = e.type.defaultProps;
      for (a in n) fa.call(n, a) && !sa.hasOwnProperty(a) && (r[a] = n[a] === void 0 && o !== void 0 ? o[a] : n[a]);
    }
    var a = arguments.length - 2;
    if (a === 1) r.children = t;else if (1 < a) {
      o = Array(a);
      for (var c = 0; c < a; c++) o[c] = arguments[c + 2];
      r.children = o;
    }
    return {
      $$typeof: Ut,
      type: e.type,
      key: l,
      ref: u,
      props: r,
      _owner: i
    };
  };
  Ed.createContext = function (e) {
    return e = {
      $$typeof: dd,
      _currentValue: e,
      _currentValue2: e,
      _threadCount: 0,
      Provider: null,
      Consumer: null,
      _defaultValue: null,
      _globalName: null
    }, e.Provider = {
      $$typeof: cd,
      _context: e
    }, e.Consumer = e;
  };
  Ed.createElement = ca;
  Ed.createFactory = function (e) {
    var n = ca.bind(null, e);
    return n.type = e, n;
  };
  Ed.createRef = function () {
    return {
      current: null
    };
  };
  Ed.forwardRef = function (e) {
    return {
      $$typeof: pd,
      render: e
    };
  };
  Ed.isValidElement = Du;
  Ed.lazy = function (e) {
    return {
      $$typeof: yd,
      _payload: {
        _status: -1,
        _result: e
      },
      _init: wd
    };
  };
  Ed.memo = function (e, n) {
    return {
      $$typeof: md,
      type: e,
      compare: n === void 0 ? null : n
    };
  };
  Ed.startTransition = function (e) {
    var n = rl.transition;
    rl.transition = {};
    try {
      e();
    } finally {
      rl.transition = n;
    }
  };
  Ed.unstable_act = da;
  Ed.useCallback = function (e, n) {
    return ae.current.useCallback(e, n);
  };
  Ed.useContext = function (e) {
    return ae.current.useContext(e);
  };
  Ed.useDebugValue = function () {};
  Ed.useDeferredValue = function (e) {
    return ae.current.useDeferredValue(e);
  };
  Ed.useEffect = function (e, n) {
    return ae.current.useEffect(e, n);
  };
  Ed.useId = function () {
    return ae.current.useId();
  };
  Ed.useImperativeHandle = function (e, n, t) {
    return ae.current.useImperativeHandle(e, n, t);
  };
  Ed.useInsertionEffect = function (e, n) {
    return ae.current.useInsertionEffect(e, n);
  };
  Ed.useLayoutEffect = function (e, n) {
    return ae.current.useLayoutEffect(e, n);
  };
  Ed.useMemo = function (e, n) {
    return ae.current.useMemo(e, n);
  };
  Ed.useReducer = function (e, n, t) {
    return ae.current.useReducer(e, n, t);
  };
  Ed.useRef = function (e) {
    return ae.current.useRef(e);
  };
  Ed.useState = function (e) {
    return ae.current.useState(e);
  };
  Ed.useSyncExternalStore = function (e, n, t) {
    return ae.current.useSyncExternalStore(e, n, t);
  };
  Ed.useTransition = function () {
    return ae.current.useTransition();
  };
  Ed.version = "18.3.1";
});
var Sa = el(ip => {
  function Lu(e, n) {
    var t = e.length;
    e.push(n);
    e: for (; 0 < t;) {
      var r = t - 1 >>> 1,
        l = e[r];
      if (0 < ll(l, n)) e[r] = n, e[t] = l, t = r;else break e;
    }
  }
  function Fe(e) {
    return e.length === 0 ? null : e[0];
  }
  function al(e) {
    if (e.length === 0) return null;
    var n = e[0],
      t = e.pop();
    if (t !== n) {
      e[0] = t;
      e: for (var r = 0, l = e.length, u = l >>> 1; r < u;) {
        var i = 2 * (r + 1) - 1,
          o = e[i],
          a = i + 1,
          c = e[a];
        if (0 > ll(o, t)) a < l && 0 > ll(c, o) ? (e[r] = c, e[a] = t, r = a) : (e[r] = o, e[i] = t, r = i);else if (a < l && 0 > ll(c, t)) e[r] = c, e[a] = t, r = a;else break e;
      }
    }
    return n;
  }
  function ll(e, n) {
    var t = e.sortIndex - n.sortIndex;
    return t !== 0 ? t : e.id - n.id;
  }
  if (typeof performance === "object" && typeof performance.now === "function") Vu = performance, ip.unstable_now = function () {
    return Vu.now();
  };else ul = Date, Uu = ul.now(), ip.unstable_now = function () {
    return ul.now() - Uu;
  };
  var Vu,
    ul,
    Uu,
    He = [],
    un = [],
    up = 1,
    Ee = null,
    re = 3,
    fl = !1,
    Dn = !1,
    Bt = !1,
    va = typeof setTimeout === "function" ? setTimeout : null,
    ma = typeof clearTimeout === "function" ? clearTimeout : null,
    pa = typeof setImmediate < "u" ? setImmediate : null;
  typeof navigator < "u" && navigator.scheduling !== void 0 && navigator.scheduling.isInputPending !== void 0 && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function $u(e) {
    for (var n = Fe(un); n !== null;) {
      if (n.callback === null) al(un);else if (n.startTime <= e) al(un), n.sortIndex = n.expirationTime, Lu(He, n);else break;
      n = Fe(un);
    }
  }
  function Hu(e) {
    if (Bt = !1, $u(e), !Dn) if (Fe(He) !== null) Dn = !0, Qu(Au);else {
      var n = Fe(un);
      n !== null && Iu(Hu, n.startTime - e);
    }
  }
  function Au(e, n) {
    Dn = !1, Bt && (Bt = !1, ma(Ht), Ht = -1), fl = !0;
    var t = re;
    try {
      $u(n);
      for (Ee = Fe(He); Ee !== null && (!(Ee.expirationTime > n) || e && !ga());) {
        var r = Ee.callback;
        if (typeof r === "function") {
          Ee.callback = null, re = Ee.priorityLevel;
          var l = r(Ee.expirationTime <= n);
          n = ip.unstable_now(), typeof l === "function" ? Ee.callback = l : Ee === Fe(He) && al(He), $u(n);
        } else al(He);
        Ee = Fe(He);
      }
      if (Ee !== null) var u = !0;else {
        var i = Fe(un);
        i !== null && Iu(Hu, i.startTime - n), u = !1;
      }
      return u;
    } finally {
      Ee = null, re = t, fl = !1;
    }
  }
  var sl = !1,
    il = null,
    Ht = -1,
    ya = 5,
    ha = -1;
  function ga() {
    return ip.unstable_now() - ha < ya ? !1 : !0;
  }
  function Mu() {
    if (il !== null) {
      var e = ip.unstable_now();
      ha = e;
      var n = !0;
      try {
        n = il(!0, e);
      } finally {
        n ? $t() : (sl = !1, il = null);
      }
    } else sl = !1;
  }
  var $t;
  if (typeof pa === "function") $t = function () {
    pa(Mu);
  };else if (typeof MessageChannel < "u") ol = new MessageChannel(), Bu = ol.port2, ol.port1.onmessage = Mu, $t = function () {
    Bu.postMessage(null);
  };else $t = function () {
    va(Mu, 0);
  };
  var ol, Bu;
  function Qu(e) {
    il = e, sl || (sl = !0, $t());
  }
  function Iu(e, n) {
    Ht = va(function () {
      e(ip.unstable_now());
    }, n);
  }
  ip.unstable_IdlePriority = 5;
  ip.unstable_ImmediatePriority = 1;
  ip.unstable_LowPriority = 4;
  ip.unstable_NormalPriority = 3;
  ip.unstable_Profiling = null;
  ip.unstable_UserBlockingPriority = 2;
  ip.unstable_cancelCallback = function (e) {
    e.callback = null;
  };
  ip.unstable_continueExecution = function () {
    Dn || fl || (Dn = !0, Qu(Au));
  };
  ip.unstable_forceFrameRate = function (e) {
    0 > e || 125 < e ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : ya = 0 < e ? Math.floor(1000 / e) : 5;
  };
  ip.unstable_getCurrentPriorityLevel = function () {
    return re;
  };
  ip.unstable_getFirstCallbackNode = function () {
    return Fe(He);
  };
  ip.unstable_next = function (e) {
    switch (re) {
      case 1:
      case 2:
      case 3:
        var n = 3;
        break;
      default:
        n = re;
    }
    var t = re;
    re = n;
    try {
      return e();
    } finally {
      re = t;
    }
  };
  ip.unstable_pauseExecution = function () {};
  ip.unstable_requestPaint = function () {};
  ip.unstable_runWithPriority = function (e, n) {
    switch (e) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        e = 3;
    }
    var t = re;
    re = e;
    try {
      return n();
    } finally {
      re = t;
    }
  };
  ip.unstable_scheduleCallback = function (e, n, t) {
    var r = ip.unstable_now();
    switch (typeof t === "object" && t !== null ? (t = t.delay, t = typeof t === "number" && 0 < t ? r + t : r) : t = r, e) {
      case 1:
        var l = -1;
        break;
      case 2:
        l = 250;
        break;
      case 5:
        l = 1073741823;
        break;
      case 4:
        l = 1e4;
        break;
      default:
        l = 5000;
    }
    return l = t + l, e = {
      id: up++,
      callback: n,
      priorityLevel: e,
      startTime: t,
      expirationTime: l,
      sortIndex: -1
    }, t > r ? (e.sortIndex = t, Lu(un, e), Fe(He) === null && e === Fe(un) && (Bt ? (ma(Ht), Ht = -1) : Bt = !0, Iu(Hu, t - r))) : (e.sortIndex = l, Lu(He, e), Dn || fl || (Dn = !0, Qu(Au))), e;
  };
  ip.unstable_shouldYield = ga;
  ip.unstable_wrapCallback = function (e) {
    var n = re;
    return function () {
      var t = re;
      re = n;
      try {
        return e.apply(this, arguments);
      } finally {
        re = t;
      }
    };
  };
});
var qo = {};
ud(qo, {
  version: () => Lc,
  unstable_renderSubtreeIntoContainer: () => Mc,
  unstable_batchedUpdates: () => Dc,
  unmountComponentAtNode: () => Rc,
  render: () => Oc,
  hydrateRoot: () => Fc,
  hydrate: () => Tc,
  flushSync: () => zc,
  findDOMNode: () => Nc,
  createRoot: () => Cc,
  createPortal: () => Pc,
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: () => _c
});
function w(e) {
  for (var n = "https://reactjs.org/docs/error-decoder.html?invariant=" + e, t = 1; t < arguments.length; t++) n += "&args[]=" + encodeURIComponent(arguments[t]);
  return "Minified React error #" + e + "; visit " + n + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
function Xn(e, n) {
  kt(e, n), kt(e + "Capture", n);
}
function kt(e, n) {
  sr[e] = n;
  for (e = 0; e < n.length; e++) Nf.add(n[e]);
}
function Np(e) {
  if (si.call(ka, e)) return !0;
  if (si.call(wa, e)) return !1;
  if (Cp.test(e)) return ka[e] = !0;
  return wa[e] = !0, !1;
}
function zp(e, n, t, r) {
  if (t !== null && t.type === 0) return !1;
  switch (typeof n) {
    case "function":
    case "symbol":
      return !0;
    case "boolean":
      if (r) return !1;
      if (t !== null) return !t.acceptsBooleans;
      return e = e.toLowerCase().slice(0, 5), e !== "data-" && e !== "aria-";
    default:
      return !1;
  }
}
function Tp(e, n, t, r) {
  if (n === null || typeof n > "u" || zp(e, n, t, r)) return !0;
  if (r) return !1;
  if (t !== null) switch (t.type) {
    case 3:
      return !n;
    case 4:
      return n === !1;
    case 5:
      return isNaN(n);
    case 6:
      return isNaN(n) || 1 > n;
  }
  return !1;
}
function ce(e, n, t, r, l, u, i) {
  this.acceptsBooleans = n === 2 || n === 3 || n === 4, this.attributeName = r, this.attributeNamespace = l, this.mustUseProperty = t, this.propertyName = e, this.type = n, this.sanitizeURL = u, this.removeEmptyString = i;
}
function uo(e) {
  return e[1].toUpperCase();
}
function io(e, n, t, r) {
  var l = te.hasOwnProperty(n) ? te[n] : null;
  if (l !== null ? l.type !== 0 : r || !(2 < n.length) || n[0] !== "o" && n[0] !== "O" || n[1] !== "n" && n[1] !== "N") Tp(n, t, l, r) && (t = null), r || l === null ? Np(n) && (t === null ? e.removeAttribute(n) : e.setAttribute(n, "" + t)) : l.mustUseProperty ? e[l.propertyName] = t === null ? l.type === 3 ? !1 : "" : t : (n = l.attributeName, r = l.attributeNamespace, t === null ? e.removeAttribute(n) : (l = l.type, t = l === 3 || l === 4 && t === !0 ? "" : "" + t, r ? e.setAttributeNS(r, n, t) : e.setAttribute(n, t)));
}
function At(e) {
  if (e === null || typeof e !== "object") return null;
  return e = Ea && e[Ea] || e["@@iterator"], typeof e === "function" ? e : null;
}
function Gt(e) {
  if (Wu === void 0) try {
    throw Error();
  } catch (t) {
    var n = t.stack.trim().match(/\n( *(at )?)/);
    Wu = n && n[1] || "";
  }
  return `
` + Wu + e;
}
function Yu(e, n) {
  if (!e || Ku) return "";
  Ku = !0;
  var t = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (n) {
      if (n = function () {
        throw Error();
      }, Object.defineProperty(n.prototype, "props", {
        set: function () {
          throw Error();
        }
      }), typeof Reflect === "object" && Reflect.construct) {
        try {
          Reflect.construct(n, []);
        } catch (c) {
          var r = c;
        }
        Reflect.construct(e, [], n);
      } else {
        try {
          n.call();
        } catch (c) {
          r = c;
        }
        e.call(n.prototype);
      }
    } else {
      try {
        throw Error();
      } catch (c) {
        r = c;
      }
      e();
    }
  } catch (c) {
    if (c && r && typeof c.stack === "string") {
      for (var l = c.stack.split(`
`), u = r.stack.split(`
`), i = l.length - 1, o = u.length - 1; 1 <= i && 0 <= o && l[i] !== u[o];) o--;
      for (; 1 <= i && 0 <= o; i--, o--) if (l[i] !== u[o]) {
        if (i !== 1 || o !== 1) do if (i--, o--, 0 > o || l[i] !== u[o]) {
          var a = `
` + l[i].replace(" at new ", " at ");
          return e.displayName && a.includes("<anonymous>") && (a = a.replace("<anonymous>", e.displayName)), a;
        } while (1 <= i && 0 <= o);
        break;
      }
    }
  } finally {
    Ku = !1, Error.prepareStackTrace = t;
  }
  return (e = e ? e.displayName || e.name : "") ? Gt(e) : "";
}
function Fp(e) {
  switch (e.tag) {
    case 5:
      return Gt(e.type);
    case 16:
      return Gt("Lazy");
    case 13:
      return Gt("Suspense");
    case 19:
      return Gt("SuspenseList");
    case 0:
    case 2:
    case 15:
      return e = Yu(e.type, !1), e;
    case 11:
      return e = Yu(e.type.render, !1), e;
    case 1:
      return e = Yu(e.type, !0), e;
    default:
      return "";
  }
}
function vi(e) {
  if (e == null) return null;
  if (typeof e === "function") return e.displayName || e.name || null;
  if (typeof e === "string") return e;
  switch (e) {
    case lt:
      return "Fragment";
    case rt:
      return "Portal";
    case ci:
      return "Profiler";
    case oo:
      return "StrictMode";
    case di:
      return "Suspense";
    case pi:
      return "SuspenseList";
  }
  if (typeof e === "object") switch (e.$$typeof) {
    case Tf:
      return (e.displayName || "Context") + ".Consumer";
    case zf:
      return (e._context.displayName || "Context") + ".Provider";
    case ao:
      var n = e.render;
      return e = e.displayName, e || (e = n.displayName || n.name || "", e = e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef"), e;
    case fo:
      return n = e.displayName || null, n !== null ? n : vi(e.type) || "Memo";
    case an:
      n = e._payload, e = e._init;
      try {
        return vi(e(n));
      } catch (t) {}
  }
  return null;
}
function Op(e) {
  var n = e.type;
  switch (e.tag) {
    case 24:
      return "Cache";
    case 9:
      return (n.displayName || "Context") + ".Consumer";
    case 10:
      return (n._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return e = n.render, e = e.displayName || e.name || "", n.displayName || (e !== "" ? "ForwardRef(" + e + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return n;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return vi(n);
    case 8:
      return n === oo ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if (typeof n === "function") return n.displayName || n.name || null;
      if (typeof n === "string") return n;
  }
  return null;
}
function En(e) {
  switch (typeof e) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return e;
    case "object":
      return e;
    default:
      return "";
  }
}
function Of(e) {
  var n = e.type;
  return (e = e.nodeName) && e.toLowerCase() === "input" && (n === "checkbox" || n === "radio");
}
function Rp(e) {
  var n = Of(e) ? "checked" : "value",
    t = Object.getOwnPropertyDescriptor(e.constructor.prototype, n),
    r = "" + e[n];
  if (!e.hasOwnProperty(n) && typeof t < "u" && typeof t.get === "function" && typeof t.set === "function") {
    var {
      get: l,
      set: u
    } = t;
    return Object.defineProperty(e, n, {
      configurable: !0,
      get: function () {
        return l.call(this);
      },
      set: function (i) {
        r = "" + i, u.call(this, i);
      }
    }), Object.defineProperty(e, n, {
      enumerable: t.enumerable
    }), {
      getValue: function () {
        return r;
      },
      setValue: function (i) {
        r = "" + i;
      },
      stopTracking: function () {
        e._valueTracker = null, delete e[n];
      }
    };
  }
}
function dl(e) {
  e._valueTracker || (e._valueTracker = Rp(e));
}
function Rf(e) {
  if (!e) return !1;
  var n = e._valueTracker;
  if (!n) return !0;
  var t = n.getValue(),
    r = "";
  return e && (r = Of(e) ? e.checked ? "true" : "false" : e.value), e = r, e !== t ? (n.setValue(e), !0) : !1;
}
function $l(e) {
  if (e = e || (typeof document < "u" ? document : void 0), typeof e > "u") return null;
  try {
    return e.activeElement || e.body;
  } catch (n) {
    return e.body;
  }
}
function mi(e, n) {
  var t = n.checked;
  return K({}, n, {
    defaultChecked: void 0,
    defaultValue: void 0,
    value: void 0,
    checked: t != null ? t : e._wrapperState.initialChecked
  });
}
function _a(e, n) {
  var t = n.defaultValue == null ? "" : n.defaultValue,
    r = n.checked != null ? n.checked : n.defaultChecked;
  t = En(n.value != null ? n.value : t), e._wrapperState = {
    initialChecked: r,
    initialValue: t,
    controlled: n.type === "checkbox" || n.type === "radio" ? n.checked != null : n.value != null
  };
}
function Df(e, n) {
  n = n.checked, n != null && io(e, "checked", n, !1);
}
function yi(e, n) {
  Df(e, n);
  var t = En(n.value),
    r = n.type;
  if (t != null) {
    if (r === "number") {
      if (t === 0 && e.value === "" || e.value != t) e.value = "" + t;
    } else e.value !== "" + t && (e.value = "" + t);
  } else if (r === "submit" || r === "reset") {
    e.removeAttribute("value");
    return;
  }
  n.hasOwnProperty("value") ? hi(e, n.type, t) : n.hasOwnProperty("defaultValue") && hi(e, n.type, En(n.defaultValue)), n.checked == null && n.defaultChecked != null && (e.defaultChecked = !!n.defaultChecked);
}
function Pa(e, n, t) {
  if (n.hasOwnProperty("value") || n.hasOwnProperty("defaultValue")) {
    var r = n.type;
    if (!(r !== "submit" && r !== "reset" || n.value !== void 0 && n.value !== null)) return;
    n = "" + e._wrapperState.initialValue, t || n === e.value || (e.value = n), e.defaultValue = n;
  }
  t = e.name, t !== "" && (e.name = ""), e.defaultChecked = !!e._wrapperState.initialChecked, t !== "" && (e.name = t);
}
function hi(e, n, t) {
  if (n !== "number" || $l(e.ownerDocument) !== e) t == null ? e.defaultValue = "" + e._wrapperState.initialValue : e.defaultValue !== "" + t && (e.defaultValue = "" + t);
}
function mt(e, n, t, r) {
  if (e = e.options, n) {
    n = {};
    for (var l = 0; l < t.length; l++) n["$" + t[l]] = !0;
    for (t = 0; t < e.length; t++) l = n.hasOwnProperty("$" + e[t].value), e[t].selected !== l && (e[t].selected = l), l && r && (e[t].defaultSelected = !0);
  } else {
    t = "" + En(t), n = null;
    for (l = 0; l < e.length; l++) {
      if (e[l].value === t) {
        e[l].selected = !0, r && (e[l].defaultSelected = !0);
        return;
      }
      n !== null || e[l].disabled || (n = e[l]);
    }
    n !== null && (n.selected = !0);
  }
}
function gi(e, n) {
  if (n.dangerouslySetInnerHTML != null) throw Error(w(91));
  return K({}, n, {
    value: void 0,
    defaultValue: void 0,
    children: "" + e._wrapperState.initialValue
  });
}
function Ca(e, n) {
  var t = n.value;
  if (t == null) {
    if (t = n.children, n = n.defaultValue, t != null) {
      if (n != null) throw Error(w(92));
      if (Zt(t)) {
        if (1 < t.length) throw Error(w(93));
        t = t[0];
      }
      n = t;
    }
    n == null && (n = ""), t = n;
  }
  e._wrapperState = {
    initialValue: En(t)
  };
}
function Mf(e, n) {
  var t = En(n.value),
    r = En(n.defaultValue);
  t != null && (t = "" + t, t !== e.value && (e.value = t), n.defaultValue == null && e.defaultValue !== t && (e.defaultValue = t)), r != null && (e.defaultValue = "" + r);
}
function Na(e) {
  var n = e.textContent;
  n === e._wrapperState.initialValue && n !== "" && n !== null && (e.value = n);
}
function Lf(e) {
  switch (e) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function Si(e, n) {
  return e == null || e === "http://www.w3.org/1999/xhtml" ? Lf(n) : e === "http://www.w3.org/2000/svg" && n === "foreignObject" ? "http://www.w3.org/1999/xhtml" : e;
}
function cr(e, n) {
  if (n) {
    var t = e.firstChild;
    if (t && t === e.lastChild && t.nodeType === 3) {
      t.nodeValue = n;
      return;
    }
  }
  e.textContent = n;
}
function Uf(e, n, t) {
  return n == null || typeof n === "boolean" || n === "" ? "" : t || typeof n !== "number" || n === 0 || nr.hasOwnProperty(e) && nr[e] ? ("" + n).trim() : n + "px";
}
function $f(e, n) {
  e = e.style;
  for (var t in n) if (n.hasOwnProperty(t)) {
    var r = t.indexOf("--") === 0,
      l = Uf(t, n[t], r);
    t === "float" && (t = "cssFloat"), r ? e.setProperty(t, l) : e[t] = l;
  }
}
function wi(e, n) {
  if (n) {
    if (Mp[e] && (n.children != null || n.dangerouslySetInnerHTML != null)) throw Error(w(137, e));
    if (n.dangerouslySetInnerHTML != null) {
      if (n.children != null) throw Error(w(60));
      if (typeof n.dangerouslySetInnerHTML !== "object" || !("__html" in n.dangerouslySetInnerHTML)) throw Error(w(61));
    }
    if (n.style != null && typeof n.style !== "object") throw Error(w(62));
  }
}
function ki(e, n) {
  if (e.indexOf("-") === -1) return typeof n.is === "string";
  switch (e) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return !1;
    default:
      return !0;
  }
}
function so(e) {
  return e = e.target || e.srcElement || window, e.correspondingUseElement && (e = e.correspondingUseElement), e.nodeType === 3 ? e.parentNode : e;
}
function za(e) {
  if (e = Fr(e)) {
    if (typeof _i !== "function") throw Error(w(280));
    var n = e.stateNode;
    n && (n = cu(n), _i(e.stateNode, e.type, n));
  }
}
function Bf(e) {
  yt ? ht ? ht.push(e) : ht = [e] : yt = e;
}
function Hf() {
  if (yt) {
    var e = yt,
      n = ht;
    if (ht = yt = null, za(e), n) for (e = 0; e < n.length; e++) za(n[e]);
  }
}
function Af(e, n) {
  return e(n);
}
function Qf() {}
function If(e, n, t) {
  if (Xu) return e(n, t);
  Xu = !0;
  try {
    return Af(e, n, t);
  } finally {
    if (Xu = !1, yt !== null || ht !== null) Qf(), Hf();
  }
}
function dr(e, n) {
  var t = e.stateNode;
  if (t === null) return null;
  var r = cu(t);
  if (r === null) return null;
  t = r[n];
  e: switch (n) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (r = !r.disabled) || (e = e.type, r = !(e === "button" || e === "input" || e === "select" || e === "textarea")), e = !r;
      break e;
    default:
      e = !1;
  }
  if (e) return null;
  if (t && typeof t !== "function") throw Error(w(231, n, typeof t));
  return t;
}
function Lp(e, n, t, r, l, u, i, o, a) {
  var c = Array.prototype.slice.call(arguments, 3);
  try {
    n.apply(t, c);
  } catch (y) {
    this.onError(y);
  }
}
function Up(e, n, t, r, l, u, i, o, a) {
  tr = !1, Bl = null, Lp.apply(Vp, arguments);
}
function $p(e, n, t, r, l, u, i, o, a) {
  if (Up.apply(this, arguments), tr) {
    if (tr) {
      var c = Bl;
      tr = !1, Bl = null;
    } else throw Error(w(198));
    Hl || (Hl = !0, Ci = c);
  }
}
function Gn(e) {
  var n = e,
    t = e;
  if (e.alternate) for (; n.return;) n = n.return;else {
    e = n;
    do n = e, (n.flags & 4098) !== 0 && (t = n.return), e = n.return; while (e);
  }
  return n.tag === 3 ? t : null;
}
function Wf(e) {
  if (e.tag === 13) {
    var n = e.memoizedState;
    if (n === null && (e = e.alternate, e !== null && (n = e.memoizedState)), n !== null) return n.dehydrated;
  }
  return null;
}
function Ta(e) {
  if (Gn(e) !== e) throw Error(w(188));
}
function Bp(e) {
  var n = e.alternate;
  if (!n) {
    if (n = Gn(e), n === null) throw Error(w(188));
    return n !== e ? null : e;
  }
  for (var t = e, r = n;;) {
    var l = t.return;
    if (l === null) break;
    var u = l.alternate;
    if (u === null) {
      if (r = l.return, r !== null) {
        t = r;
        continue;
      }
      break;
    }
    if (l.child === u.child) {
      for (u = l.child; u;) {
        if (u === t) return Ta(l), e;
        if (u === r) return Ta(l), n;
        u = u.sibling;
      }
      throw Error(w(188));
    }
    if (t.return !== r.return) t = l, r = u;else {
      for (var i = !1, o = l.child; o;) {
        if (o === t) {
          i = !0, t = l, r = u;
          break;
        }
        if (o === r) {
          i = !0, r = l, t = u;
          break;
        }
        o = o.sibling;
      }
      if (!i) {
        for (o = u.child; o;) {
          if (o === t) {
            i = !0, t = u, r = l;
            break;
          }
          if (o === r) {
            i = !0, r = u, t = l;
            break;
          }
          o = o.sibling;
        }
        if (!i) throw Error(w(189));
      }
    }
    if (t.alternate !== r) throw Error(w(190));
  }
  if (t.tag !== 3) throw Error(w(188));
  return t.stateNode.current === t ? e : n;
}
function Kf(e) {
  return e = Bp(e), e !== null ? Yf(e) : null;
}
function Yf(e) {
  if (e.tag === 5 || e.tag === 6) return e;
  for (e = e.child; e !== null;) {
    var n = Yf(e);
    if (n !== null) return n;
    e = e.sibling;
  }
  return null;
}
function Wp(e) {
  if (We && typeof We.onCommitFiberRoot === "function") try {
    We.onCommitFiberRoot(ou, e, void 0, (e.current.flags & 128) === 128);
  } catch (n) {}
}
function Xp(e) {
  return e >>>= 0, e === 0 ? 32 : 31 - (Kp(e) / Yp | 0) | 0;
}
function qt(e) {
  switch (e & -e) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return e & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return e & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return e;
  }
}
function Ql(e, n) {
  var t = e.pendingLanes;
  if (t === 0) return 0;
  var r = 0,
    l = e.suspendedLanes,
    u = e.pingedLanes,
    i = t & 268435455;
  if (i !== 0) {
    var o = i & ~l;
    o !== 0 ? r = qt(o) : (u &= i, u !== 0 && (r = qt(u)));
  } else i = t & ~l, i !== 0 ? r = qt(i) : u !== 0 && (r = qt(u));
  if (r === 0) return 0;
  if (n !== 0 && n !== r && (n & l) === 0 && (l = r & -r, u = n & -n, l >= u || l === 16 && (u & 4194240) !== 0)) return n;
  if ((r & 4) !== 0 && (r |= t & 16), n = e.entangledLanes, n !== 0) for (e = e.entanglements, n &= r; 0 < n;) t = 31 - Le(n), l = 1 << t, r |= e[t], n &= ~l;
  return r;
}
function Gp(e, n) {
  switch (e) {
    case 1:
    case 2:
    case 4:
      return n + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return n + 5000;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function Zp(e, n) {
  for (var {
    suspendedLanes: t,
    pingedLanes: r,
    expirationTimes: l,
    pendingLanes: u
  } = e; 0 < u;) {
    var i = 31 - Le(u),
      o = 1 << i,
      a = l[i];
    if (a === -1) {
      if ((o & t) === 0 || (o & r) !== 0) l[i] = Gp(o, n);
    } else a <= n && (e.expiredLanes |= o);
    u &= ~o;
  }
}
function Ni(e) {
  return e = e.pendingLanes & -1073741825, e !== 0 ? e : e & 1073741824 ? 1073741824 : 0;
}
function qf() {
  var e = vl;
  return vl <<= 1, (vl & 4194240) === 0 && (vl = 64), e;
}
function Gu(e) {
  for (var n = [], t = 0; 31 > t; t++) n.push(e);
  return n;
}
function zr(e, n, t) {
  e.pendingLanes |= n, n !== 536870912 && (e.suspendedLanes = 0, e.pingedLanes = 0), e = e.eventTimes, n = 31 - Le(n), e[n] = t;
}
function qp(e, n) {
  var t = e.pendingLanes & ~n;
  e.pendingLanes = n, e.suspendedLanes = 0, e.pingedLanes = 0, e.expiredLanes &= n, e.mutableReadLanes &= n, e.entangledLanes &= n, n = e.entanglements;
  var r = e.eventTimes;
  for (e = e.expirationTimes; 0 < t;) {
    var l = 31 - Le(t),
      u = 1 << l;
    n[l] = 0, r[l] = -1, e[l] = -1, t &= ~u;
  }
}
function po(e, n) {
  var t = e.entangledLanes |= n;
  for (e = e.entanglements; t;) {
    var r = 31 - Le(t),
      l = 1 << r;
    l & n | e[r] & n && (e[r] |= n), t &= ~l;
  }
}
function xf(e) {
  return e &= -e, 1 < e ? 4 < e ? (e & 268435455) !== 0 ? 16 : 536870912 : 4 : 1;
}
function Oa(e, n) {
  switch (e) {
    case "focusin":
    case "focusout":
      vn = null;
      break;
    case "dragenter":
    case "dragleave":
      mn = null;
      break;
    case "mouseover":
    case "mouseout":
      yn = null;
      break;
    case "pointerover":
    case "pointerout":
      pr.delete(n.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      vr.delete(n.pointerId);
  }
}
function Qt(e, n, t, r, l, u) {
  if (e === null || e.nativeEvent !== u) return e = {
    blockedOn: n,
    domEventName: t,
    eventSystemFlags: r,
    nativeEvent: u,
    targetContainers: [l]
  }, n !== null && (n = Fr(n), n !== null && vo(n)), e;
  return e.eventSystemFlags |= r, n = e.targetContainers, l !== null && n.indexOf(l) === -1 && n.push(l), e;
}
function Jp(e, n, t, r, l) {
  switch (n) {
    case "focusin":
      return vn = Qt(vn, e, n, t, r, l), !0;
    case "dragenter":
      return mn = Qt(mn, e, n, t, r, l), !0;
    case "mouseover":
      return yn = Qt(yn, e, n, t, r, l), !0;
    case "pointerover":
      var u = l.pointerId;
      return pr.set(u, Qt(pr.get(u) || null, e, n, t, r, l)), !0;
    case "gotpointercapture":
      return u = l.pointerId, vr.set(u, Qt(vr.get(u) || null, e, n, t, r, l)), !0;
  }
  return !1;
}
function ns(e) {
  var n = Un(e.target);
  if (n !== null) {
    var t = Gn(n);
    if (t !== null) {
      if (n = t.tag, n === 13) {
        if (n = Wf(t), n !== null) {
          e.blockedOn = n, es(e.priority, function () {
            jf(t);
          });
          return;
        }
      } else if (n === 3 && t.stateNode.current.memoizedState.isDehydrated) {
        e.blockedOn = t.tag === 3 ? t.stateNode.containerInfo : null;
        return;
      }
    }
  }
  e.blockedOn = null;
}
function Nl(e) {
  if (e.blockedOn !== null) return !1;
  for (var n = e.targetContainers; 0 < n.length;) {
    var t = Ti(e.domEventName, e.eventSystemFlags, n[0], e.nativeEvent);
    if (t === null) {
      t = e.nativeEvent;
      var r = new t.constructor(t.type, t);
      Ei = r, t.target.dispatchEvent(r), Ei = null;
    } else return n = Fr(t), n !== null && vo(n), e.blockedOn = t, !1;
    n.shift();
  }
  return !0;
}
function Ra(e, n, t) {
  Nl(e) && t.delete(n);
}
function jp() {
  zi = !1, vn !== null && Nl(vn) && (vn = null), mn !== null && Nl(mn) && (mn = null), yn !== null && Nl(yn) && (yn = null), pr.forEach(Ra), vr.forEach(Ra);
}
function It(e, n) {
  e.blockedOn === n && (e.blockedOn = null, zi || (zi = !0, H.unstable_scheduleCallback(H.unstable_NormalPriority, jp)));
}
function mr(e) {
  function n(l) {
    return It(l, e);
  }
  if (0 < yl.length) {
    It(yl[0], e);
    for (var t = 1; t < yl.length; t++) {
      var r = yl[t];
      r.blockedOn === e && (r.blockedOn = null);
    }
  }
  vn !== null && It(vn, e), mn !== null && It(mn, e), yn !== null && It(yn, e), pr.forEach(n), vr.forEach(n);
  for (t = 0; t < sn.length; t++) r = sn[t], r.blockedOn === e && (r.blockedOn = null);
  for (; 0 < sn.length && (t = sn[0], t.blockedOn === null);) ns(t), t.blockedOn === null && sn.shift();
}
function bp(e, n, t, r) {
  var l = M,
    u = gt.transition;
  gt.transition = null;
  try {
    M = 1, mo(e, n, t, r);
  } finally {
    M = l, gt.transition = u;
  }
}
function e0(e, n, t, r) {
  var l = M,
    u = gt.transition;
  gt.transition = null;
  try {
    M = 4, mo(e, n, t, r);
  } finally {
    M = l, gt.transition = u;
  }
}
function mo(e, n, t, r) {
  if (Il) {
    var l = Ti(e, n, t, r);
    if (l === null) bu(e, n, r, Wl, t), Oa(e, r);else if (Jp(l, e, n, t, r)) r.stopPropagation();else if (Oa(e, r), n & 4 && -1 < xp.indexOf(e)) {
      for (; l !== null;) {
        var u = Fr(l);
        if (u !== null && Jf(u), u = Ti(e, n, t, r), u === null && bu(e, n, r, Wl, t), u === l) break;
        l = u;
      }
      l !== null && r.stopPropagation();
    } else bu(e, n, r, null, t);
  }
}
function Ti(e, n, t, r) {
  if (Wl = null, e = so(r), e = Un(e), e !== null) if (n = Gn(e), n === null) e = null;else if (t = n.tag, t === 13) {
    if (e = Wf(n), e !== null) return e;
    e = null;
  } else if (t === 3) {
    if (n.stateNode.current.memoizedState.isDehydrated) return n.tag === 3 ? n.stateNode.containerInfo : null;
    e = null;
  } else n !== e && (e = null);
  return Wl = e, null;
}
function ts(e) {
  switch (e) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (Qp()) {
        case co:
          return 1;
        case Gf:
          return 4;
        case Al:
        case Ip:
          return 16;
        case Zf:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
function rs() {
  if (zl) return zl;
  var e,
    n = yo,
    t = n.length,
    r,
    l = "value" in dn ? dn.value : dn.textContent,
    u = l.length;
  for (e = 0; e < t && n[e] === l[e]; e++);
  var i = t - e;
  for (r = 1; r <= i && n[t - r] === l[u - r]; r++);
  return zl = l.slice(e, 1 < r ? 1 - r : void 0);
}
function Tl(e) {
  var n = e.keyCode;
  return "charCode" in e ? (e = e.charCode, e === 0 && n === 13 && (e = 13)) : e = n, e === 10 && (e = 13), 32 <= e || e === 13 ? e : 0;
}
function hl() {
  return !0;
}
function Da() {
  return !1;
}
function we(e) {
  function n(t, r, l, u, i) {
    this._reactName = t, this._targetInst = l, this.type = r, this.nativeEvent = u, this.target = i, this.currentTarget = null;
    for (var o in e) e.hasOwnProperty(o) && (t = e[o], this[o] = t ? t(u) : u[o]);
    return this.isDefaultPrevented = (u.defaultPrevented != null ? u.defaultPrevented : u.returnValue === !1) ? hl : Da, this.isPropagationStopped = Da, this;
  }
  return K(n.prototype, {
    preventDefault: function () {
      this.defaultPrevented = !0;
      var t = this.nativeEvent;
      t && (t.preventDefault ? t.preventDefault() : typeof t.returnValue !== "unknown" && (t.returnValue = !1), this.isDefaultPrevented = hl);
    },
    stopPropagation: function () {
      var t = this.nativeEvent;
      t && (t.stopPropagation ? t.stopPropagation() : typeof t.cancelBubble !== "unknown" && (t.cancelBubble = !0), this.isPropagationStopped = hl);
    },
    persist: function () {},
    isPersistent: hl
  }), n;
}
function p0(e) {
  var n = this.nativeEvent;
  return n.getModifierState ? n.getModifierState(e) : (e = d0[e]) ? !!n[e] : !1;
}
function go() {
  return p0;
}
function us(e, n) {
  switch (e) {
    case "keyup":
      return _0.indexOf(n.keyCode) !== -1;
    case "keydown":
      return n.keyCode !== 229;
    case "keypress":
    case "mousedown":
    case "focusout":
      return !0;
    default:
      return !1;
  }
}
function is(e) {
  return e = e.detail, typeof e === "object" && "data" in e ? e.data : null;
}
function C0(e, n) {
  switch (e) {
    case "compositionend":
      return is(n);
    case "keypress":
      if (n.which !== 32) return null;
      return $a = !0, Ua;
    case "textInput":
      return e = n.data, e === Ua && $a ? null : e;
    default:
      return null;
  }
}
function N0(e, n) {
  if (ut) return e === "compositionend" || !So && us(e, n) ? (e = rs(), zl = yo = dn = null, ut = !1, e) : null;
  switch (e) {
    case "paste":
      return null;
    case "keypress":
      if (!(n.ctrlKey || n.altKey || n.metaKey) || n.ctrlKey && n.altKey) {
        if (n.char && 1 < n.char.length) return n.char;
        if (n.which) return String.fromCharCode(n.which);
      }
      return null;
    case "compositionend":
      return ls && n.locale !== "ko" ? null : n.data;
    default:
      return null;
  }
}
function Ba(e) {
  var n = e && e.nodeName && e.nodeName.toLowerCase();
  return n === "input" ? !!z0[e.type] : n === "textarea" ? !0 : !1;
}
function os(e, n, t, r) {
  Bf(r), n = Kl(n, "onChange"), 0 < n.length && (t = new ho("onChange", "change", null, t, r), e.push({
    event: t,
    listeners: n
  }));
}
function T0(e) {
  gs(e, 0);
}
function fu(e) {
  var n = at(e);
  if (Rf(n)) return e;
}
function F0(e, n) {
  if (e === "change") return n;
}
function Ha() {
  lr && (lr.detachEvent("onpropertychange", fs), yr = lr = null);
}
function fs(e) {
  if (e.propertyName === "value" && fu(yr)) {
    var n = [];
    os(n, yr, e, so(e)), If(T0, n);
  }
}
function O0(e, n, t) {
  e === "focusin" ? (Ha(), lr = n, yr = t, lr.attachEvent("onpropertychange", fs)) : e === "focusout" && Ha();
}
function R0(e) {
  if (e === "selectionchange" || e === "keyup" || e === "keydown") return fu(yr);
}
function D0(e, n) {
  if (e === "click") return fu(n);
}
function M0(e, n) {
  if (e === "input" || e === "change") return fu(n);
}
function L0(e, n) {
  return e === n && (e !== 0 || 1 / e === 1 / n) || e !== e && n !== n;
}
function hr(e, n) {
  if (Ue(e, n)) return !0;
  if (typeof e !== "object" || e === null || typeof n !== "object" || n === null) return !1;
  var t = Object.keys(e),
    r = Object.keys(n);
  if (t.length !== r.length) return !1;
  for (r = 0; r < t.length; r++) {
    var l = t[r];
    if (!si.call(n, l) || !Ue(e[l], n[l])) return !1;
  }
  return !0;
}
function Aa(e) {
  for (; e && e.firstChild;) e = e.firstChild;
  return e;
}
function Qa(e, n) {
  var t = Aa(e);
  e = 0;
  for (var r; t;) {
    if (t.nodeType === 3) {
      if (r = e + t.textContent.length, e <= n && r >= n) return {
        node: t,
        offset: n - e
      };
      e = r;
    }
    e: {
      for (; t;) {
        if (t.nextSibling) {
          t = t.nextSibling;
          break e;
        }
        t = t.parentNode;
      }
      t = void 0;
    }
    t = Aa(t);
  }
}
function ss(e, n) {
  return e && n ? e === n ? !0 : e && e.nodeType === 3 ? !1 : n && n.nodeType === 3 ? ss(e, n.parentNode) : "contains" in e ? e.contains(n) : e.compareDocumentPosition ? !!(e.compareDocumentPosition(n) & 16) : !1 : !1;
}
function cs() {
  for (var e = window, n = $l(); n instanceof e.HTMLIFrameElement;) {
    try {
      var t = typeof n.contentWindow.location.href === "string";
    } catch (r) {
      t = !1;
    }
    if (t) e = n.contentWindow;else break;
    n = $l(e.document);
  }
  return n;
}
function wo(e) {
  var n = e && e.nodeName && e.nodeName.toLowerCase();
  return n && (n === "input" && (e.type === "text" || e.type === "search" || e.type === "tel" || e.type === "url" || e.type === "password") || n === "textarea" || e.contentEditable === "true");
}
function V0(e) {
  var n = cs(),
    t = e.focusedElem,
    r = e.selectionRange;
  if (n !== t && t && t.ownerDocument && ss(t.ownerDocument.documentElement, t)) {
    if (r !== null && wo(t)) {
      if (n = r.start, e = r.end, e === void 0 && (e = n), "selectionStart" in t) t.selectionStart = n, t.selectionEnd = Math.min(e, t.value.length);else if (e = (n = t.ownerDocument || document) && n.defaultView || window, e.getSelection) {
        e = e.getSelection();
        var l = t.textContent.length,
          u = Math.min(r.start, l);
        r = r.end === void 0 ? u : Math.min(r.end, l), !e.extend && u > r && (l = r, r = u, u = l), l = Qa(t, u);
        var i = Qa(t, r);
        l && i && (e.rangeCount !== 1 || e.anchorNode !== l.node || e.anchorOffset !== l.offset || e.focusNode !== i.node || e.focusOffset !== i.offset) && (n = n.createRange(), n.setStart(l.node, l.offset), e.removeAllRanges(), u > r ? (e.addRange(n), e.extend(i.node, i.offset)) : (n.setEnd(i.node, i.offset), e.addRange(n)));
      }
    }
    n = [];
    for (e = t; e = e.parentNode;) e.nodeType === 1 && n.push({
      element: e,
      left: e.scrollLeft,
      top: e.scrollTop
    });
    typeof t.focus === "function" && t.focus();
    for (t = 0; t < n.length; t++) e = n[t], e.element.scrollLeft = e.left, e.element.scrollTop = e.top;
  }
}
function Ia(e, n, t) {
  var r = t.window === t ? t.document : t.nodeType === 9 ? t : t.ownerDocument;
  Oi || it == null || it !== $l(r) || (r = it, "selectionStart" in r && wo(r) ? r = {
    start: r.selectionStart,
    end: r.selectionEnd
  } : (r = (r.ownerDocument && r.ownerDocument.defaultView || window).getSelection(), r = {
    anchorNode: r.anchorNode,
    anchorOffset: r.anchorOffset,
    focusNode: r.focusNode,
    focusOffset: r.focusOffset
  }), ur && hr(ur, r) || (ur = r, r = Kl(Fi, "onSelect"), 0 < r.length && (n = new ho("onSelect", "select", null, n, t), e.push({
    event: n,
    listeners: r
  }), n.target = it)));
}
function gl(e, n) {
  var t = {};
  return t[e.toLowerCase()] = n.toLowerCase(), t["Webkit" + e] = "webkit" + n, t["Moz" + e] = "moz" + n, t;
}
function su(e) {
  if (Ju[e]) return Ju[e];
  if (!ot[e]) return e;
  var n = ot[e],
    t;
  for (t in n) if (n.hasOwnProperty(t) && t in ds) return Ju[e] = n[t];
  return e;
}
function Pn(e, n) {
  hs.set(e, n), Xn(n, [e]);
}
function Ka(e, n, t) {
  var r = e.type || "unknown-event";
  e.currentTarget = t, $p(r, n, void 0, e), e.currentTarget = null;
}
function gs(e, n) {
  n = (n & 4) !== 0;
  for (var t = 0; t < e.length; t++) {
    var r = e[t],
      l = r.event;
    r = r.listeners;
    e: {
      var u = void 0;
      if (n) for (var i = r.length - 1; 0 <= i; i--) {
        var o = r[i],
          a = o.instance,
          c = o.currentTarget;
        if (o = o.listener, a !== u && l.isPropagationStopped()) break e;
        Ka(l, o, c), u = a;
      } else for (i = 0; i < r.length; i++) {
        if (o = r[i], a = o.instance, c = o.currentTarget, o = o.listener, a !== u && l.isPropagationStopped()) break e;
        Ka(l, o, c), u = a;
      }
    }
  }
  if (Hl) throw e = Ci, Hl = !1, Ci = null, e;
}
function U(e, n) {
  var t = n[$i];
  t === void 0 && (t = n[$i] = new Set());
  var r = e + "__bubble";
  t.has(r) || (Ss(n, e, 2, !1), t.add(r));
}
function ju(e, n, t) {
  var r = 0;
  n && (r |= 4), Ss(t, e, r, n);
}
function gr(e) {
  if (!e[Sl]) {
    e[Sl] = !0, Nf.forEach(function (t) {
      t !== "selectionchange" && ($0.has(t) || ju(t, !1, e), ju(t, !0, e));
    });
    var n = e.nodeType === 9 ? e : e.ownerDocument;
    n === null || n[Sl] || (n[Sl] = !0, ju("selectionchange", !1, n));
  }
}
function Ss(e, n, t, r) {
  switch (ts(n)) {
    case 1:
      var l = bp;
      break;
    case 4:
      l = e0;
      break;
    default:
      l = mo;
  }
  t = l.bind(null, n, t, e), l = void 0, !Pi || n !== "touchstart" && n !== "touchmove" && n !== "wheel" || (l = !0), r ? l !== void 0 ? e.addEventListener(n, t, {
    capture: !0,
    passive: l
  }) : e.addEventListener(n, t, !0) : l !== void 0 ? e.addEventListener(n, t, {
    passive: l
  }) : e.addEventListener(n, t, !1);
}
function bu(e, n, t, r, l) {
  var u = r;
  if ((n & 1) === 0 && (n & 2) === 0 && r !== null) e: for (;;) {
    if (r === null) return;
    var i = r.tag;
    if (i === 3 || i === 4) {
      var o = r.stateNode.containerInfo;
      if (o === l || o.nodeType === 8 && o.parentNode === l) break;
      if (i === 4) for (i = r.return; i !== null;) {
        var a = i.tag;
        if (a === 3 || a === 4) {
          if (a = i.stateNode.containerInfo, a === l || a.nodeType === 8 && a.parentNode === l) return;
        }
        i = i.return;
      }
      for (; o !== null;) {
        if (i = Un(o), i === null) return;
        if (a = i.tag, a === 5 || a === 6) {
          r = u = i;
          continue e;
        }
        o = o.parentNode;
      }
    }
    r = r.return;
  }
  If(function () {
    var c = u,
      y = so(t),
      g = [];
    e: {
      var h = hs.get(e);
      if (h !== void 0) {
        var k = ho,
          E = e;
        switch (e) {
          case "keypress":
            if (Tl(t) === 0) break e;
          case "keydown":
          case "keyup":
            k = m0;
            break;
          case "focusin":
            E = "focus", k = xu;
            break;
          case "focusout":
            E = "blur", k = xu;
            break;
          case "beforeblur":
          case "afterblur":
            k = xu;
            break;
          case "click":
            if (t.button === 2) break e;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k = Ma;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k = r0;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k = g0;
            break;
          case ps:
          case vs:
          case ms:
            k = i0;
            break;
          case ys:
            k = w0;
            break;
          case "scroll":
            k = n0;
            break;
          case "wheel":
            k = E0;
            break;
          case "copy":
          case "cut":
          case "paste":
            k = a0;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k = Va;
        }
        var _ = (n & 4) !== 0,
          Q = !_ && e === "scroll",
          d = _ ? h !== null ? h + "Capture" : null : h;
        _ = [];
        for (var s = c, v; s !== null;) {
          v = s;
          var S = v.stateNode;
          if (v.tag === 5 && S !== null && (v = S, d !== null && (S = dr(s, d), S != null && _.push(Sr(s, S, v)))), Q) break;
          s = s.return;
        }
        0 < _.length && (h = new k(h, E, null, t, y), g.push({
          event: h,
          listeners: _
        }));
      }
    }
    if ((n & 7) === 0) {
      e: {
        if (h = e === "mouseover" || e === "pointerover", k = e === "mouseout" || e === "pointerout", h && t !== Ei && (E = t.relatedTarget || t.fromElement) && (Un(E) || E[be])) break e;
        if (k || h) {
          if (h = y.window === y ? y : (h = y.ownerDocument) ? h.defaultView || h.parentWindow : window, k) {
            if (E = t.relatedTarget || t.toElement, k = c, E = E ? Un(E) : null, E !== null && (Q = Gn(E), E !== Q || E.tag !== 5 && E.tag !== 6)) E = null;
          } else k = null, E = c;
          if (k !== E) {
            if (_ = Ma, S = "onMouseLeave", d = "onMouseEnter", s = "mouse", e === "pointerout" || e === "pointerover") _ = Va, S = "onPointerLeave", d = "onPointerEnter", s = "pointer";
            if (Q = k == null ? h : at(k), v = E == null ? h : at(E), h = new _(S, s + "leave", k, t, y), h.target = Q, h.relatedTarget = v, S = null, Un(y) === c && (_ = new _(d, s + "enter", E, t, y), _.target = v, _.relatedTarget = Q, S = _), Q = S, k && E) n: {
              _ = k, d = E, s = 0;
              for (v = _; v; v = nt(v)) s++;
              v = 0;
              for (S = d; S; S = nt(S)) v++;
              for (; 0 < s - v;) _ = nt(_), s--;
              for (; 0 < v - s;) d = nt(d), v--;
              for (; s--;) {
                if (_ === d || d !== null && _ === d.alternate) break n;
                _ = nt(_), d = nt(d);
              }
              _ = null;
            } else _ = null;
            k !== null && Ya(g, h, k, _, !1), E !== null && Q !== null && Ya(g, Q, E, _, !0);
          }
        }
      }
      e: {
        if (h = c ? at(c) : window, k = h.nodeName && h.nodeName.toLowerCase(), k === "select" || k === "input" && h.type === "file") var N = F0;else if (Ba(h)) {
          if (as) N = M0;else {
            N = R0;
            var z = O0;
          }
        } else (k = h.nodeName) && k.toLowerCase() === "input" && (h.type === "checkbox" || h.type === "radio") && (N = D0);
        if (N && (N = N(e, c))) {
          os(g, N, t, y);
          break e;
        }
        z && z(e, h, c), e === "focusout" && (z = h._wrapperState) && z.controlled && h.type === "number" && hi(h, "number", h.value);
      }
      switch (z = c ? at(c) : window, e) {
        case "focusin":
          if (Ba(z) || z.contentEditable === "true") it = z, Fi = c, ur = null;
          break;
        case "focusout":
          ur = Fi = it = null;
          break;
        case "mousedown":
          Oi = !0;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Oi = !1, Ia(g, t, y);
          break;
        case "selectionchange":
          if (U0) break;
        case "keydown":
        case "keyup":
          Ia(g, t, y);
      }
      var T;
      if (So) e: {
        switch (e) {
          case "compositionstart":
            var F = "onCompositionStart";
            break e;
          case "compositionend":
            F = "onCompositionEnd";
            break e;
          case "compositionupdate":
            F = "onCompositionUpdate";
            break e;
        }
        F = void 0;
      } else ut ? us(e, t) && (F = "onCompositionEnd") : e === "keydown" && t.keyCode === 229 && (F = "onCompositionStart");
      if (F && (ls && t.locale !== "ko" && (ut || F !== "onCompositionStart" ? F === "onCompositionEnd" && ut && (T = rs()) : (dn = y, yo = "value" in dn ? dn.value : dn.textContent, ut = !0)), z = Kl(c, F), 0 < z.length && (F = new La(F, e, null, t, y), g.push({
        event: F,
        listeners: z
      }), T ? F.data = T : (T = is(t), T !== null && (F.data = T)))), T = P0 ? C0(e, t) : N0(e, t)) c = Kl(c, "onBeforeInput"), 0 < c.length && (y = new La("onBeforeInput", "beforeinput", null, t, y), g.push({
        event: y,
        listeners: c
      }), y.data = T);
    }
    gs(g, n);
  });
}
function Sr(e, n, t) {
  return {
    instance: e,
    listener: n,
    currentTarget: t
  };
}
function Kl(e, n) {
  for (var t = n + "Capture", r = []; e !== null;) {
    var l = e,
      u = l.stateNode;
    l.tag === 5 && u !== null && (l = u, u = dr(e, t), u != null && r.unshift(Sr(e, u, l)), u = dr(e, n), u != null && r.push(Sr(e, u, l))), e = e.return;
  }
  return r;
}
function nt(e) {
  if (e === null) return null;
  do e = e.return; while (e && e.tag !== 5);
  return e ? e : null;
}
function Ya(e, n, t, r, l) {
  for (var u = n._reactName, i = []; t !== null && t !== r;) {
    var o = t,
      a = o.alternate,
      c = o.stateNode;
    if (a !== null && a === r) break;
    o.tag === 5 && c !== null && (o = c, l ? (a = dr(t, u), a != null && i.unshift(Sr(t, a, o))) : l || (a = dr(t, u), a != null && i.push(Sr(t, a, o)))), t = t.return;
  }
  i.length !== 0 && e.push({
    event: n,
    listeners: i
  });
}
function Xa(e) {
  return (typeof e === "string" ? e : "" + e).replace(B0, `
`).replace(H0, "");
}
function wl(e, n, t) {
  if (n = Xa(n), Xa(e) !== n && t) throw Error(w(425));
}
function Yl() {}
function Vi(e, n) {
  return e === "textarea" || e === "noscript" || typeof n.children === "string" || typeof n.children === "number" || typeof n.dangerouslySetInnerHTML === "object" && n.dangerouslySetInnerHTML !== null && n.dangerouslySetInnerHTML.__html != null;
}
function I0(e) {
  setTimeout(function () {
    throw e;
  });
}
function ei(e, n) {
  var t = n,
    r = 0;
  do {
    var l = t.nextSibling;
    if (e.removeChild(t), l && l.nodeType === 8) if (t = l.data, t === "/$") {
      if (r === 0) {
        e.removeChild(l), mr(n);
        return;
      }
      r--;
    } else t !== "$" && t !== "$?" && t !== "$!" || r++;
    t = l;
  } while (t);
  mr(n);
}
function hn(e) {
  for (; e != null; e = e.nextSibling) {
    var n = e.nodeType;
    if (n === 1 || n === 3) break;
    if (n === 8) {
      if (n = e.data, n === "$" || n === "$!" || n === "$?") break;
      if (n === "/$") return null;
    }
  }
  return e;
}
function Za(e) {
  e = e.previousSibling;
  for (var n = 0; e;) {
    if (e.nodeType === 8) {
      var t = e.data;
      if (t === "$" || t === "$!" || t === "$?") {
        if (n === 0) return e;
        n--;
      } else t === "/$" && n++;
    }
    e = e.previousSibling;
  }
  return null;
}
function Un(e) {
  var n = e[Ie];
  if (n) return n;
  for (var t = e.parentNode; t;) {
    if (n = t[be] || t[Ie]) {
      if (t = n.alternate, n.child !== null || t !== null && t.child !== null) for (e = Za(e); e !== null;) {
        if (t = e[Ie]) return t;
        e = Za(e);
      }
      return n;
    }
    e = t, t = e.parentNode;
  }
  return null;
}
function Fr(e) {
  return e = e[Ie] || e[be], !e || e.tag !== 5 && e.tag !== 6 && e.tag !== 13 && e.tag !== 3 ? null : e;
}
function at(e) {
  if (e.tag === 5 || e.tag === 6) return e.stateNode;
  throw Error(w(33));
}
function cu(e) {
  return e[wr] || null;
}
function Cn(e) {
  return {
    current: e
  };
}
function $(e) {
  0 > ft || (e.current = Bi[ft], Bi[ft] = null, ft--);
}
function V(e, n) {
  ft++, Bi[ft] = e.current, e.current = n;
}
function Et(e, n) {
  var t = e.type.contextTypes;
  if (!t) return _n;
  var r = e.stateNode;
  if (r && r.__reactInternalMemoizedUnmaskedChildContext === n) return r.__reactInternalMemoizedMaskedChildContext;
  var l = {},
    u;
  for (u in t) l[u] = n[u];
  return r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = n, e.__reactInternalMemoizedMaskedChildContext = l), l;
}
function me(e) {
  return e = e.childContextTypes, e !== null && e !== void 0;
}
function Xl() {
  $(ve), $(oe);
}
function qa(e, n, t) {
  if (oe.current !== _n) throw Error(w(168));
  V(oe, n), V(ve, t);
}
function ws(e, n, t) {
  var r = e.stateNode;
  if (n = n.childContextTypes, typeof r.getChildContext !== "function") return t;
  r = r.getChildContext();
  for (var l in r) if (!(l in n)) throw Error(w(108, Op(e) || "Unknown", l));
  return K({}, t, r);
}
function Gl(e) {
  return e = (e = e.stateNode) && e.__reactInternalMemoizedMergedChildContext || _n, Qn = oe.current, V(oe, e), V(ve, ve.current), !0;
}
function xa(e, n, t) {
  var r = e.stateNode;
  if (!r) throw Error(w(169));
  t ? (e = ws(e, n, Qn), r.__reactInternalMemoizedMergedChildContext = e, $(ve), $(oe), V(oe, e)) : $(ve), V(ve, t);
}
function ks(e) {
  Ze === null ? Ze = [e] : Ze.push(e);
}
function Y0(e) {
  du = !0, ks(e);
}
function Nn() {
  if (!ni && Ze !== null) {
    ni = !0;
    var e = 0,
      n = M;
    try {
      var t = Ze;
      for (M = 1; e < t.length; e++) {
        var r = t[e];
        do r = r(!0); while (r !== null);
      }
      Ze = null, du = !1;
    } catch (l) {
      throw Ze !== null && (Ze = Ze.slice(e + 1)), Xf(co, Nn), l;
    } finally {
      M = n, ni = !1;
    }
  }
  return null;
}
function Ln(e, n) {
  st[ct++] = ql, st[ct++] = Zl, Zl = e, ql = n;
}
function Es(e, n, t) {
  _e[Pe++] = qe, _e[Pe++] = xe, _e[Pe++] = In, In = e;
  var r = qe;
  e = xe;
  var l = 32 - Le(r) - 1;
  r &= ~(1 << l), t += 1;
  var u = 32 - Le(n) + l;
  if (30 < u) {
    var i = l - l % 5;
    u = (r & (1 << i) - 1).toString(32), r >>= i, l -= i, qe = 1 << 32 - Le(n) + l | t << l | r, xe = u + e;
  } else qe = 1 << u | t << l | r, xe = e;
}
function ko(e) {
  e.return !== null && (Ln(e, 1), Es(e, 1, 0));
}
function Eo(e) {
  for (; e === Zl;) Zl = st[--ct], st[ct] = null, ql = st[--ct], st[ct] = null;
  for (; e === In;) In = _e[--Pe], _e[Pe] = null, xe = _e[--Pe], _e[Pe] = null, qe = _e[--Pe], _e[Pe] = null;
}
function _s(e, n) {
  var t = Ce(5, null, null, 0);
  t.elementType = "DELETED", t.stateNode = n, t.return = e, n = e.deletions, n === null ? (e.deletions = [t], e.flags |= 16) : n.push(t);
}
function Ja(e, n) {
  switch (e.tag) {
    case 5:
      var t = e.type;
      return n = n.nodeType !== 1 || t.toLowerCase() !== n.nodeName.toLowerCase() ? null : n, n !== null ? (e.stateNode = n, Se = e, ge = hn(n.firstChild), !0) : !1;
    case 6:
      return n = e.pendingProps === "" || n.nodeType !== 3 ? null : n, n !== null ? (e.stateNode = n, Se = e, ge = null, !0) : !1;
    case 13:
      return n = n.nodeType !== 8 ? null : n, n !== null ? (t = In !== null ? {
        id: qe,
        overflow: xe
      } : null, e.memoizedState = {
        dehydrated: n,
        treeContext: t,
        retryLane: 1073741824
      }, t = Ce(18, null, null, 0), t.stateNode = n, t.return = e, e.child = t, Se = e, ge = null, !0) : !1;
    default:
      return !1;
  }
}
function Hi(e) {
  return (e.mode & 1) !== 0 && (e.flags & 128) === 0;
}
function Ai(e) {
  if (B) {
    var n = ge;
    if (n) {
      var t = n;
      if (!Ja(e, n)) {
        if (Hi(e)) throw Error(w(418));
        n = hn(t.nextSibling);
        var r = Se;
        n && Ja(e, n) ? _s(r, t) : (e.flags = e.flags & -4097 | 2, B = !1, Se = e);
      }
    } else {
      if (Hi(e)) throw Error(w(418));
      e.flags = e.flags & -4097 | 2, B = !1, Se = e;
    }
  }
}
function ja(e) {
  for (e = e.return; e !== null && e.tag !== 5 && e.tag !== 3 && e.tag !== 13;) e = e.return;
  Se = e;
}
function kl(e) {
  if (e !== Se) return !1;
  if (!B) return ja(e), B = !0, !1;
  var n;
  if ((n = e.tag !== 3) && !(n = e.tag !== 5) && (n = e.type, n = n !== "head" && n !== "body" && !Vi(e.type, e.memoizedProps)), n && (n = ge)) {
    if (Hi(e)) throw Ps(), Error(w(418));
    for (; n;) _s(e, n), n = hn(n.nextSibling);
  }
  if (ja(e), e.tag === 13) {
    if (e = e.memoizedState, e = e !== null ? e.dehydrated : null, !e) throw Error(w(317));
    e: {
      e = e.nextSibling;
      for (n = 0; e;) {
        if (e.nodeType === 8) {
          var t = e.data;
          if (t === "/$") {
            if (n === 0) {
              ge = hn(e.nextSibling);
              break e;
            }
            n--;
          } else t !== "$" && t !== "$!" && t !== "$?" || n++;
        }
        e = e.nextSibling;
      }
      ge = null;
    }
  } else ge = Se ? hn(e.stateNode.nextSibling) : null;
  return !0;
}
function Ps() {
  for (var e = ge; e;) e = hn(e.nextSibling);
}
function _t() {
  ge = Se = null, B = !1;
}
function _o(e) {
  Me === null ? Me = [e] : Me.push(e);
}
function Kt(e, n, t) {
  if (e = t.ref, e !== null && typeof e !== "function" && typeof e !== "object") {
    if (t._owner) {
      if (t = t._owner, t) {
        if (t.tag !== 1) throw Error(w(309));
        var r = t.stateNode;
      }
      if (!r) throw Error(w(147, e));
      var l = r,
        u = "" + e;
      if (n !== null && n.ref !== null && typeof n.ref === "function" && n.ref._stringRef === u) return n.ref;
      return n = function (i) {
        var o = l.refs;
        i === null ? delete o[u] : o[u] = i;
      }, n._stringRef = u, n;
    }
    if (typeof e !== "string") throw Error(w(284));
    if (!t._owner) throw Error(w(290, e));
  }
  return e;
}
function El(e, n) {
  throw e = Object.prototype.toString.call(n), Error(w(31, e === "[object Object]" ? "object with keys {" + Object.keys(n).join(", ") + "}" : e));
}
function ba(e) {
  var n = e._init;
  return n(e._payload);
}
function Cs(e) {
  function n(d, s) {
    if (e) {
      var v = d.deletions;
      v === null ? (d.deletions = [s], d.flags |= 16) : v.push(s);
    }
  }
  function t(d, s) {
    if (!e) return null;
    for (; s !== null;) n(d, s), s = s.sibling;
    return null;
  }
  function r(d, s) {
    for (d = new Map(); s !== null;) s.key !== null ? d.set(s.key, s) : d.set(s.index, s), s = s.sibling;
    return d;
  }
  function l(d, s) {
    return d = kn(d, s), d.index = 0, d.sibling = null, d;
  }
  function u(d, s, v) {
    if (d.index = v, !e) return d.flags |= 1048576, s;
    if (v = d.alternate, v !== null) return v = v.index, v < s ? (d.flags |= 2, s) : v;
    return d.flags |= 2, s;
  }
  function i(d) {
    return e && d.alternate === null && (d.flags |= 2), d;
  }
  function o(d, s, v, S) {
    if (s === null || s.tag !== 6) return s = ai(v, d.mode, S), s.return = d, s;
    return s = l(s, v), s.return = d, s;
  }
  function a(d, s, v, S) {
    var N = v.type;
    if (N === lt) return y(d, s, v.props.children, S, v.key);
    if (s !== null && (s.elementType === N || typeof N === "object" && N !== null && N.$$typeof === an && ba(N) === s.type)) return S = l(s, v.props), S.ref = Kt(d, s, v), S.return = d, S;
    return S = Ul(v.type, v.key, v.props, null, d.mode, S), S.ref = Kt(d, s, v), S.return = d, S;
  }
  function c(d, s, v, S) {
    if (s === null || s.tag !== 4 || s.stateNode.containerInfo !== v.containerInfo || s.stateNode.implementation !== v.implementation) return s = fi(v, d.mode, S), s.return = d, s;
    return s = l(s, v.children || []), s.return = d, s;
  }
  function y(d, s, v, S, N) {
    if (s === null || s.tag !== 7) return s = An(v, d.mode, S, N), s.return = d, s;
    return s = l(s, v), s.return = d, s;
  }
  function g(d, s, v) {
    if (typeof s === "string" && s !== "" || typeof s === "number") return s = ai("" + s, d.mode, v), s.return = d, s;
    if (typeof s === "object" && s !== null) {
      switch (s.$$typeof) {
        case cl:
          return v = Ul(s.type, s.key, s.props, null, d.mode, v), v.ref = Kt(d, null, s), v.return = d, v;
        case rt:
          return s = fi(s, d.mode, v), s.return = d, s;
        case an:
          var S = s._init;
          return g(d, S(s._payload), v);
      }
      if (Zt(s) || At(s)) return s = An(s, d.mode, v, null), s.return = d, s;
      El(d, s);
    }
    return null;
  }
  function h(d, s, v, S) {
    var N = s !== null ? s.key : null;
    if (typeof v === "string" && v !== "" || typeof v === "number") return N !== null ? null : o(d, s, "" + v, S);
    if (typeof v === "object" && v !== null) {
      switch (v.$$typeof) {
        case cl:
          return v.key === N ? a(d, s, v, S) : null;
        case rt:
          return v.key === N ? c(d, s, v, S) : null;
        case an:
          return N = v._init, h(d, s, N(v._payload), S);
      }
      if (Zt(v) || At(v)) return N !== null ? null : y(d, s, v, S, null);
      El(d, v);
    }
    return null;
  }
  function k(d, s, v, S, N) {
    if (typeof S === "string" && S !== "" || typeof S === "number") return d = d.get(v) || null, o(s, d, "" + S, N);
    if (typeof S === "object" && S !== null) {
      switch (S.$$typeof) {
        case cl:
          return d = d.get(S.key === null ? v : S.key) || null, a(s, d, S, N);
        case rt:
          return d = d.get(S.key === null ? v : S.key) || null, c(s, d, S, N);
        case an:
          var z = S._init;
          return k(d, s, v, z(S._payload), N);
      }
      if (Zt(S) || At(S)) return d = d.get(v) || null, y(s, d, S, N, null);
      El(s, S);
    }
    return null;
  }
  function E(d, s, v, S) {
    for (var N = null, z = null, T = s, F = s = 0, G = null; T !== null && F < v.length; F++) {
      T.index > F ? (G = T, T = null) : G = T.sibling;
      var R = h(d, T, v[F], S);
      if (R === null) {
        T === null && (T = G);
        break;
      }
      e && T && R.alternate === null && n(d, T), s = u(R, s, F), z === null ? N = R : z.sibling = R, z = R, T = G;
    }
    if (F === v.length) return t(d, T), B && Ln(d, F), N;
    if (T === null) {
      for (; F < v.length; F++) T = g(d, v[F], S), T !== null && (s = u(T, s, F), z === null ? N = T : z.sibling = T, z = T);
      return B && Ln(d, F), N;
    }
    for (T = r(d, T); F < v.length; F++) G = k(T, d, F, v[F], S), G !== null && (e && G.alternate !== null && T.delete(G.key === null ? F : G.key), s = u(G, s, F), z === null ? N = G : z.sibling = G, z = G);
    return e && T.forEach(function (ke) {
      return n(d, ke);
    }), B && Ln(d, F), N;
  }
  function _(d, s, v, S) {
    var N = At(v);
    if (typeof N !== "function") throw Error(w(150));
    if (v = N.call(v), v == null) throw Error(w(151));
    for (var z = N = null, T = s, F = s = 0, G = null, R = v.next(); T !== null && !R.done; F++, R = v.next()) {
      T.index > F ? (G = T, T = null) : G = T.sibling;
      var ke = h(d, T, R.value, S);
      if (ke === null) {
        T === null && (T = G);
        break;
      }
      e && T && ke.alternate === null && n(d, T), s = u(ke, s, F), z === null ? N = ke : z.sibling = ke, z = ke, T = G;
    }
    if (R.done) return t(d, T), B && Ln(d, F), N;
    if (T === null) {
      for (; !R.done; F++, R = v.next()) R = g(d, R.value, S), R !== null && (s = u(R, s, F), z === null ? N = R : z.sibling = R, z = R);
      return B && Ln(d, F), N;
    }
    for (T = r(d, T); !R.done; F++, R = v.next()) R = k(T, d, F, R.value, S), R !== null && (e && R.alternate !== null && T.delete(R.key === null ? F : R.key), s = u(R, s, F), z === null ? N = R : z.sibling = R, z = R);
    return e && T.forEach(function (Cu) {
      return n(d, Cu);
    }), B && Ln(d, F), N;
  }
  function Q(d, s, v, S) {
    if (typeof v === "object" && v !== null && v.type === lt && v.key === null && (v = v.props.children), typeof v === "object" && v !== null) {
      switch (v.$$typeof) {
        case cl:
          e: {
            for (var N = v.key, z = s; z !== null;) {
              if (z.key === N) {
                if (N = v.type, N === lt) {
                  if (z.tag === 7) {
                    t(d, z.sibling), s = l(z, v.props.children), s.return = d, d = s;
                    break e;
                  }
                } else if (z.elementType === N || typeof N === "object" && N !== null && N.$$typeof === an && ba(N) === z.type) {
                  t(d, z.sibling), s = l(z, v.props), s.ref = Kt(d, z, v), s.return = d, d = s;
                  break e;
                }
                t(d, z);
                break;
              } else n(d, z);
              z = z.sibling;
            }
            v.type === lt ? (s = An(v.props.children, d.mode, S, v.key), s.return = d, d = s) : (S = Ul(v.type, v.key, v.props, null, d.mode, S), S.ref = Kt(d, s, v), S.return = d, d = S);
          }
          return i(d);
        case rt:
          e: {
            for (z = v.key; s !== null;) {
              if (s.key === z) {
                if (s.tag === 4 && s.stateNode.containerInfo === v.containerInfo && s.stateNode.implementation === v.implementation) {
                  t(d, s.sibling), s = l(s, v.children || []), s.return = d, d = s;
                  break e;
                } else {
                  t(d, s);
                  break;
                }
              } else n(d, s);
              s = s.sibling;
            }
            s = fi(v, d.mode, S), s.return = d, d = s;
          }
          return i(d);
        case an:
          return z = v._init, Q(d, s, z(v._payload), S);
      }
      if (Zt(v)) return E(d, s, v, S);
      if (At(v)) return _(d, s, v, S);
      El(d, v);
    }
    return typeof v === "string" && v !== "" || typeof v === "number" ? (v = "" + v, s !== null && s.tag === 6 ? (t(d, s.sibling), s = l(s, v), s.return = d, d = s) : (t(d, s), s = ai(v, d.mode, S), s.return = d, d = s), i(d)) : t(d, s);
  }
  return Q;
}
function Co() {
  Po = dt = Jl = null;
}
function No(e) {
  var n = xl.current;
  $(xl), e._currentValue = n;
}
function Qi(e, n, t) {
  for (; e !== null;) {
    var r = e.alternate;
    if ((e.childLanes & n) !== n ? (e.childLanes |= n, r !== null && (r.childLanes |= n)) : r !== null && (r.childLanes & n) !== n && (r.childLanes |= n), e === t) break;
    e = e.return;
  }
}
function St(e, n) {
  Jl = e, Po = dt = null, e = e.dependencies, e !== null && e.firstContext !== null && ((e.lanes & n) !== 0 && (pe = !0), e.firstContext = null);
}
function ze(e) {
  var n = e._currentValue;
  if (Po !== e) if (e = {
    context: e,
    memoizedValue: n,
    next: null
  }, dt === null) {
    if (Jl === null) throw Error(w(308));
    dt = e, Jl.dependencies = {
      lanes: 0,
      firstContext: e
    };
  } else dt = dt.next = e;
  return n;
}
function zo(e) {
  $n === null ? $n = [e] : $n.push(e);
}
function zs(e, n, t, r) {
  var l = n.interleaved;
  return l === null ? (t.next = t, zo(n)) : (t.next = l.next, l.next = t), n.interleaved = t, en(e, r);
}
function en(e, n) {
  e.lanes |= n;
  var t = e.alternate;
  t !== null && (t.lanes |= n), t = e;
  for (e = e.return; e !== null;) e.childLanes |= n, t = e.alternate, t !== null && (t.childLanes |= n), t = e, e = e.return;
  return t.tag === 3 ? t.stateNode : null;
}
function To(e) {
  e.updateQueue = {
    baseState: e.memoizedState,
    firstBaseUpdate: null,
    lastBaseUpdate: null,
    shared: {
      pending: null,
      interleaved: null,
      lanes: 0
    },
    effects: null
  };
}
function Ts(e, n) {
  e = e.updateQueue, n.updateQueue === e && (n.updateQueue = {
    baseState: e.baseState,
    firstBaseUpdate: e.firstBaseUpdate,
    lastBaseUpdate: e.lastBaseUpdate,
    shared: e.shared,
    effects: e.effects
  });
}
function Je(e, n) {
  return {
    eventTime: e,
    lane: n,
    tag: 0,
    payload: null,
    callback: null,
    next: null
  };
}
function gn(e, n, t) {
  var r = e.updateQueue;
  if (r === null) return null;
  if (r = r.shared, (D & 2) !== 0) {
    var l = r.pending;
    return l === null ? n.next = n : (n.next = l.next, l.next = n), r.pending = n, en(e, t);
  }
  return l = r.interleaved, l === null ? (n.next = n, zo(r)) : (n.next = l.next, l.next = n), r.interleaved = n, en(e, t);
}
function Ol(e, n, t) {
  if (n = n.updateQueue, n !== null && (n = n.shared, (t & 4194240) !== 0)) {
    var r = n.lanes;
    r &= e.pendingLanes, t |= r, n.lanes = t, po(e, t);
  }
}
function ef(e, n) {
  var {
    updateQueue: t,
    alternate: r
  } = e;
  if (r !== null && (r = r.updateQueue, t === r)) {
    var l = null,
      u = null;
    if (t = t.firstBaseUpdate, t !== null) {
      do {
        var i = {
          eventTime: t.eventTime,
          lane: t.lane,
          tag: t.tag,
          payload: t.payload,
          callback: t.callback,
          next: null
        };
        u === null ? l = u = i : u = u.next = i, t = t.next;
      } while (t !== null);
      u === null ? l = u = n : u = u.next = n;
    } else l = u = n;
    t = {
      baseState: r.baseState,
      firstBaseUpdate: l,
      lastBaseUpdate: u,
      shared: r.shared,
      effects: r.effects
    }, e.updateQueue = t;
    return;
  }
  e = t.lastBaseUpdate, e === null ? t.firstBaseUpdate = n : e.next = n, t.lastBaseUpdate = n;
}
function jl(e, n, t, r) {
  var l = e.updateQueue;
  fn = !1;
  var {
      firstBaseUpdate: u,
      lastBaseUpdate: i
    } = l,
    o = l.shared.pending;
  if (o !== null) {
    l.shared.pending = null;
    var a = o,
      c = a.next;
    a.next = null, i === null ? u = c : i.next = c, i = a;
    var y = e.alternate;
    y !== null && (y = y.updateQueue, o = y.lastBaseUpdate, o !== i && (o === null ? y.firstBaseUpdate = c : o.next = c, y.lastBaseUpdate = a));
  }
  if (u !== null) {
    var g = l.baseState;
    i = 0, y = c = a = null, o = u;
    do {
      var {
        lane: h,
        eventTime: k
      } = o;
      if ((r & h) === h) {
        y !== null && (y = y.next = {
          eventTime: k,
          lane: 0,
          tag: o.tag,
          payload: o.payload,
          callback: o.callback,
          next: null
        });
        e: {
          var E = e,
            _ = o;
          switch (h = n, k = t, _.tag) {
            case 1:
              if (E = _.payload, typeof E === "function") {
                g = E.call(k, g, h);
                break e;
              }
              g = E;
              break e;
            case 3:
              E.flags = E.flags & -65537 | 128;
            case 0:
              if (E = _.payload, h = typeof E === "function" ? E.call(k, g, h) : E, h === null || h === void 0) break e;
              g = K({}, g, h);
              break e;
            case 2:
              fn = !0;
          }
        }
        o.callback !== null && o.lane !== 0 && (e.flags |= 64, h = l.effects, h === null ? l.effects = [o] : h.push(o));
      } else k = {
        eventTime: k,
        lane: h,
        tag: o.tag,
        payload: o.payload,
        callback: o.callback,
        next: null
      }, y === null ? (c = y = k, a = g) : y = y.next = k, i |= h;
      if (o = o.next, o === null) if (o = l.shared.pending, o === null) break;else h = o, o = h.next, h.next = null, l.lastBaseUpdate = h, l.shared.pending = null;
    } while (1);
    if (y === null && (a = g), l.baseState = a, l.firstBaseUpdate = c, l.lastBaseUpdate = y, n = l.shared.interleaved, n !== null) {
      l = n;
      do i |= l.lane, l = l.next; while (l !== n);
    } else u === null && (l.shared.lanes = 0);
    Kn |= i, e.lanes = i, e.memoizedState = g;
  }
}
function nf(e, n, t) {
  if (e = n.effects, n.effects = null, e !== null) for (n = 0; n < e.length; n++) {
    var r = e[n],
      l = r.callback;
    if (l !== null) {
      if (r.callback = null, r = t, typeof l !== "function") throw Error(w(191, l));
      l.call(r);
    }
  }
}
function Bn(e) {
  if (e === Or) throw Error(w(174));
  return e;
}
function Fo(e, n) {
  switch (V(Er, n), V(kr, e), V(Ke, Or), e = n.nodeType, e) {
    case 9:
    case 11:
      n = (n = n.documentElement) ? n.namespaceURI : Si(null, "");
      break;
    default:
      e = e === 8 ? n.parentNode : n, n = e.namespaceURI || null, e = e.tagName, n = Si(n, e);
  }
  $(Ke), V(Ke, n);
}
function Ct() {
  $(Ke), $(kr), $(Er);
}
function Fs(e) {
  Bn(Er.current);
  var n = Bn(Ke.current),
    t = Si(n, e.type);
  n !== t && (V(kr, e), V(Ke, t));
}
function Oo(e) {
  kr.current === e && ($(Ke), $(kr));
}
function bl(e) {
  for (var n = e; n !== null;) {
    if (n.tag === 13) {
      var t = n.memoizedState;
      if (t !== null && (t = t.dehydrated, t === null || t.data === "$?" || t.data === "$!")) return n;
    } else if (n.tag === 19 && n.memoizedProps.revealOrder !== void 0) {
      if ((n.flags & 128) !== 0) return n;
    } else if (n.child !== null) {
      n.child.return = n, n = n.child;
      continue;
    }
    if (n === e) break;
    for (; n.sibling === null;) {
      if (n.return === null || n.return === e) return null;
      n = n.return;
    }
    n.sibling.return = n.return, n = n.sibling;
  }
  return null;
}
function Ro() {
  for (var e = 0; e < ti.length; e++) ti[e]._workInProgressVersionPrimary = null;
  ti.length = 0;
}
function le() {
  throw Error(w(321));
}
function Do(e, n) {
  if (n === null) return !1;
  for (var t = 0; t < n.length && t < e.length; t++) if (!Ue(e[t], n[t])) return !1;
  return !0;
}
function Mo(e, n, t, r, l, u) {
  if (Wn = u, W = n, n.memoizedState = null, n.updateQueue = null, n.lanes = 0, Rl.current = e === null || e.memoizedState === null ? J0 : j0, e = t(r, l), ir) {
    u = 0;
    do {
      if (ir = !1, _r = 0, 25 <= u) throw Error(w(301));
      u += 1, j = q = null, n.updateQueue = null, Rl.current = b0, e = t(r, l);
    } while (ir);
  }
  if (Rl.current = nu, n = q !== null && q.next !== null, Wn = 0, j = q = W = null, eu = !1, n) throw Error(w(300));
  return e;
}
function Lo() {
  var e = _r !== 0;
  return _r = 0, e;
}
function Qe() {
  var e = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null
  };
  return j === null ? W.memoizedState = j = e : j = j.next = e, j;
}
function Te() {
  if (q === null) {
    var e = W.alternate;
    e = e !== null ? e.memoizedState : null;
  } else e = q.next;
  var n = j === null ? W.memoizedState : j.next;
  if (n !== null) j = n, q = e;else {
    if (e === null) throw Error(w(310));
    q = e, e = {
      memoizedState: q.memoizedState,
      baseState: q.baseState,
      baseQueue: q.baseQueue,
      queue: q.queue,
      next: null
    }, j === null ? W.memoizedState = j = e : j = j.next = e;
  }
  return j;
}
function Pr(e, n) {
  return typeof n === "function" ? n(e) : n;
}
function li(e) {
  var n = Te(),
    t = n.queue;
  if (t === null) throw Error(w(311));
  t.lastRenderedReducer = e;
  var r = q,
    l = r.baseQueue,
    u = t.pending;
  if (u !== null) {
    if (l !== null) {
      var i = l.next;
      l.next = u.next, u.next = i;
    }
    r.baseQueue = l = u, t.pending = null;
  }
  if (l !== null) {
    u = l.next, r = r.baseState;
    var o = i = null,
      a = null,
      c = u;
    do {
      var y = c.lane;
      if ((Wn & y) === y) a !== null && (a = a.next = {
        lane: 0,
        action: c.action,
        hasEagerState: c.hasEagerState,
        eagerState: c.eagerState,
        next: null
      }), r = c.hasEagerState ? c.eagerState : e(r, c.action);else {
        var g = {
          lane: y,
          action: c.action,
          hasEagerState: c.hasEagerState,
          eagerState: c.eagerState,
          next: null
        };
        a === null ? (o = a = g, i = r) : a = a.next = g, W.lanes |= y, Kn |= y;
      }
      c = c.next;
    } while (c !== null && c !== u);
    a === null ? i = r : a.next = o, Ue(r, n.memoizedState) || (pe = !0), n.memoizedState = r, n.baseState = i, n.baseQueue = a, t.lastRenderedState = r;
  }
  if (e = t.interleaved, e !== null) {
    l = e;
    do u = l.lane, W.lanes |= u, Kn |= u, l = l.next; while (l !== e);
  } else l === null && (t.lanes = 0);
  return [n.memoizedState, t.dispatch];
}
function ui(e) {
  var n = Te(),
    t = n.queue;
  if (t === null) throw Error(w(311));
  t.lastRenderedReducer = e;
  var {
      dispatch: r,
      pending: l
    } = t,
    u = n.memoizedState;
  if (l !== null) {
    t.pending = null;
    var i = l = l.next;
    do u = e(u, i.action), i = i.next; while (i !== l);
    Ue(u, n.memoizedState) || (pe = !0), n.memoizedState = u, n.baseQueue === null && (n.baseState = u), t.lastRenderedState = u;
  }
  return [u, r];
}
function Os() {}
function Rs(e, n) {
  var t = W,
    r = Te(),
    l = n(),
    u = !Ue(r.memoizedState, l);
  if (u && (r.memoizedState = l, pe = !0), r = r.queue, Vo(Ls.bind(null, t, r, e), [e]), r.getSnapshot !== n || u || j !== null && j.memoizedState.tag & 1) {
    if (t.flags |= 2048, Cr(9, Ms.bind(null, t, r, l, n), void 0, null), b === null) throw Error(w(349));
    (Wn & 30) !== 0 || Ds(t, n, l);
  }
  return l;
}
function Ds(e, n, t) {
  e.flags |= 16384, e = {
    getSnapshot: n,
    value: t
  }, n = W.updateQueue, n === null ? (n = {
    lastEffect: null,
    stores: null
  }, W.updateQueue = n, n.stores = [e]) : (t = n.stores, t === null ? n.stores = [e] : t.push(e));
}
function Ms(e, n, t, r) {
  n.value = t, n.getSnapshot = r, Vs(n) && Us(e);
}
function Ls(e, n, t) {
  return t(function () {
    Vs(n) && Us(e);
  });
}
function Vs(e) {
  var n = e.getSnapshot;
  e = e.value;
  try {
    var t = n();
    return !Ue(e, t);
  } catch (r) {
    return !0;
  }
}
function Us(e) {
  var n = en(e, 1);
  n !== null && Ve(n, e, 1, -1);
}
function tf(e) {
  var n = Qe();
  return typeof e === "function" && (e = e()), n.memoizedState = n.baseState = e, e = {
    pending: null,
    interleaved: null,
    lanes: 0,
    dispatch: null,
    lastRenderedReducer: Pr,
    lastRenderedState: e
  }, n.queue = e, e = e.dispatch = x0.bind(null, W, e), [n.memoizedState, e];
}
function Cr(e, n, t, r) {
  return e = {
    tag: e,
    create: n,
    destroy: t,
    deps: r,
    next: null
  }, n = W.updateQueue, n === null ? (n = {
    lastEffect: null,
    stores: null
  }, W.updateQueue = n, n.lastEffect = e.next = e) : (t = n.lastEffect, t === null ? n.lastEffect = e.next = e : (r = t.next, t.next = e, e.next = r, n.lastEffect = e)), e;
}
function $s() {
  return Te().memoizedState;
}
function Dl(e, n, t, r) {
  var l = Qe();
  W.flags |= e, l.memoizedState = Cr(1 | n, t, void 0, r === void 0 ? null : r);
}
function pu(e, n, t, r) {
  var l = Te();
  r = r === void 0 ? null : r;
  var u = void 0;
  if (q !== null) {
    var i = q.memoizedState;
    if (u = i.destroy, r !== null && Do(r, i.deps)) {
      l.memoizedState = Cr(n, t, u, r);
      return;
    }
  }
  W.flags |= e, l.memoizedState = Cr(1 | n, t, u, r);
}
function rf(e, n) {
  return Dl(8390656, 8, e, n);
}
function Vo(e, n) {
  return pu(2048, 8, e, n);
}
function Bs(e, n) {
  return pu(4, 2, e, n);
}
function Hs(e, n) {
  return pu(4, 4, e, n);
}
function As(e, n) {
  if (typeof n === "function") return e = e(), n(e), function () {
    n(null);
  };
  if (n !== null && n !== void 0) return e = e(), n.current = e, function () {
    n.current = null;
  };
}
function Qs(e, n, t) {
  return t = t !== null && t !== void 0 ? t.concat([e]) : null, pu(4, 4, As.bind(null, n, e), t);
}
function Uo() {}
function Is(e, n) {
  var t = Te();
  n = n === void 0 ? null : n;
  var r = t.memoizedState;
  if (r !== null && n !== null && Do(n, r[1])) return r[0];
  return t.memoizedState = [e, n], e;
}
function Ws(e, n) {
  var t = Te();
  n = n === void 0 ? null : n;
  var r = t.memoizedState;
  if (r !== null && n !== null && Do(n, r[1])) return r[0];
  return e = e(), t.memoizedState = [e, n], e;
}
function Ks(e, n, t) {
  if ((Wn & 21) === 0) return e.baseState && (e.baseState = !1, pe = !0), e.memoizedState = t;
  return Ue(t, n) || (t = qf(), W.lanes |= t, Kn |= t, e.baseState = !0), n;
}
function Z0(e, n) {
  var t = M;
  M = t !== 0 && 4 > t ? t : 4, e(!0);
  var r = ri.transition;
  ri.transition = {};
  try {
    e(!1), n();
  } finally {
    M = t, ri.transition = r;
  }
}
function Ys() {
  return Te().memoizedState;
}
function q0(e, n, t) {
  var r = wn(e);
  if (t = {
    lane: r,
    action: t,
    hasEagerState: !1,
    eagerState: null,
    next: null
  }, Xs(e)) Gs(n, t);else if (t = zs(e, n, t, r), t !== null) {
    var l = se();
    Ve(t, e, r, l), Zs(t, n, r);
  }
}
function x0(e, n, t) {
  var r = wn(e),
    l = {
      lane: r,
      action: t,
      hasEagerState: !1,
      eagerState: null,
      next: null
    };
  if (Xs(e)) Gs(n, l);else {
    var u = e.alternate;
    if (e.lanes === 0 && (u === null || u.lanes === 0) && (u = n.lastRenderedReducer, u !== null)) try {
      var i = n.lastRenderedState,
        o = u(i, t);
      if (l.hasEagerState = !0, l.eagerState = o, Ue(o, i)) {
        var a = n.interleaved;
        a === null ? (l.next = l, zo(n)) : (l.next = a.next, a.next = l), n.interleaved = l;
        return;
      }
    } catch (c) {} finally {}
    t = zs(e, n, l, r), t !== null && (l = se(), Ve(t, e, r, l), Zs(t, n, r));
  }
}
function Xs(e) {
  var n = e.alternate;
  return e === W || n !== null && n === W;
}
function Gs(e, n) {
  ir = eu = !0;
  var t = e.pending;
  t === null ? n.next = n : (n.next = t.next, t.next = n), e.pending = n;
}
function Zs(e, n, t) {
  if ((t & 4194240) !== 0) {
    var r = n.lanes;
    r &= e.pendingLanes, t |= r, n.lanes = t, po(e, t);
  }
}
function Re(e, n) {
  if (e && e.defaultProps) {
    n = K({}, n), e = e.defaultProps;
    for (var t in e) n[t] === void 0 && (n[t] = e[t]);
    return n;
  }
  return n;
}
function Ii(e, n, t, r) {
  n = e.memoizedState, t = t(r, n), t = t === null || t === void 0 ? n : K({}, n, t), e.memoizedState = t, e.lanes === 0 && (e.updateQueue.baseState = t);
}
function lf(e, n, t, r, l, u, i) {
  return e = e.stateNode, typeof e.shouldComponentUpdate === "function" ? e.shouldComponentUpdate(r, u, i) : n.prototype && n.prototype.isPureReactComponent ? !hr(t, r) || !hr(l, u) : !0;
}
function qs(e, n, t) {
  var r = !1,
    l = _n,
    u = n.contextType;
  return typeof u === "object" && u !== null ? u = ze(u) : (l = me(n) ? Qn : oe.current, r = n.contextTypes, u = (r = r !== null && r !== void 0) ? Et(e, l) : _n), n = new n(t, u), e.memoizedState = n.state !== null && n.state !== void 0 ? n.state : null, n.updater = vu, e.stateNode = n, n._reactInternals = e, r && (e = e.stateNode, e.__reactInternalMemoizedUnmaskedChildContext = l, e.__reactInternalMemoizedMaskedChildContext = u), n;
}
function uf(e, n, t, r) {
  e = n.state, typeof n.componentWillReceiveProps === "function" && n.componentWillReceiveProps(t, r), typeof n.UNSAFE_componentWillReceiveProps === "function" && n.UNSAFE_componentWillReceiveProps(t, r), n.state !== e && vu.enqueueReplaceState(n, n.state, null);
}
function Wi(e, n, t, r) {
  var l = e.stateNode;
  l.props = t, l.state = e.memoizedState, l.refs = {}, To(e);
  var u = n.contextType;
  typeof u === "object" && u !== null ? l.context = ze(u) : (u = me(n) ? Qn : oe.current, l.context = Et(e, u)), l.state = e.memoizedState, u = n.getDerivedStateFromProps, typeof u === "function" && (Ii(e, n, u, t), l.state = e.memoizedState), typeof n.getDerivedStateFromProps === "function" || typeof l.getSnapshotBeforeUpdate === "function" || typeof l.UNSAFE_componentWillMount !== "function" && typeof l.componentWillMount !== "function" || (n = l.state, typeof l.componentWillMount === "function" && l.componentWillMount(), typeof l.UNSAFE_componentWillMount === "function" && l.UNSAFE_componentWillMount(), n !== l.state && vu.enqueueReplaceState(l, l.state, null), jl(e, t, l, r), l.state = e.memoizedState), typeof l.componentDidMount === "function" && (e.flags |= 4194308);
}
function Nt(e, n) {
  try {
    var t = "",
      r = n;
    do t += Fp(r), r = r.return; while (r);
    var l = t;
  } catch (u) {
    l = `
Error generating stack: ` + u.message + `
` + u.stack;
  }
  return {
    value: e,
    source: n,
    stack: l,
    digest: null
  };
}
function ii(e, n, t) {
  return {
    value: e,
    source: null,
    stack: t != null ? t : null,
    digest: n != null ? n : null
  };
}
function Ki(e, n) {
  try {
    console.error(n.value);
  } catch (t) {
    setTimeout(function () {
      throw t;
    });
  }
}
function xs(e, n, t) {
  t = Je(-1, t), t.tag = 3, t.payload = {
    element: null
  };
  var r = n.value;
  return t.callback = function () {
    ru || (ru = !0, eo = r), Ki(e, n);
  }, t;
}
function Js(e, n, t) {
  t = Je(-1, t), t.tag = 3;
  var r = e.type.getDerivedStateFromError;
  if (typeof r === "function") {
    var l = n.value;
    t.payload = function () {
      return r(l);
    }, t.callback = function () {
      Ki(e, n);
    };
  }
  var u = e.stateNode;
  return u !== null && typeof u.componentDidCatch === "function" && (t.callback = function () {
    Ki(e, n), typeof r !== "function" && (Sn === null ? Sn = new Set([this]) : Sn.add(this));
    var i = n.stack;
    this.componentDidCatch(n.value, {
      componentStack: i !== null ? i : ""
    });
  }), t;
}
function of(e, n, t) {
  var r = e.pingCache;
  if (r === null) {
    r = e.pingCache = new ev();
    var l = new Set();
    r.set(n, l);
  } else l = r.get(n), l === void 0 && (l = new Set(), r.set(n, l));
  l.has(t) || (l.add(t), e = vv.bind(null, e, n, t), n.then(e, e));
}
function af(e) {
  do {
    var n;
    if (n = e.tag === 13) n = e.memoizedState, n = n !== null ? n.dehydrated !== null ? !0 : !1 : !0;
    if (n) return e;
    e = e.return;
  } while (e !== null);
  return null;
}
function ff(e, n, t, r, l) {
  if ((e.mode & 1) === 0) return e === n ? e.flags |= 65536 : (e.flags |= 128, t.flags |= 131072, t.flags &= -52805, t.tag === 1 && (t.alternate === null ? t.tag = 17 : (n = Je(-1, 1), n.tag = 2, gn(t, n, 1))), t.lanes |= 1), e;
  return e.flags |= 65536, e.lanes = l, e;
}
function fe(e, n, t, r) {
  n.child = e === null ? Ns(n, null, t, r) : Pt(n, e.child, t, r);
}
function sf(e, n, t, r, l) {
  t = t.render;
  var u = n.ref;
  if (St(n, l), r = Mo(e, n, t, r, u, l), t = Lo(), e !== null && !pe) return n.updateQueue = e.updateQueue, n.flags &= -2053, e.lanes &= ~l, nn(e, n, l);
  return B && t && ko(n), n.flags |= 1, fe(e, n, r, l), n.child;
}
function cf(e, n, t, r, l) {
  if (e === null) {
    var u = t.type;
    if (typeof u === "function" && !Ko(u) && u.defaultProps === void 0 && t.compare === null && t.defaultProps === void 0) return n.tag = 15, n.type = u, js(e, n, u, r, l);
    return e = Ul(t.type, null, r, n, n.mode, l), e.ref = n.ref, e.return = n, n.child = e;
  }
  if (u = e.child, (e.lanes & l) === 0) {
    var i = u.memoizedProps;
    if (t = t.compare, t = t !== null ? t : hr, t(i, r) && e.ref === n.ref) return nn(e, n, l);
  }
  return n.flags |= 1, e = kn(u, r), e.ref = n.ref, e.return = n, n.child = e;
}
function js(e, n, t, r, l) {
  if (e !== null) {
    var u = e.memoizedProps;
    if (hr(u, r) && e.ref === n.ref) if (pe = !1, n.pendingProps = r = u, (e.lanes & l) !== 0) (e.flags & 131072) !== 0 && (pe = !0);else return n.lanes = e.lanes, nn(e, n, l);
  }
  return Yi(e, n, t, r, l);
}
function bs(e, n, t) {
  var r = n.pendingProps,
    l = r.children,
    u = e !== null ? e.memoizedState : null;
  if (r.mode === "hidden") {
    if ((n.mode & 1) === 0) n.memoizedState = {
      baseLanes: 0,
      cachePool: null,
      transitions: null
    }, V(vt, he), he |= t;else {
      if ((t & 1073741824) === 0) return e = u !== null ? u.baseLanes | t : t, n.lanes = n.childLanes = 1073741824, n.memoizedState = {
        baseLanes: e,
        cachePool: null,
        transitions: null
      }, n.updateQueue = null, V(vt, he), he |= e, null;
      n.memoizedState = {
        baseLanes: 0,
        cachePool: null,
        transitions: null
      }, r = u !== null ? u.baseLanes : t, V(vt, he), he |= r;
    }
  } else u !== null ? (r = u.baseLanes | t, n.memoizedState = null) : r = t, V(vt, he), he |= r;
  return fe(e, n, l, t), n.child;
}
function ec(e, n) {
  var t = n.ref;
  if (e === null && t !== null || e !== null && e.ref !== t) n.flags |= 512, n.flags |= 2097152;
}
function Yi(e, n, t, r, l) {
  var u = me(t) ? Qn : oe.current;
  if (u = Et(n, u), St(n, l), t = Mo(e, n, t, r, u, l), r = Lo(), e !== null && !pe) return n.updateQueue = e.updateQueue, n.flags &= -2053, e.lanes &= ~l, nn(e, n, l);
  return B && r && ko(n), n.flags |= 1, fe(e, n, t, l), n.child;
}
function df(e, n, t, r, l) {
  if (me(t)) {
    var u = !0;
    Gl(n);
  } else u = !1;
  if (St(n, l), n.stateNode === null) Ml(e, n), qs(n, t, r), Wi(n, t, r, l), r = !0;else if (e === null) {
    var {
      stateNode: i,
      memoizedProps: o
    } = n;
    i.props = o;
    var a = i.context,
      c = t.contextType;
    typeof c === "object" && c !== null ? c = ze(c) : (c = me(t) ? Qn : oe.current, c = Et(n, c));
    var y = t.getDerivedStateFromProps,
      g = typeof y === "function" || typeof i.getSnapshotBeforeUpdate === "function";
    g || typeof i.UNSAFE_componentWillReceiveProps !== "function" && typeof i.componentWillReceiveProps !== "function" || (o !== r || a !== c) && uf(n, i, r, c), fn = !1;
    var h = n.memoizedState;
    i.state = h, jl(n, r, i, l), a = n.memoizedState, o !== r || h !== a || ve.current || fn ? (typeof y === "function" && (Ii(n, t, y, r), a = n.memoizedState), (o = fn || lf(n, t, o, r, h, a, c)) ? (g || typeof i.UNSAFE_componentWillMount !== "function" && typeof i.componentWillMount !== "function" || (typeof i.componentWillMount === "function" && i.componentWillMount(), typeof i.UNSAFE_componentWillMount === "function" && i.UNSAFE_componentWillMount()), typeof i.componentDidMount === "function" && (n.flags |= 4194308)) : (typeof i.componentDidMount === "function" && (n.flags |= 4194308), n.memoizedProps = r, n.memoizedState = a), i.props = r, i.state = a, i.context = c, r = o) : (typeof i.componentDidMount === "function" && (n.flags |= 4194308), r = !1);
  } else {
    i = n.stateNode, Ts(e, n), o = n.memoizedProps, c = n.type === n.elementType ? o : Re(n.type, o), i.props = c, g = n.pendingProps, h = i.context, a = t.contextType, typeof a === "object" && a !== null ? a = ze(a) : (a = me(t) ? Qn : oe.current, a = Et(n, a));
    var k = t.getDerivedStateFromProps;
    (y = typeof k === "function" || typeof i.getSnapshotBeforeUpdate === "function") || typeof i.UNSAFE_componentWillReceiveProps !== "function" && typeof i.componentWillReceiveProps !== "function" || (o !== g || h !== a) && uf(n, i, r, a), fn = !1, h = n.memoizedState, i.state = h, jl(n, r, i, l);
    var E = n.memoizedState;
    o !== g || h !== E || ve.current || fn ? (typeof k === "function" && (Ii(n, t, k, r), E = n.memoizedState), (c = fn || lf(n, t, c, r, h, E, a) || !1) ? (y || typeof i.UNSAFE_componentWillUpdate !== "function" && typeof i.componentWillUpdate !== "function" || (typeof i.componentWillUpdate === "function" && i.componentWillUpdate(r, E, a), typeof i.UNSAFE_componentWillUpdate === "function" && i.UNSAFE_componentWillUpdate(r, E, a)), typeof i.componentDidUpdate === "function" && (n.flags |= 4), typeof i.getSnapshotBeforeUpdate === "function" && (n.flags |= 1024)) : (typeof i.componentDidUpdate !== "function" || o === e.memoizedProps && h === e.memoizedState || (n.flags |= 4), typeof i.getSnapshotBeforeUpdate !== "function" || o === e.memoizedProps && h === e.memoizedState || (n.flags |= 1024), n.memoizedProps = r, n.memoizedState = E), i.props = r, i.state = E, i.context = a, r = c) : (typeof i.componentDidUpdate !== "function" || o === e.memoizedProps && h === e.memoizedState || (n.flags |= 4), typeof i.getSnapshotBeforeUpdate !== "function" || o === e.memoizedProps && h === e.memoizedState || (n.flags |= 1024), r = !1);
  }
  return Xi(e, n, t, r, u, l);
}
function Xi(e, n, t, r, l, u) {
  ec(e, n);
  var i = (n.flags & 128) !== 0;
  if (!r && !i) return l && xa(n, t, !1), nn(e, n, u);
  r = n.stateNode, nv.current = n;
  var o = i && typeof t.getDerivedStateFromError !== "function" ? null : r.render();
  return n.flags |= 1, e !== null && i ? (n.child = Pt(n, e.child, null, u), n.child = Pt(n, null, o, u)) : fe(e, n, o, u), n.memoizedState = r.state, l && xa(n, t, !0), n.child;
}
function nc(e) {
  var n = e.stateNode;
  n.pendingContext ? qa(e, n.pendingContext, n.pendingContext !== n.context) : n.context && qa(e, n.context, !1), Fo(e, n.containerInfo);
}
function pf(e, n, t, r, l) {
  return _t(), _o(l), n.flags |= 256, fe(e, n, t, r), n.child;
}
function Zi(e) {
  return {
    baseLanes: e,
    cachePool: null,
    transitions: null
  };
}
function tc(e, n, t) {
  var r = n.pendingProps,
    l = I.current,
    u = !1,
    i = (n.flags & 128) !== 0,
    o;
  if ((o = i) || (o = e !== null && e.memoizedState === null ? !1 : (l & 2) !== 0), o) u = !0, n.flags &= -129;else if (e === null || e.memoizedState !== null) l |= 1;
  if (V(I, l & 1), e === null) {
    if (Ai(n), e = n.memoizedState, e !== null && (e = e.dehydrated, e !== null)) return (n.mode & 1) === 0 ? n.lanes = 1 : e.data === "$!" ? n.lanes = 8 : n.lanes = 1073741824, null;
    return i = r.children, e = r.fallback, u ? (r = n.mode, u = n.child, i = {
      mode: "hidden",
      children: i
    }, (r & 1) === 0 && u !== null ? (u.childLanes = 0, u.pendingProps = i) : u = hu(i, r, 0, null), e = An(e, r, t, null), u.return = n, e.return = n, u.sibling = e, n.child = u, n.child.memoizedState = Zi(t), n.memoizedState = Gi, e) : $o(n, i);
  }
  if (l = e.memoizedState, l !== null && (o = l.dehydrated, o !== null)) return tv(e, n, i, r, o, l, t);
  if (u) {
    u = r.fallback, i = n.mode, l = e.child, o = l.sibling;
    var a = {
      mode: "hidden",
      children: r.children
    };
    return (i & 1) === 0 && n.child !== l ? (r = n.child, r.childLanes = 0, r.pendingProps = a, n.deletions = null) : (r = kn(l, a), r.subtreeFlags = l.subtreeFlags & 14680064), o !== null ? u = kn(o, u) : (u = An(u, i, t, null), u.flags |= 2), u.return = n, r.return = n, r.sibling = u, n.child = r, r = u, u = n.child, i = e.child.memoizedState, i = i === null ? Zi(t) : {
      baseLanes: i.baseLanes | t,
      cachePool: null,
      transitions: i.transitions
    }, u.memoizedState = i, u.childLanes = e.childLanes & ~t, n.memoizedState = Gi, r;
  }
  return u = e.child, e = u.sibling, r = kn(u, {
    mode: "visible",
    children: r.children
  }), (n.mode & 1) === 0 && (r.lanes = t), r.return = n, r.sibling = null, e !== null && (t = n.deletions, t === null ? (n.deletions = [e], n.flags |= 16) : t.push(e)), n.child = r, n.memoizedState = null, r;
}
function $o(e, n) {
  return n = hu({
    mode: "visible",
    children: n
  }, e.mode, 0, null), n.return = e, e.child = n;
}
function _l(e, n, t, r) {
  return r !== null && _o(r), Pt(n, e.child, null, t), e = $o(n, n.pendingProps.children), e.flags |= 2, n.memoizedState = null, e;
}
function tv(e, n, t, r, l, u, i) {
  if (t) {
    if (n.flags & 256) return n.flags &= -257, r = ii(Error(w(422))), _l(e, n, i, r);
    if (n.memoizedState !== null) return n.child = e.child, n.flags |= 128, null;
    return u = r.fallback, l = n.mode, r = hu({
      mode: "visible",
      children: r.children
    }, l, 0, null), u = An(u, l, i, null), u.flags |= 2, r.return = n, u.return = n, r.sibling = u, n.child = r, (n.mode & 1) !== 0 && Pt(n, e.child, null, i), n.child.memoizedState = Zi(i), n.memoizedState = Gi, u;
  }
  if ((n.mode & 1) === 0) return _l(e, n, i, null);
  if (l.data === "$!") {
    if (r = l.nextSibling && l.nextSibling.dataset, r) var o = r.dgst;
    return r = o, u = Error(w(419)), r = ii(u, r, void 0), _l(e, n, i, r);
  }
  if (o = (i & e.childLanes) !== 0, pe || o) {
    if (r = b, r !== null) {
      switch (i & -i) {
        case 4:
          l = 2;
          break;
        case 16:
          l = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          l = 32;
          break;
        case 536870912:
          l = 268435456;
          break;
        default:
          l = 0;
      }
      l = (l & (r.suspendedLanes | i)) !== 0 ? 0 : l, l !== 0 && l !== u.retryLane && (u.retryLane = l, en(e, l), Ve(r, e, l, -1));
    }
    return Wo(), r = ii(Error(w(421))), _l(e, n, i, r);
  }
  if (l.data === "$?") return n.flags |= 128, n.child = e.child, n = mv.bind(null, e), l._reactRetry = n, null;
  return e = u.treeContext, ge = hn(l.nextSibling), Se = n, B = !0, Me = null, e !== null && (_e[Pe++] = qe, _e[Pe++] = xe, _e[Pe++] = In, qe = e.id, xe = e.overflow, In = n), n = $o(n, r.children), n.flags |= 4096, n;
}
function vf(e, n, t) {
  e.lanes |= n;
  var r = e.alternate;
  r !== null && (r.lanes |= n), Qi(e.return, n, t);
}
function oi(e, n, t, r, l) {
  var u = e.memoizedState;
  u === null ? e.memoizedState = {
    isBackwards: n,
    rendering: null,
    renderingStartTime: 0,
    last: r,
    tail: t,
    tailMode: l
  } : (u.isBackwards = n, u.rendering = null, u.renderingStartTime = 0, u.last = r, u.tail = t, u.tailMode = l);
}
function rc(e, n, t) {
  var r = n.pendingProps,
    l = r.revealOrder,
    u = r.tail;
  if (fe(e, n, r.children, t), r = I.current, (r & 2) !== 0) r = r & 1 | 2, n.flags |= 128;else {
    if (e !== null && (e.flags & 128) !== 0) e: for (e = n.child; e !== null;) {
      if (e.tag === 13) e.memoizedState !== null && vf(e, t, n);else if (e.tag === 19) vf(e, t, n);else if (e.child !== null) {
        e.child.return = e, e = e.child;
        continue;
      }
      if (e === n) break e;
      for (; e.sibling === null;) {
        if (e.return === null || e.return === n) break e;
        e = e.return;
      }
      e.sibling.return = e.return, e = e.sibling;
    }
    r &= 1;
  }
  if (V(I, r), (n.mode & 1) === 0) n.memoizedState = null;else switch (l) {
    case "forwards":
      t = n.child;
      for (l = null; t !== null;) e = t.alternate, e !== null && bl(e) === null && (l = t), t = t.sibling;
      t = l, t === null ? (l = n.child, n.child = null) : (l = t.sibling, t.sibling = null), oi(n, !1, l, t, u);
      break;
    case "backwards":
      t = null, l = n.child;
      for (n.child = null; l !== null;) {
        if (e = l.alternate, e !== null && bl(e) === null) {
          n.child = l;
          break;
        }
        e = l.sibling, l.sibling = t, t = l, l = e;
      }
      oi(n, !0, t, null, u);
      break;
    case "together":
      oi(n, !1, null, null, void 0);
      break;
    default:
      n.memoizedState = null;
  }
  return n.child;
}
function Ml(e, n) {
  (n.mode & 1) === 0 && e !== null && (e.alternate = null, n.alternate = null, n.flags |= 2);
}
function nn(e, n, t) {
  if (e !== null && (n.dependencies = e.dependencies), Kn |= n.lanes, (t & n.childLanes) === 0) return null;
  if (e !== null && n.child !== e.child) throw Error(w(153));
  if (n.child !== null) {
    e = n.child, t = kn(e, e.pendingProps), n.child = t;
    for (t.return = n; e.sibling !== null;) e = e.sibling, t = t.sibling = kn(e, e.pendingProps), t.return = n;
    t.sibling = null;
  }
  return n.child;
}
function rv(e, n, t) {
  switch (n.tag) {
    case 3:
      nc(n), _t();
      break;
    case 5:
      Fs(n);
      break;
    case 1:
      me(n.type) && Gl(n);
      break;
    case 4:
      Fo(n, n.stateNode.containerInfo);
      break;
    case 10:
      var r = n.type._context,
        l = n.memoizedProps.value;
      V(xl, r._currentValue), r._currentValue = l;
      break;
    case 13:
      if (r = n.memoizedState, r !== null) {
        if (r.dehydrated !== null) return V(I, I.current & 1), n.flags |= 128, null;
        if ((t & n.child.childLanes) !== 0) return tc(e, n, t);
        return V(I, I.current & 1), e = nn(e, n, t), e !== null ? e.sibling : null;
      }
      V(I, I.current & 1);
      break;
    case 19:
      if (r = (t & n.childLanes) !== 0, (e.flags & 128) !== 0) {
        if (r) return rc(e, n, t);
        n.flags |= 128;
      }
      if (l = n.memoizedState, l !== null && (l.rendering = null, l.tail = null, l.lastEffect = null), V(I, I.current), r) break;else return null;
    case 22:
    case 23:
      return n.lanes = 0, bs(e, n, t);
  }
  return nn(e, n, t);
}
function Yt(e, n) {
  if (!B) switch (e.tailMode) {
    case "hidden":
      n = e.tail;
      for (var t = null; n !== null;) n.alternate !== null && (t = n), n = n.sibling;
      t === null ? e.tail = null : t.sibling = null;
      break;
    case "collapsed":
      t = e.tail;
      for (var r = null; t !== null;) t.alternate !== null && (r = t), t = t.sibling;
      r === null ? n || e.tail === null ? e.tail = null : e.tail.sibling = null : r.sibling = null;
  }
}
function ue(e) {
  var n = e.alternate !== null && e.alternate.child === e.child,
    t = 0,
    r = 0;
  if (n) for (var l = e.child; l !== null;) t |= l.lanes | l.childLanes, r |= l.subtreeFlags & 14680064, r |= l.flags & 14680064, l.return = e, l = l.sibling;else for (l = e.child; l !== null;) t |= l.lanes | l.childLanes, r |= l.subtreeFlags, r |= l.flags, l.return = e, l = l.sibling;
  return e.subtreeFlags |= r, e.childLanes = t, n;
}
function lv(e, n, t) {
  var r = n.pendingProps;
  switch (Eo(n), n.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return ue(n), null;
    case 1:
      return me(n.type) && Xl(), ue(n), null;
    case 3:
      if (r = n.stateNode, Ct(), $(ve), $(oe), Ro(), r.pendingContext && (r.context = r.pendingContext, r.pendingContext = null), e === null || e.child === null) kl(n) ? n.flags |= 4 : e === null || e.memoizedState.isDehydrated && (n.flags & 256) === 0 || (n.flags |= 1024, Me !== null && (ro(Me), Me = null));
      return qi(e, n), ue(n), null;
    case 5:
      Oo(n);
      var l = Bn(Er.current);
      if (t = n.type, e !== null && n.stateNode != null) uc(e, n, t, r, l), e.ref !== n.ref && (n.flags |= 512, n.flags |= 2097152);else {
        if (!r) {
          if (n.stateNode === null) throw Error(w(166));
          return ue(n), null;
        }
        if (e = Bn(Ke.current), kl(n)) {
          r = n.stateNode, t = n.type;
          var u = n.memoizedProps;
          switch (r[Ie] = n, r[wr] = u, e = (n.mode & 1) !== 0, t) {
            case "dialog":
              U("cancel", r), U("close", r);
              break;
            case "iframe":
            case "object":
            case "embed":
              U("load", r);
              break;
            case "video":
            case "audio":
              for (l = 0; l < er.length; l++) U(er[l], r);
              break;
            case "source":
              U("error", r);
              break;
            case "img":
            case "image":
            case "link":
              U("error", r), U("load", r);
              break;
            case "details":
              U("toggle", r);
              break;
            case "input":
              _a(r, u), U("invalid", r);
              break;
            case "select":
              r._wrapperState = {
                wasMultiple: !!u.multiple
              }, U("invalid", r);
              break;
            case "textarea":
              Ca(r, u), U("invalid", r);
          }
          wi(t, u), l = null;
          for (var i in u) if (u.hasOwnProperty(i)) {
            var o = u[i];
            i === "children" ? typeof o === "string" ? r.textContent !== o && (u.suppressHydrationWarning !== !0 && wl(r.textContent, o, e), l = ["children", o]) : typeof o === "number" && r.textContent !== "" + o && (u.suppressHydrationWarning !== !0 && wl(r.textContent, o, e), l = ["children", "" + o]) : sr.hasOwnProperty(i) && o != null && i === "onScroll" && U("scroll", r);
          }
          switch (t) {
            case "input":
              dl(r), Pa(r, u, !0);
              break;
            case "textarea":
              dl(r), Na(r);
              break;
            case "select":
            case "option":
              break;
            default:
              typeof u.onClick === "function" && (r.onclick = Yl);
          }
          r = l, n.updateQueue = r, r !== null && (n.flags |= 4);
        } else {
          i = l.nodeType === 9 ? l : l.ownerDocument, e === "http://www.w3.org/1999/xhtml" && (e = Lf(t)), e === "http://www.w3.org/1999/xhtml" ? t === "script" ? (e = i.createElement("div"), e.innerHTML = "<script><\/script>", e = e.removeChild(e.firstChild)) : typeof r.is === "string" ? e = i.createElement(t, {
            is: r.is
          }) : (e = i.createElement(t), t === "select" && (i = e, r.multiple ? i.multiple = !0 : r.size && (i.size = r.size))) : e = i.createElementNS(e, t), e[Ie] = n, e[wr] = r, lc(e, n, !1, !1), n.stateNode = e;
          e: {
            switch (i = ki(t, r), t) {
              case "dialog":
                U("cancel", e), U("close", e), l = r;
                break;
              case "iframe":
              case "object":
              case "embed":
                U("load", e), l = r;
                break;
              case "video":
              case "audio":
                for (l = 0; l < er.length; l++) U(er[l], e);
                l = r;
                break;
              case "source":
                U("error", e), l = r;
                break;
              case "img":
              case "image":
              case "link":
                U("error", e), U("load", e), l = r;
                break;
              case "details":
                U("toggle", e), l = r;
                break;
              case "input":
                _a(e, r), l = mi(e, r), U("invalid", e);
                break;
              case "option":
                l = r;
                break;
              case "select":
                e._wrapperState = {
                  wasMultiple: !!r.multiple
                }, l = K({}, r, {
                  value: void 0
                }), U("invalid", e);
                break;
              case "textarea":
                Ca(e, r), l = gi(e, r), U("invalid", e);
                break;
              default:
                l = r;
            }
            wi(t, l), o = l;
            for (u in o) if (o.hasOwnProperty(u)) {
              var a = o[u];
              u === "style" ? $f(e, a) : u === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, a != null && Vf(e, a)) : u === "children" ? typeof a === "string" ? (t !== "textarea" || a !== "") && cr(e, a) : typeof a === "number" && cr(e, "" + a) : u !== "suppressContentEditableWarning" && u !== "suppressHydrationWarning" && u !== "autoFocus" && (sr.hasOwnProperty(u) ? a != null && u === "onScroll" && U("scroll", e) : a != null && io(e, u, a, i));
            }
            switch (t) {
              case "input":
                dl(e), Pa(e, r, !1);
                break;
              case "textarea":
                dl(e), Na(e);
                break;
              case "option":
                r.value != null && e.setAttribute("value", "" + En(r.value));
                break;
              case "select":
                e.multiple = !!r.multiple, u = r.value, u != null ? mt(e, !!r.multiple, u, !1) : r.defaultValue != null && mt(e, !!r.multiple, r.defaultValue, !0);
                break;
              default:
                typeof l.onClick === "function" && (e.onclick = Yl);
            }
            switch (t) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                r = !!r.autoFocus;
                break e;
              case "img":
                r = !0;
                break e;
              default:
                r = !1;
            }
          }
          r && (n.flags |= 4);
        }
        n.ref !== null && (n.flags |= 512, n.flags |= 2097152);
      }
      return ue(n), null;
    case 6:
      if (e && n.stateNode != null) ic(e, n, e.memoizedProps, r);else {
        if (typeof r !== "string" && n.stateNode === null) throw Error(w(166));
        if (t = Bn(Er.current), Bn(Ke.current), kl(n)) {
          if (r = n.stateNode, t = n.memoizedProps, r[Ie] = n, u = r.nodeValue !== t) {
            if (e = Se, e !== null) switch (e.tag) {
              case 3:
                wl(r.nodeValue, t, (e.mode & 1) !== 0);
                break;
              case 5:
                e.memoizedProps.suppressHydrationWarning !== !0 && wl(r.nodeValue, t, (e.mode & 1) !== 0);
            }
          }
          u && (n.flags |= 4);
        } else r = (t.nodeType === 9 ? t : t.ownerDocument).createTextNode(r), r[Ie] = n, n.stateNode = r;
      }
      return ue(n), null;
    case 13:
      if ($(I), r = n.memoizedState, e === null || e.memoizedState !== null && e.memoizedState.dehydrated !== null) {
        if (B && ge !== null && (n.mode & 1) !== 0 && (n.flags & 128) === 0) Ps(), _t(), n.flags |= 98560, u = !1;else if (u = kl(n), r !== null && r.dehydrated !== null) {
          if (e === null) {
            if (!u) throw Error(w(318));
            if (u = n.memoizedState, u = u !== null ? u.dehydrated : null, !u) throw Error(w(317));
            u[Ie] = n;
          } else _t(), (n.flags & 128) === 0 && (n.memoizedState = null), n.flags |= 4;
          ue(n), u = !1;
        } else Me !== null && (ro(Me), Me = null), u = !0;
        if (!u) return n.flags & 65536 ? n : null;
      }
      if ((n.flags & 128) !== 0) return n.lanes = t, n;
      return r = r !== null, r !== (e !== null && e.memoizedState !== null) && r && (n.child.flags |= 8192, (n.mode & 1) !== 0 && (e === null || (I.current & 1) !== 0 ? x === 0 && (x = 3) : Wo())), n.updateQueue !== null && (n.flags |= 4), ue(n), null;
    case 4:
      return Ct(), qi(e, n), e === null && gr(n.stateNode.containerInfo), ue(n), null;
    case 10:
      return No(n.type._context), ue(n), null;
    case 17:
      return me(n.type) && Xl(), ue(n), null;
    case 19:
      if ($(I), u = n.memoizedState, u === null) return ue(n), null;
      if (r = (n.flags & 128) !== 0, i = u.rendering, i === null) {
        if (r) Yt(u, !1);else {
          if (x !== 0 || e !== null && (e.flags & 128) !== 0) for (e = n.child; e !== null;) {
            if (i = bl(e), i !== null) {
              n.flags |= 128, Yt(u, !1), r = i.updateQueue, r !== null && (n.updateQueue = r, n.flags |= 4), n.subtreeFlags = 0, r = t;
              for (t = n.child; t !== null;) u = t, e = r, u.flags &= 14680066, i = u.alternate, i === null ? (u.childLanes = 0, u.lanes = e, u.child = null, u.subtreeFlags = 0, u.memoizedProps = null, u.memoizedState = null, u.updateQueue = null, u.dependencies = null, u.stateNode = null) : (u.childLanes = i.childLanes, u.lanes = i.lanes, u.child = i.child, u.subtreeFlags = 0, u.deletions = null, u.memoizedProps = i.memoizedProps, u.memoizedState = i.memoizedState, u.updateQueue = i.updateQueue, u.type = i.type, e = i.dependencies, u.dependencies = e === null ? null : {
                lanes: e.lanes,
                firstContext: e.firstContext
              }), t = t.sibling;
              return V(I, I.current & 1 | 2), n.child;
            }
            e = e.sibling;
          }
          u.tail !== null && X() > zt && (n.flags |= 128, r = !0, Yt(u, !1), n.lanes = 4194304);
        }
      } else {
        if (!r) if (e = bl(i), e !== null) {
          if (n.flags |= 128, r = !0, t = e.updateQueue, t !== null && (n.updateQueue = t, n.flags |= 4), Yt(u, !0), u.tail === null && u.tailMode === "hidden" && !i.alternate && !B) return ue(n), null;
        } else 2 * X() - u.renderingStartTime > zt && t !== 1073741824 && (n.flags |= 128, r = !0, Yt(u, !1), n.lanes = 4194304);
        u.isBackwards ? (i.sibling = n.child, n.child = i) : (t = u.last, t !== null ? t.sibling = i : n.child = i, u.last = i);
      }
      if (u.tail !== null) return n = u.tail, u.rendering = n, u.tail = n.sibling, u.renderingStartTime = X(), n.sibling = null, t = I.current, V(I, r ? t & 1 | 2 : t & 1), n;
      return ue(n), null;
    case 22:
    case 23:
      return Io(), r = n.memoizedState !== null, e !== null && e.memoizedState !== null !== r && (n.flags |= 8192), r && (n.mode & 1) !== 0 ? (he & 1073741824) !== 0 && (ue(n), n.subtreeFlags & 6 && (n.flags |= 8192)) : ue(n), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(w(156, n.tag));
}
function uv(e, n) {
  switch (Eo(n), n.tag) {
    case 1:
      return me(n.type) && Xl(), e = n.flags, e & 65536 ? (n.flags = e & -65537 | 128, n) : null;
    case 3:
      return Ct(), $(ve), $(oe), Ro(), e = n.flags, (e & 65536) !== 0 && (e & 128) === 0 ? (n.flags = e & -65537 | 128, n) : null;
    case 5:
      return Oo(n), null;
    case 13:
      if ($(I), e = n.memoizedState, e !== null && e.dehydrated !== null) {
        if (n.alternate === null) throw Error(w(340));
        _t();
      }
      return e = n.flags, e & 65536 ? (n.flags = e & -65537 | 128, n) : null;
    case 19:
      return $(I), null;
    case 4:
      return Ct(), null;
    case 10:
      return No(n.type._context), null;
    case 22:
    case 23:
      return Io(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
function pt(e, n) {
  var t = e.ref;
  if (t !== null) if (typeof t === "function") try {
    t(null);
  } catch (r) {
    Y(e, n, r);
  } else t.current = null;
}
function xi(e, n, t) {
  try {
    t();
  } catch (r) {
    Y(e, n, r);
  }
}
function ov(e, n) {
  if (Mi = Il, e = cs(), wo(e)) {
    if ("selectionStart" in e) var t = {
      start: e.selectionStart,
      end: e.selectionEnd
    };else e: {
      t = (t = e.ownerDocument) && t.defaultView || window;
      var r = t.getSelection && t.getSelection();
      if (r && r.rangeCount !== 0) {
        t = r.anchorNode;
        var {
          anchorOffset: l,
          focusNode: u
        } = r;
        r = r.focusOffset;
        try {
          t.nodeType, u.nodeType;
        } catch (S) {
          t = null;
          break e;
        }
        var i = 0,
          o = -1,
          a = -1,
          c = 0,
          y = 0,
          g = e,
          h = null;
        n: for (;;) {
          for (var k;;) {
            if (g !== t || l !== 0 && g.nodeType !== 3 || (o = i + l), g !== u || r !== 0 && g.nodeType !== 3 || (a = i + r), g.nodeType === 3 && (i += g.nodeValue.length), (k = g.firstChild) === null) break;
            h = g, g = k;
          }
          for (;;) {
            if (g === e) break n;
            if (h === t && ++c === l && (o = i), h === u && ++y === r && (a = i), (k = g.nextSibling) !== null) break;
            g = h, h = g.parentNode;
          }
          g = k;
        }
        t = o === -1 || a === -1 ? null : {
          start: o,
          end: a
        };
      } else t = null;
    }
    t = t || {
      start: 0,
      end: 0
    };
  } else t = null;
  Li = {
    focusedElem: e,
    selectionRange: t
  }, Il = !1;
  for (P = n; P !== null;) if (n = P, e = n.child, (n.subtreeFlags & 1028) !== 0 && e !== null) e.return = n, P = e;else for (; P !== null;) {
    n = P;
    try {
      var E = n.alternate;
      if ((n.flags & 1024) !== 0) switch (n.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (E !== null) {
            var {
                memoizedProps: _,
                memoizedState: Q
              } = E,
              d = n.stateNode,
              s = d.getSnapshotBeforeUpdate(n.elementType === n.type ? _ : Re(n.type, _), Q);
            d.__reactInternalSnapshotBeforeUpdate = s;
          }
          break;
        case 3:
          var v = n.stateNode.containerInfo;
          v.nodeType === 1 ? v.textContent = "" : v.nodeType === 9 && v.documentElement && v.removeChild(v.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(w(163));
      }
    } catch (S) {
      Y(n, n.return, S);
    }
    if (e = n.sibling, e !== null) {
      e.return = n.return, P = e;
      break;
    }
    P = n.return;
  }
  return E = mf, mf = !1, E;
}
function or(e, n, t) {
  var r = n.updateQueue;
  if (r = r !== null ? r.lastEffect : null, r !== null) {
    var l = r = r.next;
    do {
      if ((l.tag & e) === e) {
        var u = l.destroy;
        l.destroy = void 0, u !== void 0 && xi(n, t, u);
      }
      l = l.next;
    } while (l !== r);
  }
}
function mu(e, n) {
  if (n = n.updateQueue, n = n !== null ? n.lastEffect : null, n !== null) {
    var t = n = n.next;
    do {
      if ((t.tag & e) === e) {
        var r = t.create;
        t.destroy = r();
      }
      t = t.next;
    } while (t !== n);
  }
}
function Ji(e) {
  var n = e.ref;
  if (n !== null) {
    var t = e.stateNode;
    switch (e.tag) {
      case 5:
        e = t;
        break;
      default:
        e = t;
    }
    typeof n === "function" ? n(e) : n.current = e;
  }
}
function oc(e) {
  var n = e.alternate;
  n !== null && (e.alternate = null, oc(n)), e.child = null, e.deletions = null, e.sibling = null, e.tag === 5 && (n = e.stateNode, n !== null && (delete n[Ie], delete n[wr], delete n[$i], delete n[W0], delete n[K0])), e.stateNode = null, e.return = null, e.dependencies = null, e.memoizedProps = null, e.memoizedState = null, e.pendingProps = null, e.stateNode = null, e.updateQueue = null;
}
function ac(e) {
  return e.tag === 5 || e.tag === 3 || e.tag === 4;
}
function yf(e) {
  e: for (;;) {
    for (; e.sibling === null;) {
      if (e.return === null || ac(e.return)) return null;
      e = e.return;
    }
    e.sibling.return = e.return;
    for (e = e.sibling; e.tag !== 5 && e.tag !== 6 && e.tag !== 18;) {
      if (e.flags & 2) continue e;
      if (e.child === null || e.tag === 4) continue e;else e.child.return = e, e = e.child;
    }
    if (!(e.flags & 2)) return e.stateNode;
  }
}
function ji(e, n, t) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, n ? t.nodeType === 8 ? t.parentNode.insertBefore(e, n) : t.insertBefore(e, n) : (t.nodeType === 8 ? (n = t.parentNode, n.insertBefore(e, t)) : (n = t, n.appendChild(e)), t = t._reactRootContainer, t !== null && t !== void 0 || n.onclick !== null || (n.onclick = Yl));else if (r !== 4 && (e = e.child, e !== null)) for (ji(e, n, t), e = e.sibling; e !== null;) ji(e, n, t), e = e.sibling;
}
function bi(e, n, t) {
  var r = e.tag;
  if (r === 5 || r === 6) e = e.stateNode, n ? t.insertBefore(e, n) : t.appendChild(e);else if (r !== 4 && (e = e.child, e !== null)) for (bi(e, n, t), e = e.sibling; e !== null;) bi(e, n, t), e = e.sibling;
}
function on(e, n, t) {
  for (t = t.child; t !== null;) fc(e, n, t), t = t.sibling;
}
function fc(e, n, t) {
  if (We && typeof We.onCommitFiberUnmount === "function") try {
    We.onCommitFiberUnmount(ou, t);
  } catch (o) {}
  switch (t.tag) {
    case 5:
      ie || pt(t, n);
    case 6:
      var r = ee,
        l = De;
      ee = null, on(e, n, t), ee = r, De = l, ee !== null && (De ? (e = ee, t = t.stateNode, e.nodeType === 8 ? e.parentNode.removeChild(t) : e.removeChild(t)) : ee.removeChild(t.stateNode));
      break;
    case 18:
      ee !== null && (De ? (e = ee, t = t.stateNode, e.nodeType === 8 ? ei(e.parentNode, t) : e.nodeType === 1 && ei(e, t), mr(e)) : ei(ee, t.stateNode));
      break;
    case 4:
      r = ee, l = De, ee = t.stateNode.containerInfo, De = !0, on(e, n, t), ee = r, De = l;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!ie && (r = t.updateQueue, r !== null && (r = r.lastEffect, r !== null))) {
        l = r = r.next;
        do {
          var u = l,
            i = u.destroy;
          u = u.tag, i !== void 0 && ((u & 2) !== 0 ? xi(t, n, i) : (u & 4) !== 0 && xi(t, n, i)), l = l.next;
        } while (l !== r);
      }
      on(e, n, t);
      break;
    case 1:
      if (!ie && (pt(t, n), r = t.stateNode, typeof r.componentWillUnmount === "function")) try {
        r.props = t.memoizedProps, r.state = t.memoizedState, r.componentWillUnmount();
      } catch (o) {
        Y(t, n, o);
      }
      on(e, n, t);
      break;
    case 21:
      on(e, n, t);
      break;
    case 22:
      t.mode & 1 ? (ie = (r = ie) || t.memoizedState !== null, on(e, n, t), ie = r) : on(e, n, t);
      break;
    default:
      on(e, n, t);
  }
}
function hf(e) {
  var n = e.updateQueue;
  if (n !== null) {
    e.updateQueue = null;
    var t = e.stateNode;
    t === null && (t = e.stateNode = new iv()), n.forEach(function (r) {
      var l = yv.bind(null, e, r);
      t.has(r) || (t.add(r), r.then(l, l));
    });
  }
}
function Oe(e, n) {
  var t = n.deletions;
  if (t !== null) for (var r = 0; r < t.length; r++) {
    var l = t[r];
    try {
      var u = e,
        i = n,
        o = i;
      e: for (; o !== null;) {
        switch (o.tag) {
          case 5:
            ee = o.stateNode, De = !1;
            break e;
          case 3:
            ee = o.stateNode.containerInfo, De = !0;
            break e;
          case 4:
            ee = o.stateNode.containerInfo, De = !0;
            break e;
        }
        o = o.return;
      }
      if (ee === null) throw Error(w(160));
      fc(u, i, l), ee = null, De = !1;
      var a = l.alternate;
      a !== null && (a.return = null), l.return = null;
    } catch (c) {
      Y(l, n, c);
    }
  }
  if (n.subtreeFlags & 12854) for (n = n.child; n !== null;) sc(n, e), n = n.sibling;
}
function sc(e, n) {
  var {
    alternate: t,
    flags: r
  } = e;
  switch (e.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      if (Oe(n, e), Ae(e), r & 4) {
        try {
          or(3, e, e.return), mu(3, e);
        } catch (_) {
          Y(e, e.return, _);
        }
        try {
          or(5, e, e.return);
        } catch (_) {
          Y(e, e.return, _);
        }
      }
      break;
    case 1:
      Oe(n, e), Ae(e), r & 512 && t !== null && pt(t, t.return);
      break;
    case 5:
      if (Oe(n, e), Ae(e), r & 512 && t !== null && pt(t, t.return), e.flags & 32) {
        var l = e.stateNode;
        try {
          cr(l, "");
        } catch (_) {
          Y(e, e.return, _);
        }
      }
      if (r & 4 && (l = e.stateNode, l != null)) {
        var u = e.memoizedProps,
          i = t !== null ? t.memoizedProps : u,
          o = e.type,
          a = e.updateQueue;
        if (e.updateQueue = null, a !== null) try {
          o === "input" && u.type === "radio" && u.name != null && Df(l, u), ki(o, i);
          var c = ki(o, u);
          for (i = 0; i < a.length; i += 2) {
            var y = a[i],
              g = a[i + 1];
            y === "style" ? $f(l, g) : y === "dangerouslySetInnerHTML" ? Vf(l, g) : y === "children" ? cr(l, g) : io(l, y, g, c);
          }
          switch (o) {
            case "input":
              yi(l, u);
              break;
            case "textarea":
              Mf(l, u);
              break;
            case "select":
              var h = l._wrapperState.wasMultiple;
              l._wrapperState.wasMultiple = !!u.multiple;
              var k = u.value;
              k != null ? mt(l, !!u.multiple, k, !1) : h !== !!u.multiple && (u.defaultValue != null ? mt(l, !!u.multiple, u.defaultValue, !0) : mt(l, !!u.multiple, u.multiple ? [] : "", !1));
          }
          l[wr] = u;
        } catch (_) {
          Y(e, e.return, _);
        }
      }
      break;
    case 6:
      if (Oe(n, e), Ae(e), r & 4) {
        if (e.stateNode === null) throw Error(w(162));
        l = e.stateNode, u = e.memoizedProps;
        try {
          l.nodeValue = u;
        } catch (_) {
          Y(e, e.return, _);
        }
      }
      break;
    case 3:
      if (Oe(n, e), Ae(e), r & 4 && t !== null && t.memoizedState.isDehydrated) try {
        mr(n.containerInfo);
      } catch (_) {
        Y(e, e.return, _);
      }
      break;
    case 4:
      Oe(n, e), Ae(e);
      break;
    case 13:
      Oe(n, e), Ae(e), l = e.child, l.flags & 8192 && (u = l.memoizedState !== null, l.stateNode.isHidden = u, !u || l.alternate !== null && l.alternate.memoizedState !== null || (Ao = X())), r & 4 && hf(e);
      break;
    case 22:
      if (y = t !== null && t.memoizedState !== null, e.mode & 1 ? (ie = (c = ie) || y, Oe(n, e), ie = c) : Oe(n, e), Ae(e), r & 8192) {
        if (c = e.memoizedState !== null, (e.stateNode.isHidden = c) && !y && (e.mode & 1) !== 0) for (P = e, y = e.child; y !== null;) {
          for (g = P = y; P !== null;) {
            switch (h = P, k = h.child, h.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                or(4, h, h.return);
                break;
              case 1:
                pt(h, h.return);
                var E = h.stateNode;
                if (typeof E.componentWillUnmount === "function") {
                  r = h, t = h.return;
                  try {
                    n = r, E.props = n.memoizedProps, E.state = n.memoizedState, E.componentWillUnmount();
                  } catch (_) {
                    Y(r, t, _);
                  }
                }
                break;
              case 5:
                pt(h, h.return);
                break;
              case 22:
                if (h.memoizedState !== null) {
                  Sf(g);
                  continue;
                }
            }
            k !== null ? (k.return = h, P = k) : Sf(g);
          }
          y = y.sibling;
        }
        e: for (y = null, g = e;;) {
          if (g.tag === 5) {
            if (y === null) {
              y = g;
              try {
                l = g.stateNode, c ? (u = l.style, typeof u.setProperty === "function" ? u.setProperty("display", "none", "important") : u.display = "none") : (o = g.stateNode, a = g.memoizedProps.style, i = a !== void 0 && a !== null && a.hasOwnProperty("display") ? a.display : null, o.style.display = Uf("display", i));
              } catch (_) {
                Y(e, e.return, _);
              }
            }
          } else if (g.tag === 6) {
            if (y === null) try {
              g.stateNode.nodeValue = c ? "" : g.memoizedProps;
            } catch (_) {
              Y(e, e.return, _);
            }
          } else if ((g.tag !== 22 && g.tag !== 23 || g.memoizedState === null || g === e) && g.child !== null) {
            g.child.return = g, g = g.child;
            continue;
          }
          if (g === e) break e;
          for (; g.sibling === null;) {
            if (g.return === null || g.return === e) break e;
            y === g && (y = null), g = g.return;
          }
          y === g && (y = null), g.sibling.return = g.return, g = g.sibling;
        }
      }
      break;
    case 19:
      Oe(n, e), Ae(e), r & 4 && hf(e);
      break;
    case 21:
      break;
    default:
      Oe(n, e), Ae(e);
  }
}
function Ae(e) {
  var n = e.flags;
  if (n & 2) {
    try {
      e: {
        for (var t = e.return; t !== null;) {
          if (ac(t)) {
            var r = t;
            break e;
          }
          t = t.return;
        }
        throw Error(w(160));
      }
      switch (r.tag) {
        case 5:
          var l = r.stateNode;
          r.flags & 32 && (cr(l, ""), r.flags &= -33);
          var u = yf(e);
          bi(e, u, l);
          break;
        case 3:
        case 4:
          var i = r.stateNode.containerInfo,
            o = yf(e);
          ji(e, o, i);
          break;
        default:
          throw Error(w(161));
      }
    } catch (a) {
      Y(e, e.return, a);
    }
    e.flags &= -3;
  }
  n & 4096 && (e.flags &= -4097);
}
function av(e, n, t) {
  P = e, cc(e, n, t);
}
function cc(e, n, t) {
  for (var r = (e.mode & 1) !== 0; P !== null;) {
    var l = P,
      u = l.child;
    if (l.tag === 22 && r) {
      var i = l.memoizedState !== null || Pl;
      if (!i) {
        var o = l.alternate,
          a = o !== null && o.memoizedState !== null || ie;
        o = Pl;
        var c = ie;
        if (Pl = i, (ie = a) && !c) for (P = l; P !== null;) i = P, a = i.child, i.tag === 22 && i.memoizedState !== null ? wf(l) : a !== null ? (a.return = i, P = a) : wf(l);
        for (; u !== null;) P = u, cc(u, n, t), u = u.sibling;
        P = l, Pl = o, ie = c;
      }
      gf(e, n, t);
    } else (l.subtreeFlags & 8772) !== 0 && u !== null ? (u.return = l, P = u) : gf(e, n, t);
  }
}
function gf(e) {
  for (; P !== null;) {
    var n = P;
    if ((n.flags & 8772) !== 0) {
      var t = n.alternate;
      try {
        if ((n.flags & 8772) !== 0) switch (n.tag) {
          case 0:
          case 11:
          case 15:
            ie || mu(5, n);
            break;
          case 1:
            var r = n.stateNode;
            if (n.flags & 4 && !ie) if (t === null) r.componentDidMount();else {
              var l = n.elementType === n.type ? t.memoizedProps : Re(n.type, t.memoizedProps);
              r.componentDidUpdate(l, t.memoizedState, r.__reactInternalSnapshotBeforeUpdate);
            }
            var u = n.updateQueue;
            u !== null && nf(n, u, r);
            break;
          case 3:
            var i = n.updateQueue;
            if (i !== null) {
              if (t = null, n.child !== null) switch (n.child.tag) {
                case 5:
                  t = n.child.stateNode;
                  break;
                case 1:
                  t = n.child.stateNode;
              }
              nf(n, i, t);
            }
            break;
          case 5:
            var o = n.stateNode;
            if (t === null && n.flags & 4) {
              t = o;
              var a = n.memoizedProps;
              switch (n.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  a.autoFocus && t.focus();
                  break;
                case "img":
                  a.src && (t.src = a.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (n.memoizedState === null) {
              var c = n.alternate;
              if (c !== null) {
                var y = c.memoizedState;
                if (y !== null) {
                  var g = y.dehydrated;
                  g !== null && mr(g);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(w(163));
        }
        ie || n.flags & 512 && Ji(n);
      } catch (h) {
        Y(n, n.return, h);
      }
    }
    if (n === e) {
      P = null;
      break;
    }
    if (t = n.sibling, t !== null) {
      t.return = n.return, P = t;
      break;
    }
    P = n.return;
  }
}
function Sf(e) {
  for (; P !== null;) {
    var n = P;
    if (n === e) {
      P = null;
      break;
    }
    var t = n.sibling;
    if (t !== null) {
      t.return = n.return, P = t;
      break;
    }
    P = n.return;
  }
}
function wf(e) {
  for (; P !== null;) {
    var n = P;
    try {
      switch (n.tag) {
        case 0:
        case 11:
        case 15:
          var t = n.return;
          try {
            mu(4, n);
          } catch (a) {
            Y(n, t, a);
          }
          break;
        case 1:
          var r = n.stateNode;
          if (typeof r.componentDidMount === "function") {
            var l = n.return;
            try {
              r.componentDidMount();
            } catch (a) {
              Y(n, l, a);
            }
          }
          var u = n.return;
          try {
            Ji(n);
          } catch (a) {
            Y(n, u, a);
          }
          break;
        case 5:
          var i = n.return;
          try {
            Ji(n);
          } catch (a) {
            Y(n, i, a);
          }
      }
    } catch (a) {
      Y(n, n.return, a);
    }
    if (n === e) {
      P = null;
      break;
    }
    var o = n.sibling;
    if (o !== null) {
      o.return = n.return, P = o;
      break;
    }
    P = n.return;
  }
}
function se() {
  return (D & 6) !== 0 ? X() : Ll !== -1 ? Ll : Ll = X();
}
function wn(e) {
  if ((e.mode & 1) === 0) return 1;
  if ((D & 2) !== 0 && ne !== 0) return ne & -ne;
  if (X0.transition !== null) return Vl === 0 && (Vl = qf()), Vl;
  if (e = M, e !== 0) return e;
  return e = window.event, e = e === void 0 ? 16 : ts(e.type), e;
}
function Ve(e, n, t, r) {
  if (50 < fr) throw fr = 0, no = null, Error(w(185));
  if (zr(e, t, r), (D & 2) === 0 || e !== b) e === b && ((D & 2) === 0 && (yu |= t), x === 4 && cn(e, ne)), ye(e, r), t === 1 && D === 0 && (n.mode & 1) === 0 && (zt = X() + 500, du && Nn());
}
function ye(e, n) {
  var t = e.callbackNode;
  Zp(e, n);
  var r = Ql(e, e === b ? ne : 0);
  if (r === 0) t !== null && Fa(t), e.callbackNode = null, e.callbackPriority = 0;else if (n = r & -r, e.callbackPriority !== n) {
    if (t != null && Fa(t), n === 1) e.tag === 0 ? Y0(kf.bind(null, e)) : ks(kf.bind(null, e)), Q0(function () {
      (D & 6) === 0 && Nn();
    }), t = null;else {
      switch (xf(r)) {
        case 1:
          t = co;
          break;
        case 4:
          t = Gf;
          break;
        case 16:
          t = Al;
          break;
        case 536870912:
          t = Zf;
          break;
        default:
          t = Al;
      }
      t = Sc(t, dc.bind(null, e));
    }
    e.callbackPriority = n, e.callbackNode = t;
  }
}
function dc(e, n) {
  if (Ll = -1, Vl = 0, (D & 6) !== 0) throw Error(w(327));
  var t = e.callbackNode;
  if (wt() && e.callbackNode !== t) return null;
  var r = Ql(e, e === b ? ne : 0);
  if (r === 0) return null;
  if ((r & 30) !== 0 || (r & e.expiredLanes) !== 0 || n) n = uu(e, r);else {
    n = r;
    var l = D;
    D |= 2;
    var u = vc();
    if (b !== e || ne !== n) Ge = null, zt = X() + 500, Hn(e, n);
    do try {
      dv();
      break;
    } catch (o) {
      pc(e, o);
    } while (1);
    Co(), tu.current = u, D = l, Z !== null ? n = 0 : (b = null, ne = 0, n = x);
  }
  if (n !== 0) {
    if (n === 2 && (l = Ni(e), l !== 0 && (r = l, n = to(e, l))), n === 1) throw t = Nr, Hn(e, 0), cn(e, r), ye(e, X()), t;
    if (n === 6) cn(e, r);else {
      if (l = e.current.alternate, (r & 30) === 0 && !sv(l) && (n = uu(e, r), n === 2 && (u = Ni(e), u !== 0 && (r = u, n = to(e, u))), n === 1)) throw t = Nr, Hn(e, 0), cn(e, r), ye(e, X()), t;
      switch (e.finishedWork = l, e.finishedLanes = r, n) {
        case 0:
        case 1:
          throw Error(w(345));
        case 2:
          Vn(e, de, Ge);
          break;
        case 3:
          if (cn(e, r), (r & 130023424) === r && (n = Ao + 500 - X(), 10 < n)) {
            if (Ql(e, 0) !== 0) break;
            if (l = e.suspendedLanes, (l & r) !== r) {
              se(), e.pingedLanes |= e.suspendedLanes & l;
              break;
            }
            e.timeoutHandle = Ui(Vn.bind(null, e, de, Ge), n);
            break;
          }
          Vn(e, de, Ge);
          break;
        case 4:
          if (cn(e, r), (r & 4194240) === r) break;
          n = e.eventTimes;
          for (l = -1; 0 < r;) {
            var i = 31 - Le(r);
            u = 1 << i, i = n[i], i > l && (l = i), r &= ~u;
          }
          if (r = l, r = X() - r, r = (120 > r ? 120 : 480 > r ? 480 : 1080 > r ? 1080 : 1920 > r ? 1920 : 3000 > r ? 3000 : 4320 > r ? 4320 : 1960 * fv(r / 1960)) - r, 10 < r) {
            e.timeoutHandle = Ui(Vn.bind(null, e, de, Ge), r);
            break;
          }
          Vn(e, de, Ge);
          break;
        case 5:
          Vn(e, de, Ge);
          break;
        default:
          throw Error(w(329));
      }
    }
  }
  return ye(e, X()), e.callbackNode === t ? dc.bind(null, e) : null;
}
function to(e, n) {
  var t = ar;
  return e.current.memoizedState.isDehydrated && (Hn(e, n).flags |= 256), e = uu(e, n), e !== 2 && (n = de, de = t, n !== null && ro(n)), e;
}
function ro(e) {
  de === null ? de = e : de.push.apply(de, e);
}
function sv(e) {
  for (var n = e;;) {
    if (n.flags & 16384) {
      var t = n.updateQueue;
      if (t !== null && (t = t.stores, t !== null)) for (var r = 0; r < t.length; r++) {
        var l = t[r],
          u = l.getSnapshot;
        l = l.value;
        try {
          if (!Ue(u(), l)) return !1;
        } catch (i) {
          return !1;
        }
      }
    }
    if (t = n.child, n.subtreeFlags & 16384 && t !== null) t.return = n, n = t;else {
      if (n === e) break;
      for (; n.sibling === null;) {
        if (n.return === null || n.return === e) return !0;
        n = n.return;
      }
      n.sibling.return = n.return, n = n.sibling;
    }
  }
  return !0;
}
function cn(e, n) {
  n &= ~Ho, n &= ~yu, e.suspendedLanes |= n, e.pingedLanes &= ~n;
  for (e = e.expirationTimes; 0 < n;) {
    var t = 31 - Le(n),
      r = 1 << t;
    e[t] = -1, n &= ~r;
  }
}
function kf(e) {
  if ((D & 6) !== 0) throw Error(w(327));
  wt();
  var n = Ql(e, 0);
  if ((n & 1) === 0) return ye(e, X()), null;
  var t = uu(e, n);
  if (e.tag !== 0 && t === 2) {
    var r = Ni(e);
    r !== 0 && (n = r, t = to(e, r));
  }
  if (t === 1) throw t = Nr, Hn(e, 0), cn(e, n), ye(e, X()), t;
  if (t === 6) throw Error(w(345));
  return e.finishedWork = e.current.alternate, e.finishedLanes = n, Vn(e, de, Ge), ye(e, X()), null;
}
function Qo(e, n) {
  var t = D;
  D |= 1;
  try {
    return e(n);
  } finally {
    D = t, D === 0 && (zt = X() + 500, du && Nn());
  }
}
function Yn(e) {
  pn !== null && pn.tag === 0 && (D & 6) === 0 && wt();
  var n = D;
  D |= 1;
  var t = Ne.transition,
    r = M;
  try {
    if (Ne.transition = null, M = 1, e) return e();
  } finally {
    M = r, Ne.transition = t, D = n, (D & 6) === 0 && Nn();
  }
}
function Io() {
  he = vt.current, $(vt);
}
function Hn(e, n) {
  e.finishedWork = null, e.finishedLanes = 0;
  var t = e.timeoutHandle;
  if (t !== -1 && (e.timeoutHandle = -1, A0(t)), Z !== null) for (t = Z.return; t !== null;) {
    var r = t;
    switch (Eo(r), r.tag) {
      case 1:
        r = r.type.childContextTypes, r !== null && r !== void 0 && Xl();
        break;
      case 3:
        Ct(), $(ve), $(oe), Ro();
        break;
      case 5:
        Oo(r);
        break;
      case 4:
        Ct();
        break;
      case 13:
        $(I);
        break;
      case 19:
        $(I);
        break;
      case 10:
        No(r.type._context);
        break;
      case 22:
      case 23:
        Io();
    }
    t = t.return;
  }
  if (b = e, Z = e = kn(e.current, null), ne = he = n, x = 0, Nr = null, Ho = yu = Kn = 0, de = ar = null, $n !== null) {
    for (n = 0; n < $n.length; n++) if (t = $n[n], r = t.interleaved, r !== null) {
      t.interleaved = null;
      var l = r.next,
        u = t.pending;
      if (u !== null) {
        var i = u.next;
        u.next = l, r.next = i;
      }
      t.pending = r;
    }
    $n = null;
  }
  return e;
}
function pc(e, n) {
  do {
    var t = Z;
    try {
      if (Co(), Rl.current = nu, eu) {
        for (var r = W.memoizedState; r !== null;) {
          var l = r.queue;
          l !== null && (l.pending = null), r = r.next;
        }
        eu = !1;
      }
      if (Wn = 0, j = q = W = null, ir = !1, _r = 0, Bo.current = null, t === null || t.return === null) {
        x = 1, Nr = n, Z = null;
        break;
      }
      e: {
        var u = e,
          i = t.return,
          o = t,
          a = n;
        if (n = ne, o.flags |= 32768, a !== null && typeof a === "object" && typeof a.then === "function") {
          var c = a,
            y = o,
            g = y.tag;
          if ((y.mode & 1) === 0 && (g === 0 || g === 11 || g === 15)) {
            var h = y.alternate;
            h ? (y.updateQueue = h.updateQueue, y.memoizedState = h.memoizedState, y.lanes = h.lanes) : (y.updateQueue = null, y.memoizedState = null);
          }
          var k = af(i);
          if (k !== null) {
            k.flags &= -257, ff(k, i, o, u, n), k.mode & 1 && of(u, c, n), n = k, a = c;
            var E = n.updateQueue;
            if (E === null) {
              var _ = new Set();
              _.add(a), n.updateQueue = _;
            } else E.add(a);
            break e;
          } else {
            if ((n & 1) === 0) {
              of(u, c, n), Wo();
              break e;
            }
            a = Error(w(426));
          }
        } else if (B && o.mode & 1) {
          var Q = af(i);
          if (Q !== null) {
            (Q.flags & 65536) === 0 && (Q.flags |= 256), ff(Q, i, o, u, n), _o(Nt(a, o));
            break e;
          }
        }
        u = a = Nt(a, o), x !== 4 && (x = 2), ar === null ? ar = [u] : ar.push(u), u = i;
        do {
          switch (u.tag) {
            case 3:
              u.flags |= 65536, n &= -n, u.lanes |= n;
              var d = xs(u, a, n);
              ef(u, d);
              break e;
            case 1:
              o = a;
              var {
                type: s,
                stateNode: v
              } = u;
              if ((u.flags & 128) === 0 && (typeof s.getDerivedStateFromError === "function" || v !== null && typeof v.componentDidCatch === "function" && (Sn === null || !Sn.has(v)))) {
                u.flags |= 65536, n &= -n, u.lanes |= n;
                var S = Js(u, o, n);
                ef(u, S);
                break e;
              }
          }
          u = u.return;
        } while (u !== null);
      }
      yc(t);
    } catch (N) {
      n = N, Z === t && t !== null && (Z = t = t.return);
      continue;
    }
    break;
  } while (1);
}
function vc() {
  var e = tu.current;
  return tu.current = nu, e === null ? nu : e;
}
function Wo() {
  if (x === 0 || x === 3 || x === 2) x = 4;
  b === null || (Kn & 268435455) === 0 && (yu & 268435455) === 0 || cn(b, ne);
}
function uu(e, n) {
  var t = D;
  D |= 2;
  var r = vc();
  if (b !== e || ne !== n) Ge = null, Hn(e, n);
  do try {
    cv();
    break;
  } catch (l) {
    pc(e, l);
  } while (1);
  if (Co(), D = t, tu.current = r, Z !== null) throw Error(w(261));
  return b = null, ne = 0, x;
}
function cv() {
  for (; Z !== null;) mc(Z);
}
function dv() {
  for (; Z !== null && !Hp();) mc(Z);
}
function mc(e) {
  var n = gc(e.alternate, e, he);
  e.memoizedProps = e.pendingProps, n === null ? yc(e) : Z = n, Bo.current = null;
}
function yc(e) {
  var n = e;
  do {
    var t = n.alternate;
    if (e = n.return, (n.flags & 32768) === 0) {
      if (t = lv(t, n, he), t !== null) {
        Z = t;
        return;
      }
    } else {
      if (t = uv(t, n), t !== null) {
        t.flags &= 32767, Z = t;
        return;
      }
      if (e !== null) e.flags |= 32768, e.subtreeFlags = 0, e.deletions = null;else {
        x = 6, Z = null;
        return;
      }
    }
    if (n = n.sibling, n !== null) {
      Z = n;
      return;
    }
    Z = n = e;
  } while (n !== null);
  x === 0 && (x = 5);
}
function Vn(e, n, t) {
  var r = M,
    l = Ne.transition;
  try {
    Ne.transition = null, M = 1, pv(e, n, t, r);
  } finally {
    Ne.transition = l, M = r;
  }
  return null;
}
function pv(e, n, t, r) {
  do wt(); while (pn !== null);
  if ((D & 6) !== 0) throw Error(w(327));
  t = e.finishedWork;
  var l = e.finishedLanes;
  if (t === null) return null;
  if (e.finishedWork = null, e.finishedLanes = 0, t === e.current) throw Error(w(177));
  e.callbackNode = null, e.callbackPriority = 0;
  var u = t.lanes | t.childLanes;
  if (qp(e, u), e === b && (Z = b = null, ne = 0), (t.subtreeFlags & 2064) === 0 && (t.flags & 2064) === 0 || Cl || (Cl = !0, Sc(Al, function () {
    return wt(), null;
  })), u = (t.flags & 15990) !== 0, (t.subtreeFlags & 15990) !== 0 || u) {
    u = Ne.transition, Ne.transition = null;
    var i = M;
    M = 1;
    var o = D;
    D |= 4, Bo.current = null, ov(e, t), sc(t, e), V0(Li), Il = !!Mi, Li = Mi = null, e.current = t, av(t, e, l), Ap(), D = o, M = i, Ne.transition = u;
  } else e.current = t;
  if (Cl && (Cl = !1, pn = e, lu = l), u = e.pendingLanes, u === 0 && (Sn = null), Wp(t.stateNode, r), ye(e, X()), n !== null) for (r = e.onRecoverableError, t = 0; t < n.length; t++) l = n[t], r(l.value, {
    componentStack: l.stack,
    digest: l.digest
  });
  if (ru) throw ru = !1, e = eo, eo = null, e;
  return (lu & 1) !== 0 && e.tag !== 0 && wt(), u = e.pendingLanes, (u & 1) !== 0 ? e === no ? fr++ : (fr = 0, no = e) : fr = 0, Nn(), null;
}
function wt() {
  if (pn !== null) {
    var e = xf(lu),
      n = Ne.transition,
      t = M;
    try {
      if (Ne.transition = null, M = 16 > e ? 16 : e, pn === null) var r = !1;else {
        if (e = pn, pn = null, lu = 0, (D & 6) !== 0) throw Error(w(331));
        var l = D;
        D |= 4;
        for (P = e.current; P !== null;) {
          var u = P,
            i = u.child;
          if ((P.flags & 16) !== 0) {
            var o = u.deletions;
            if (o !== null) {
              for (var a = 0; a < o.length; a++) {
                var c = o[a];
                for (P = c; P !== null;) {
                  var y = P;
                  switch (y.tag) {
                    case 0:
                    case 11:
                    case 15:
                      or(8, y, u);
                  }
                  var g = y.child;
                  if (g !== null) g.return = y, P = g;else for (; P !== null;) {
                    y = P;
                    var {
                      sibling: h,
                      return: k
                    } = y;
                    if (oc(y), y === c) {
                      P = null;
                      break;
                    }
                    if (h !== null) {
                      h.return = k, P = h;
                      break;
                    }
                    P = k;
                  }
                }
              }
              var E = u.alternate;
              if (E !== null) {
                var _ = E.child;
                if (_ !== null) {
                  E.child = null;
                  do {
                    var Q = _.sibling;
                    _.sibling = null, _ = Q;
                  } while (_ !== null);
                }
              }
              P = u;
            }
          }
          if ((u.subtreeFlags & 2064) !== 0 && i !== null) i.return = u, P = i;else e: for (; P !== null;) {
            if (u = P, (u.flags & 2048) !== 0) switch (u.tag) {
              case 0:
              case 11:
              case 15:
                or(9, u, u.return);
            }
            var d = u.sibling;
            if (d !== null) {
              d.return = u.return, P = d;
              break e;
            }
            P = u.return;
          }
        }
        var s = e.current;
        for (P = s; P !== null;) {
          i = P;
          var v = i.child;
          if ((i.subtreeFlags & 2064) !== 0 && v !== null) v.return = i, P = v;else e: for (i = s; P !== null;) {
            if (o = P, (o.flags & 2048) !== 0) try {
              switch (o.tag) {
                case 0:
                case 11:
                case 15:
                  mu(9, o);
              }
            } catch (N) {
              Y(o, o.return, N);
            }
            if (o === i) {
              P = null;
              break e;
            }
            var S = o.sibling;
            if (S !== null) {
              S.return = o.return, P = S;
              break e;
            }
            P = o.return;
          }
        }
        if (D = l, Nn(), We && typeof We.onPostCommitFiberRoot === "function") try {
          We.onPostCommitFiberRoot(ou, e);
        } catch (N) {}
        r = !0;
      }
      return r;
    } finally {
      M = t, Ne.transition = n;
    }
  }
  return !1;
}
function Ef(e, n, t) {
  n = Nt(t, n), n = xs(e, n, 1), e = gn(e, n, 1), n = se(), e !== null && (zr(e, 1, n), ye(e, n));
}
function Y(e, n, t) {
  if (e.tag === 3) Ef(e, e, t);else for (; n !== null;) {
    if (n.tag === 3) {
      Ef(n, e, t);
      break;
    } else if (n.tag === 1) {
      var r = n.stateNode;
      if (typeof n.type.getDerivedStateFromError === "function" || typeof r.componentDidCatch === "function" && (Sn === null || !Sn.has(r))) {
        e = Nt(t, e), e = Js(n, e, 1), n = gn(n, e, 1), e = se(), n !== null && (zr(n, 1, e), ye(n, e));
        break;
      }
    }
    n = n.return;
  }
}
function vv(e, n, t) {
  var r = e.pingCache;
  r !== null && r.delete(n), n = se(), e.pingedLanes |= e.suspendedLanes & t, b === e && (ne & t) === t && (x === 4 || x === 3 && (ne & 130023424) === ne && 500 > X() - Ao ? Hn(e, 0) : Ho |= t), ye(e, n);
}
function hc(e, n) {
  n === 0 && ((e.mode & 1) === 0 ? n = 1 : (n = ml, ml <<= 1, (ml & 130023424) === 0 && (ml = 4194304)));
  var t = se();
  e = en(e, n), e !== null && (zr(e, n, t), ye(e, t));
}
function mv(e) {
  var n = e.memoizedState,
    t = 0;
  n !== null && (t = n.retryLane), hc(e, t);
}
function yv(e, n) {
  var t = 0;
  switch (e.tag) {
    case 13:
      var {
        stateNode: r,
        memoizedState: l
      } = e;
      l !== null && (t = l.retryLane);
      break;
    case 19:
      r = e.stateNode;
      break;
    default:
      throw Error(w(314));
  }
  r !== null && r.delete(n), hc(e, t);
}
function Sc(e, n) {
  return Xf(e, n);
}
function hv(e, n, t, r) {
  this.tag = e, this.key = t, this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null, this.index = 0, this.ref = null, this.pendingProps = n, this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null, this.mode = r, this.subtreeFlags = this.flags = 0, this.deletions = null, this.childLanes = this.lanes = 0, this.alternate = null;
}
function Ce(e, n, t, r) {
  return new hv(e, n, t, r);
}
function Ko(e) {
  return e = e.prototype, !(!e || !e.isReactComponent);
}
function gv(e) {
  if (typeof e === "function") return Ko(e) ? 1 : 0;
  if (e !== void 0 && e !== null) {
    if (e = e.$$typeof, e === ao) return 11;
    if (e === fo) return 14;
  }
  return 2;
}
function kn(e, n) {
  var t = e.alternate;
  return t === null ? (t = Ce(e.tag, n, e.key, e.mode), t.elementType = e.elementType, t.type = e.type, t.stateNode = e.stateNode, t.alternate = e, e.alternate = t) : (t.pendingProps = n, t.type = e.type, t.flags = 0, t.subtreeFlags = 0, t.deletions = null), t.flags = e.flags & 14680064, t.childLanes = e.childLanes, t.lanes = e.lanes, t.child = e.child, t.memoizedProps = e.memoizedProps, t.memoizedState = e.memoizedState, t.updateQueue = e.updateQueue, n = e.dependencies, t.dependencies = n === null ? null : {
    lanes: n.lanes,
    firstContext: n.firstContext
  }, t.sibling = e.sibling, t.index = e.index, t.ref = e.ref, t;
}
function Ul(e, n, t, r, l, u) {
  var i = 2;
  if (r = e, typeof e === "function") Ko(e) && (i = 1);else if (typeof e === "string") i = 5;else e: switch (e) {
    case lt:
      return An(t.children, l, u, n);
    case oo:
      i = 8, l |= 8;
      break;
    case ci:
      return e = Ce(12, t, n, l | 2), e.elementType = ci, e.lanes = u, e;
    case di:
      return e = Ce(13, t, n, l), e.elementType = di, e.lanes = u, e;
    case pi:
      return e = Ce(19, t, n, l), e.elementType = pi, e.lanes = u, e;
    case Ff:
      return hu(t, l, u, n);
    default:
      if (typeof e === "object" && e !== null) switch (e.$$typeof) {
        case zf:
          i = 10;
          break e;
        case Tf:
          i = 9;
          break e;
        case ao:
          i = 11;
          break e;
        case fo:
          i = 14;
          break e;
        case an:
          i = 16, r = null;
          break e;
      }
      throw Error(w(130, e == null ? e : typeof e, ""));
  }
  return n = Ce(i, t, n, l), n.elementType = e, n.type = r, n.lanes = u, n;
}
function An(e, n, t, r) {
  return e = Ce(7, e, r, n), e.lanes = t, e;
}
function hu(e, n, t, r) {
  return e = Ce(22, e, r, n), e.elementType = Ff, e.lanes = t, e.stateNode = {
    isHidden: !1
  }, e;
}
function ai(e, n, t) {
  return e = Ce(6, e, null, n), e.lanes = t, e;
}
function fi(e, n, t) {
  return n = Ce(4, e.children !== null ? e.children : [], e.key, n), n.lanes = t, n.stateNode = {
    containerInfo: e.containerInfo,
    pendingChildren: null,
    implementation: e.implementation
  }, n;
}
function Sv(e, n, t, r, l) {
  this.tag = n, this.containerInfo = e, this.finishedWork = this.pingCache = this.current = this.pendingChildren = null, this.timeoutHandle = -1, this.callbackNode = this.pendingContext = this.context = null, this.callbackPriority = 0, this.eventTimes = Gu(0), this.expirationTimes = Gu(-1), this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0, this.entanglements = Gu(0), this.identifierPrefix = r, this.onRecoverableError = l, this.mutableSourceEagerHydrationData = null;
}
function Yo(e, n, t, r, l, u, i, o, a) {
  return e = new Sv(e, n, t, o, a), n === 1 ? (n = 1, u === !0 && (n |= 8)) : n = 0, u = Ce(3, null, null, n), e.current = u, u.stateNode = e, u.memoizedState = {
    element: r,
    isDehydrated: t,
    cache: null,
    transitions: null,
    pendingSuspenseBoundaries: null
  }, To(u), e;
}
function wv(e, n, t) {
  var r = 3 < arguments.length && arguments[3] !== void 0 ? arguments[3] : null;
  return {
    $$typeof: rt,
    key: r == null ? null : "" + r,
    children: e,
    containerInfo: n,
    implementation: t
  };
}
function wc(e) {
  if (!e) return _n;
  e = e._reactInternals;
  e: {
    if (Gn(e) !== e || e.tag !== 1) throw Error(w(170));
    var n = e;
    do {
      switch (n.tag) {
        case 3:
          n = n.stateNode.context;
          break e;
        case 1:
          if (me(n.type)) {
            n = n.stateNode.__reactInternalMemoizedMergedChildContext;
            break e;
          }
      }
      n = n.return;
    } while (n !== null);
    throw Error(w(171));
  }
  if (e.tag === 1) {
    var t = e.type;
    if (me(t)) return ws(e, t, n);
  }
  return n;
}
function kc(e, n, t, r, l, u, i, o, a) {
  return e = Yo(t, r, !0, e, l, u, i, o, a), e.context = wc(null), t = e.current, r = se(), l = wn(t), u = Je(r, l), u.callback = n !== void 0 && n !== null ? n : null, gn(t, u, l), e.current.lanes = l, zr(e, l, r), ye(e, r), e;
}
function gu(e, n, t, r) {
  var l = n.current,
    u = se(),
    i = wn(l);
  return t = wc(t), n.context === null ? n.context = t : n.pendingContext = t, n = Je(u, i), n.payload = {
    element: e
  }, r = r === void 0 ? null : r, r !== null && (n.callback = r), e = gn(l, n, i), e !== null && (Ve(e, l, i, u), Ol(e, l, i)), i;
}
function iu(e) {
  if (e = e.current, !e.child) return null;
  switch (e.child.tag) {
    case 5:
      return e.child.stateNode;
    default:
      return e.child.stateNode;
  }
}
function _f(e, n) {
  if (e = e.memoizedState, e !== null && e.dehydrated !== null) {
    var t = e.retryLane;
    e.retryLane = t !== 0 && t < n ? t : n;
  }
}
function Xo(e, n) {
  _f(e, n), (e = e.alternate) && _f(e, n);
}
function kv() {
  return null;
}
function Go(e) {
  this._internalRoot = e;
}
function Su(e) {
  this._internalRoot = e;
}
function Zo(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11);
}
function wu(e) {
  return !(!e || e.nodeType !== 1 && e.nodeType !== 9 && e.nodeType !== 11 && (e.nodeType !== 8 || e.nodeValue !== " react-mount-point-unstable "));
}
function Pf() {}
function Ev(e, n, t, r, l) {
  if (l) {
    if (typeof r === "function") {
      var u = r;
      r = function () {
        var c = iu(i);
        u.call(c);
      };
    }
    var i = kc(n, r, e, 0, null, !1, !1, "", Pf);
    return e._reactRootContainer = i, e[be] = i.current, gr(e.nodeType === 8 ? e.parentNode : e), Yn(), i;
  }
  for (; l = e.lastChild;) e.removeChild(l);
  if (typeof r === "function") {
    var o = r;
    r = function () {
      var c = iu(a);
      o.call(c);
    };
  }
  var a = Yo(e, 0, !1, null, null, !1, !1, "", Pf);
  return e._reactRootContainer = a, e[be] = a.current, gr(e.nodeType === 8 ? e.parentNode : e), Yn(function () {
    gu(n, a, t, r);
  }), a;
}
function ku(e, n, t, r, l) {
  var u = t._reactRootContainer;
  if (u) {
    var i = u;
    if (typeof l === "function") {
      var o = l;
      l = function () {
        var a = iu(i);
        o.call(a);
      };
    }
    gu(n, i, e, l);
  } else i = Ev(t, n, e, l, r);
  return iu(i);
}
var Cf,
  H,
  Nf,
  sr,
  je,
  si,
  Cp,
  wa,
  ka,
  te,
  lo,
  tn,
  cl,
  rt,
  lt,
  oo,
  ci,
  zf,
  Tf,
  ao,
  di,
  pi,
  fo,
  an,
  Ff,
  Ea,
  K,
  Wu,
  Ku = !1,
  Zt,
  pl,
  Vf,
  nr,
  Dp,
  Mp,
  Ei = null,
  _i = null,
  yt = null,
  ht = null,
  Xu = !1,
  Pi = !1,
  Mn,
  tr = !1,
  Bl = null,
  Hl = !1,
  Ci = null,
  Vp,
  Xf,
  Fa,
  Hp,
  Ap,
  X,
  Qp,
  co,
  Gf,
  Al,
  Ip,
  Zf,
  ou = null,
  We = null,
  Le,
  Kp,
  Yp,
  vl = 64,
  ml = 4194304,
  M = 0,
  Jf,
  vo,
  jf,
  bf,
  es,
  zi = !1,
  yl,
  vn = null,
  mn = null,
  yn = null,
  pr,
  vr,
  sn,
  xp,
  gt,
  Il = !0,
  Wl = null,
  dn = null,
  yo = null,
  zl = null,
  Tt,
  ho,
  Tr,
  n0,
  Zu,
  qu,
  Wt,
  au,
  Ma,
  t0,
  r0,
  l0,
  xu,
  u0,
  i0,
  o0,
  a0,
  f0,
  La,
  s0,
  c0,
  d0,
  v0,
  m0,
  y0,
  Va,
  h0,
  g0,
  S0,
  w0,
  k0,
  E0,
  _0,
  So,
  rr = null,
  P0,
  ls,
  Ua,
  $a = !1,
  ut = !1,
  z0,
  lr = null,
  yr = null,
  as = !1,
  xt,
  Jt,
  Fl,
  Ue,
  U0,
  it = null,
  Fi = null,
  ur = null,
  Oi = !1,
  ot,
  Ju,
  ds,
  ps,
  vs,
  ms,
  ys,
  hs,
  Wa,
  bt,
  Ri,
  Di,
  jt,
  er,
  $0,
  Sl,
  B0,
  H0,
  Mi = null,
  Li = null,
  Ui,
  A0,
  Ga,
  Q0,
  Ft,
  Ie,
  wr,
  be,
  $i,
  W0,
  K0,
  Bi,
  ft = -1,
  _n,
  oe,
  ve,
  Qn,
  Ze = null,
  du = !1,
  ni = !1,
  st,
  ct = 0,
  Zl = null,
  ql = 0,
  _e,
  Pe = 0,
  In = null,
  qe = 1,
  xe = "",
  Se = null,
  ge = null,
  B = !1,
  Me = null,
  X0,
  Pt,
  Ns,
  xl,
  Jl = null,
  dt = null,
  Po = null,
  $n = null,
  fn = !1,
  Or,
  Ke,
  kr,
  Er,
  I,
  ti,
  Rl,
  ri,
  Wn = 0,
  W = null,
  q = null,
  j = null,
  eu = !1,
  ir = !1,
  _r = 0,
  G0 = 0,
  nu,
  J0,
  j0,
  b0,
  vu,
  ev,
  nv,
  pe = !1,
  Gi,
  lc,
  qi,
  uc,
  ic,
  Pl = !1,
  ie = !1,
  iv,
  P = null,
  mf = !1,
  ee = null,
  De = !1,
  fv,
  tu,
  Bo,
  Ne,
  D = 0,
  b = null,
  Z = null,
  ne = 0,
  he = 0,
  vt,
  x = 0,
  Nr = null,
  Kn = 0,
  yu = 0,
  Ho = 0,
  ar = null,
  de = null,
  Ao = 0,
  zt = 1 / 0,
  Ge = null,
  ru = !1,
  eo = null,
  Sn = null,
  Cl = !1,
  pn = null,
  lu = 0,
  fr = 0,
  no = null,
  Ll = -1,
  Vl = 0,
  gc,
  Ec,
  _v,
  Xt,
  Pv,
  tt,
  _c,
  Pc = function (e, n) {
    var t = 2 < arguments.length && arguments[2] !== void 0 ? arguments[2] : null;
    if (!Zo(n)) throw Error(w(200));
    return wv(e, n, null, t);
  },
  Cc = function (e, n) {
    if (!Zo(e)) throw Error(w(299));
    var t = !1,
      r = "",
      l = Ec;
    return n !== null && n !== void 0 && (n.unstable_strictMode === !0 && (t = !0), n.identifierPrefix !== void 0 && (r = n.identifierPrefix), n.onRecoverableError !== void 0 && (l = n.onRecoverableError)), n = Yo(e, 1, !1, null, null, t, !1, r, l), e[be] = n.current, gr(e.nodeType === 8 ? e.parentNode : e), new Go(n);
  },
  Nc = function (e) {
    if (e == null) return null;
    if (e.nodeType === 1) return e;
    var n = e._reactInternals;
    if (n === void 0) {
      if (typeof e.render === "function") throw Error(w(188));
      throw e = Object.keys(e).join(","), Error(w(268, e));
    }
    return e = Kf(n), e = e === null ? null : e.stateNode, e;
  },
  zc = function (e) {
    return Yn(e);
  },
  Tc = function (e, n, t) {
    if (!wu(n)) throw Error(w(200));
    return ku(null, e, n, !0, t);
  },
  Fc = function (e, n, t) {
    if (!Zo(e)) throw Error(w(405));
    var r = t != null && t.hydratedSources || null,
      l = !1,
      u = "",
      i = Ec;
    if (t !== null && t !== void 0 && (t.unstable_strictMode === !0 && (l = !0), t.identifierPrefix !== void 0 && (u = t.identifierPrefix), t.onRecoverableError !== void 0 && (i = t.onRecoverableError)), n = kc(n, null, e, 1, t != null ? t : null, l, !1, u, i), e[be] = n.current, gr(e), r) for (e = 0; e < r.length; e++) t = r[e], l = t._getVersion, l = l(t._source), n.mutableSourceEagerHydrationData == null ? n.mutableSourceEagerHydrationData = [t, l] : n.mutableSourceEagerHydrationData.push(t, l);
    return new Su(n);
  },
  Oc = function (e, n, t) {
    if (!wu(n)) throw Error(w(200));
    return ku(null, e, n, !1, t);
  },
  Rc = function (e) {
    if (!wu(e)) throw Error(w(40));
    return e._reactRootContainer ? (Yn(function () {
      ku(null, null, e, !1, function () {
        e._reactRootContainer = null, e[be] = null;
      });
    }), !0) : !1;
  },
  Dc,
  Mc = function (e, n, t, r) {
    if (!wu(t)) throw Error(w(200));
    if (e == null || e._reactInternals === void 0) throw Error(w(38));
    return ku(e, n, t, !1, r);
  },
  Lc = "18.3.1-next-f1338f8080-20240426";
var Vc = id(() => {
  Cf = Xe(Rn(), 1), H = Xe(Sa(), 1);
  Nf = new Set(), sr = {};
  je = !(typeof window > "u" || typeof window.document > "u" || typeof window.document.createElement > "u"), si = Object.prototype.hasOwnProperty, Cp = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, wa = {}, ka = {};
  te = {};
  "children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function (e) {
    te[e] = new ce(e, 0, !1, e, null, !1, !1);
  });
  [["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function (e) {
    var n = e[0];
    te[n] = new ce(n, 1, !1, e[1], null, !1, !1);
  });
  ["contentEditable", "draggable", "spellCheck", "value"].forEach(function (e) {
    te[e] = new ce(e, 2, !1, e.toLowerCase(), null, !1, !1);
  });
  ["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function (e) {
    te[e] = new ce(e, 2, !1, e, null, !1, !1);
  });
  "allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function (e) {
    te[e] = new ce(e, 3, !1, e.toLowerCase(), null, !1, !1);
  });
  ["checked", "multiple", "muted", "selected"].forEach(function (e) {
    te[e] = new ce(e, 3, !0, e, null, !1, !1);
  });
  ["capture", "download"].forEach(function (e) {
    te[e] = new ce(e, 4, !1, e, null, !1, !1);
  });
  ["cols", "rows", "size", "span"].forEach(function (e) {
    te[e] = new ce(e, 6, !1, e, null, !1, !1);
  });
  ["rowSpan", "start"].forEach(function (e) {
    te[e] = new ce(e, 5, !1, e.toLowerCase(), null, !1, !1);
  });
  lo = /[\-:]([a-z])/g;
  "accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function (e) {
    var n = e.replace(lo, uo);
    te[n] = new ce(n, 1, !1, e, null, !1, !1);
  });
  "xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function (e) {
    var n = e.replace(lo, uo);
    te[n] = new ce(n, 1, !1, e, "http://www.w3.org/1999/xlink", !1, !1);
  });
  ["xml:base", "xml:lang", "xml:space"].forEach(function (e) {
    var n = e.replace(lo, uo);
    te[n] = new ce(n, 1, !1, e, "http://www.w3.org/XML/1998/namespace", !1, !1);
  });
  ["tabIndex", "crossOrigin"].forEach(function (e) {
    te[e] = new ce(e, 1, !1, e.toLowerCase(), null, !1, !1);
  });
  te.xlinkHref = new ce("xlinkHref", 1, !1, "xlink:href", "http://www.w3.org/1999/xlink", !0, !1);
  ["src", "href", "action", "formAction"].forEach(function (e) {
    te[e] = new ce(e, 1, !1, e.toLowerCase(), null, !0, !0);
  });
  tn = Cf.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, cl = Symbol.for("react.element"), rt = Symbol.for("react.portal"), lt = Symbol.for("react.fragment"), oo = Symbol.for("react.strict_mode"), ci = Symbol.for("react.profiler"), zf = Symbol.for("react.provider"), Tf = Symbol.for("react.context"), ao = Symbol.for("react.forward_ref"), di = Symbol.for("react.suspense"), pi = Symbol.for("react.suspense_list"), fo = Symbol.for("react.memo"), an = Symbol.for("react.lazy"), Ff = Symbol.for("react.offscreen"), Ea = Symbol.iterator;
  K = Object.assign;
  Zt = Array.isArray;
  Vf = function (e) {
    return typeof MSApp < "u" && MSApp.execUnsafeLocalFunction ? function (n, t, r, l) {
      MSApp.execUnsafeLocalFunction(function () {
        return e(n, t, r, l);
      });
    } : e;
  }(function (e, n) {
    if (e.namespaceURI !== "http://www.w3.org/2000/svg" || "innerHTML" in e) e.innerHTML = n;else {
      pl = pl || document.createElement("div"), pl.innerHTML = "<svg>" + n.valueOf().toString() + "</svg>";
      for (n = pl.firstChild; e.firstChild;) e.removeChild(e.firstChild);
      for (; n.firstChild;) e.appendChild(n.firstChild);
    }
  });
  nr = {
    animationIterationCount: !0,
    aspectRatio: !0,
    borderImageOutset: !0,
    borderImageSlice: !0,
    borderImageWidth: !0,
    boxFlex: !0,
    boxFlexGroup: !0,
    boxOrdinalGroup: !0,
    columnCount: !0,
    columns: !0,
    flex: !0,
    flexGrow: !0,
    flexPositive: !0,
    flexShrink: !0,
    flexNegative: !0,
    flexOrder: !0,
    gridArea: !0,
    gridRow: !0,
    gridRowEnd: !0,
    gridRowSpan: !0,
    gridRowStart: !0,
    gridColumn: !0,
    gridColumnEnd: !0,
    gridColumnSpan: !0,
    gridColumnStart: !0,
    fontWeight: !0,
    lineClamp: !0,
    lineHeight: !0,
    opacity: !0,
    order: !0,
    orphans: !0,
    tabSize: !0,
    widows: !0,
    zIndex: !0,
    zoom: !0,
    fillOpacity: !0,
    floodOpacity: !0,
    stopOpacity: !0,
    strokeDasharray: !0,
    strokeDashoffset: !0,
    strokeMiterlimit: !0,
    strokeOpacity: !0,
    strokeWidth: !0
  }, Dp = ["Webkit", "ms", "Moz", "O"];
  Object.keys(nr).forEach(function (e) {
    Dp.forEach(function (n) {
      n = n + e.charAt(0).toUpperCase() + e.substring(1), nr[n] = nr[e];
    });
  });
  Mp = K({
    menuitem: !0
  }, {
    area: !0,
    base: !0,
    br: !0,
    col: !0,
    embed: !0,
    hr: !0,
    img: !0,
    input: !0,
    keygen: !0,
    link: !0,
    meta: !0,
    param: !0,
    source: !0,
    track: !0,
    wbr: !0
  });
  if (je) try {
    Mn = {}, Object.defineProperty(Mn, "passive", {
      get: function () {
        Pi = !0;
      }
    }), window.addEventListener("test", Mn, Mn), window.removeEventListener("test", Mn, Mn);
  } catch (e) {
    Pi = !1;
  }
  Vp = {
    onError: function (e) {
      tr = !0, Bl = e;
    }
  };
  Xf = H.unstable_scheduleCallback, Fa = H.unstable_cancelCallback, Hp = H.unstable_shouldYield, Ap = H.unstable_requestPaint, X = H.unstable_now, Qp = H.unstable_getCurrentPriorityLevel, co = H.unstable_ImmediatePriority, Gf = H.unstable_UserBlockingPriority, Al = H.unstable_NormalPriority, Ip = H.unstable_LowPriority, Zf = H.unstable_IdlePriority;
  Le = Math.clz32 ? Math.clz32 : Xp, Kp = Math.log, Yp = Math.LN2;
  yl = [], pr = new Map(), vr = new Map(), sn = [], xp = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
  gt = tn.ReactCurrentBatchConfig;
  Tt = {
    eventPhase: 0,
    bubbles: 0,
    cancelable: 0,
    timeStamp: function (e) {
      return e.timeStamp || Date.now();
    },
    defaultPrevented: 0,
    isTrusted: 0
  }, ho = we(Tt), Tr = K({}, Tt, {
    view: 0,
    detail: 0
  }), n0 = we(Tr), au = K({}, Tr, {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    pageX: 0,
    pageY: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    getModifierState: go,
    button: 0,
    buttons: 0,
    relatedTarget: function (e) {
      return e.relatedTarget === void 0 ? e.fromElement === e.srcElement ? e.toElement : e.fromElement : e.relatedTarget;
    },
    movementX: function (e) {
      if ("movementX" in e) return e.movementX;
      return e !== Wt && (Wt && e.type === "mousemove" ? (Zu = e.screenX - Wt.screenX, qu = e.screenY - Wt.screenY) : qu = Zu = 0, Wt = e), Zu;
    },
    movementY: function (e) {
      return "movementY" in e ? e.movementY : qu;
    }
  }), Ma = we(au), t0 = K({}, au, {
    dataTransfer: 0
  }), r0 = we(t0), l0 = K({}, Tr, {
    relatedTarget: 0
  }), xu = we(l0), u0 = K({}, Tt, {
    animationName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), i0 = we(u0), o0 = K({}, Tt, {
    clipboardData: function (e) {
      return "clipboardData" in e ? e.clipboardData : window.clipboardData;
    }
  }), a0 = we(o0), f0 = K({}, Tt, {
    data: 0
  }), La = we(f0), s0 = {
    Esc: "Escape",
    Spacebar: " ",
    Left: "ArrowLeft",
    Up: "ArrowUp",
    Right: "ArrowRight",
    Down: "ArrowDown",
    Del: "Delete",
    Win: "OS",
    Menu: "ContextMenu",
    Apps: "ContextMenu",
    Scroll: "ScrollLock",
    MozPrintableKey: "Unidentified"
  }, c0 = {
    8: "Backspace",
    9: "Tab",
    12: "Clear",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    19: "Pause",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    45: "Insert",
    46: "Delete",
    112: "F1",
    113: "F2",
    114: "F3",
    115: "F4",
    116: "F5",
    117: "F6",
    118: "F7",
    119: "F8",
    120: "F9",
    121: "F10",
    122: "F11",
    123: "F12",
    144: "NumLock",
    145: "ScrollLock",
    224: "Meta"
  }, d0 = {
    Alt: "altKey",
    Control: "ctrlKey",
    Meta: "metaKey",
    Shift: "shiftKey"
  };
  v0 = K({}, Tr, {
    key: function (e) {
      if (e.key) {
        var n = s0[e.key] || e.key;
        if (n !== "Unidentified") return n;
      }
      return e.type === "keypress" ? (e = Tl(e), e === 13 ? "Enter" : String.fromCharCode(e)) : e.type === "keydown" || e.type === "keyup" ? c0[e.keyCode] || "Unidentified" : "";
    },
    code: 0,
    location: 0,
    ctrlKey: 0,
    shiftKey: 0,
    altKey: 0,
    metaKey: 0,
    repeat: 0,
    locale: 0,
    getModifierState: go,
    charCode: function (e) {
      return e.type === "keypress" ? Tl(e) : 0;
    },
    keyCode: function (e) {
      return e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    },
    which: function (e) {
      return e.type === "keypress" ? Tl(e) : e.type === "keydown" || e.type === "keyup" ? e.keyCode : 0;
    }
  }), m0 = we(v0), y0 = K({}, au, {
    pointerId: 0,
    width: 0,
    height: 0,
    pressure: 0,
    tangentialPressure: 0,
    tiltX: 0,
    tiltY: 0,
    twist: 0,
    pointerType: 0,
    isPrimary: 0
  }), Va = we(y0), h0 = K({}, Tr, {
    touches: 0,
    targetTouches: 0,
    changedTouches: 0,
    altKey: 0,
    metaKey: 0,
    ctrlKey: 0,
    shiftKey: 0,
    getModifierState: go
  }), g0 = we(h0), S0 = K({}, Tt, {
    propertyName: 0,
    elapsedTime: 0,
    pseudoElement: 0
  }), w0 = we(S0), k0 = K({}, au, {
    deltaX: function (e) {
      return "deltaX" in e ? e.deltaX : "wheelDeltaX" in e ? -e.wheelDeltaX : 0;
    },
    deltaY: function (e) {
      return "deltaY" in e ? e.deltaY : "wheelDeltaY" in e ? -e.wheelDeltaY : "wheelDelta" in e ? -e.wheelDelta : 0;
    },
    deltaZ: 0,
    deltaMode: 0
  }), E0 = we(k0), _0 = [9, 13, 27, 32], So = je && "CompositionEvent" in window;
  je && "documentMode" in document && (rr = document.documentMode);
  P0 = je && "TextEvent" in window && !rr, ls = je && (!So || rr && 8 < rr && 11 >= rr), Ua = String.fromCharCode(32);
  z0 = {
    color: !0,
    date: !0,
    datetime: !0,
    "datetime-local": !0,
    email: !0,
    month: !0,
    number: !0,
    password: !0,
    range: !0,
    search: !0,
    tel: !0,
    text: !0,
    time: !0,
    url: !0,
    week: !0
  };
  if (je) {
    if (je) {
      if (Jt = "oninput" in document, !Jt) Fl = document.createElement("div"), Fl.setAttribute("oninput", "return;"), Jt = typeof Fl.oninput === "function";
      xt = Jt;
    } else xt = !1;
    as = xt && (!document.documentMode || 9 < document.documentMode);
  }
  Ue = typeof Object.is === "function" ? Object.is : L0;
  U0 = je && "documentMode" in document && 11 >= document.documentMode;
  ot = {
    animationend: gl("Animation", "AnimationEnd"),
    animationiteration: gl("Animation", "AnimationIteration"),
    animationstart: gl("Animation", "AnimationStart"),
    transitionend: gl("Transition", "TransitionEnd")
  }, Ju = {}, ds = {};
  je && (ds = document.createElement("div").style, "AnimationEvent" in window || (delete ot.animationend.animation, delete ot.animationiteration.animation, delete ot.animationstart.animation), "TransitionEvent" in window || delete ot.transitionend.transition);
  ps = su("animationend"), vs = su("animationiteration"), ms = su("animationstart"), ys = su("transitionend"), hs = new Map(), Wa = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
  for (jt = 0; jt < Wa.length; jt++) bt = Wa[jt], Ri = bt.toLowerCase(), Di = bt[0].toUpperCase() + bt.slice(1), Pn(Ri, "on" + Di);
  Pn(ps, "onAnimationEnd");
  Pn(vs, "onAnimationIteration");
  Pn(ms, "onAnimationStart");
  Pn("dblclick", "onDoubleClick");
  Pn("focusin", "onFocus");
  Pn("focusout", "onBlur");
  Pn(ys, "onTransitionEnd");
  kt("onMouseEnter", ["mouseout", "mouseover"]);
  kt("onMouseLeave", ["mouseout", "mouseover"]);
  kt("onPointerEnter", ["pointerout", "pointerover"]);
  kt("onPointerLeave", ["pointerout", "pointerover"]);
  Xn("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
  Xn("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
  Xn("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
  Xn("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
  Xn("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
  Xn("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
  er = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), $0 = new Set("cancel close invalid load scroll toggle".split(" ").concat(er));
  Sl = "_reactListening" + Math.random().toString(36).slice(2);
  B0 = /\r\n?/g, H0 = /\u0000|\uFFFD/g;
  Ui = typeof setTimeout === "function" ? setTimeout : void 0, A0 = typeof clearTimeout === "function" ? clearTimeout : void 0, Ga = typeof Promise === "function" ? Promise : void 0, Q0 = typeof queueMicrotask === "function" ? queueMicrotask : typeof Ga < "u" ? function (e) {
    return Ga.resolve(null).then(e).catch(I0);
  } : Ui;
  Ft = Math.random().toString(36).slice(2), Ie = "__reactFiber$" + Ft, wr = "__reactProps$" + Ft, be = "__reactContainer$" + Ft, $i = "__reactEvents$" + Ft, W0 = "__reactListeners$" + Ft, K0 = "__reactHandles$" + Ft;
  Bi = [];
  _n = {}, oe = Cn(_n), ve = Cn(!1), Qn = _n;
  st = [], _e = [];
  X0 = tn.ReactCurrentBatchConfig;
  Pt = Cs(!0), Ns = Cs(!1), xl = Cn(null);
  Or = {}, Ke = Cn(Or), kr = Cn(Or), Er = Cn(Or);
  I = Cn(0);
  ti = [];
  Rl = tn.ReactCurrentDispatcher, ri = tn.ReactCurrentBatchConfig;
  nu = {
    readContext: ze,
    useCallback: le,
    useContext: le,
    useEffect: le,
    useImperativeHandle: le,
    useInsertionEffect: le,
    useLayoutEffect: le,
    useMemo: le,
    useReducer: le,
    useRef: le,
    useState: le,
    useDebugValue: le,
    useDeferredValue: le,
    useTransition: le,
    useMutableSource: le,
    useSyncExternalStore: le,
    useId: le,
    unstable_isNewReconciler: !1
  }, J0 = {
    readContext: ze,
    useCallback: function (e, n) {
      return Qe().memoizedState = [e, n === void 0 ? null : n], e;
    },
    useContext: ze,
    useEffect: rf,
    useImperativeHandle: function (e, n, t) {
      return t = t !== null && t !== void 0 ? t.concat([e]) : null, Dl(4194308, 4, As.bind(null, n, e), t);
    },
    useLayoutEffect: function (e, n) {
      return Dl(4194308, 4, e, n);
    },
    useInsertionEffect: function (e, n) {
      return Dl(4, 2, e, n);
    },
    useMemo: function (e, n) {
      var t = Qe();
      return n = n === void 0 ? null : n, e = e(), t.memoizedState = [e, n], e;
    },
    useReducer: function (e, n, t) {
      var r = Qe();
      return n = t !== void 0 ? t(n) : n, r.memoizedState = r.baseState = n, e = {
        pending: null,
        interleaved: null,
        lanes: 0,
        dispatch: null,
        lastRenderedReducer: e,
        lastRenderedState: n
      }, r.queue = e, e = e.dispatch = q0.bind(null, W, e), [r.memoizedState, e];
    },
    useRef: function (e) {
      var n = Qe();
      return e = {
        current: e
      }, n.memoizedState = e;
    },
    useState: tf,
    useDebugValue: Uo,
    useDeferredValue: function (e) {
      return Qe().memoizedState = e;
    },
    useTransition: function () {
      var e = tf(!1),
        n = e[0];
      return e = Z0.bind(null, e[1]), Qe().memoizedState = e, [n, e];
    },
    useMutableSource: function () {},
    useSyncExternalStore: function (e, n, t) {
      var r = W,
        l = Qe();
      if (B) {
        if (t === void 0) throw Error(w(407));
        t = t();
      } else {
        if (t = n(), b === null) throw Error(w(349));
        (Wn & 30) !== 0 || Ds(r, n, t);
      }
      l.memoizedState = t;
      var u = {
        value: t,
        getSnapshot: n
      };
      return l.queue = u, rf(Ls.bind(null, r, u, e), [e]), r.flags |= 2048, Cr(9, Ms.bind(null, r, u, t, n), void 0, null), t;
    },
    useId: function () {
      var e = Qe(),
        n = b.identifierPrefix;
      if (B) {
        var t = xe,
          r = qe;
        t = (r & ~(1 << 32 - Le(r) - 1)).toString(32) + t, n = ":" + n + "R" + t, t = _r++, 0 < t && (n += "H" + t.toString(32)), n += ":";
      } else t = G0++, n = ":" + n + "r" + t.toString(32) + ":";
      return e.memoizedState = n;
    },
    unstable_isNewReconciler: !1
  }, j0 = {
    readContext: ze,
    useCallback: Is,
    useContext: ze,
    useEffect: Vo,
    useImperativeHandle: Qs,
    useInsertionEffect: Bs,
    useLayoutEffect: Hs,
    useMemo: Ws,
    useReducer: li,
    useRef: $s,
    useState: function () {
      return li(Pr);
    },
    useDebugValue: Uo,
    useDeferredValue: function (e) {
      var n = Te();
      return Ks(n, q.memoizedState, e);
    },
    useTransition: function () {
      var e = li(Pr)[0],
        n = Te().memoizedState;
      return [e, n];
    },
    useMutableSource: Os,
    useSyncExternalStore: Rs,
    useId: Ys,
    unstable_isNewReconciler: !1
  }, b0 = {
    readContext: ze,
    useCallback: Is,
    useContext: ze,
    useEffect: Vo,
    useImperativeHandle: Qs,
    useInsertionEffect: Bs,
    useLayoutEffect: Hs,
    useMemo: Ws,
    useReducer: ui,
    useRef: $s,
    useState: function () {
      return ui(Pr);
    },
    useDebugValue: Uo,
    useDeferredValue: function (e) {
      var n = Te();
      return q === null ? n.memoizedState = e : Ks(n, q.memoizedState, e);
    },
    useTransition: function () {
      var e = ui(Pr)[0],
        n = Te().memoizedState;
      return [e, n];
    },
    useMutableSource: Os,
    useSyncExternalStore: Rs,
    useId: Ys,
    unstable_isNewReconciler: !1
  };
  vu = {
    isMounted: function (e) {
      return (e = e._reactInternals) ? Gn(e) === e : !1;
    },
    enqueueSetState: function (e, n, t) {
      e = e._reactInternals;
      var r = se(),
        l = wn(e),
        u = Je(r, l);
      u.payload = n, t !== void 0 && t !== null && (u.callback = t), n = gn(e, u, l), n !== null && (Ve(n, e, l, r), Ol(n, e, l));
    },
    enqueueReplaceState: function (e, n, t) {
      e = e._reactInternals;
      var r = se(),
        l = wn(e),
        u = Je(r, l);
      u.tag = 1, u.payload = n, t !== void 0 && t !== null && (u.callback = t), n = gn(e, u, l), n !== null && (Ve(n, e, l, r), Ol(n, e, l));
    },
    enqueueForceUpdate: function (e, n) {
      e = e._reactInternals;
      var t = se(),
        r = wn(e),
        l = Je(t, r);
      l.tag = 2, n !== void 0 && n !== null && (l.callback = n), n = gn(e, l, r), n !== null && (Ve(n, e, r, t), Ol(n, e, r));
    }
  };
  ev = typeof WeakMap === "function" ? WeakMap : Map;
  nv = tn.ReactCurrentOwner;
  Gi = {
    dehydrated: null,
    treeContext: null,
    retryLane: 0
  };
  lc = function (e, n) {
    for (var t = n.child; t !== null;) {
      if (t.tag === 5 || t.tag === 6) e.appendChild(t.stateNode);else if (t.tag !== 4 && t.child !== null) {
        t.child.return = t, t = t.child;
        continue;
      }
      if (t === n) break;
      for (; t.sibling === null;) {
        if (t.return === null || t.return === n) return;
        t = t.return;
      }
      t.sibling.return = t.return, t = t.sibling;
    }
  };
  qi = function () {};
  uc = function (e, n, t, r) {
    var l = e.memoizedProps;
    if (l !== r) {
      e = n.stateNode, Bn(Ke.current);
      var u = null;
      switch (t) {
        case "input":
          l = mi(e, l), r = mi(e, r), u = [];
          break;
        case "select":
          l = K({}, l, {
            value: void 0
          }), r = K({}, r, {
            value: void 0
          }), u = [];
          break;
        case "textarea":
          l = gi(e, l), r = gi(e, r), u = [];
          break;
        default:
          typeof l.onClick !== "function" && typeof r.onClick === "function" && (e.onclick = Yl);
      }
      wi(t, r);
      var i;
      t = null;
      for (c in l) if (!r.hasOwnProperty(c) && l.hasOwnProperty(c) && l[c] != null) if (c === "style") {
        var o = l[c];
        for (i in o) o.hasOwnProperty(i) && (t || (t = {}), t[i] = "");
      } else c !== "dangerouslySetInnerHTML" && c !== "children" && c !== "suppressContentEditableWarning" && c !== "suppressHydrationWarning" && c !== "autoFocus" && (sr.hasOwnProperty(c) ? u || (u = []) : (u = u || []).push(c, null));
      for (c in r) {
        var a = r[c];
        if (o = l != null ? l[c] : void 0, r.hasOwnProperty(c) && a !== o && (a != null || o != null)) if (c === "style") {
          if (o) {
            for (i in o) !o.hasOwnProperty(i) || a && a.hasOwnProperty(i) || (t || (t = {}), t[i] = "");
            for (i in a) a.hasOwnProperty(i) && o[i] !== a[i] && (t || (t = {}), t[i] = a[i]);
          } else t || (u || (u = []), u.push(c, t)), t = a;
        } else c === "dangerouslySetInnerHTML" ? (a = a ? a.__html : void 0, o = o ? o.__html : void 0, a != null && o !== a && (u = u || []).push(c, a)) : c === "children" ? typeof a !== "string" && typeof a !== "number" || (u = u || []).push(c, "" + a) : c !== "suppressContentEditableWarning" && c !== "suppressHydrationWarning" && (sr.hasOwnProperty(c) ? (a != null && c === "onScroll" && U("scroll", e), u || o === a || (u = [])) : (u = u || []).push(c, a));
      }
      t && (u = u || []).push("style", t);
      var c = u;
      if (n.updateQueue = c) n.flags |= 4;
    }
  };
  ic = function (e, n, t, r) {
    t !== r && (n.flags |= 4);
  };
  iv = typeof WeakSet === "function" ? WeakSet : Set;
  fv = Math.ceil, tu = tn.ReactCurrentDispatcher, Bo = tn.ReactCurrentOwner, Ne = tn.ReactCurrentBatchConfig, vt = Cn(0);
  gc = function (e, n, t) {
    if (e !== null) {
      if (e.memoizedProps !== n.pendingProps || ve.current) pe = !0;else {
        if ((e.lanes & t) === 0 && (n.flags & 128) === 0) return pe = !1, rv(e, n, t);
        pe = (e.flags & 131072) !== 0 ? !0 : !1;
      }
    } else pe = !1, B && (n.flags & 1048576) !== 0 && Es(n, ql, n.index);
    switch (n.lanes = 0, n.tag) {
      case 2:
        var r = n.type;
        Ml(e, n), e = n.pendingProps;
        var l = Et(n, oe.current);
        St(n, t), l = Mo(null, n, r, e, l, t);
        var u = Lo();
        return n.flags |= 1, typeof l === "object" && l !== null && typeof l.render === "function" && l.$$typeof === void 0 ? (n.tag = 1, n.memoizedState = null, n.updateQueue = null, me(r) ? (u = !0, Gl(n)) : u = !1, n.memoizedState = l.state !== null && l.state !== void 0 ? l.state : null, To(n), l.updater = vu, n.stateNode = l, l._reactInternals = n, Wi(n, r, e, t), n = Xi(null, n, r, !0, u, t)) : (n.tag = 0, B && u && ko(n), fe(null, n, l, t), n = n.child), n;
      case 16:
        r = n.elementType;
        e: {
          switch (Ml(e, n), e = n.pendingProps, l = r._init, r = l(r._payload), n.type = r, l = n.tag = gv(r), e = Re(r, e), l) {
            case 0:
              n = Yi(null, n, r, e, t);
              break e;
            case 1:
              n = df(null, n, r, e, t);
              break e;
            case 11:
              n = sf(null, n, r, e, t);
              break e;
            case 14:
              n = cf(null, n, r, Re(r.type, e), t);
              break e;
          }
          throw Error(w(306, r, ""));
        }
        return n;
      case 0:
        return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : Re(r, l), Yi(e, n, r, l, t);
      case 1:
        return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : Re(r, l), df(e, n, r, l, t);
      case 3:
        e: {
          if (nc(n), e === null) throw Error(w(387));
          r = n.pendingProps, u = n.memoizedState, l = u.element, Ts(e, n), jl(n, r, null, t);
          var i = n.memoizedState;
          if (r = i.element, u.isDehydrated) {
            if (u = {
              element: r,
              isDehydrated: !1,
              cache: i.cache,
              pendingSuspenseBoundaries: i.pendingSuspenseBoundaries,
              transitions: i.transitions
            }, n.updateQueue.baseState = u, n.memoizedState = u, n.flags & 256) {
              l = Nt(Error(w(423)), n), n = pf(e, n, r, t, l);
              break e;
            } else if (r !== l) {
              l = Nt(Error(w(424)), n), n = pf(e, n, r, t, l);
              break e;
            } else for (ge = hn(n.stateNode.containerInfo.firstChild), Se = n, B = !0, Me = null, t = Ns(n, null, r, t), n.child = t; t;) t.flags = t.flags & -3 | 4096, t = t.sibling;
          } else {
            if (_t(), r === l) {
              n = nn(e, n, t);
              break e;
            }
            fe(e, n, r, t);
          }
          n = n.child;
        }
        return n;
      case 5:
        return Fs(n), e === null && Ai(n), r = n.type, l = n.pendingProps, u = e !== null ? e.memoizedProps : null, i = l.children, Vi(r, l) ? i = null : u !== null && Vi(r, u) && (n.flags |= 32), ec(e, n), fe(e, n, i, t), n.child;
      case 6:
        return e === null && Ai(n), null;
      case 13:
        return tc(e, n, t);
      case 4:
        return Fo(n, n.stateNode.containerInfo), r = n.pendingProps, e === null ? n.child = Pt(n, null, r, t) : fe(e, n, r, t), n.child;
      case 11:
        return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : Re(r, l), sf(e, n, r, l, t);
      case 7:
        return fe(e, n, n.pendingProps, t), n.child;
      case 8:
        return fe(e, n, n.pendingProps.children, t), n.child;
      case 12:
        return fe(e, n, n.pendingProps.children, t), n.child;
      case 10:
        e: {
          if (r = n.type._context, l = n.pendingProps, u = n.memoizedProps, i = l.value, V(xl, r._currentValue), r._currentValue = i, u !== null) if (Ue(u.value, i)) {
            if (u.children === l.children && !ve.current) {
              n = nn(e, n, t);
              break e;
            }
          } else for (u = n.child, u !== null && (u.return = n); u !== null;) {
            var o = u.dependencies;
            if (o !== null) {
              i = u.child;
              for (var a = o.firstContext; a !== null;) {
                if (a.context === r) {
                  if (u.tag === 1) {
                    a = Je(-1, t & -t), a.tag = 2;
                    var c = u.updateQueue;
                    if (c !== null) {
                      c = c.shared;
                      var y = c.pending;
                      y === null ? a.next = a : (a.next = y.next, y.next = a), c.pending = a;
                    }
                  }
                  u.lanes |= t, a = u.alternate, a !== null && (a.lanes |= t), Qi(u.return, t, n), o.lanes |= t;
                  break;
                }
                a = a.next;
              }
            } else if (u.tag === 10) i = u.type === n.type ? null : u.child;else if (u.tag === 18) {
              if (i = u.return, i === null) throw Error(w(341));
              i.lanes |= t, o = i.alternate, o !== null && (o.lanes |= t), Qi(i, t, n), i = u.sibling;
            } else i = u.child;
            if (i !== null) i.return = u;else for (i = u; i !== null;) {
              if (i === n) {
                i = null;
                break;
              }
              if (u = i.sibling, u !== null) {
                u.return = i.return, i = u;
                break;
              }
              i = i.return;
            }
            u = i;
          }
          fe(e, n, l.children, t), n = n.child;
        }
        return n;
      case 9:
        return l = n.type, r = n.pendingProps.children, St(n, t), l = ze(l), r = r(l), n.flags |= 1, fe(e, n, r, t), n.child;
      case 14:
        return r = n.type, l = Re(r, n.pendingProps), l = Re(r.type, l), cf(e, n, r, l, t);
      case 15:
        return js(e, n, n.type, n.pendingProps, t);
      case 17:
        return r = n.type, l = n.pendingProps, l = n.elementType === r ? l : Re(r, l), Ml(e, n), n.tag = 1, me(r) ? (e = !0, Gl(n)) : e = !1, St(n, t), qs(n, r, l), Wi(n, r, l, t), Xi(null, n, r, !0, e, t);
      case 19:
        return rc(e, n, t);
      case 22:
        return bs(e, n, t);
    }
    throw Error(w(156, n.tag));
  };
  Ec = typeof reportError === "function" ? reportError : function (e) {
    console.error(e);
  };
  Su.prototype.render = Go.prototype.render = function (e) {
    var n = this._internalRoot;
    if (n === null) throw Error(w(409));
    gu(e, n, null, null);
  };
  Su.prototype.unmount = Go.prototype.unmount = function () {
    var e = this._internalRoot;
    if (e !== null) {
      this._internalRoot = null;
      var n = e.containerInfo;
      Yn(function () {
        gu(null, e, null, null);
      }), n[be] = null;
    }
  };
  Su.prototype.unstable_scheduleHydration = function (e) {
    if (e) {
      var n = bf();
      e = {
        blockedOn: null,
        target: e,
        priority: n
      };
      for (var t = 0; t < sn.length && n !== 0 && n < sn[t].priority; t++);
      sn.splice(t, 0, e), t === 0 && ns(e);
    }
  };
  Jf = function (e) {
    switch (e.tag) {
      case 3:
        var n = e.stateNode;
        if (n.current.memoizedState.isDehydrated) {
          var t = qt(n.pendingLanes);
          t !== 0 && (po(n, t | 1), ye(n, X()), (D & 6) === 0 && (zt = X() + 500, Nn()));
        }
        break;
      case 13:
        Yn(function () {
          var r = en(e, 1);
          if (r !== null) {
            var l = se();
            Ve(r, e, 1, l);
          }
        }), Xo(e, 1);
    }
  };
  vo = function (e) {
    if (e.tag === 13) {
      var n = en(e, 134217728);
      if (n !== null) {
        var t = se();
        Ve(n, e, 134217728, t);
      }
      Xo(e, 134217728);
    }
  };
  jf = function (e) {
    if (e.tag === 13) {
      var n = wn(e),
        t = en(e, n);
      if (t !== null) {
        var r = se();
        Ve(t, e, n, r);
      }
      Xo(e, n);
    }
  };
  bf = function () {
    return M;
  };
  es = function (e, n) {
    var t = M;
    try {
      return M = e, n();
    } finally {
      M = t;
    }
  };
  _i = function (e, n, t) {
    switch (n) {
      case "input":
        if (yi(e, t), n = t.name, t.type === "radio" && n != null) {
          for (t = e; t.parentNode;) t = t.parentNode;
          t = t.querySelectorAll("input[name=" + JSON.stringify("" + n) + '][type="radio"]');
          for (n = 0; n < t.length; n++) {
            var r = t[n];
            if (r !== e && r.form === e.form) {
              var l = cu(r);
              if (!l) throw Error(w(90));
              Rf(r), yi(r, l);
            }
          }
        }
        break;
      case "textarea":
        Mf(e, t);
        break;
      case "select":
        n = t.value, n != null && mt(e, !!t.multiple, n, !1);
    }
  };
  Af = Qo;
  Qf = Yn;
  _v = {
    usingClientEntryPoint: !1,
    Events: [Fr, at, cu, Bf, Hf, Qo]
  }, Xt = {
    findFiberByHostInstance: Un,
    bundleType: 0,
    version: "18.3.1",
    rendererPackageName: "react-dom"
  }, Pv = {
    bundleType: Xt.bundleType,
    version: Xt.version,
    rendererPackageName: Xt.rendererPackageName,
    rendererConfig: Xt.rendererConfig,
    overrideHookState: null,
    overrideHookStateDeletePath: null,
    overrideHookStateRenamePath: null,
    overrideProps: null,
    overridePropsDeletePath: null,
    overridePropsRenamePath: null,
    setErrorHandler: null,
    setSuspenseHandler: null,
    scheduleUpdate: null,
    currentDispatcherRef: tn.ReactCurrentDispatcher,
    findHostInstanceByFiber: function (e) {
      return e = Kf(e), e === null ? null : e.stateNode;
    },
    findFiberByHostInstance: Xt.findFiberByHostInstance || kv,
    findHostInstancesForRefresh: null,
    scheduleRefresh: null,
    scheduleRoot: null,
    setRefreshHandler: null,
    getCurrentFiber: null,
    reconcilerVersion: "18.3.1-next-f1338f8080-20240426"
  };
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ < "u") {
    if (tt = __REACT_DEVTOOLS_GLOBAL_HOOK__, !tt.isDisabled && tt.supportsFiber) try {
      ou = tt.inject(Pv), We = tt;
    } catch (e) {}
  }
  _c = _v, Dc = Qo;
});
var Bc = el(($v, $c) => {
  Vc();
  function Uc() {
    if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ > "u" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") return;
    try {
      __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(Uc);
    } catch (e) {
      console.error(e);
    }
  }
  Uc(), $c.exports = qo;
});
var Hc = el(Nv => {
  var Rr = Xe(Bc(), 1);
  Nv.createRoot = Rr.createRoot, Nv.hydrateRoot = Rr.hydrateRoot;
  var Cv;
});
var Xc = Xe(Rn(), 1),
  Gc = Xe(Hc(), 1);
var A = Xe(Rn(), 1);
var _u = Xe(Rn(), 1);
var Ac = e => e.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
  Eu = (...e) => e.filter((n, t, r) => {
    return Boolean(n) && n.trim() !== "" && r.indexOf(n) === t;
  }).join(" ").trim();
var Dr = Xe(Rn(), 1);
var Qc = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
var Ic = Dr.forwardRef(({
  color: e = "currentColor",
  size: n = 24,
  strokeWidth: t = 2,
  absoluteStrokeWidth: r,
  className: l = "",
  children: u,
  iconNode: i,
  ...o
}, a) => {
  return Dr.createElement("svg", {
    ref: a,
    ...Qc,
    width: n,
    height: n,
    stroke: e,
    strokeWidth: r ? Number(t) * 24 / Number(n) : t,
    className: Eu("lucide", l),
    ...o
  }, [...i.map(([c, y]) => Dr.createElement(c, y)), ...(Array.isArray(u) ? u : [u])]);
});
var C = (e, n) => {
  let t = _u.forwardRef(({
    className: r,
    ...l
  }, u) => _u.createElement(Ic, {
    ref: u,
    iconNode: n,
    className: Eu(`lucide-${Ac(e)}`, r),
    ...l
  }));
  return t.displayName = `${e}`, t;
};
var Ot = C("ArrowRight", [["path", {
  d: "M5 12h14",
  key: "1ays0h"
}], ["path", {
  d: "m12 5 7 7-7 7",
  key: "xquz4c"
}]]);
var Mr = C("Banknote", [["rect", {
  width: "20",
  height: "12",
  x: "2",
  y: "6",
  rx: "2",
  key: "9lu3g6"
}], ["circle", {
  cx: "12",
  cy: "12",
  r: "2",
  key: "1c9p78"
}], ["path", {
  d: "M6 12h.01M18 12h.01",
  key: "113zkx"
}]]);
var Rt = C("Battery", [["rect", {
  width: "16",
  height: "10",
  x: "2",
  y: "7",
  rx: "2",
  ry: "2",
  key: "1w10f2"
}], ["line", {
  x1: "22",
  x2: "22",
  y1: "11",
  y2: "13",
  key: "4dh1rd"
}]]);
var Lr = C("CalendarDays", [["path", {
  d: "M8 2v4",
  key: "1cmpym"
}], ["path", {
  d: "M16 2v4",
  key: "4m81vk"
}], ["rect", {
  width: "18",
  height: "18",
  x: "3",
  y: "4",
  rx: "2",
  key: "1hopcy"
}], ["path", {
  d: "M3 10h18",
  key: "8toen8"
}], ["path", {
  d: "M8 14h.01",
  key: "6423bh"
}], ["path", {
  d: "M12 14h.01",
  key: "1etili"
}], ["path", {
  d: "M16 14h.01",
  key: "1gbofw"
}], ["path", {
  d: "M8 18h.01",
  key: "lrp35t"
}], ["path", {
  d: "M12 18h.01",
  key: "mhygvu"
}], ["path", {
  d: "M16 18h.01",
  key: "kzsmim"
}]]);
var zn = C("Camera", [["path", {
  d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",
  key: "1tc9qg"
}], ["circle", {
  cx: "12",
  cy: "13",
  r: "3",
  key: "1vg3eu"
}]]);
var Tn = C("Check", [["path", {
  d: "M20 6 9 17l-5-5",
  key: "1gmf2c"
}]]);
var Vr = C("ChevronDown", [["path", {
  d: "m6 9 6 6 6-6",
  key: "qrunsl"
}]]);
var Ur = C("ChevronLeft", [["path", {
  d: "m15 18-6-6 6-6",
  key: "1wnfg3"
}]]);
var $e = C("CircleCheck", [["circle", {
  cx: "12",
  cy: "12",
  r: "10",
  key: "1mglay"
}], ["path", {
  d: "m9 12 2 2 4-4",
  key: "dzmm74"
}]]);
var rn = C("CircleHelp", [["circle", {
  cx: "12",
  cy: "12",
  r: "10",
  key: "1mglay"
}], ["path", {
  d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",
  key: "1u773s"
}], ["path", {
  d: "M12 17h.01",
  key: "p32p05"
}]]);
var $r = C("Clock3", [["circle", {
  cx: "12",
  cy: "12",
  r: "10",
  key: "1mglay"
}], ["polyline", {
  points: "12 6 12 12 16.5 12",
  key: "1aq6pp"
}]]);
var Br = C("Clock", [["circle", {
  cx: "12",
  cy: "12",
  r: "10",
  key: "1mglay"
}], ["polyline", {
  points: "12 6 12 12 16 14",
  key: "68esgv"
}]]);
var Hr = C("Copy", [["rect", {
  width: "14",
  height: "14",
  x: "8",
  y: "8",
  rx: "2",
  ry: "2",
  key: "17jyea"
}], ["path", {
  d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2",
  key: "zix9uf"
}]]);
var Ar = C("EyeOff", [["path", {
  d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
  key: "ct8e1f"
}], ["path", {
  d: "M14.084 14.158a3 3 0 0 1-4.242-4.242",
  key: "151rxh"
}], ["path", {
  d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
  key: "13bj9a"
}], ["path", {
  d: "m2 2 20 20",
  key: "1ooewy"
}]]);
var Qr = C("Eye", [["path", {
  d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
  key: "1nclc0"
}], ["circle", {
  cx: "12",
  cy: "12",
  r: "3",
  key: "1v7zrd"
}]]);
var Dt = C("FileText", [["path", {
  d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",
  key: "1rqfz7"
}], ["path", {
  d: "M14 2v4a2 2 0 0 0 2 2h4",
  key: "tnqrlb"
}], ["path", {
  d: "M10 9H8",
  key: "b1mrlr"
}], ["path", {
  d: "M16 13H8",
  key: "t4e002"
}], ["path", {
  d: "M16 17H8",
  key: "z1uh3a"
}]]);
var Mt = C("Globe", [["circle", {
  cx: "12",
  cy: "12",
  r: "10",
  key: "1mglay"
}], ["path", {
  d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20",
  key: "13o1zl"
}], ["path", {
  d: "M2 12h20",
  key: "9i4pu4"
}]]);
var Ir = C("Image", [["rect", {
  width: "18",
  height: "18",
  x: "3",
  y: "3",
  rx: "2",
  ry: "2",
  key: "1m3agn"
}], ["circle", {
  cx: "9",
  cy: "9",
  r: "2",
  key: "af1f0g"
}], ["path", {
  d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",
  key: "1xmnt7"
}]]);
var Wr = C("Lock", [["rect", {
  width: "18",
  height: "11",
  x: "3",
  y: "11",
  rx: "2",
  ry: "2",
  key: "1w4ew1"
}], ["path", {
  d: "M7 11V7a5 5 0 0 1 10 0v4",
  key: "fwvmzm"
}]]);
var Kr = C("LogOut", [["path", {
  d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",
  key: "1uf3rs"
}], ["polyline", {
  points: "16 17 21 12 16 7",
  key: "1gabdz"
}], ["line", {
  x1: "21",
  x2: "9",
  y1: "12",
  y2: "12",
  key: "1uyos4"
}]]);
var Zn = C("MapPin", [["path", {
  d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0",
  key: "1r0f0z"
}], ["circle", {
  cx: "12",
  cy: "10",
  r: "3",
  key: "ilqhr7"
}]]);
var Fn = C("Navigation", [["polygon", {
  points: "3 11 22 2 13 21 11 13 3 11",
  key: "1ltx0t"
}]]);
var qn = C("Package", [["path", {
  d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
  key: "1a0edw"
}], ["path", {
  d: "M12 22V12",
  key: "d0xqtd"
}], ["path", {
  d: "m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7",
  key: "yx3hmr"
}], ["path", {
  d: "m7.5 4.27 9 5.15",
  key: "1c824w"
}]]);
var Yr = C("Phone", [["path", {
  d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z",
  key: "foiqr5"
}]]);
var Xr = C("QrCode", [["rect", {
  width: "5",
  height: "5",
  x: "3",
  y: "3",
  rx: "1",
  key: "1tu5fj"
}], ["rect", {
  width: "5",
  height: "5",
  x: "16",
  y: "3",
  rx: "1",
  key: "1v8r4q"
}], ["rect", {
  width: "5",
  height: "5",
  x: "3",
  y: "16",
  rx: "1",
  key: "1x03jg"
}], ["path", {
  d: "M21 16h-3a2 2 0 0 0-2 2v3",
  key: "177gqh"
}], ["path", {
  d: "M21 21v.01",
  key: "ents32"
}], ["path", {
  d: "M12 7v3a2 2 0 0 1-2 2H7",
  key: "8crl2c"
}], ["path", {
  d: "M3 12h.01",
  key: "nlz23k"
}], ["path", {
  d: "M12 3h.01",
  key: "n36tog"
}], ["path", {
  d: "M12 16v.01",
  key: "133mhm"
}], ["path", {
  d: "M16 12h1",
  key: "1slzba"
}], ["path", {
  d: "M21 12v.01",
  key: "1lwtk9"
}], ["path", {
  d: "M12 21v-1",
  key: "1880an"
}]]);
var Lt = C("ShieldCheck", [["path", {
  d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
  key: "oel41y"
}], ["path", {
  d: "m9 12 2 2 4-4",
  key: "dzmm74"
}]]);
var Gr = C("Signal", [["path", {
  d: "M2 20h.01",
  key: "4haj6o"
}], ["path", {
  d: "M7 20v-4",
  key: "j294jx"
}], ["path", {
  d: "M12 20v-8",
  key: "i3yub9"
}], ["path", {
  d: "M17 20V8",
  key: "1tkaf5"
}], ["path", {
  d: "M22 4v16",
  key: "sih9yq"
}]]);
var On = C("Sparkles", [["path", {
  d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z",
  key: "4pj2yx"
}], ["path", {
  d: "M20 3v4",
  key: "1olli1"
}], ["path", {
  d: "M22 5h-4",
  key: "1gvqau"
}], ["path", {
  d: "M4 17v2",
  key: "vumght"
}], ["path", {
  d: "M5 18H3",
  key: "zchphs"
}]]);
var ln = C("TriangleAlert", [["path", {
  d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
  key: "wmoenq"
}], ["path", {
  d: "M12 9v4",
  key: "juzpu7"
}], ["path", {
  d: "M12 17h.01",
  key: "p32p05"
}]]);
var Zr = C("User", [["path", {
  d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
  key: "975kel"
}], ["circle", {
  cx: "12",
  cy: "7",
  r: "4",
  key: "17ys0d"
}]]);
var qr = C("Wallet", [["path", {
  d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1",
  key: "18etb6"
}], ["path", {
  d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4",
  key: "xoc0q4"
}]]);
var xr = C("X", [["path", {
  d: "M18 6 6 18",
  key: "1bl5f8"
}], ["path", {
  d: "m6 6 12 12",
  key: "d8bk6v"
}]]);
var xn = C("Zap", [["path", {
  d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
  key: "1xq2db"
}]]);
var Wc = Xe(Rn(), 1),
  zv = Symbol.for("react.element"),
  Tv = Symbol.for("react.fragment"),
  Fv = Object.prototype.hasOwnProperty,
  Ov = Wc.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
  Rv = {
    key: !0,
    ref: !0,
    __self: !0,
    __source: !0
  };
function Kc(e, n, t) {
  var r,
    l = {},
    u = null,
    i = null;
  t !== void 0 && (u = "" + t), n.key !== void 0 && (u = "" + n.key), n.ref !== void 0 && (i = n.ref);
  for (r in n) Fv.call(n, r) && !Rv.hasOwnProperty(r) && (l[r] = n[r]);
  if (e && e.defaultProps) for (r in n = e.defaultProps, n) l[r] === void 0 && (l[r] = n[r]);
  return {
    $$typeof: zv,
    type: e,
    key: u,
    ref: i,
    props: l,
    _owner: Ov.current
  };
}
var Pu = Tv,
  f = Kc,
  p = Kc;
var Jr = [],
  Yc = [{
    label: "English (UK)",
    code: "EN"
  }];
const panels = createPanels(A);
function xo() {
  const live = useCleaner(A);
  const Jr = live.jobs;
  let [e, n] = [Boolean(live.workspace), () => {}],
    [t, r] = A.useState(["", "", "", "", "", ""]),
    l = A.useRef([]),
    [u, i] = A.useState(null),
    [o, a] = A.useState("today"),
    [c, y] = [new Set(live.jobs.filter(j => j.check_in_at).map(j => j.id)), () => {}],
    [g, h] = [new Set(live.jobs.filter(j => j.check_out_at).map(j => j.id)), () => {}],
    [k, E] = [Object.fromEntries(live.jobs.map(j => [j.id, Object.fromEntries(j.tasks.map(t => [t.id, t.done]))])), () => {}],
    [_, Q] = A.useState(!1),
    [d, s] = A.useState(!1),
    [v, S] = A.useState(1),
    [N, z] = A.useState(null),
    [T, F] = [Object.fromEntries(live.jobs.map(j => [j.id, live.photos.filter(p => p.job_id === j.id).length])), () => {}],
    [G, R] = A.useState(!1),
    [ke, Cu] = A.useState(null),
    [Jo, jo] = A.useState(!1),
    [Nu, bo] = A.useState("EN"),
    [ea, na] = A.useState(!1),
    [Dv, Zc] = [Object.fromEntries(live.jobs.filter(j => j.check_in_at).map(j => [j.id, new Date(j.check_in_at).toLocaleTimeString("en-GB")])), () => {}],
    [jr] = A.useState("±5m"),
    O = Jr.find(m => m.id === u) || null,
    Be = m => {
      z(m), setTimeout(() => z(null), 3000);
    },
    qc = (m, L) => {
      if (!/^\d*$/.test(L)) return;
      let J = [...t];
      if (J[m] = L.slice(-1), r(J), L && m < 5) l.current[m + 1]?.focus();
      if (J.every(Ye => Ye !== "") && m === 5) setTimeout(() => n(!0), 300);
    },
    xc = (job, id) => live.toggle(job, id),
    Jn = m => {
      let L = k[m] || {};
      return Object.values(L).filter(Boolean).length;
    },
    jn = m => m.tasks.length,
    Jc = () => s(true),
    jc = () => live.attendance(O.id, "in_progress"),
    bc = async () => {
      if (await live.attendance(O.id, "completed")) {
        i(null);
        a("today");
      }
    },
    ed = () => {
      jo(!1), i(null), a("today"), Be("Great job! Earnings updated");
    },
    br = Array.from(g).reduce((m, L) => {
      let J = Jr.find(Ye => Ye.id === L);
      return m + (J?.pay || 0);
    }, 0),
    Vt = Jr.filter(j => dayKey(j.scheduled_date) === live.today).map((j,index,rows) => ({...j,status:j.status === "UPCOMING" && index === rows.findIndex(x=>x.status === "UPCOMING") ? "NEXT" : j.status})),
    Mv = Vt.find(m => m.status === "NEXT" || m.status === "IN_PROGRESS") || Vt[0];
  return null, p("div", {
    className: "min-h-screen bg-[#EEF2FF] text-slate-900 antialiased selection:bg-blue-600 selection:text-white overflow-x-clip",
    style: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    },
    children: [f("style", {
      children: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        :root { --primary: #2563EB; }
        * { -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { display: none; }
      `
    }), p("div", {
      className: "min-h-screen w-full flex justify-center items-start lg:items-center p-0 lg:p-6 gap-8",
      style: {
        paddingTop: "var(--safe-area-inset-top)",
        boxSizing: "border-box"
      },
      children: [p("div", {
        className: "hidden xl:flex flex-col gap-4 w-[320px] shrink-0",
        children: [p("div", {
          className: "bg-white rounded-[24px] border border-slate-200 p-6 shadow-sm",
          children: [f("div", {
            className: "w-10 h-10 rounded-xl bg-[#2563EB] grid place-items-center",
            children: f(xn, {
              className: "w-5 h-5 text-white"
            })
          }), f("h2", {
            className: "mt-4 font-bold text-[18px] leading-tight tracking-tight",
            children: "CleanMa \u2022 Two apps, one flow"
          }), p("p", {
            className: "mt-2 text-[13px] text-slate-600 leading-relaxed",
            children: ["This is the ", f("b", {
              children: "Cleaner App"
            }), " (mobile, simple). The other side is the ", f("b", {
              children: "Admin Dashboard"
            }), " (desktop, operations). They sync live via Supabase."]
          }), p("div", {
            className: "mt-5 space-y-3",
            children: [p("div", {
              className: "flex gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100",
              children: [f("div", {
                className: "w-8 h-8 rounded-xl bg-slate-900 text-white grid place-items-center text-[12px] font-bold shrink-0",
                children: "A"
              }), p("div", {
                children: [f("div", {
                  className: "text-[12px] font-semibold",
                  children: "Admin assigns job"
                }), f("div", {
                  className: "text-[11px] text-slate-500",
                  children: "Schedules, cleaning plan, door code"
                })]
              })]
            }), f("div", {
              className: "flex items-center justify-center",
              children: f(Ot, {
                className: "w-4 h-4 text-slate-400 rotate-90"
              })
            }), p("div", {
              className: "flex gap-3 p-3 rounded-2xl bg-blue-50 border border-blue-100",
              children: [f("div", {
                className: "w-8 h-8 rounded-xl bg-[#2563EB] text-white grid place-items-center text-[12px] font-bold shrink-0",
                children: "C"
              }), p("div", {
                children: [f("div", {
                  className: "text-[12px] font-semibold",
                  children: "Cleaner checks in • GPS + photo"
                }), f("div", {
                  className: "text-[11px] text-slate-600",
                  children: "Checklist, before/after, issues, checkout"
                })]
              })]
            }), f("div", {
              className: "flex items-center justify-center",
              children: f(Ot, {
                className: "w-4 h-4 text-slate-400 rotate-90"
              })
            }), p("div", {
              className: "flex gap-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-100",
              children: [f("div", {
                className: "w-8 h-8 rounded-xl bg-emerald-600 text-white grid place-items-center",
                children: f(Tn, {
                  className: "w-4 h-4"
                })
              }), p("div", {
                children: [f("div", {
                  className: "text-[12px] font-semibold",
                  children: "Admin sees live status + earnings"
                }), f("div", {
                  className: "text-[11px] text-slate-600",
                  children: "Reports, invoices, Faster Payments"
                })]
              })]
            })]
          }), p("div", {
            className: "mt-5 p-3 rounded-xl bg-slate-900 text-white text-[11px] leading-relaxed",
            children: [p("div", {
              className: "font-bold flex items-center gap-1.5",
              children: [f(Lt, {
                className: "w-3.5 h-3.5"
              }), " Real-time sync via Supabase Realtime"]
            }), f("div", {
              className: "opacity-70 mt-1",
              children: "GPS attendance \u2022 Photo documentation \u2022 Messages"
            })]
          })]
        }), p("div", {
          className: "bg-slate-900 rounded-[20px] p-4 text-white flex items-center gap-3",
          children: [f("div", {
            className: "w-9 h-9 rounded-full bg-white text-slate-900 grid place-items-center font-bold text-[12px]",
            children: "CF"
          }), p("div", {
            className: "text-[12px]",
            children: [f("div", {
              className: "font-semibold",
              children: "Manager view"
            }), f("div", {
              className: "opacity-60 text-[11px]",
              children: "CleanMa Owner Dashboard"
            })]
          }), f("div", {
            className: "ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
          })]
        })]
      }), p("div", {
        className: "w-full max-w-[400px] bg-white lg:rounded-[44px] lg:border-[10px] lg:border-slate-900 lg:shadow-[0_20px_60px_rgba(0,0,0,0.25),0_0_0_1px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col relative min-h-[100dvh] lg:min-h-0 lg:h-[840px]",
        children: [f("div", {
          className: "hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-[110px] h-[28px] bg-slate-900 rounded-b-[16px] z-30"
        }), p("div", {
          className: "h-[56px] shrink-0 flex items-center justify-between px-4 pt-2 bg-white border-b border-slate-100 sticky top-0 z-20",
          children: [p("div", {
            className: "flex items-center gap-2",
            children: [f("img", {src:brandLogo,alt:"CleanMa logo",style:{width:48,height:28,objectFit:"contain",flexShrink:0}}), f("span", {
              className: "font-extrabold tracking-tight text-[15px]",
              children: "CleanMa"
            })]
          }), f("a", {
            href: "mailto:support@cleanflow.uk",
            "aria-label": "Help & Support",
            className: "w-7 h-7 grid place-items-center rounded-full bg-white border border-slate-200",
            children: f(rn, {className: "w-4 h-4 text-slate-600"})
            })]
        }), f("div", {
          className: "flex-1 overflow-y-auto bg-[#F8FAFC] relative",
          children: !e ? f(panels.Login, {
            live
          }) : p(Pu, {
            children: [o === "today" && !u && p("div", {
              className: "p-4 pb-24",
              children: [p("div", {
                className: "flex items-start justify-between gap-3",
                children: [p("div", {
                  children: [f("h2", {
                    className: "text-[22px] font-extrabold tracking-tight leading-tight",
                    children: live.greeting + ", " + live.name.split(" ")[0]
                  }), p("div", {
                    className: "mt-1 flex items-center gap-2 text-[13px] text-slate-600",
                    children: [f(Lr, {
                      className: "w-4 h-4"
                    }), " " + live.today + " · " + Vt.length + " visits"]
                  })]
                }), f("div", {
                  className: "w-11 h-11 rounded-full bg-slate-900 text-white grid place-items-center font-bold text-[13px]",
                  children: live.name.split(/\s+/).map(x => x[0]).slice(0, 2).join("")
                })]
              }), p("div", {
                className: "mt-5 grid grid-cols-3 gap-2",
                children: [p("div", {
                  className: "bg-white rounded-2xl border border-slate-200 p-3",
                  children: [f("div", {
                    className: "text-[11px] font-bold tracking-widest uppercase text-slate-400",
                    children: "Today"
                  }), p("div", {
                    className: "mt-1 text-[20px] font-extrabold",
                    children: live.hoursToday + "h"
                  }), f("div", {
                    className: "text-[11px] text-emerald-600 font-medium",
                    children: [g.size, " visits"]
                  })]
                }), p("div", {
                  className: "bg-white rounded-2xl border border-slate-200 p-3",
                  children: [f("div", {
                    className: "text-[11px] font-bold tracking-widest uppercase text-slate-400",
                    children: "This week"
                  }), p("div", {
                    className: "mt-1 text-[20px] font-extrabold",
                    children: live.hoursWeek + "h"
                  }), f("div", {
                    className: "text-[11px] text-slate-500",
                    children: live.visitsWeek + " visits"
                  })]
                }), p("div", {
                  className: "bg-white rounded-2xl border border-slate-200 p-3",
                  children: [f("div", {
                    className: "text-[11px] font-bold tracking-widest uppercase text-slate-400",
                    children: "Month"
                  }), p("div", {
                    className: "mt-1 text-[20px] font-extrabold",
                    children: live.hoursMonth + "h"
                  }), f("div", {
                    className: "text-[11px] text-slate-500",
                    children: "Total"
                  })]
                })]
              }), f("div", {
                className: "mt-5 space-y-3",
                children: Vt.length > 0 ? Vt.map(m => {
                  let L = m.status === "NEXT",
                    J = m.status === "COMPLETED",
                    Ye = m.status === "IN_PROGRESS";
                  return p("button", {
                    onClick: () => i(m.id),
                    className: `w-full text-left rounded-[22px] border-2 p-4 bg-white shadow-sm transition active:scale-[0.99] ${L ? "border-[#2563EB] shadow-[0_0_0_4px_rgba(37,99,235,0.12)]" : J ? "border-emerald-200 bg-emerald-50/40" : Ye ? "border-blue-300 bg-blue-50/50" : "border-slate-200"}`,
                    children: [p("div", {
                      className: "flex items-start justify-between gap-3",
                      children: [p("div", {
                        className: "flex items-center gap-3",
                        children: [f("div", {
                          className: `w-12 h-12 rounded-2xl grid place-items-center font-extrabold text-[14px] ${J ? "bg-emerald-600 text-white" : "bg-slate-900 text-white"}`,
                          children: m.logo
                        }), p("div", {
                          children: [f("div", {
                            className: "font-bold text-[14px] leading-tight",
                            children: m.site
                          }), p("div", {
                            className: "mt-0.5 flex items-center gap-1 text-[12px] text-slate-500",
                            children: [f(Zn, {
                              className: "w-3 h-3"
                            }), " ", m.address]
                          })]
                        })]
                      }), p("div", {
                        className: "text-right",
                        children: [p("div", {
                          className: "text-[18px] font-extrabold leading-none",
                          children: m.pay == null ? "—" : ["£", m.pay]
                        }), f("div", {
                          className: "mt-1 text-[11px] font-medium text-slate-500",
                          children: m.duration
                        })]
                      })]
                    }), p("div", {
                      className: "mt-3 flex items-center justify-between",
                      children: [p("div", {
                        className: "flex items-center gap-2",
                        children: [p("span", {
                          className: "inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full bg-slate-900 text-white text-[12px] font-bold",
                          children: [f($r, {
                            className: "w-3 h-3"
                          }), " ", m.time]
                        }), f("span", {
                          className: `px-2.5 h-7 grid place-items-center rounded-full text-[11px] font-extrabold tracking-wider ${J ? "bg-emerald-600 text-white" : L ? "bg-[#2563EB] text-white animate-pulse" : Ye ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`,
                          children: m.status
                        })]
                      }), p("span", {
                        className: "text-[11px] text-slate-500 flex items-center gap-1",
                        children: [f(Fn, {
                          className: "w-3 h-3"
                        }), " ", m.distance.split("•")[0]]
                      })]
                    }), L && f("div", {
                      className: "hidden",
                      children: f("div", {
                        className: "h-full w-[68%] bg-[#2563EB] rounded-full animate-pulse"
                      })
                    })]
                  }, m.id);
                }) : f("div", {
                  className: "rounded-2xl border border-slate-200 p-6 text-center text-sm text-slate-500",
                  children: live.loading ? "Loading assigned jobs…" : "No jobs assigned for today."
                })
              })]
            }), O && !Jo && p("div", {
              className: "pb-28",
              children: [p("div", {
                className: "sticky top-0 z-10 bg-white border-b border-slate-100 px-4 h-[56px] flex items-center gap-3",
                children: [f("button", {
                  onClick: () => i(null),
                  className: "w-9 h-9 rounded-full bg-slate-50 border border-slate-200 grid place-items-center",
                  children: f(Ur, {
                    className: "w-5 h-5"
                  })
                }), p("div", {
                  className: "flex-1 min-w-0",
                  children: [f("div", {
                    className: "font-bold text-[14px] truncate",
                    children: O.site
                  }), p("div", {
                    className: "text-[11px] text-slate-500",
                    children: [O.time, " • ", O.duration, " • £", O.pay]
                  })]
                }), f("span", {
                  className: `px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${c.has(O.id) ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-blue-50 border border-blue-200 text-blue-700"}`,
                  children: c.has(O.id) ? "IN PROGRESS" : O.status
                })]
              }), p("div", {
                className: "p-4 space-y-4",
                children: [p("div", {
                  className: "rounded-[20px] overflow-hidden border border-slate-200 bg-slate-900 relative h-[160px]",
                  children: [f("div", {
                    className: "absolute inset-0 opacity-30",
                    style: {
                      backgroundImage: "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
                      backgroundSize: "28px 28px"
                    }
                  }), f("div", {
                    className: "absolute inset-0 grid place-items-center",
                    children: f("div", {
                      className: "w-10 h-10 rounded-full bg-[#2563EB] border-4 border-white shadow-xl grid place-items-center animate-bounce",
                      children: f(Zn, {
                        className: "w-5 h-5 text-white"
                      })
                    })
                  }), p("div", {
                    className: "absolute bottom-3 left-3 right-3 flex justify-between items-center",
                    children: [f("div", {
                      className: "px-3 py-1.5 rounded-full bg-white text-[11px] font-semibold shadow",
                      children: O.fullAddress
                    }), p("button", {
                      onClick: () => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(O.fullAddress)}`, "_blank"),
                      className: "h-9 px-4 rounded-full bg-[#2563EB] text-white text-[12px] font-bold flex items-center gap-1.5 shadow",
                      children: [f(Fn, {
                        className: "w-4 h-4"
                      }), " Navigate"]
                    })]
                  })]
                }), p("div", {
                  className: "grid grid-cols-2 gap-3",
                  children: [p("div", {
                    className: "bg-white rounded-2xl border border-slate-200 p-3",
                    children: [f("div", {
                      className: "text-[11px] font-bold tracking-widest uppercase text-slate-400",
                      children: "Contact"
                    }), f("div", {
                      className: "mt-1 font-semibold text-[13px]",
                      children: O.contactName
                    }), p("a", {
                      href: `tel:${O.contactPhone}`,
                      className: "mt-2 inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-slate-900 text-white text-[12px] font-bold",
                      children: [f(Yr, {
                        className: "w-3.5 h-3.5"
                      }), " Call"]
                    })]
                  }), p("div", {
                    className: "bg-white rounded-2xl border border-slate-200 p-3",
                    children: [f("div", {
                      className: "text-[11px] font-bold tracking-widest uppercase text-slate-400",
                      children: "Door code"
                    }), p("div", {
                      className: "mt-1 flex items-center gap-2",
                      children: [f("span", {
                        className: "font-mono font-bold text-[16px]",
                        children: _ ? O.doorCode : "••••"
                      }), f("button", {
                        onClick: () => Q(!_),
                        className: "w-7 h-7 rounded-full bg-slate-50 border border-slate-200 grid place-items-center",
                        children: _ ? f(Ar, {
                          className: "w-4 h-4"
                        }) : f(Qr, {
                          className: "w-4 h-4"
                        })
                      })]
                    }), p("button", {
                      onClick: () => navigator.clipboard.writeText(O.doorCode).then(() => Be("Copied"), () => Be("Copy unavailable")),
                      className: "mt-2 inline-flex items-center gap-1 h-7 px-2.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-bold",
                      children: [f(Hr, {
                        className: "w-3 h-3"
                      }), " Copy"]
                    })]
                  })]
                }), p("div", {
                  className: "bg-amber-50 border border-amber-200 rounded-2xl p-3 flex gap-3",
                  children: [f("div", {
                    className: "w-9 h-9 rounded-xl bg-white border border-amber-200 grid place-items-center shrink-0",
                    children: f(qn, {
                      className: "w-4 h-4 text-amber-700"
                    })
                  }), p("div", {
                    children: [f("div", {
                      className: "text-[12px] font-bold",
                      children: "Materials needed"
                    }), f("div", {
                      className: "text-[12px] text-amber-900 mt-0.5",
                      children: O.materials
                    })]
                  })]
                }), !c.has(O.id) ? p("button", {
                  onClick: Jc,
                  className: "w-full h-[64px] rounded-[20px] bg-[#2563EB] text-white font-extrabold text-[16px] flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(37,99,235,0.35)] active:scale-[0.98] transition",
                  children: [f(Zn, {
                    className: "w-5 h-5"
                  }), " CHECK-IN — I'm here"]
                }) : p(Pu, {
                  children: [p("div", {
                    className: "bg-white rounded-[20px] border border-slate-200 p-4",
                    children: [p("div", {
                      className: "flex items-center justify-between",
                      children: [f("div", {
                        className: "font-bold text-[14px]",
                        children: "Cleaning Plan"
                      }), p("div", {
                        className: "text-[12px] font-bold px-2.5 py-1 rounded-full bg-slate-900 text-white",
                        children: [Jn(O.id), "/", jn(O), " completed"]
                      })]
                    }), f("div", {
                      className: "mt-3 h-2 bg-slate-100 rounded-full overflow-hidden",
                      children: f("div", {
                        className: "h-full bg-emerald-500 transition-all",
                        style: {
                          width: `${Jn(O.id) / jn(O) * 100}%`
                        }
                      })
                    }), f("div", {
                      className: "mt-4 space-y-3",
                      children: O.tasks.map(m => {
                        let L = !!k[O.id]?.[m.id];
                        return p("button", {
                          onClick: () => xc(O.id, m.id),
                          className: `w-full text-left flex items-start gap-3 p-3 rounded-2xl border-2 transition ${L ? "bg-emerald-50 border-emerald-200" : "bg-white border-slate-200 hover:border-slate-300"}`,
                          children: [f("div", {
                            className: `mt-0.5 w-7 h-7 rounded-full border-2 grid place-items-center shrink-0 transition ${L ? "bg-emerald-600 border-emerald-600 text-white" : "bg-white border-slate-300"}`,
                            children: L && f(Tn, {
                              className: "w-4 h-4"
                            })
                          }), p("div", {
                            className: "flex-1",
                            children: [f("div", {
                              className: `font-bold text-[13px] ${L ? "line-through text-slate-500" : ""}`,
                              children: m.label
                            }), f("div", {
                              className: "text-[11px] text-slate-500 mt-0.5",
                              children: m.detail
                            })]
                          })]
                        }, m.id);
                      })
                    })]
                  }), p("div", {
                    className: "grid grid-cols-2 gap-3",
                    children: [p("button", {
                      onClick: () => R(!0),
                      className: "h-[56px] rounded-2xl bg-white border-2 border-slate-200 font-bold text-[13px] flex flex-col items-center justify-center gap-1 hover:bg-slate-50 active:scale-[0.98]",
                      children: [f(ln, {
                        className: "w-5 h-5 text-amber-600"
                      }), " Report Issue"]
                    }), p("button", {
                      onClick: () => panels.uploadPhoto(live, O),
                      className: "h-[56px] rounded-2xl bg-white border-2 border-slate-200 font-bold text-[13px] flex flex-col items-center justify-center gap-1 hover:bg-slate-50 active:scale-[0.98]",
                      children: [f(zn, {
                        className: "w-5 h-5 text-[#2563EB]"
                      }), " Before/After (", T[O.id] || 0, "/2)"]
                    })]
                  }), p("button", {
                    onClick: () => R(true),
                    className: "w-full h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 font-semibold text-[13px] flex items-center justify-center gap-2",
                    children: [f(qn, {
                      className: "w-4 h-4"
                    }), " Report low stock: toilet paper"]
                  }), p("button", {
                    onClick: bc,
                    disabled: Jn(O.id) < jn(O),
                    className: `w-full h-[60px] rounded-[20px] font-extrabold text-[16px] flex items-center justify-center gap-2 transition ${Jn(O.id) >= jn(O) ? "bg-emerald-600 text-white shadow-[0_8px_24px_rgba(16,185,129,0.35)] active:scale-[0.98]" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`,
                    children: [f($e, {
                      className: "w-5 h-5"
                    }), " CHECK-OUT & Finish"]
                  }), f("button", {onClick:()=>live.nfc(O.id,"completed"),disabled:live.busy||Jn(O.id)<jn(O),className:"w-full h-12 rounded-2xl border border-slate-200 text-sm",children:"NFC check-out (optional)"}), Jn(O.id) < jn(O) && p("div", {
                    className: "text-center text-[11px] text-slate-500",
                    children: ["Complete all ", jn(O), " tasks to check-out"]
                  })]
                })]
              })]
            }), o === "earnings" && !u && f(panels.Hours, {
              live
            }), o === "chat" && !u && f(panels.Chat, {
              live
            }), o === "profile" && !u && f(panels.Profile, {
              live
            }), Jo && O && p("div", {
              className: "absolute inset-0 z-40 bg-white flex flex-col p-6",
              children: [f("div", {
                className: "flex-1 grid place-items-center",
                children: p("div", {
                  className: "text-center max-w-[300px]",
                  children: [f("div", {
                    className: "w-20 h-20 rounded-full bg-emerald-100 border-4 border-emerald-200 grid place-items-center mx-auto",
                    children: f($e, {
                      className: "w-10 h-10 text-emerald-600"
                    })
                  }), f("h2", {
                    className: "mt-5 text-[24px] font-extrabold tracking-tight",
                    children: "Job completed"
                  }), p("p", {
                    className: "mt-2 text-[14px] text-slate-600 leading-relaxed",
                    children: ["£", O.pay, " will be added to your earnings. GPS log saved, photos uploaded, report sent to manager."]
                  }), p("div", {
                    className: "mt-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 text-[13px]",
                    children: [p("div", {
                      className: "flex justify-between",
                      children: [f("span", {
                        className: "text-slate-500",
                        children: "Time worked"
                      }), f("span", {
                        className: "font-bold",
                        children: "2h 05m"
                      })]
                    }), p("div", {
                      className: "flex justify-between",
                      children: [f("span", {
                        className: "text-slate-500",
                        children: "Checklist"
                      }), f("span", {
                        className: "font-bold",
                        children: "4/4 completed"
                      })]
                    }), p("div", {
                      className: "flex justify-between",
                      children: [f("span", {
                        className: "text-slate-500",
                        children: "Photos"
                      }), p("span", {
                        className: "font-bold",
                        children: [T[O.id] || 2, " uploaded"]
                      })]
                    }), p("div", {
                      className: "flex justify-between",
                      children: [f("span", {
                        className: "text-slate-500",
                        children: "GPS"
                      }), f("span", {
                        className: "font-bold text-emerald-700",
                        children: "OK ±5m • 08:02-10:07"
                      })]
                    })]
                  }), p("div", {
                    className: "mt-5 p-3 rounded-2xl bg-[#2563EB] text-white flex gap-3 text-left",
                    children: [f("div", {
                      className: "w-10 h-10 rounded-xl bg-white/20 grid place-items-center shrink-0",
                      children: f(Fn, {
                        className: "w-5 h-5"
                      })
                    }), p("div", {
                      children: [p("div", {
                        className: "font-bold text-[13px]",
                        children: ["Next: ", Jr.find(m => m.id === "J2")?.site, " 11:00"]
                      }), f("div", {
                        className: "text-[11px] opacity-80 mt-0.5",
                        children: "15 min away • 2.1 mi • Tap to navigate"
                      })]
                    })]
                  })]
                })
              }), f("button", {
                onClick: ed,
                className: "w-full h-[56px] rounded-2xl bg-slate-900 text-white font-bold text-[15px]",
                children: "Done • Back to Today"
              })]
            })]
          })
        }), e && !u && f("div", {
          className: "h-[84px] shrink-0 bg-white border-t border-slate-200 px-2 flex items-center justify-around pb-3",
          children: [{
            id: "today",
            label: "Today",
            icon: Br,
            count: 4
          }, {
            id: "chat",
            label: "Chat",
            icon: Zr,
            count: 1
          }, {
            id: "earnings",
            label: "Hours",
            icon: Mr,
            count: null
          }, {
            id: "profile",
            label: "Profile",
            icon: Zr,
            count: null
          }].map(m => {
            let L = o === m.id;
            return p("button", {
              onClick: () => a(m.id),
              className: `flex-1 h-[56px] rounded-2xl flex flex-col items-center justify-center gap-1 transition ${L ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-50"}`,
              children: [p("div", {
                className: "relative",
                children: [f(m.icon, {
                  className: "w-5 h-5"
                }), m.count && f("span", {
                  className: "absolute -top-2 -right-2 w-4 h-4 rounded-full bg-[#2563EB] text-white text-[10px] font-bold grid place-items-center",
                  children: m.count
                })]
              }), f("span", {
                className: "text-[11px] font-bold tracking-wide",
                children: m.label
              })]
            }, m.id);
          })
        })]
      }), p("div", {
        className: "hidden xl:flex flex-col gap-3 w-[280px] shrink-0",
        children: [p("div", {
          className: "bg-white rounded-[20px] border border-slate-200 p-4",
          children: [f("div", {
            className: "text-[11px] font-bold tracking-widest uppercase text-slate-400",
            children: "Live sync example"
          }), p("div", {
            className: "mt-3 space-y-2 text-[12px] font-mono",
            children: [f("div", {
              className: "p-2 rounded-xl bg-slate-50 border border-slate-100",
              children: "admin creates job →"
            }), f("div", {
              className: "p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-700",
              children: "supabase INSERT realtime →"
            }), f("div", {
              className: "p-2 rounded-xl bg-slate-900 text-white",
              children: "cleaner phone vibrates • new job"
            }), f("div", {
              className: "p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700",
              children: "GPS check-in • checklist → admin map live"
            })]
          })]
        }), p("div", {
          className: "rounded-[20px] bg-gradient-to-br from-blue-600 to-violet-600 p-4 text-white",
          children: [f("div", {
            className: "text-[13px] font-bold",
            children: "Why this UX works for cleaners"
          }), p("ul", {
            className: "mt-2 space-y-1.5 text-[11px] opacity-90 leading-relaxed list-disc pl-4",
            children: [f("li", {
              children: "48px+ touch targets, one hand use"
            }), f("li", {
              children: "No tiny text, high contrast, English UK simple"
            }), f("li", {
              children: "GPS + photo proof = fewer disputes"
            }), f("li", {
              children: "Offline queue → auto-sync"
            }), f("li", {
              children: "Earnings instant via Stripe/Faster Payments"
            })]
          })]
        })]
      })]
    }), d && O && f(panels.Checkin, {
      live,
      job: O,
      onClose: () => s(false)
    }), G && f(panels.Incident, {
      live,
      job: O,
      onClose: () => R(false)
    }), N && p("div", {
      className: "fixed bottom-6 left-1/2 -translate-x-1/2 z-[120] bg-slate-900 text-white px-4 py-2.5 rounded-full text-[13px] font-medium shadow-xl flex items-center gap-2 animate-[slideUp_0.3s_ease] max-w-[90vw]",
      children: [f($e, {
        className: "w-4 h-4 text-emerald-400 shrink-0"
      }), " ", f("span", {
        className: "truncate",
        children: N
      })]
    }), f("style", {
      children: "@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }"
    }), f("div", {
      className: "hidden lg:block fixed bottom-0 inset-x-0 z-10 pointer-events-none",
      children: f("div", {
        className: "mx-auto max-w-[1200px] p-4",
        children: p("div", {
          className: "pointer-events-auto bg-white/90 backdrop-blur-xl border border-slate-200 rounded-[16px] px-4 py-3 flex items-center gap-4 shadow-lg",
          children: [f("div", {
            className: "w-8 h-8 rounded-xl bg-slate-900 text-white grid place-items-center shrink-0",
            children: f(xn, {
              className: "w-4 h-4"
            })
          }), p("div", {
            className: "text-[12px] leading-snug",
            children: [f("span", {
              className: "font-bold",
              children: "How both apps work side-by-side:"
            }), " ", f("span", {
              className: "text-slate-600",
              children: "Admin dashboard assigns & tracks (left) \u2194 Cleaner app checks in with GPS + photos (center) \u2194 Real-time sync via Supabase Realtime + Storage for photos. Attendance and messages are saved online."
            })]
          }), f("a", {
            href: "mailto:support@cleanmaapp.com",
            className: "ml-auto shrink-0 h-8 px-3 rounded-full bg-slate-900 text-white text-[11px] font-bold grid place-items-center",
            children: "support@cleanmaapp.com"
          })]
        })
      })
    }), e && f(panels.Banner, {
      live
    })]
  });
}
Gc.createRoot(document.getElementById("root")).render(f(Xc.default.StrictMode, {
  children: f(xo, {})
}));
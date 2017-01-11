/*
 * はてなが公式に公開しているものを全コピペ
 * This code is MochiKit & BookmarkCommentViewer 
 * MIT Licence.
 */

(function() {
  var MochiNameSpace = {};
  /***

  MochiKit.Base 1.4

  See <http://mochikit.com/> for documentation, downloads, license, etc.

  (c) 2005 Bob Ippolito.  All rights Reserved.

  ***/

  if (typeof(dojo) != 'undefined') {
      dojo.provide("MochiKit.Base");
  }

  if (typeof(MochiKit) == 'undefined') {
      var MochiKit = {};
  }
  if (typeof(MochiKit.Base) == 'undefined') {
      MochiKit.Base = {};
  }

  MochiKit.Base.VERSION = "1.4";
  MochiKit.Base.NAME = "MochiKit.Base";
  /** @id MochiKit.Base.update */
  MochiKit.Base.update = function (self, obj/*, ... */) {
      if (self === null) {
          self = {};
      }
      for (var i = 1; i < arguments.length; i++) {
          var o = arguments[i];
          if (typeof(o) != 'undefined' && o !== null) {
              for (var k in o) {
                  self[k] = o[k];
              }
          }
      }
      return self;
  };

  MochiKit.Base.update(MochiKit.Base, {
      __repr__: function () {
          return "[" + this.NAME + " " + this.VERSION + "]";
      },

      toString: function () {
          return this.__repr__();
      },

      /** @id MochiKit.Base.camelize */
      camelize: function (selector) {
          /* from dojo.style.toCamelCase */
          var arr = selector.split('-');
          var cc = arr[0];
          for (var i = 1; i < arr.length; i++) {
              cc += arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
          }
          return cc;
      },

      /** @id MochiKit.Base.counter */
      counter: function (n/* = 1 */) {
          if (arguments.length === 0) {
              n = 1;
          }
          return function () {
              return n++;
          };
      },
          
      /** @id MochiKit.Base.clone */
      clone: function (obj) {
          var me = arguments.callee;
          if (arguments.length == 1) {
              me.prototype = obj;
              return new me();
          }
      },
              
      _flattenArray: function (res, lst) {
          for (var i = 0; i < lst.length; i++) {
              var o = lst[i];
              if (o instanceof Array) {
                  arguments.callee(res, o);
              } else {
                  res.push(o);
              }
          }
          return res;
      },
      
      /** @id MochiKit.Base.flattenArray */
      flattenArray: function (lst) {
          return MochiKit.Base._flattenArray([], lst);
      },
      
      /** @id MochiKit.Base.flattenArguments */
      flattenArguments: function (lst/* ...*/) {
          var res = [];
          var m = MochiKit.Base;
          var args = m.extend(null, arguments);
          while (args.length) {
              var o = args.shift();
              if (o && typeof(o) == "object" && typeof(o.length) == "number") {
                  for (var i = o.length - 1; i >= 0; i--) {
                      args.unshift(o[i]);
                  }
              } else {
                  res.push(o);
              }
          }
          return res;
      },

      /** @id MochiKit.Base.extend */
      extend: function (self, obj, /* optional */skip) {        
          // Extend an array with an array-like object starting
          // from the skip index
          if (!skip) {
              skip = 0;
          }
          if (obj) {
              // allow iterable fall-through, but skip the full isArrayLike
              // check for speed, this is called often.
              var l = obj.length;
              if (typeof(l) != 'number' /* !isArrayLike(obj) */) {
                  if (typeof(MochiKit.Iter) != "undefined") {
                      obj = MochiKit.Iter.list(obj);
                      l = obj.length;
                  } else {
                      throw new TypeError("Argument not an array-like and MochiKit.Iter not present");
                  }
              }
              if (!self) {
                  self = [];
              }
              for (var i = skip; i < l; i++) {
                  self.push(obj[i]);
              }
          }
          // This mutates, but it's convenient to return because
          // it's often used like a constructor when turning some
          // ghetto array-like to a real array
          return self;
      },


      /** @id MochiKit.Base.updatetree */
      updatetree: function (self, obj/*, ...*/) {
          if (self === null) {
              self = {};
          }
          for (var i = 1; i < arguments.length; i++) {
              var o = arguments[i];
              if (typeof(o) != 'undefined' && o !== null) {
                  for (var k in o) {
                      var v = o[k];
                      if (typeof(self[k]) == 'object' && typeof(v) == 'object') {
                          arguments.callee(self[k], v);
                      } else {
                          self[k] = v;
                      }
                  }
              }
          }
          return self;
      },

      /** @id MochiKit.Base.setdefault */
      setdefault: function (self, obj/*, ...*/) {
          if (self === null) {
              self = {};
          }
          for (var i = 1; i < arguments.length; i++) {
              var o = arguments[i];
              for (var k in o) {
                  if (!(k in self)) {
                      self[k] = o[k];
                  }
              }
          }
          return self;
      },

      /** @id MochiKit.Base.keys */
      keys: function (obj) {
          var rval = [];
          for (var prop in obj) {
              rval.push(prop);
          }
          return rval;
      },
          
      /** @id MochiKit.Base.items */
      items: function (obj) {
          var rval = [];
          var e;
          for (var prop in obj) {
              var v;
              try {
                  v = obj[prop];
              } catch (e) {
                  continue;
              }
              rval.push([prop, v]);
          }
          return rval;
      },


      _newNamedError: function (module, name, func) {
          func.prototype = new MochiKit.Base.NamedError(module.NAME + "." + name);
          module[name] = func;
      },


      /** @id MochiKit.Base.operator */
      operator: {
          // unary logic operators
          /** @id MochiKit.Base.truth */
          truth: function (a) { return !!a; }, 
          /** @id MochiKit.Base.lognot */
          lognot: function (a) { return !a; },
          /** @id MochiKit.Base.identity */
          identity: function (a) { return a; },

          // bitwise unary operators
          /** @id MochiKit.Base.not */
          not: function (a) { return ~a; },
          /** @id MochiKit.Base.neg */
          neg: function (a) { return -a; },

          // binary operators
          /** @id MochiKit.Base.add */
          add: function (a, b) { return a + b; },
          /** @id MochiKit.Base.sub */
          sub: function (a, b) { return a - b; },
          /** @id MochiKit.Base.div */
          div: function (a, b) { return a / b; },
          /** @id MochiKit.Base.mod */
          mod: function (a, b) { return a % b; },
          /** @id MochiKit.Base.mul */
          mul: function (a, b) { return a * b; },

          // bitwise binary operators
          /** @id MochiKit.Base.and */
          and: function (a, b) { return a & b; },
          /** @id MochiKit.Base.or */
          or: function (a, b) { return a | b; },
          /** @id MochiKit.Base.xor */
          xor: function (a, b) { return a ^ b; },
          /** @id MochiKit.Base.lshift */
          lshift: function (a, b) { return a << b; },
          /** @id MochiKit.Base.rshift */
          rshift: function (a, b) { return a >> b; },
          /** @id MochiKit.Base.zrshift */
          zrshift: function (a, b) { return a >>> b; },

          // near-worthless built-in comparators
          /** @id MochiKit.Base.eq */
          eq: function (a, b) { return a == b; },
          /** @id MochiKit.Base.ne */
          ne: function (a, b) { return a != b; },
          /** @id MochiKit.Base.gt */
          gt: function (a, b) { return a > b; },
          /** @id MochiKit.Base.ge */
          ge: function (a, b) { return a >= b; },
          /** @id MochiKit.Base.lt */
          lt: function (a, b) { return a < b; },
          /** @id MochiKit.Base.le */
          le: function (a, b) { return a <= b; },

          // strict built-in comparators
          seq: function (a, b) { return a === b; },
          sne: function (a, b) { return a !== b; },

          // compare comparators
          /** @id MochiKit.Base.ceq */
          ceq: function (a, b) { return MochiKit.Base.compare(a, b) === 0; },
          /** @id MochiKit.Base.cne */
          cne: function (a, b) { return MochiKit.Base.compare(a, b) !== 0; },
          /** @id MochiKit.Base.cgt */
          cgt: function (a, b) { return MochiKit.Base.compare(a, b) == 1; },
          /** @id MochiKit.Base.cge */
          cge: function (a, b) { return MochiKit.Base.compare(a, b) != -1; },
          /** @id MochiKit.Base.clt */
          clt: function (a, b) { return MochiKit.Base.compare(a, b) == -1; },
          /** @id MochiKit.Base.cle */
          cle: function (a, b) { return MochiKit.Base.compare(a, b) != 1; },

          // binary logical operators
          /** @id MochiKit.Base.logand */
          logand: function (a, b) { return a && b; },
          /** @id MochiKit.Base.logor */
          logor: function (a, b) { return a || b; },
          /** @id MochiKit.Base.contains */
          contains: function (a, b) { return b in a; }
      },

      /** @id MochiKit.Base.forwardCall */
      forwardCall: function (func) {
          return function () {
              return this[func].apply(this, arguments);
          };
      },

      /** @id MochiKit.Base.itemgetter */
      itemgetter: function (func) {
          return function (arg) {
              return arg[func];
          };
      },

      /** @id MochiKit.Base.typeMatcher */
      typeMatcher: function (/* typ */) {
          var types = {};
          for (var i = 0; i < arguments.length; i++) {
              var typ = arguments[i];
              types[typ] = typ;
          }
          return function () { 
              for (var i = 0; i < arguments.length; i++) {
                  if (!(typeof(arguments[i]) in types)) {
                      return false;
                  }
              }
              return true;
          };
      },

      /** @id MochiKit.Base.isNull */
      isNull: function (/* ... */) {
          for (var i = 0; i < arguments.length; i++) {
              if (arguments[i] !== null) {
                  return false;
              }
          }
          return true;
      },

      /** @id MochiKit.Base.isUndefinedOrNull */
      isUndefinedOrNull: function (/* ... */) {
          for (var i = 0; i < arguments.length; i++) {
              var o = arguments[i];
              if (!(typeof(o) == 'undefined' || o === null)) {
                  return false;
              }
          }
          return true;
      },

      /** @id MochiKit.Base.isEmpty */
      isEmpty: function (obj) {
          return !MochiKit.Base.isNotEmpty.apply(this, arguments);
      },

      /** @id MochiKit.Base.isNotEmpty */
      isNotEmpty: function (obj) {
          for (var i = 0; i < arguments.length; i++) {
              var o = arguments[i];
              if (!(o && o.length)) {
                  return false;
              }
          }
          return true;
      },

      /** @id MochiKit.Base.isArrayLike */
      isArrayLike: function () {
          for (var i = 0; i < arguments.length; i++) {
              var o = arguments[i];
              var typ = typeof(o);
              if (
                  (typ != 'object' && !(typ == 'function' && typeof(o.item) == 'function')) ||
                  o === null ||
                  typeof(o.length) != 'number' ||
                  o.nodeType === 3
              ) {
                  return false;
              }
          }
          return true;
      },

      /** @id MochiKit.Base.isDateLike */
      isDateLike: function () {
          for (var i = 0; i < arguments.length; i++) {
              var o = arguments[i];
              if (typeof(o) != "object" || o === null
                      || typeof(o.getTime) != 'function') {
                  return false;
              }
          }
          return true;
      },


      /** @id MochiKit.Base.xmap */
      xmap: function (fn/*, obj... */) {
          if (fn === null) {
              return MochiKit.Base.extend(null, arguments, 1);
          }
          var rval = [];
          for (var i = 1; i < arguments.length; i++) {
              rval.push(fn(arguments[i]));
          }
          return rval;
      },

      /** @id MochiKit.Base.map */
      map: function (fn, lst/*, lst... */) {
          var m = MochiKit.Base;
          var itr = MochiKit.Iter;
          var isArrayLike = m.isArrayLike;
          if (arguments.length <= 2) {
              // allow an iterable to be passed
              if (!isArrayLike(lst)) {
                  if (itr) {
                      // fast path for map(null, iterable)
                      lst = itr.list(lst);
                      if (fn === null) {
                          return lst;
                      }
                  } else {
                      throw new TypeError("Argument not an array-like and MochiKit.Iter not present");
                  }
              }
              // fast path for map(null, lst)
              if (fn === null) {
                  return m.extend(null, lst);
              }
              // disabled fast path for map(fn, lst)
              /*
              if (false && typeof(Array.prototype.map) == 'function') {
                  // Mozilla fast-path
                  return Array.prototype.map.call(lst, fn);
              }
              */
              var rval = [];
              for (var i = 0; i < lst.length; i++) {
                  rval.push(fn(lst[i]));
              }
              return rval;
          } else {
              // default for map(null, ...) is zip(...)
              if (fn === null) {
                  fn = Array;
              }
              var length = null;
              for (i = 1; i < arguments.length; i++) {
                  // allow iterables to be passed
                  if (!isArrayLike(arguments[i])) {
                      if (itr) {
                          return itr.list(itr.imap.apply(null, arguments));
                      } else {
                          throw new TypeError("Argument not an array-like and MochiKit.Iter not present");
                      }
                  }
                  // find the minimum length
                  var l = arguments[i].length;
                  if (length === null || length > l) {
                      length = l;
                  }
              }
              rval = [];
              for (i = 0; i < length; i++) {
                  var args = [];
                  for (var j = 1; j < arguments.length; j++) {
                      args.push(arguments[j][i]);
                  }
                  rval.push(fn.apply(this, args));
              }
              return rval;
          }
      },

      /** @id MochiKit.Base.xfilter */
      xfilter: function (fn/*, obj... */) {
          var rval = [];
          if (fn === null) {
              fn = MochiKit.Base.operator.truth;
          }
          for (var i = 1; i < arguments.length; i++) {
              var o = arguments[i];
              if (fn(o)) {
                  rval.push(o);
              }
          }
          return rval;
      },

      /** @id MochiKit.Base.filter */
      filter: function (fn, lst, self) {
          var rval = [];
          // allow an iterable to be passed
          var m = MochiKit.Base;
          if (!m.isArrayLike(lst)) {
              if (MochiKit.Iter) {
                  lst = MochiKit.Iter.list(lst);
              } else {
                  throw new TypeError("Argument not an array-like and MochiKit.Iter not present");
              }
          }
          if (fn === null) {
              fn = m.operator.truth;
          }
          if (typeof(Array.prototype.filter) == 'function') {
              // Mozilla fast-path
              return Array.prototype.filter.call(lst, fn, self);
          } else if (typeof(self) == 'undefined' || self === null) {
              for (var i = 0; i < lst.length; i++) {
                  var o = lst[i];
                  if (fn(o)) {
                      rval.push(o);
                  }
              }
          } else {
              for (i = 0; i < lst.length; i++) {
                  o = lst[i];
                  if (fn.call(self, o)) {
                      rval.push(o);
                  }
              }
          }
          return rval;
      },


      _wrapDumbFunction: function (func) {
          return function () {
              // fast path!
              switch (arguments.length) {
                  case 0: return func();
                  case 1: return func(arguments[0]);
                  case 2: return func(arguments[0], arguments[1]);
                  case 3: return func(arguments[0], arguments[1], arguments[2]);
              }
              var args = [];
              for (var i = 0; i < arguments.length; i++) {
                  args.push("arguments[" + i + "]");
              }
              return eval("(func(" + args.join(",") + "))");
          };
      },

      /** @id MochiKit.Base.methodcaller */
      methodcaller: function (func/*, args... */) {
          var args = MochiKit.Base.extend(null, arguments, 1);
          if (typeof(func) == "function") {
              return function (obj) {
                  return func.apply(obj, args);
              };
          } else {
              return function (obj) {
                  return obj[func].apply(obj, args);
              };
          }
      },
      
      /** @id MochiKit.Base.method */
      method: function (self, func) {
          var m = MochiKit.Base;
          return m.bind.apply(this, m.extend([func, self], arguments, 2));
      },

      /** @id MochiKit.Base.compose */
      compose: function (f1, f2/*, f3, ... fN */) {
          var fnlist = [];
          var m = MochiKit.Base;
          if (arguments.length === 0) {
              throw new TypeError("compose() requires at least one argument");
          }
          for (var i = 0; i < arguments.length; i++) {
              var fn = arguments[i];
              if (typeof(fn) != "function") {
                  throw new TypeError(m.repr(fn) + " is not a function");
              }
              fnlist.push(fn);
          }
          return function () {
              var args = arguments;
              for (var i = fnlist.length - 1; i >= 0; i--) {
                  args = [fnlist[i].apply(this, args)];
              }
              return args[0];
          };
      },
          
      /** @id MochiKit.Base.bind */
      bind: function (func, self/* args... */) {
          if (typeof(func) == "string") {
              func = self[func];
          }
          var im_func = func.im_func;
          var im_preargs = func.im_preargs;
          var im_self = func.im_self;
          var m = MochiKit.Base;
          if (typeof(func) == "function" && typeof(func.apply) == "undefined") {
              // this is for cases where JavaScript sucks ass and gives you a
              // really dumb built-in function like alert() that doesn't have
              // an apply
              func = m._wrapDumbFunction(func);
          }
          if (typeof(im_func) != 'function') {
              im_func = func;
          }
          if (typeof(self) != 'undefined') {
              im_self = self;
          }
          if (typeof(im_preargs) == 'undefined') {
              im_preargs = [];
          } else  {
              im_preargs = im_preargs.slice();
          }
          m.extend(im_preargs, arguments, 2);
          var newfunc = function () {
              var args = arguments;
              var me = arguments.callee;
              if (me.im_preargs.length > 0) {
                  args = m.concat(me.im_preargs, args);
              }
              var self = me.im_self;
              if (!self) {
                  self = this;
              }
              return me.im_func.apply(self, args);
          };
          newfunc.im_self = im_self;
          newfunc.im_func = im_func;
          newfunc.im_preargs = im_preargs;
          return newfunc;
      },

      /** @id MochiKit.Base.bindMethods */
      bindMethods: function (self) {
          var bind = MochiKit.Base.bind;
          for (var k in self) {
              var func = self[k];
              if (typeof(func) == 'function') {
                  self[k] = bind(func, self);
              }
          }
      },

      /** @id MochiKit.Base.registerComparator */
      registerComparator: function (name, check, comparator, /* optional */ override) {
          MochiKit.Base.comparatorRegistry.register(name, check, comparator, override);
      },

      _primitives: {'boolean': true, 'string': true, 'number': true},

      /** @id MochiKit.Base.compare */
      compare: function (a, b) {
          if (a == b) {
              return 0;
          }
          var aIsNull = (typeof(a) == 'undefined' || a === null);
          var bIsNull = (typeof(b) == 'undefined' || b === null);
          if (aIsNull && bIsNull) {
              return 0;
          } else if (aIsNull) {
              return -1;
          } else if (bIsNull) {
              return 1;
          }
          var m = MochiKit.Base;
          // bool, number, string have meaningful comparisons
          var prim = m._primitives;
          if (!(typeof(a) in prim && typeof(b) in prim)) {
              try {
                  return m.comparatorRegistry.match(a, b);
              } catch (e) {
                  if (e != m.NotFound) {
                      throw e;
                  }
              }
          }
          if (a < b) {
              return -1;
          } else if (a > b) {
              return 1;
          }
          // These types can't be compared
          var repr = m.repr;
          throw new TypeError(repr(a) + " and " + repr(b) + " can not be compared");
      },

      /** @id MochiKit.Base.compareDateLike */
      compareDateLike: function (a, b) {
          return MochiKit.Base.compare(a.getTime(), b.getTime());
      },

      /** @id MochiKit.Base.compareArrayLike */
      compareArrayLike: function (a, b) {
          var compare = MochiKit.Base.compare;
          var count = a.length;
          var rval = 0;
          if (count > b.length) {
              rval = 1;
              count = b.length;
          } else if (count < b.length) {
              rval = -1;
          }
          for (var i = 0; i < count; i++) {
              var cmp = compare(a[i], b[i]);
              if (cmp) {
                  return cmp;
              }
          }
          return rval;
      },

      /** @id MochiKit.Base.registerRepr */
      registerRepr: function (name, check, wrap, /* optional */override) {
          MochiKit.Base.reprRegistry.register(name, check, wrap, override);
      },

      /** @id MochiKit.Base.repr */
      repr: function (o) {
          if (typeof(o) == "undefined") {
              return "undefined";
          } else if (o === null) {
              return "null";
          }
          try {
              if (typeof(o.__repr__) == 'function') {
                  return o.__repr__();
              } else if (typeof(o.repr) == 'function' && o.repr != arguments.callee) {
                  return o.repr();
              }
              return MochiKit.Base.reprRegistry.match(o);
          } catch (e) {
              if (typeof(o.NAME) == 'string' && (
                      o.toString == Function.prototype.toString ||
                      o.toString == Object.prototype.toString
                  )) {
                  return o.NAME;
              }
          }
          try {
              var ostring = (o + "");
          } catch (e) {
              return "[" + typeof(o) + "]";
          }
          if (typeof(o) == "function") {
              o = ostring.replace(/^\s+/, "");
              var idx = o.indexOf("{");
              if (idx != -1) {
                  o = o.substr(0, idx) + "{...}";
              }
          }
          return ostring;
      },

      /** @id MochiKit.Base.reprArrayLike */
      reprArrayLike: function (o) {
          var m = MochiKit.Base;
          return "[" + m.map(m.repr, o).join(", ") + "]";
      },

      /** @id MochiKit.Base.reprString */
      reprString: function (o) { 
          return ('"' + o.replace(/(["\\])/g, '\\$1') + '"'
              ).replace(/[\f]/g, "\\f"
              ).replace(/[\b]/g, "\\b"
              ).replace(/[\n]/g, "\\n"
              ).replace(/[\t]/g, "\\t"
              ).replace(/[\r]/g, "\\r");
      },

      /** @id MochiKit.Base.reprNumber */
      reprNumber: function (o) {
          return o + "";
      },

      /** @id MochiKit.Base.registerJSON */
      registerJSON: function (name, check, wrap, /* optional */override) {
          MochiKit.Base.jsonRegistry.register(name, check, wrap, override);
      },


      /** @id MochiKit.Base.evalJSON */
      evalJSON: function () {
          return eval("(" + arguments[0] + ")");
      },

      /** @id MochiKit.Base.serializeJSON */
      serializeJSON: function (o) {
          var objtype = typeof(o);
          if (objtype == "number" || objtype == "boolean") {
              return o + "";
          } else if (o === null) {
              return "null";
          }
          var m = MochiKit.Base;
          var reprString = m.reprString;
          if (objtype == "string") {
              return reprString(o);
          }
          // recurse
          var me = arguments.callee;
          // short-circuit for objects that support "json" serialization
          // if they return "self" then just pass-through...
          var newObj;
          if (typeof(o.__json__) == "function") {
              newObj = o.__json__();
              if (o !== newObj) {
                  return me(newObj);
              }
          }
          if (typeof(o.json) == "function") {
              newObj = o.json();
              if (o !== newObj) {
                  return me(newObj);
              }
          }
          // array
          if (objtype != "function" && typeof(o.length) == "number") {
              var res = [];
              for (var i = 0; i < o.length; i++) {
                  var val = me(o[i]);
                  if (typeof(val) != "string") {
                      val = "undefined";
                  }
                  res.push(val);
              }
              return "[" + res.join(", ") + "]";
          }
          // look in the registry
          try {
              newObj = m.jsonRegistry.match(o);
              if (o !== newObj) {
                  return me(newObj);
              }
          } catch (e) {
              if (e != m.NotFound) {
                  // something really bad happened
                  throw e;
              }
          }
          // undefined is outside of the spec
          if (objtype == "undefined") {
              throw new TypeError("undefined can not be serialized as JSON");
          }
          // it's a function with no adapter, bad
          if (objtype == "function") {
              return null;
          }
          // generic object code path
          res = [];
          for (var k in o) {
              var useKey;
              if (typeof(k) == "number") {
                  useKey = '"' + k + '"';
              } else if (typeof(k) == "string") {
                  useKey = reprString(k);
              } else {
                  // skip non-string or number keys
                  continue;
              }
              val = me(o[k]);
              if (typeof(val) != "string") {
                  // skip non-serializable values
                  continue;
              }
              res.push(useKey + ":" + val);
          }
          return "{" + res.join(", ") + "}";
      },
              

      /** @id MochiKit.Base.objEqual */
      objEqual: function (a, b) {
          return (MochiKit.Base.compare(a, b) === 0);
      },

      /** @id MochiKit.Base.arrayEqual */
      arrayEqual: function (self, arr) {
          if (self.length != arr.length) {
              return false;
          }
          return (MochiKit.Base.compare(self, arr) === 0);
      },

      /** @id MochiKit.Base.concat */
      concat: function (/* lst... */) {
          var rval = [];
          var extend = MochiKit.Base.extend;
          for (var i = 0; i < arguments.length; i++) {
              extend(rval, arguments[i]);
          }
          return rval;
      },

      /** @id MochiKit.Base.keyComparator */
      keyComparator: function (key/* ... */) {
          // fast-path for single key comparisons
          var m = MochiKit.Base;
          var compare = m.compare;
          if (arguments.length == 1) {
              return function (a, b) {
                  return compare(a[key], b[key]);
              };
          }
          var compareKeys = m.extend(null, arguments);
          return function (a, b) {
              var rval = 0;
              // keep comparing until something is inequal or we run out of
              // keys to compare
              for (var i = 0; (rval === 0) && (i < compareKeys.length); i++) {
                  var key = compareKeys[i];
                  rval = compare(a[key], b[key]);
              }
              return rval;
          };
      },

      /** @id MochiKit.Base.reverseKeyComparator */
      reverseKeyComparator: function (key) {
          var comparator = MochiKit.Base.keyComparator.apply(this, arguments);
          return function (a, b) {
              return comparator(b, a);
          };
      },

      /** @id MochiKit.Base.partial */
      partial: function (func) {
          var m = MochiKit.Base;
          return m.bind.apply(this, m.extend([func, undefined], arguments, 1));
      },
       
      /** @id MochiKit.Base.listMinMax */
      listMinMax: function (which, lst) {
          if (lst.length === 0) {
              return null;
          }
          var cur = lst[0];
          var compare = MochiKit.Base.compare;
          for (var i = 1; i < lst.length; i++) {
              var o = lst[i];
              if (compare(o, cur) == which) {
                  cur = o;
              }
          }
          return cur;
      },

      /** @id MochiKit.Base.objMax */
      objMax: function (/* obj... */) {
          return MochiKit.Base.listMinMax(1, arguments);
      },
              
      /** @id MochiKit.Base.objMin */
      objMin: function (/* obj... */) {
          return MochiKit.Base.listMinMax(-1, arguments);
      },

      /** @id MochiKit.Base.findIdentical */
      findIdentical: function (lst, value, start/* = 0 */, /* optional */end) {
          if (typeof(end) == "undefined" || end === null) {
              end = lst.length;
          }
          if (typeof(start) == "undefined" || start === null) {
              start = 0;
          }
          for (var i = start; i < end; i++) {
              if (lst[i] === value) {
                  return i;
              }
          }
          return -1;
      },

      /** @id MochiKit.Base.mean */
      mean: function(/* lst... */) {
          /* http://www.nist.gov/dads/HTML/mean.html */
          var sum = 0;

          var m = MochiKit.Base;
          var args = m.extend(null, arguments);
          var count = args.length;

          while (args.length) {
              var o = args.shift();
              if (o && typeof(o) == "object" && typeof(o.length) == "number") {
                  count += o.length - 1;
                  for (var i = o.length - 1; i >= 0; i--) {
                      sum += o[i];
                  }
              } else {
                  sum += o;
              }
          }

          if (count <= 0) {
              throw new TypeError('mean() requires at least one argument');
          }

          return sum/count;
      },
      
      /** @id MochiKit.Base.median */
      median: function(/* lst... */) {
          /* http://www.nist.gov/dads/HTML/median.html */
          var data = MochiKit.Base.flattenArguments(arguments);
          if (data.length === 0) {
              throw new TypeError('median() requires at least one argument');
          }
          data.sort(compare);
          if (data.length % 2 == 0) {
              var upper = data.length / 2;
              return (data[upper] + data[upper - 1]) / 2;
          } else {
              return data[(data.length - 1) / 2];
          }
      },

      /** @id MochiKit.Base.findValue */
      findValue: function (lst, value, start/* = 0 */, /* optional */end) {
          if (typeof(end) == "undefined" || end === null) {
              end = lst.length;
          }
          if (typeof(start) == "undefined" || start === null) {
              start = 0;
          }
          var cmp = MochiKit.Base.compare;
          for (var i = start; i < end; i++) {
              if (cmp(lst[i], value) === 0) {
                  return i;
              }
          }
          return -1;
      },
      
      /** @id MochiKit.Base.nodeWalk */
      nodeWalk: function (node, visitor) {
          var nodes = [node];
          var extend = MochiKit.Base.extend;
          while (nodes.length) {
              var res = visitor(nodes.shift());
              if (res) {
                  extend(nodes, res);
              }
          }
      },

         
      /** @id MochiKit.Base.nameFunctions */
      nameFunctions: function (namespace) {
          var base = namespace.NAME;
          if (typeof(base) == 'undefined') {
              base = '';
          } else {
              base = base + '.';
          }
          for (var name in namespace) {
              var o = namespace[name];
              if (typeof(o) == 'function' && typeof(o.NAME) == 'undefined') {
                  try {
                      o.NAME = base + name;
                  } catch (e) {
                      // pass
                  }
              }
          }
      },


      /** @id MochiKit.Base.queryString */
      queryString: function (names, values) {
          // check to see if names is a string or a DOM element, and if
          // MochiKit.DOM is available.  If so, drop it like it's a form
          // Ugliest conditional in MochiKit?  Probably!
          if (typeof(MochiKit.DOM) != "undefined" && arguments.length == 1
              && (typeof(names) == "string" || (
                  typeof(names.nodeType) != "undefined" && names.nodeType > 0
              ))
          ) {
              var kv = MochiKit.DOM.formContents(names);
              names = kv[0];
              values = kv[1];
          } else if (arguments.length == 1) {
              var o = names;
              names = [];
              values = [];
              for (var k in o) {
                  var v = o[k];
                  if (typeof(v) != "function") {
                      names.push(k);
                      values.push(v);
                  }
              }
          }
          var rval = [];
          var len = Math.min(names.length, values.length);
          var urlEncode = MochiKit.Base.urlEncode;
          for (var i = 0; i < len; i++) {
              v = values[i];
              if (typeof(v) != 'undefined' && v !== null) {
                  rval.push(urlEncode(names[i]) + "=" + urlEncode(v));
              }
          }
          return rval.join("&");
      },


      /** @id MochiKit.Base.parseQueryString */
      parseQueryString: function (encodedString, useArrays) {
          var pairs = encodedString.replace(/\+/g, "%20").split("&");
          var o = {};
          var decode;
          if (typeof(decodeURIComponent) != "undefined") {
              decode = decodeURIComponent;
          } else {
              decode = unescape;
          }
          if (useArrays) {
              for (var i = 0; i < pairs.length; i++) {
                  var pair = pairs[i].split("=");
                  var name = decode(pair[0]);
                  var arr = o[name];
                  if (!(arr instanceof Array)) {
                      arr = [];
                      o[name] = arr;
                  }
                  arr.push(decode(pair[1]));
              }
          } else {
              for (i = 0; i < pairs.length; i++) {
                  pair = pairs[i].split("=");
                  o[decode(pair[0])] = decode(pair[1]);
              }
          }
          return o;
      }
  });
      
  /** @id MochiKit.Base.AdapterRegistry */
  MochiKit.Base.AdapterRegistry = function () {
      this.pairs = [];
  };

  MochiKit.Base.AdapterRegistry.prototype = {
      /** @id MochiKit.Base.AdapterRegistry.prototype.register */
      register: function (name, check, wrap, /* optional */ override) {
          if (override) {
              this.pairs.unshift([name, check, wrap]);
          } else {
              this.pairs.push([name, check, wrap]);
          }
      },

      /** @id MochiKit.Base.AdapterRegistry.prototype.match */
      match: function (/* ... */) {
          for (var i = 0; i < this.pairs.length; i++) {
              var pair = this.pairs[i];
              if (pair[1].apply(this, arguments)) {
                  return pair[2].apply(this, arguments);
              }
          }
          throw MochiKit.Base.NotFound;
      },

      /** @id MochiKit.Base.AdapterRegistry.prototype.unregister */
      unregister: function (name) {
          for (var i = 0; i < this.pairs.length; i++) {
              var pair = this.pairs[i];
              if (pair[0] == name) {
                  this.pairs.splice(i, 1);
                  return true;
              }
          }
          return false;
      }
  };


  MochiKit.Base.EXPORT = [
      "flattenArray",
      "noop",
      "camelize",
      "counter",
      "clone",
      "extend",
      "update",
      "updatetree",
      "setdefault",
      "keys",
      "items",
      "NamedError",
      "operator",
      "forwardCall",
      "itemgetter",
      "typeMatcher",
      "isCallable",
      "isUndefined",
      "isUndefinedOrNull",
      "isNull",
      "isEmpty",
      "isNotEmpty",
      "isArrayLike",
      "isDateLike",
      "xmap",
      "map",
      "xfilter",
      "filter",
      "methodcaller",
      "compose",
      "bind",
      "bindMethods",
      "NotFound",
      "AdapterRegistry",
      "registerComparator",
      "compare",
      "registerRepr",
      "repr",
      "objEqual",
      "arrayEqual",
      "concat",
      "keyComparator",
      "reverseKeyComparator",
      "partial",
      "merge",
      "listMinMax",
      "listMax",
      "listMin",
      "objMax",
      "objMin",
      "nodeWalk",
      "zip",
      "urlEncode",
      "queryString",
      "serializeJSON",
      "registerJSON",
      "evalJSON",
      "parseQueryString",
      "findValue",
      "findIdentical",
      "flattenArguments",
      "method",
      "average",
      "mean",
      "median"
  ];

  MochiKit.Base.EXPORT_OK = [
      "nameFunctions",
      "comparatorRegistry",
      "reprRegistry",
      "jsonRegistry",
      "compareDateLike",
      "compareArrayLike",
      "reprArrayLike",
      "reprString",
      "reprNumber"
  ];

  MochiKit.Base._exportSymbols = function (globals, module) {
      if (typeof(MochiKit.__export__) == "undefined") {
          MochiKit.__export__ = (MochiKit.__compat__  ||
              (typeof(JSAN) == 'undefined' && typeof(dojo) == 'undefined')
          );
      }
      if (!MochiKit.__export__) {
          return;
      }
      var all = module.EXPORT_TAGS[":all"];
      for (var i = 0; i < all.length; i++) {
          globals[all[i]] = module[all[i]];
      }
  };

  MochiKit.Base.__new__ = function () {
      // A singleton raised when no suitable adapter is found
      var m = this;

      // convenience
      /** @id MochiKit.Base.noop */
      m.noop = m.operator.identity;
      
      // Backwards compat
      m.forward = m.forwardCall;
      m.find = m.findValue;

      if (typeof(encodeURIComponent) != "undefined") {
          /** @id MochiKit.Base.urlEncode */
          m.urlEncode = function (unencoded) {
              return encodeURIComponent(unencoded).replace(/\'/g, '%27');
          };
      } else {
          m.urlEncode = function (unencoded) {
              return escape(unencoded
                  ).replace(/\+/g, '%2B'
                  ).replace(/\"/g,'%22'
                  ).rval.replace(/\'/g, '%27');
          };
      }

      /** @id MochiKit.Base.NamedError */
      m.NamedError = function (name) {
          this.message = name;
          this.name = name;
      };
      m.NamedError.prototype = new Error();
      m.update(m.NamedError.prototype, {
          repr: function () {
              if (this.message && this.message != this.name) {
                  return this.name + "(" + m.repr(this.message) + ")";
              } else {
                  return this.name + "()";
              }
          },
          toString: m.forwardCall("repr")
      });

      /** @id MochiKit.Base.NotFound */
      m.NotFound = new m.NamedError("MochiKit.Base.NotFound");


      /** @id MochiKit.Base.listMax */
      m.listMax = m.partial(m.listMinMax, 1);
      /** @id MochiKit.Base.listMin */
      m.listMin = m.partial(m.listMinMax, -1);

      /** @id MochiKit.Base.isCallable */
      m.isCallable = m.typeMatcher('function');
      /** @id MochiKit.Base.isUndefined */
      m.isUndefined = m.typeMatcher('undefined');

      /** @id MochiKit.Base.merge */
      m.merge = m.partial(m.update, null);
      /** @id MochiKit.Base.zip */
      m.zip = m.partial(m.map, null);

      /** @id MochiKit.Base.average */    
      m.average = m.mean;

      /** @id MochiKit.Base.comparatorRegistry */
      m.comparatorRegistry = new m.AdapterRegistry();
      m.registerComparator("dateLike", m.isDateLike, m.compareDateLike);
      m.registerComparator("arrayLike", m.isArrayLike, m.compareArrayLike);

      /** @id MochiKit.Base.reprRegistry */
      m.reprRegistry = new m.AdapterRegistry();
      m.registerRepr("arrayLike", m.isArrayLike, m.reprArrayLike);
      m.registerRepr("string", m.typeMatcher("string"), m.reprString);
      m.registerRepr("numbers", m.typeMatcher("number", "boolean"), m.reprNumber);

      /** @id MochiKit.Base.jsonRegistry */
      m.jsonRegistry = new m.AdapterRegistry();

      var all = m.concat(m.EXPORT, m.EXPORT_OK);
      m.EXPORT_TAGS = {
          ":common": m.concat(m.EXPORT_OK),
          ":all": all
      };

      m.nameFunctions(this);

  };

  MochiKit.Base.__new__();

  //
  // XXX: Internet Explorer blows
  //
  if (MochiKit.__export__) {
      // compare = MochiKit.Base.compare;
  }

  MochiKit.Base._exportSymbols(MochiNameSpace, MochiKit.Base);
  /***

  MochiKit.Iter 1.4

  See <http://mochikit.com/> for documentation, downloads, license, etc.

  (c) 2005 Bob Ippolito.  All rights Reserved.

  ***/

  if (typeof(dojo) != 'undefined') {
      dojo.provide('MochiKit.Iter');
      dojo.require('MochiKit.Base');
  }

  if (typeof(JSAN) != 'undefined') {
      JSAN.use("MochiKit.Base", []);
  }   

  try {
      if (typeof(MochiKit.Base) == 'undefined') {
          throw "";
      }
  } catch (e) {
      throw "MochiKit.Iter depends on MochiKit.Base!";
  }  
              
  if (typeof(MochiKit.Iter) == 'undefined') {
      MochiKit.Iter = {};
  }           
          
  MochiKit.Iter.NAME = "MochiKit.Iter";
  MochiKit.Iter.VERSION = "1.4";
  MochiKit.Base.update(MochiKit.Iter, {
      __repr__: function () {
          return "[" + this.NAME + " " + this.VERSION + "]";
      },
      toString: function () {
          return this.__repr__();
      },

      /** @id MochiKit.Iter.registerIteratorFactory  */
      registerIteratorFactory: function (name, check, iterfactory, /* optional */ override) {
          MochiKit.Iter.iteratorRegistry.register(name, check, iterfactory, override);
      },

      /** @id MochiKit.Iter.iter */
      iter: function (iterable, /* optional */ sentinel) {
          var self = MochiKit.Iter;
          if (arguments.length == 2) {
              return self.takewhile(
                  function (a) { return a != sentinel; },
                  iterable
              );
          }
          if (typeof(iterable.next) == 'function') {
              return iterable;
          } else if (typeof(iterable.iter) == 'function') {
              return iterable.iter();
          /*
          }  else if (typeof(iterable.__iterator__) == 'function') {
              //
              // XXX: We can't support JavaScript 1.7 __iterator__ directly
              //      because of Object.prototype.__iterator__
              //
              return iterable.__iterator__();
          */
          }

          try {
              return self.iteratorRegistry.match(iterable);
          } catch (e) {
              var m = MochiKit.Base;
              if (e == m.NotFound) {
                  e = new TypeError(typeof(iterable) + ": " + m.repr(iterable) + " is not iterable");
              }
              throw e;
          }
      },

      /** @id MochiKit.Iter.count */
      count: function (n) {
          if (!n) {
              n = 0;
          }
          var m = MochiKit.Base;
          return {
              repr: function () { return "count(" + n + ")"; },
              toString: m.forwardCall("repr"),
              next: m.counter(n)
          };
      },

      /** @id MochiKit.Iter.cycle */
      cycle: function (p) {
          var self = MochiKit.Iter;
          var m = MochiKit.Base;
          var lst = [];
          var iterator = self.iter(p);
          return {
              repr: function () { return "cycle(...)"; },
              toString: m.forwardCall("repr"),
              next: function () {
                  try {
                      var rval = iterator.next();
                      lst.push(rval);
                      return rval;
                  } catch (e) {
                      if (e != self.StopIteration) {
                          throw e;
                      }
                      if (lst.length === 0) {
                          this.next = function () {
                              throw self.StopIteration;
                          };
                      } else {
                          var i = -1;
                          this.next = function () {
                              i = (i + 1) % lst.length;
                              return lst[i];
                          };
                      }
                      return this.next();
                  }
              }
          };
      },

      /** @id MochiKit.Iter.repeat */
      repeat: function (elem, /* optional */n) {
          var m = MochiKit.Base;
          if (typeof(n) == 'undefined') {
              return {
                  repr: function () {
                      return "repeat(" + m.repr(elem) + ")";
                  },
                  toString: m.forwardCall("repr"),
                  next: function () {
                      return elem;
                  }
              };
          }
          return {
              repr: function () {
                  return "repeat(" + m.repr(elem) + ", " + n + ")";
              },
              toString: m.forwardCall("repr"),
              next: function () {
                  if (n <= 0) {
                      throw MochiKit.Iter.StopIteration;
                  }
                  n -= 1;
                  return elem;
              }
          };
      },
              
      /** @id MochiKit.Iter.next */
      next: function (iterator) {
          return iterator.next();
      },

      /** @id MochiKit.Iter.izip */
      izip: function (p, q/*, ...*/) {
          var m = MochiKit.Base;
          var self = MochiKit.Iter;
          var next = self.next;
          var iterables = m.map(self.iter, arguments);
          return {
              repr: function () { return "izip(...)"; },
              toString: m.forwardCall("repr"),
              next: function () { return m.map(next, iterables); }
          };
      },

      /** @id MochiKit.Iter.ifilter */
      ifilter: function (pred, seq) {
          var m = MochiKit.Base;
          seq = MochiKit.Iter.iter(seq);
          if (pred === null) {
              pred = m.operator.truth;
          }
          return {
              repr: function () { return "ifilter(...)"; },
              toString: m.forwardCall("repr"),
              next: function () {
                  while (true) {
                      var rval = seq.next();
                      if (pred(rval)) {
                          return rval;
                      }
                  }
                  // mozilla warnings aren't too bright
                  return undefined;
              }
          };
      },

      /** @id MochiKit.Iter.ifilterfalse */
      ifilterfalse: function (pred, seq) {
          var m = MochiKit.Base;
          seq = MochiKit.Iter.iter(seq);
          if (pred === null) {
              pred = m.operator.truth;
          }
          return {
              repr: function () { return "ifilterfalse(...)"; },
              toString: m.forwardCall("repr"),
              next: function () {
                  while (true) {
                      var rval = seq.next();
                      if (!pred(rval)) {
                          return rval;
                      }
                  }
                  // mozilla warnings aren't too bright
                  return undefined;
              }
          };
      },
       
      /** @id MochiKit.Iter.islice */
      islice: function (seq/*, [start,] stop[, step] */) {
          var self = MochiKit.Iter;
          var m = MochiKit.Base;
          seq = self.iter(seq);
          var start = 0;
          var stop = 0;
          var step = 1;
          var i = -1;
          if (arguments.length == 2) {
              stop = arguments[1];
          } else if (arguments.length == 3) {
              start = arguments[1];
              stop = arguments[2];
          } else {
              start = arguments[1];
              stop = arguments[2];
              step = arguments[3];
          }
          return {
              repr: function () {
                  return "islice(" + ["...", start, stop, step].join(", ") + ")";
              },
              toString: m.forwardCall("repr"),
              next: function () {
                  var rval;
                  while (i < start) {
                      rval = seq.next();
                      i++;
                  }
                  if (start >= stop) {
                      throw self.StopIteration;
                  }
                  start += step;
                  return rval;
              }
          };
      },

      /** @id MochiKit.Iter.imap */
      imap: function (fun, p, q/*, ...*/) {
          var m = MochiKit.Base;
          var self = MochiKit.Iter;
          var iterables = m.map(self.iter, m.extend(null, arguments, 1));
          var map = m.map;
          var next = self.next;
          return {
              repr: function () { return "imap(...)"; },
              toString: m.forwardCall("repr"),
              next: function () {
                  return fun.apply(this, map(next, iterables));
              }
          };
      },
          
      /** @id MochiKit.Iter.applymap */
      applymap: function (fun, seq, self) {
          seq = MochiKit.Iter.iter(seq);
          var m = MochiKit.Base;
          return {
              repr: function () { return "applymap(...)"; },
              toString: m.forwardCall("repr"),
              next: function () {
                  return fun.apply(self, seq.next());
              }
          };
      },

      /** @id MochiKit.Iter.chain */
      chain: function (p, q/*, ...*/) {
          // dumb fast path
          var self = MochiKit.Iter;
          var m = MochiKit.Base;
          if (arguments.length == 1) {
              return self.iter(arguments[0]);
          }
          var argiter = m.map(self.iter, arguments);
          return {
              repr: function () { return "chain(...)"; },
              toString: m.forwardCall("repr"),
              next: function () {
                  while (argiter.length > 1) {
                      try {
                          return argiter[0].next();
                      } catch (e) {
                          if (e != self.StopIteration) {
                              throw e;
                          }
                          argiter.shift();
                      }
                  }
                  if (argiter.length == 1) {
                      // optimize last element
                      var arg = argiter.shift();
                      this.next = m.bind("next", arg);
                      return this.next();
                  }
                  throw self.StopIteration;
              }
          };
      },

      /** @id MochiKit.Iter.takewhile */
      takewhile: function (pred, seq) {
          var self = MochiKit.Iter;
          seq = self.iter(seq);
          return {
              repr: function () { return "takewhile(...)"; },
              toString: MochiKit.Base.forwardCall("repr"),
              next: function () {
                  var rval = seq.next();
                  if (!pred(rval)) {
                      this.next = function () {
                          throw self.StopIteration;
                      };
                      this.next();
                  }
                  return rval;
              }
          };
      },

      /** @id MochiKit.Iter.dropwhile */
      dropwhile: function (pred, seq) {
          seq = MochiKit.Iter.iter(seq);
          var m = MochiKit.Base;
          var bind = m.bind;
          return {
              "repr": function () { return "dropwhile(...)"; },
              "toString": m.forwardCall("repr"),
              "next": function () {
                  while (true) {
                      var rval = seq.next();
                      if (!pred(rval)) {
                          break;
                      }
                  }
                  this.next = bind("next", seq);
                  return rval;
              }
          };
      },

      _tee: function (ident, sync, iterable) {
          sync.pos[ident] = -1;
          var m = MochiKit.Base;
          var listMin = m.listMin;
          return {
              repr: function () { return "tee(" + ident + ", ...)"; },
              toString: m.forwardCall("repr"),
              next: function () {
                  var rval;
                  var i = sync.pos[ident];

                  if (i == sync.max) {
                      rval = iterable.next();
                      sync.deque.push(rval);
                      sync.max += 1;
                      sync.pos[ident] += 1;
                  } else {
                      rval = sync.deque[i - sync.min];
                      sync.pos[ident] += 1;
                      if (i == sync.min && listMin(sync.pos) != sync.min) {
                          sync.min += 1;
                          sync.deque.shift();
                      }
                  }
                  return rval;
              }
          };
      },

      /** @id MochiKit.Iter.tee */
      tee: function (iterable, n/* = 2 */) {
          var rval = [];
          var sync = {
              "pos": [],
              "deque": [],
              "max": -1,
              "min": -1
          };
          if (arguments.length == 1 || typeof(n) == "undefined" || n === null) {
              n = 2;
          }
          var self = MochiKit.Iter;
          iterable = self.iter(iterable);
          var _tee = self._tee;
          for (var i = 0; i < n; i++) {
              rval.push(_tee(i, sync, iterable));
          }
          return rval;
      },

      /** @id MochiKit.Iter.list */
      list: function (iterable) {
          // Fast-path for Array and Array-like
          var m = MochiKit.Base;
          if (typeof(iterable.slice) == 'function') {
              return iterable.slice();
          } else if (m.isArrayLike(iterable)) {
              return m.concat(iterable);
          }

          var self = MochiKit.Iter;
          iterable = self.iter(iterable);
          var rval = [];
          try {
              while (true) {
                  rval.push(iterable.next());
              }
          } catch (e) {
              if (e != self.StopIteration) {
                  throw e;
              }
              return rval;
          }
          // mozilla warnings aren't too bright
          return undefined;
      },

          
      /** @id MochiKit.Iter.reduce */
      reduce: function (fn, iterable, /* optional */initial) {
          var i = 0;
          var x = initial;
          var self = MochiKit.Iter;
          iterable = self.iter(iterable);
          if (arguments.length < 3) {
              try {
                  x = iterable.next();
              } catch (e) {
                  if (e == self.StopIteration) {
                      e = new TypeError("reduce() of empty sequence with no initial value");
                  }
                  throw e;
              }
              i++;
          }
          try {
              while (true) {
                  x = fn(x, iterable.next());
              }
          } catch (e) {
              if (e != self.StopIteration) {
                  throw e;
              }
          }
          return x;
      },

      /** @id MochiKit.Iter.range */
      range: function (/* [start,] stop[, step] */) {
          var start = 0;
          var stop = 0;
          var step = 1;
          if (arguments.length == 1) {
              stop = arguments[0];
          } else if (arguments.length == 2) {
              start = arguments[0];
              stop = arguments[1];
          } else if (arguments.length == 3) {
              start = arguments[0];
              stop = arguments[1];
              step = arguments[2];
          } else {
              throw new TypeError("range() takes 1, 2, or 3 arguments!");
          }
          if (step === 0) {
              throw new TypeError("range() step must not be 0");
          }
          return {
              next: function () {
                  if ((step > 0 && start >= stop) || (step < 0 && start <= stop)) {
                      throw MochiKit.Iter.StopIteration;
                  }
                  var rval = start;
                  start += step;
                  return rval;
              },
              repr: function () {
                  return "range(" + [start, stop, step].join(", ") + ")";
              },
              toString: MochiKit.Base.forwardCall("repr")
          };
      },
              
      /** @id MochiKit.Iter.sum */
      sum: function (iterable, start/* = 0 */) {
          if (typeof(start) == "undefined" || start === null) {
              start = 0;
          }
          var x = start;
          var self = MochiKit.Iter;
          iterable = self.iter(iterable);
          try {
              while (true) {
                  x += iterable.next();
              }
          } catch (e) {
              if (e != self.StopIteration) {
                  throw e;
              }
          }
          return x;
      },
              
      /** @id MochiKit.Iter.exhaust */
      exhaust: function (iterable) {
          var self = MochiKit.Iter;
          iterable = self.iter(iterable);
          try {
              while (true) {
                  iterable.next();
              }
          } catch (e) {
              if (e != self.StopIteration) {
                  throw e;
              }
          }
      },

      /** @id MochiKit.Iter.forEach */
      forEach: function (iterable, func, /* optional */self) {
          var m = MochiKit.Base;
          if (arguments.length > 2) {
              func = m.bind(func, self);
          }
          // fast path for array
          if (m.isArrayLike(iterable)) {
              try {
                  for (var i = 0; i < iterable.length; i++) {
                      func(iterable[i]);
                  }
              } catch (e) {
                  if (e != MochiKit.Iter.StopIteration) {
                      throw e;
                  }
              }
          } else {
              self = MochiKit.Iter;
              self.exhaust(self.imap(func, iterable));
          }
      },

      /** @id MochiKit.Iter.every */
      every: function (iterable, func) {
          var self = MochiKit.Iter;
          try {
              self.ifilterfalse(func, iterable).next();
              return false;
          } catch (e) {
              if (e != self.StopIteration) {
                  throw e;
              }
              return true;
          }
      },

      /** @id MochiKit.Iter.sorted */
      sorted: function (iterable, /* optional */cmp) {
          var rval = MochiKit.Iter.list(iterable);
          if (arguments.length == 1) {
              cmp = MochiKit.Base.compare;
          }
          rval.sort(cmp);
          return rval;
      },

      /** @id MochiKit.Iter.reversed */
      reversed: function (iterable) {
          var rval = MochiKit.Iter.list(iterable);
          rval.reverse();
          return rval;
      },

      /** @id MochiKit.Iter.some */
      some: function (iterable, func) {
          var self = MochiKit.Iter;
          try {
              self.ifilter(func, iterable).next();
              return true;
          } catch (e) {
              if (e != self.StopIteration) {
                  throw e;
              }
              return false;
          }
      },

      /** @id MochiKit.Iter.iextend */
      iextend: function (lst, iterable) {
          if (MochiKit.Base.isArrayLike(iterable)) {
              // fast-path for array-like
              for (var i = 0; i < iterable.length; i++) {
                  lst.push(iterable[i]);
              }
          } else {
              var self = MochiKit.Iter;
              iterable = self.iter(iterable);
              try {
                  while (true) {
                      lst.push(iterable.next());
                  }
              } catch (e) {
                  if (e != self.StopIteration) {
                      throw e;
                  }
              }
          }
          return lst;
      },

      /** @id MochiKit.Iter.groupby */
      groupby: function(iterable, /* optional */ keyfunc) {
          var m = MochiKit.Base;
          var self = MochiKit.Iter;
          if (arguments.length < 2) {
              keyfunc = m.operator.identity;
          }
          iterable = self.iter(iterable);

          // shared
          var pk = undefined;
          var k = undefined;
          var v;

          function fetch() {
              v = iterable.next();
              k = keyfunc(v);
          };

          function eat() {
              var ret = v;
              v = undefined;
              return ret;
          };

          var first = true;
          var compare = m.compare;
          return {
              repr: function () { return "groupby(...)"; },
              next: function() {
                  // iterator-next

                  // iterate until meet next group
                  while (compare(k, pk) === 0) {
                      fetch();
                      if (first) {
                          first = false;
                          break;
                      }
                  }
                  pk = k;
                  return [k, {
                      next: function() {
                          // subiterator-next
                          if (v == undefined) { // Is there something to eat?
                              fetch();
                          }
                          if (compare(k, pk) !== 0) {
                              throw self.StopIteration;
                          }
                          return eat();
                      }
                  }];
              }
          };
      },

      /** @id MochiKit.Iter.groupby_as_array */
      groupby_as_array: function (iterable, /* optional */ keyfunc) {
          var m = MochiKit.Base;
          var self = MochiKit.Iter;
          if (arguments.length < 2) {
              keyfunc = m.operator.identity;
          }

          iterable = self.iter(iterable);
          var result = [];
          var first = true;
          var prev_key;
          var compare = m.compare;
          while (true) {
              try {
                  var value = iterable.next();
                  var key = keyfunc(value);
              } catch (e) {
                  if (e == self.StopIteration) {
                      break;
                  }
                  throw e;
              }
              if (first || compare(key, prev_key) !== 0) {
                  var values = [];
                  result.push([key, values]);
              }
              values.push(value);
              first = false;
              prev_key = key;
          }
          return result;
      },

      /** @id MochiKit.Iter.arrayLikeIter */
      arrayLikeIter: function (iterable) {
          var i = 0;
          return {
              repr: function () { return "arrayLikeIter(...)"; },
              toString: MochiKit.Base.forwardCall("repr"),
              next: function () {
                  if (i >= iterable.length) {
                      throw MochiKit.Iter.StopIteration;
                  }
                  return iterable[i++];
              }
          };
      },

      /** @id MochiKit.Iter.hasIterateNext */
      hasIterateNext: function (iterable) {
          return (iterable && typeof(iterable.iterateNext) == "function");
      },

      /** @id MochiKit.Iter.iterateNextIter */
      iterateNextIter: function (iterable) {
          return {
              repr: function () { return "iterateNextIter(...)"; },
              toString: MochiKit.Base.forwardCall("repr"),
              next: function () {
                  var rval = iterable.iterateNext();
                  if (rval === null || rval === undefined) {
                      throw MochiKit.Iter.StopIteration;
                  }
                  return rval;
              }
          };
      }
  });


  MochiKit.Iter.EXPORT_OK = [
      "iteratorRegistry",
      "arrayLikeIter",
      "hasIterateNext",
      "iterateNextIter",
  ];

  MochiKit.Iter.EXPORT = [
      "StopIteration",
      "registerIteratorFactory",
      "iter",
      "count",
      "cycle",
      "repeat",
      "next",
      "izip",
      "ifilter",
      "ifilterfalse",
      "islice",
      "imap",
      "applymap",
      "chain",
      "takewhile",
      "dropwhile",
      "tee",
      "list",
      "reduce",
      "range",
      "sum",
      "exhaust",
      "forEach",
      "every",
      "sorted",
      "reversed",
      "some",
      "iextend",
      "groupby",
      "groupby_as_array"
  ];

  MochiKit.Iter.__new__ = function () {
      var m = MochiKit.Base;
      // Re-use StopIteration if exists (e.g. SpiderMonkey)
      if (typeof(StopIteration) != "undefined") {
          this.StopIteration = StopIteration;
      } else {
          /** @id MochiKit.Iter.StopIteration */
          this.StopIteration = new m.NamedError("StopIteration");
      }
      this.iteratorRegistry = new m.AdapterRegistry();
      // Register the iterator factory for arrays
      this.registerIteratorFactory(
          "arrayLike",
          m.isArrayLike,
          this.arrayLikeIter
      );

      this.registerIteratorFactory(
          "iterateNext",
          this.hasIterateNext,
          this.iterateNextIter
      );

      this.EXPORT_TAGS = {
          ":common": this.EXPORT,
          ":all": m.concat(this.EXPORT, this.EXPORT_OK)
      };

      m.nameFunctions(this);
          
  };

  MochiKit.Iter.__new__();

  //
  // XXX: Internet Explorer blows
  //
  if (MochiKit.__export__) {
      // reduce = MochiKit.Iter.reduce;
  }

  MochiKit.Base._exportSymbols(MochiNameSpace, MochiKit.Iter);
  /***

  MochiKit.DOM 1.4

  See <http://mochikit.com/> for documentation, downloads, license, etc.

  (c) 2005 Bob Ippolito.  All rights Reserved.

  ***/

  if (typeof(dojo) != 'undefined') {
      dojo.provide("MochiKit.DOM");
      dojo.require("MochiKit.Base");
  }
  if (typeof(JSAN) != 'undefined') {
      JSAN.use("MochiKit.Base", []);
  }

  try {
      if (typeof(MochiKit.Base) == 'undefined') {
          throw "";
      }
  } catch (e) {
      throw "MochiKit.DOM depends on MochiKit.Base!";
  }

  if (typeof(MochiKit.DOM) == 'undefined') {
      MochiKit.DOM = {};
  }

  MochiKit.DOM.NAME = "MochiKit.DOM";
  MochiKit.DOM.VERSION = "1.4";
  MochiKit.DOM.__repr__ = function () {
      return "[" + this.NAME + " " + this.VERSION + "]";
  };
  MochiKit.DOM.toString = function () {
      return this.__repr__();
  };

  MochiKit.DOM.EXPORT = [
      "removeEmptyTextNodes",
      "formContents",
      "currentWindow",
      "currentDocument",
      "withWindow",
      "withDocument",
      "registerDOMConverter",
      "coerceToDOM",
      "createDOM",
      "createDOMFunc",
      "isChildNode",
      "getNodeAttribute",
      "setNodeAttribute",
      "updateNodeAttributes",
      "appendChildNodes",
      "replaceChildNodes",
      "removeElement",
      "swapDOM",
      "BUTTON",
      "TT",
      "PRE",
      "H1",
      "H2",
      "H3",
      "BR",
      "CANVAS",
      "HR",
      "LABEL",
      "TEXTAREA",
      "FORM",
      "STRONG",
      "SELECT",
      "OPTION",
      "OPTGROUP",
      "LEGEND",
      "FIELDSET",
      "P",
      "UL",
      "OL",
      "LI",
      "TD",
      "TR",
      "THEAD",
      "TBODY",
      "TFOOT",
      "TABLE",
      "TH",
      "INPUT",
      "SPAN",
      "A",
      "DIV",
      "IMG",
      "getElement",
      "$",
      "getElementsByTagAndClassName",
      "addToCallStack",
      "addLoadEvent",
      "focusOnLoad",
      "setElementClass",
      "toggleElementClass",
      "addElementClass",
      "removeElementClass",
      "swapElementClass",
      "hasElementClass",
      "escapeHTML",
      "toHTML",
      "emitHTML",
      "scrapeText"
  ];

  MochiKit.DOM.EXPORT_OK = [
      "domConverters"
  ];

  MochiKit.DOM.DEPRECATED = [
      ['computedStyle', 'MochiKit.Style.computedStyle', '1.4'],
      /** @id MochiKit.DOM.elementDimensions  */
      ['elementDimensions', 'MochiKit.Style.getElementDimensions', '1.4'],
      /** @id MochiKit.DOM.elementPosition  */
      ['elementPosition', 'MochiKit.Style.getElementPosition', '1.4'],
      ['hideElement', 'MochiKit.Style.hideElement', '1.4'],
      /** @id MochiKit.DOM.setElementDimensions */
      ['setElementDimensions', 'MochiKit.Style.setElementDimensions', '1.4'],
      /** @id MochiKit.DOM.setElementPosition */
      ['setElementPosition', 'MochiKit.Style.setElementPosition', '1.4'],
      ['setDisplayForElement', 'MochiKit.Style.setDisplayForElement', '1.4'],
      /** @id MochiKit.DOM.setOpacity */
      ['setOpacity', 'MochiKit.Style.setOpacity', '1.4'],
      ['showElement', 'MochiKit.Style.showElement', '1.4'],
      /** @id MochiKit.DOM.Coordinates */
      ['Coordinates', 'MochiKit.Style.Coordinates', '1.4'], // FIXME: broken
      /** @id MochiKit.DOM.Dimensions */
      ['Dimensions', 'MochiKit.Style.Dimensions', '1.4'] // FIXME: broken
  ];

  /** @id MochiKit.DOM.getViewportDimensions */
  MochiKit.DOM.getViewportDimensions = new Function('' + 
      'if (!MochiKit["Style"]) {' + 
      '    throw new Error("This function has been deprecated and depends on MochiKit.Style.");' + 
      '}' + 
      'return MochiKit.Style.getViewportDimensions.apply(this, arguments);');

  MochiKit.Base.update(MochiKit.DOM, {

      /** @id MochiKit.DOM.currentWindow */
      currentWindow: function () {
          return MochiKit.DOM._window;
      },

      /** @id MochiKit.DOM.currentDocument */
      currentDocument: function () {
          return MochiKit.DOM._document;
      },

      /** @id MochiKit.DOM.withWindow */
      withWindow: function (win, func) {
          var self = MochiKit.DOM;
          var oldDoc = self._document;
          var oldWin = self._win;
          var rval;
          try {
              self._window = win;
              self._document = win.document;
              rval = func();
          } catch (e) {
              self._window = oldWin;
              self._document = oldDoc;
              throw e;
          }
          self._window = oldWin;
          self._document = oldDoc;
          return rval;
      },

      /** @id MochiKit.DOM.formContents  */
      formContents: function (elem/* = document */) {
          var names = [];
          var values = [];
          var m = MochiKit.Base;
          var self = MochiKit.DOM;
          if (typeof(elem) == "undefined" || elem === null) {
              elem = self._document;
          } else {
              elem = self.getElement(elem);
          }
          m.nodeWalk(elem, function (elem) {
              var name = elem.name;
              if (m.isNotEmpty(name)) {
                  var tagName = elem.nodeName;
                  if (tagName == "INPUT"
                      && (elem.type == "radio" || elem.type == "checkbox")
                      && !elem.checked
                  ) {
                      return null;
                  }
                  if (tagName == "SELECT") {
                      if (elem.type == "select-one") {
                          if (elem.selectedIndex >= 0) {
                              var opt = elem.options[elem.selectedIndex];
                              names.push(name);
                              values.push((opt.value) ? opt.value : opt.text);
                              return null;
                          }
                          // no form elements?
                          names.push(name);
                          values.push("");
                          return null;
                      } else {
                          var opts = elem.options; 
                          if (!opts.length) {
                              names.push(name);
                              values.push("");
                              return null;
                          }
                          for (var i = 0; i < opts.length; i++) { 
                              var opt = opts[i];
                              if (!opt.selected) { 
                                  continue; 
                              } 
                              names.push(name); 
                              values.push((opt.value) ? opt.value : opt.text); 
                          }
                          return null;
                      }
                  }
                  if (tagName == "FORM" || tagName == "P" || tagName == "SPAN"
                      || tagName == "DIV"
                  ) {
                      return elem.childNodes;
                  }
                  names.push(name);
                  values.push(elem.value || '');
                  return null;
              }
              return elem.childNodes;
          });
          return [names, values];
      },

      /** @id MochiKit.DOM.withDocument */
      withDocument: function (doc, func) {
          var self = MochiKit.DOM;
          var oldDoc = self._document;
          var rval;
          try {
              self._document = doc;
              rval = func();
          } catch (e) {
              self._document = oldDoc;
              throw e;
          }
          self._document = oldDoc;
          return rval;
      },

      /** @id MochiKit.DOM.registerDOMConverter */
      registerDOMConverter: function (name, check, wrap, /* optional */override) {
          MochiKit.DOM.domConverters.register(name, check, wrap, override);
      },

      /** @id MochiKit.DOM.coerceToDOM */
      coerceToDOM: function (node, ctx) {
          var m = MochiKit.Base;
          var im = MochiKit.Iter;
          var self = MochiKit.DOM;
          if (im) {
              var iter = im.iter;
              var repeat = im.repeat;
              var map = m.map;
          }
          var domConverters = self.domConverters;
          var coerceToDOM = arguments.callee;
          var NotFound = m.NotFound;
          while (true) {
              if (typeof(node) == 'undefined' || node === null) {
                  return null;
              }
              if (typeof(node.nodeType) != 'undefined' && node.nodeType > 0) {
                  return node;
              }
              if (typeof(node) == 'number' || typeof(node) == 'boolean') {
                  node = node.toString();
                  // FALL THROUGH
              }
              if (typeof(node) == 'string') {
                  return self._document.createTextNode(node);
              }
              if (typeof(node.__dom__) == 'function') {
                  node = node.__dom__(ctx);
                  continue;
              }
              if (typeof(node.dom) == 'function') {
                  node = node.dom(ctx);
                  continue;
              }
              if (typeof(node) == 'function') {
                  node = node.apply(ctx, [ctx]);
                  continue;
              }

              if (im) {
                  // iterable
                  var iterNodes = null;
                  try {
                      iterNodes = iter(node);
                  } catch (e) {
                      // pass
                  }
                  if (iterNodes) {
                      return map(coerceToDOM, iterNodes, repeat(ctx));
                  }
              }

              // adapter
              try {
                  node = domConverters.match(node, ctx);
                  continue;
              } catch (e) {
                  if (e != NotFound) {
                      throw e;
                  }
              }

              // fallback
              return self._document.createTextNode(node.toString());
          }
          // mozilla warnings aren't too bright
          return undefined;
      },
          
      /** @id MochiKit.DOM.isChildNode */
      isChildNode: function (node, maybeparent) {
          var self = MochiKit.DOM;
          if (typeof(node) == "string") {
              node = self.getElement(node);
          }
          if (typeof(maybeparent) == "string") {
              maybeparent = self.getElement(maybeparent);
          }
          if (node === maybeparent) {
              return true;
          }
          while (node && node.nodeName != "BODY") {
              node = node.parentNode;
              if (node === maybeparent) {
                  return true;
              }
          }
          return false;
      },

      /** @id MochiKit.DOM.setNodeAttribute */
      setNodeAttribute: function (node, attr, value) {
          var o = {};
          o[attr] = value;
          try {
              return MochiKit.DOM.updateNodeAttributes(node, o);
          } catch (e) {
              // pass
          }
          return null;
      },

      /** @id MochiKit.DOM.getNodeAttribute */
      getNodeAttribute: function (node, attr) {
          var self = MochiKit.DOM;
          var rename = self.attributeArray.renames[attr];
          node = self.getElement(node);
          try {
              if (rename) {
                  return node[rename];
              }
              return node.getAttribute(attr);
          } catch (e) {
              // pass
          }
          return null;
      },

      /** @id MochiKit.DOM.updateNodeAttributes */
      updateNodeAttributes: function (node, attrs) {
          var elem = node;
          var self = MochiKit.DOM;
          if (typeof(node) == 'string') {
              elem = self.getElement(node);
          }
          if (attrs) {
              var updatetree = MochiKit.Base.updatetree;
              if (self.attributeArray.compliant) {
                  // not IE, good.
                  for (var k in attrs) {
                      var v = attrs[k];
                      if (typeof(v) == 'object' && typeof(elem[k]) == 'object') {
                          updatetree(elem[k], v);
                      } else if (k.substring(0, 2) == "on") {
                          if (typeof(v) == "string") {
                              v = new Function(v);
                          }
                          elem[k] = v;
                      } else {
                          elem.setAttribute(k, v);
                      }
                  }
              } else {
                  // IE is insane in the membrane
                  var renames = self.attributeArray.renames;
                  for (k in attrs) {
                      v = attrs[k];
                      var renamed = renames[k];
                      if (k == "style" && typeof(v) == "string") {
                          elem.style.cssText = v;
                      } else if (typeof(renamed) == "string") {
                          elem[renamed] = v;
                      } else if (typeof(elem[k]) == 'object'
                              && typeof(v) == 'object') {
                          updatetree(elem[k], v);
                      } else if (k.substring(0, 2) == "on") {
                          if (typeof(v) == "string") {
                              v = new Function(v);
                          }
                          elem[k] = v;
                      } else {
                          elem.setAttribute(k, v);
                      }
                  }
              }
          }
          return elem;
      },

      /** @id MochiKit.DOM.appendChildNodes */
      appendChildNodes: function (node/*, nodes...*/) {
          var elem = node;
          var self = MochiKit.DOM;
          if (typeof(node) == 'string') {
              elem = self.getElement(node);
          }
          var nodeStack = [
              self.coerceToDOM(
                  MochiKit.Base.extend(null, arguments, 1),
                  elem
              )
          ];
          var concat = MochiKit.Base.concat;
          while (nodeStack.length) {
              var n = nodeStack.shift();
              if (typeof(n) == 'undefined' || n === null) {
                  // pass
              } else if (typeof(n.nodeType) == 'number') {
                  elem.appendChild(n);
              } else {
                  nodeStack = concat(n, nodeStack);
              }
          }
          return elem;
      },

      /** @id MochiKit.DOM.replaceChildNodes */
      replaceChildNodes: function (node/*, nodes...*/) {
          var elem = node;
          var self = MochiKit.DOM;
          if (typeof(node) == 'string') {
              elem = self.getElement(node);
              arguments[0] = elem;
          }
          var child;
          while ((child = elem.firstChild)) {
              elem.removeChild(child);
          }
          if (arguments.length < 2) {
              return elem;
          } else {
              return self.appendChildNodes.apply(this, arguments);
          }
      },

      /** @id MochiKit.DOM.createDOM */
      createDOM: function (name, attrs/*, nodes... */) {
          var elem;
          var self = MochiKit.DOM;
          var m = MochiKit.Base;
          if (typeof(attrs) == "string" || typeof(attrs) == "number") {
              var args = m.extend([name, null], arguments, 1);
              return arguments.callee.apply(this, args);
          }
          if (typeof(name) == 'string') {
              // Internet Explorer is dumb
              if (attrs && !self.attributeArray.compliant) {
                  // http://msdn.microsoft.com/workshop/author/dhtml/reference/properties/name_2.asp
                  var contents = "";
                  if ('name' in attrs) {
                      contents += ' name="' + self.escapeHTML(attrs.name) + '"';
                  }
                  if (name == 'input' && 'type' in attrs) {
                      contents += ' type="' + self.escapeHTML(attrs.type) + '"';
                  }
                  if (contents) {
                      name = "<" + name + contents + ">";
                  }
              }
              elem = self._document.createElement(name);
          } else {
              elem = name;
          }
          if (attrs) {
              self.updateNodeAttributes(elem, attrs);
          }
          if (arguments.length <= 2) {
              return elem;
          } else {
              var args = m.extend([elem], arguments, 2);
              return self.appendChildNodes.apply(this, args);
          }
      },

      /** @id MochiKit.DOM.createDOMFunc */
      createDOMFunc: function (/* tag, attrs, *nodes */) {
          var m = MochiKit.Base;
          return m.partial.apply(
              this,
              m.extend([MochiKit.DOM.createDOM], arguments)
          );
      },

      /** @id MochiKit.DOM.removeElement */
      removeElement: function (elem) {
          var e = MochiKit.DOM.getElement(elem);
          e.parentNode.removeChild(e);
          return e;
      },

      /** @id MochiKit.DOM.swapDOM */
      swapDOM: function (dest, src) {
          var self = MochiKit.DOM;
          dest = self.getElement(dest);
          var parent = dest.parentNode;
          if (src) {
              src = self.getElement(src);
              parent.replaceChild(src, dest);
          } else {
              parent.removeChild(dest);
          }
          return src;
      },

      /** @id MochiKit.DOM.getElement */
      getElement: function (id) {
          var self = MochiKit.DOM;
          if (arguments.length == 1) {
              return ((typeof(id) == "string") ?
                  self._document.getElementById(id) : id);
          } else {
              return MochiKit.Base.map(self.getElement, arguments);
          }
      },

      /** @id MochiKit.DOM.getElementsByTagAndClassName */
      getElementsByTagAndClassName: function (tagName, className,
              /* optional */parent) {
          var self = MochiKit.DOM;
          if (typeof(tagName) == 'undefined' || tagName === null) {
              tagName = '*';
          }
          if (typeof(parent) == 'undefined' || parent === null) {
              parent = self._document;
          }
          parent = self.getElement(parent);
          var children = (parent.getElementsByTagName(tagName)
              || self._document.all);
          if (typeof(className) == 'undefined' || className === null) {
              return MochiKit.Base.extend(null, children);
          }

          var elements = [];
          for (var i = 0; i < children.length; i++) {
              var child = children[i];
              var cls = child.className;
              if (!cls) {
                  continue;
              }
              var classNames = cls.split(' ');
              for (var j = 0; j < classNames.length; j++) {
                  if (classNames[j] == className) {
                      elements.push(child);
                      break;
                  }
              }
          }

          return elements;
      },

      _newCallStack: function (path, once) {
          var rval = function () {
              var callStack = arguments.callee.callStack;
              for (var i = 0; i < callStack.length; i++) {
                  if (callStack[i].apply(this, arguments) === false) {
                      break;
                  }
              }
              if (once) {
                  try {
                      this[path] = null;
                  } catch (e) {
                      // pass
                  }
              }
          };
          rval.callStack = [];
          return rval;
      },

      /** @id MochiKit.DOM.addToCallStack */
      addToCallStack: function (target, path, func, once) {
          var self = MochiKit.DOM;
          var existing = target[path];
          var regfunc = existing;
          if (!(typeof(existing) == 'function'
                  && typeof(existing.callStack) == "object"
                  && existing.callStack !== null)) {
              regfunc = self._newCallStack(path, once);
              if (typeof(existing) == 'function') {
                  regfunc.callStack.push(existing);
              }
              target[path] = regfunc;
          }
          regfunc.callStack.push(func);
      },

      /** @id MochiKit.DOM.addLoadEvent */
      addLoadEvent: function (func) {
          var self = MochiKit.DOM;
          self.addToCallStack(self._window, "onload", func, true);
          
      },

      /** @id MochiKit.DOM.focusOnLoad */
      focusOnLoad: function (element) {
          var self = MochiKit.DOM;
          self.addLoadEvent(function () {
              element = self.getElement(element);
              if (element) {
                  element.focus();
              }
          });
      },
              
      /** @id MochiKit.DOM.setElementClass */
      setElementClass: function (element, className) {
          var self = MochiKit.DOM;
          var obj = self.getElement(element);
          if (self.attributeArray.compliant) {
              obj.setAttribute("class", className);
          } else {
              obj.setAttribute("className", className);
          }
      },
              
      /** @id MochiKit.DOM.toggleElementClass */
      toggleElementClass: function (className/*, element... */) {
          var self = MochiKit.DOM;
          for (var i = 1; i < arguments.length; i++) {
              var obj = self.getElement(arguments[i]);
              if (!self.addElementClass(obj, className)) {
                  self.removeElementClass(obj, className);
              }
          }
      },

      /** @id MochiKit.DOM.addElementClass */
      addElementClass: function (element, className) {
          var self = MochiKit.DOM;
          var obj = self.getElement(element);
          var cls = obj.className;
          // trivial case, no className yet
          if (cls == undefined || cls.length === 0) {
              self.setElementClass(obj, className);
              return true;
          }
          // the other trivial case, already set as the only class
          if (cls == className) {
              return false;
          }
          var classes = cls.split(" ");
          for (var i = 0; i < classes.length; i++) {
              // already present
              if (classes[i] == className) {
                  return false;
              }
          }
          // append class
          self.setElementClass(obj, cls + " " + className);
          return true;
      },

      /** @id MochiKit.DOM.removeElementClass */
      removeElementClass: function (element, className) {
          var self = MochiKit.DOM;
          var obj = self.getElement(element);
          var cls = obj.className;
          // trivial case, no className yet
          if (cls == undefined || cls.length === 0) {
              return false;
          }
          // other trivial case, set only to className
          if (cls == className) {
              self.setElementClass(obj, "");
              return true;
          }
          var classes = cls.split(" ");
          for (var i = 0; i < classes.length; i++) {
              // already present
              if (classes[i] == className) {
                  // only check sane case where the class is used once
                  classes.splice(i, 1);
                  self.setElementClass(obj, classes.join(" "));
                  return true;
              }
          }
          // not found
          return false;
      },

      /** @id MochiKit.DOM.swapElementClass */
      swapElementClass: function (element, fromClass, toClass) {
          var obj = MochiKit.DOM.getElement(element);
          var res = MochiKit.DOM.removeElementClass(obj, fromClass);
          if (res) {
              MochiKit.DOM.addElementClass(obj, toClass);
          }
          return res;
      },

      /** @id MochiKit.DOM.hasElementClass */
      hasElementClass: function (element, className/*...*/) {
          var obj = MochiKit.DOM.getElement(element);
          var cls = obj.className;
          if (!cls) {
              return false;
          }
          var classes = cls.split(" ");
          for (var i = 1; i < arguments.length; i++) {
              var good = false;
              for (var j = 0; j < classes.length; j++) {
                  if (classes[j] == arguments[i]) {
                      good = true;
                      break;
                  }
              }
              if (!good) {
                  return false;
              }
          }
          return true;
      },

      /** @id MochiKit.DOM.escapeHTML */
      escapeHTML: function (s) {
          return s.replace(/&/g, "&amp;"
              ).replace(/"/g, "&quot;"
              ).replace(/</g, "&lt;"
              ).replace(/>/g, "&gt;");
      },

      /** @id MochiKit.DOM.toHTML */
      toHTML: function (dom) {
          return MochiKit.DOM.emitHTML(dom).join("");
      },

      /** @id MochiKit.DOM.emitHTML */
      emitHTML: function (dom, /* optional */lst) {
          if (typeof(lst) == 'undefined' || lst === null) {
              lst = [];
          }
          // queue is the call stack, we're doing this non-recursively
          var queue = [dom];
          var self = MochiKit.DOM;
          var escapeHTML = self.escapeHTML;
          var attributeArray = self.attributeArray;
          while (queue.length) {
              dom = queue.pop();
              if (typeof(dom) == 'string') {
                  lst.push(dom);
              } else if (dom.nodeType == 1) {
                  // we're not using higher order stuff here
                  // because safari has heisenbugs.. argh.
                  //
                  // I think it might have something to do with
                  // garbage collection and function calls.
                  lst.push('<' + dom.nodeName.toLowerCase());
                  var attributes = [];
                  var domAttr = attributeArray(dom);
                  for (var i = 0; i < domAttr.length; i++) {
                      var a = domAttr[i];
                      attributes.push([
                          " ",
                          a.name,
                          '="',
                          escapeHTML(a.value),
                          '"'
                      ]);
                  }
                  attributes.sort();
                  for (i = 0; i < attributes.length; i++) {
                      var attrs = attributes[i];
                      for (var j = 0; j < attrs.length; j++) {
                          lst.push(attrs[j]);
                      }
                  }
                  if (dom.hasChildNodes()) {
                      lst.push(">");
                      // queue is the FILO call stack, so we put the close tag
                      // on first
                      queue.push("</" + dom.nodeName.toLowerCase() + ">");
                      var cnodes = dom.childNodes;
                      for (i = cnodes.length - 1; i >= 0; i--) {
                          queue.push(cnodes[i]);
                      }
                  } else {
                      lst.push('/>');
                  }
              } else if (dom.nodeType == 3) {
                  lst.push(escapeHTML(dom.nodeValue));
              }
          }
          return lst;
      },

      /** @id MochiKit.DOM.scrapeText */
      scrapeText: function (node, /* optional */asArray) {
          var rval = [];
          (function (node) {
              var cn = node.childNodes;
              if (cn) {
                  for (var i = 0; i < cn.length; i++) {
                      arguments.callee.call(this, cn[i]);
                  }
              }
              var nodeValue = node.nodeValue;
              if (typeof(nodeValue) == 'string') {
                  rval.push(nodeValue);
              }
          })(MochiKit.DOM.getElement(node));
          if (asArray) {
              return rval;
          } else {
              return rval.join("");
          }
      },    

      /** @id MochiKit.DOM.removeEmptyTextNodes */
      removeEmptyTextNodes: function (element) {
          element = MochiKit.DOM.getElement(element);
          for (var i = 0; i < element.childNodes.length; i++) {
              var node = element.childNodes[i];
              if (node.nodeType == 3 && !/\S/.test(node.nodeValue)) {
                  node.parentNode.removeChild(node);
              }
          }
      },

      __new__: function (win) {

          var m = MochiKit.Base;
          if (typeof(document) != "undefined") {
              this._document = document;
          } else if (MochiKit.MockDOM) {
              this._document = MochiKit.MockDOM.document;
          }
          this._window = win;

          this.domConverters = new m.AdapterRegistry(); 
          
          var __tmpElement = this._document.createElement("span");
          var attributeArray;
          if (__tmpElement && __tmpElement.attributes &&
                  __tmpElement.attributes.length > 0) {
              // for braindead browsers (IE) that insert extra junk
              var filter = m.filter;
              attributeArray = function (node) {
                  return filter(attributeArray.ignoreAttrFilter, node.attributes);
              };
              attributeArray.ignoreAttr = {};
              var attrs = __tmpElement.attributes;
              var ignoreAttr = attributeArray.ignoreAttr;
              for (var i = 0; i < attrs.length; i++) {
                  var a = attrs[i];
                  ignoreAttr[a.name] = a.value;
              }
              attributeArray.ignoreAttrFilter = function (a) {
                  return (attributeArray.ignoreAttr[a.name] != a.value);
              };
              attributeArray.compliant = false;
              attributeArray.renames = {
                  "class": "className",
                  "checked": "defaultChecked",
                  "usemap": "useMap",
                  "for": "htmlFor",
                  "readonly": "readOnly"
              };
          } else {
              attributeArray = function (node) {
                  /***
                      
                      Return an array of attributes for a given node,
                      filtering out attributes that don't belong for
                      that are inserted by "Certain Browsers".

                  ***/
                  return node.attributes;
              };
              attributeArray.compliant = true;
              attributeArray.renames = {};
          }
          this.attributeArray = attributeArray;

          // FIXME: this really belongs in Base, and could probably be cleaner
          var _deprecated = function(fromModule, arr) {
              var modules = arr[1].split('.');
              var str = '';
              var obj = {};
              
              str += 'if (!MochiKit.' + modules[1] + ') { throw new Error("';
              str += 'This function has been deprecated and depends on MochiKit.';
              str += modules[1] + '.");}';
              str += 'return MochiKit.' + modules[1] + '.' + arr[0];
              str += '.apply(this, arguments);';
              
              obj[modules[2]] = new Function(str);
              MochiKit.Base.update(MochiKit[fromModule], obj);
          }
          for (var i; i < MochiKit.DOM.DEPRECATED.length; i++) {
              _deprecated('DOM', MochiKit.DOM.DEPRECATED[i]);
          }

          // shorthand for createDOM syntax
          var createDOMFunc = this.createDOMFunc;
          /** @id MochiKit.DOM.UL */
          this.UL = createDOMFunc("ul");
          /** @id MochiKit.DOM.OL */
          this.OL = createDOMFunc("ol");
          /** @id MochiKit.DOM.LI */
          this.LI = createDOMFunc("li");
          /** @id MochiKit.DOM.TD */
          this.TD = createDOMFunc("td");
          /** @id MochiKit.DOM.TR */
          this.TR = createDOMFunc("tr");
          /** @id MochiKit.DOM.TBODY */
          this.TBODY = createDOMFunc("tbody");
          /** @id MochiKit.DOM.THEAD */
          this.THEAD = createDOMFunc("thead");
          /** @id MochiKit.DOM.TFOOT */
          this.TFOOT = createDOMFunc("tfoot");
          /** @id MochiKit.DOM.TABLE */
          this.TABLE = createDOMFunc("table");
          /** @id MochiKit.DOM.TH */
          this.TH = createDOMFunc("th");
          /** @id MochiKit.DOM.INPUT */
          this.INPUT = createDOMFunc("input");
          /** @id MochiKit.DOM.SPAN */
          this.SPAN = createDOMFunc("span");
          /** @id MochiKit.DOM.A */
          this.A = createDOMFunc("a");
          /** @id MochiKit.DOM.DIV */
          this.DIV = createDOMFunc("div");
          /** @id MochiKit.DOM.IMG */
          this.IMG = createDOMFunc("img");
          /** @id MochiKit.DOM.BUTTON */
          this.BUTTON = createDOMFunc("button");
          /** @id MochiKit.DOM.TT */
          this.TT = createDOMFunc("tt");
          /** @id MochiKit.DOM.PRE */
          this.PRE = createDOMFunc("pre");
          /** @id MochiKit.DOM.H1 */
          this.H1 = createDOMFunc("h1");
          /** @id MochiKit.DOM.H2 */
          this.H2 = createDOMFunc("h2");
          /** @id MochiKit.DOM.H3 */
          this.H3 = createDOMFunc("h3");
          /** @id MochiKit.DOM.BR */
          this.BR = createDOMFunc("br");
          /** @id MochiKit.DOM.HR */
          this.HR = createDOMFunc("hr");
          /** @id MochiKit.DOM.LABEL */
          this.LABEL = createDOMFunc("label");
          /** @id MochiKit.DOM.TEXTAREA */
          this.TEXTAREA = createDOMFunc("textarea");
          /** @id MochiKit.DOM.FORM */
          this.FORM = createDOMFunc("form");
          /** @id MochiKit.DOM.P */
          this.P = createDOMFunc("p");
          /** @id MochiKit.DOM.SELECT */
          this.SELECT = createDOMFunc("select");
          /** @id MochiKit.DOM.OPTION */
          this.OPTION = createDOMFunc("option");
          /** @id MochiKit.DOM.OPTGROUP */
          this.OPTGROUP = createDOMFunc("optgroup");
          /** @id MochiKit.DOM.LEGEND */
          this.LEGEND = createDOMFunc("legend");
          /** @id MochiKit.DOM.FIELDSET */
          this.FIELDSET = createDOMFunc("fieldset");
          /** @id MochiKit.DOM.STRONG */
          this.STRONG = createDOMFunc("strong");
          /** @id MochiKit.DOM.CANVAS */
          this.CANVAS = createDOMFunc("canvas");

          /** @id MochiKit.DOM.$ */
          this.$ = this.getElement;

          this.EXPORT_TAGS = {
              ":common": this.EXPORT,
              ":all": m.concat(this.EXPORT, this.EXPORT_OK)
          };

          m.nameFunctions(this);

      }
  });


  MochiKit.DOM.__new__(((typeof(window) == "undefined") ? this : window));

  //
  // XXX: Internet Explorer blows
  //
  if (MochiKit.__export__) {
      // withWindow = MochiKit.DOM.withWindow;
      // withDocument = MochiKit.DOM.withDocument;
  }

  MochiKit.Base._exportSymbols(MochiNameSpace, MochiKit.DOM);
  /***

  MochiKit.Style 1.4

  See <http://mochikit.com/> for documentation, downloads, license, etc.

  (c) 2005-2006 Bob Ippolito, Beau Hartshorne.  All rights Reserved.

  ***/

  if (typeof(dojo) != 'undefined') {
      dojo.provide('MochiKit.Style');
      dojo.require('MochiKit.Base');
      dojo.require('MochiKit.DOM');
  }
  if (typeof(JSAN) != 'undefined') {
      JSAN.use('MochiKit.Base', []);
  }

  try {
      if (typeof(MochiKit.Base) == 'undefined') {
          throw '';
      }
  } catch (e) {
      throw 'MochiKit.Style depends on MochiKit.Base!';
  }

  try {
      if (typeof(MochiKit.DOM) == 'undefined') {
          throw '';
      }
  } catch (e) {
      throw 'MochiKit.Style depends on MochiKit.DOM!';
  }


  if (typeof(MochiKit.Style) == 'undefined') {
      MochiKit.Style = {};
  }

  MochiKit.Style.NAME = 'MochiKit.Style';
  MochiKit.Style.VERSION = '1.4';
  MochiKit.Style.__repr__ = function () {
      return '[' + this.NAME + ' ' + this.VERSION + ']';
  };
  MochiKit.Style.toString = function () {
      return this.__repr__();
  };

  MochiKit.Style.EXPORT_OK = [];

  MochiKit.Style.EXPORT = [
      'setOpacity',
      'computedStyle',
      'getElementDimensions',
      'elementDimensions', // deprecated
      'setElementDimensions',
      'getElementPosition',
      'elementPosition', // deprecated
      'setElementPosition',
      'setDisplayForElement',
      'hideElement',
      'showElement',
      'getViewportDimensions',
      'Dimensions',
      'Coordinates'
  ];


  /*

      Dimensions
      
  */
  /** @id MochiKit.Style.Dimensions */
  MochiKit.Style.Dimensions = function (w, h) {
      this.w = w;
      this.h = h;
  };

  MochiKit.Style.Dimensions.prototype.__repr__ = function () {
      var repr = MochiKit.Base.repr;
      return '{w: '  + repr(this.w) + ', h: ' + repr(this.h) + '}';
  };

  MochiKit.Style.Dimensions.prototype.toString = function () {
      return this.__repr__();
  };


  /*

      Coordinates

  */
  /** @id MochiKit.Style.Coordinates */
  MochiKit.Style.Coordinates = function (x, y) {
      this.x = x;
      this.y = y;
  };

  MochiKit.Style.Coordinates.prototype.__repr__ = function () {
      var repr = MochiKit.Base.repr;
      return '{x: '  + repr(this.x) + ', y: ' + repr(this.y) + '}';
  };

  MochiKit.Style.Coordinates.prototype.toString = function () {
      return this.__repr__();
  };


  MochiKit.Base.update(MochiKit.Style, {

      /** @id MochiKit.Style.computedStyle */
      computedStyle: function (elem, cssProperty) {
          var dom = MochiKit.DOM;
          var d = dom._document;
          
          elem = dom.getElement(elem);
          cssProperty = MochiKit.Base.camelize(cssProperty);
          
          if (!elem || elem == d) {
              return undefined;
          }
          
          /* from YUI 0.10.0 */
          if (cssProperty == 'opacity' && elem.filters) { // IE opacity
              try {
                  return elem.filters.item('DXImageTransform.Microsoft.Alpha'
                      ).opacity / 100;
              } catch(e) {
                  try {
                      return elem.filters.item('alpha').opacity / 100;
                  } catch(e) {}
              }
          }
          
          if (elem.currentStyle) {
              return elem.currentStyle[cssProperty];
          }
          if (typeof(d.defaultView) == 'undefined') {
              return undefined;
          }
          if (d.defaultView === null) {
              return undefined;
          }
          var style = d.defaultView.getComputedStyle(elem, null);
          if (typeof(style) == 'undefined' || style === null) {
              return undefined;
          }
          
          var selectorCase = cssProperty.replace(/([A-Z])/g, '-$1'
              ).toLowerCase(); // from dojo.style.toSelectorCase
              
          return style.getPropertyValue(selectorCase);
      },
      
      /** @id MochiKit.Style.setOpacity */
      setOpacity: function(elem, o) {
          elem = MochiKit.DOM.getElement(elem);
          MochiKit.DOM.updateNodeAttributes(elem, {'style': {
                  'opacity': o, 
                  '-moz-opacity': o,
                  '-khtml-opacity': o,
                  'filter':' alpha(opacity=' + (o * 100) + ')'
              }});
      },

      /* 

          getElementPosition is adapted from YAHOO.util.Dom.getXY v0.9.0.
          Copyright: Copyright (c) 2006, Yahoo! Inc. All rights reserved.
          License: BSD, http://developer.yahoo.net/yui/license.txt

      */
      
      /** @id MochiKit.Style.getElementPosition */    
      getElementPosition: function (elem, /* optional */relativeTo) {
          var self = MochiKit.Style;
          var dom = MochiKit.DOM;        
          elem = dom.getElement(elem);
          
          if (!elem || 
              (!(elem.x && elem.y) && 
              (!elem.parentNode == null || 
              self.computedStyle(elem, 'display') == 'none'))) {
              return undefined;
          }

          var c = new self.Coordinates(0, 0);        
          var box = null;
          var parent = null;
          
          var d = MochiKit.DOM._document;
          var de = d.documentElement;
          var b = d.body;            
      
          if (!elem.parentNode && elem.x && elem.y) {
              /* it's just a MochiKit.Style.Coordinates object */
              c.x += elem.x || 0;
              c.y += elem.y || 0;
          } else if (elem.getBoundingClientRect) { // IE shortcut
              /*
              
                  The IE shortcut can be off by two. We fix it. See:
                  http://msdn.microsoft.com/workshop/author/dhtml/reference/methods/getboundingclientrect.asp
                  
                  This is similar to the method used in 
                  MochiKit.Signal.Event.mouse().
                  
              */
              box = elem.getBoundingClientRect();
                          
              c.x += box.left + 
                  (de.scrollLeft || b.scrollLeft) - 
                  (de.clientLeft || 0);
              
              c.y += box.top + 
                  (de.scrollTop || b.scrollTop) - 
                  (de.clientTop || 0);
              
          } else if (elem.offsetParent) {
              c.x += elem.offsetLeft;
              c.y += elem.offsetTop;
              parent = elem.offsetParent;
              
              if (parent != elem) {
                  while (parent) {
                      c.x += parent.offsetLeft;
                      c.y += parent.offsetTop;
                      parent = parent.offsetParent;
                  }
              }

              /*
                  
                  Opera < 9 and old Safari (absolute) incorrectly account for 
                  body offsetTop and offsetLeft.
                  
              */
              var ua = navigator.userAgent.toLowerCase();
              if ((typeof(opera) != 'undefined' && 
                  parseFloat(opera.version()) < 9) || 
                  (ua.indexOf('safari') != -1 && 
                  self.computedStyle(elem, 'position') == 'absolute')) {
                                  
                  c.x -= b.offsetLeft;
                  c.y -= b.offsetTop;
                  
              }
          }
          
          if (typeof(relativeTo) != 'undefined') {
              relativeTo = arguments.callee(relativeTo);
              if (relativeTo) {
                  c.x -= (relativeTo.x || 0);
                  c.y -= (relativeTo.y || 0);
              }
          }
          
          if (elem.parentNode) {
              parent = elem.parentNode;
          } else {
              parent = null;
          }
          
          while (parent && parent.tagName != 'BODY' && 
              parent.tagName != 'HTML') {
              c.x -= parent.scrollLeft;
              c.y -= parent.scrollTop;        
              if (parent.parentNode) {
                  parent = parent.parentNode;
              } else {
                  parent = null;
              }
          }
          
          return c;
      },
          
      /** @id MochiKit.Style.setElementPosition */    
      setElementPosition: function (elem, newPos/* optional */, units) {
          elem = MochiKit.DOM.getElement(elem);
          if (typeof(units) == 'undefined') {
              units = 'px';
          }
          MochiKit.DOM.updateNodeAttributes(elem, {'style': {
              'left': newPos.x + units,
              'top': newPos.y + units
          }});
      },

      /** @id MochiKit.Style.getElementDimensions */
      getElementDimensions: function (elem) {
          var self = MochiKit.Style;
          var dom = MochiKit.DOM;
          if (typeof(elem.w) == 'number' || typeof(elem.h) == 'number') {
              return new self.Dimensions(elem.w || 0, elem.h || 0);
          }
          elem = dom.getElement(elem);
          if (!elem) {
              return undefined;
          }
          if (self.computedStyle(elem, 'display') != 'none') {
              return new self.Dimensions(elem.offsetWidth || 0, 
                  elem.offsetHeight || 0);
          }
          var s = elem.style;
          var originalVisibility = s.visibility;
          var originalPosition = s.position;
          s.visibility = 'hidden';
          s.position = 'absolute';
          s.display = '';
          var originalWidth = elem.offsetWidth;
          var originalHeight = elem.offsetHeight;
          s.display = 'none';
          s.position = originalPosition;
          s.visibility = originalVisibility;
          return new self.Dimensions(originalWidth, originalHeight);
      },

      /** @id MochiKit.Style.setElementDimensions */    
      setElementDimensions: function (elem, newSize/* optional */, units) {
          elem = MochiKit.DOM.getElement(elem);
          if (typeof(units) == 'undefined') {
              units = 'px';
          }
          MochiKit.DOM.updateNodeAttributes(elem, {'style': {
              'width': newSize.w + units, 
              'height': newSize.h + units
          }});
      },

      /** @id MochiKit.Style.setDisplayForElement */
      setDisplayForElement: function (display, element/*, ...*/) {
          var elements = MochiKit.Base.extend(null, arguments, 1);
          var getElement = MochiKit.DOM.getElement;
          for (var i = 0; i < elements.length; i++) {
              var element = getElement(elements[i]);
              if (element) {
                  element.style.display = display;
              }
          }
      },

      /** @id MochiKit.Style.getViewportDimensions */
      getViewportDimensions: function() {
          var d = new MochiKit.Style.Dimensions();
          
          var w = MochiKit.DOM._window;
          var b = MochiKit.DOM._document.body;
          
          if (w.innerWidth) {
              d.w = w.innerWidth;
              d.h = w.innerHeight;
          } else if (b.parentElement.clientWidth) {
              d.w = b.parentElement.clientWidth;
              d.h = b.parentElement.clientHeight;
          } else if (b && b.clientWidth) {
              d.w = b.clientWidth;
              d.h = b.clientHeight;
          }
          return d;
      },
      
      __new__: function () {
          var m = MochiKit.Base;
          
          this.elementPosition = this.getElementPosition;
          this.elementDimensions = this.getElementDimensions;
          
          this.hideElement = m.partial(this.setDisplayForElement, 'none');
          this.showElement = m.partial(this.setDisplayForElement, 'block');
          
          this.EXPORT_TAGS = {
              ':common': this.EXPORT,
              ':all': m.concat(this.EXPORT, this.EXPORT_OK)
          };

          m.nameFunctions(this);
      }
  });

  MochiKit.Style.__new__();
  MochiKit.Base._exportSymbols(MochiNameSpace, MochiKit.Style);
  /***

  MochiKit.Signal 1.4

  See <http://mochikit.com/> for documentation, downloads, license, etc.

  (c) 2006 Jonathan Gardner, Beau Hartshorne, Bob Ippolito.  All rights Reserved.

  ***/

  if (typeof(dojo) != 'undefined') {
      dojo.provide('MochiKit.Signal');
      dojo.require('MochiKit.Base');
      dojo.require('MochiKit.DOM');
      dojo.require('MochiKit.Style');
  }
  if (typeof(JSAN) != 'undefined') {
      JSAN.use('MochiKit.Base', []);
      JSAN.use('MochiKit.DOM', []);
  }

  try {
      if (typeof(MochiKit.Base) == 'undefined') {
          throw '';
      }
  } catch (e) {
      throw 'MochiKit.Signal depends on MochiKit.Base!';
  }

  try {
      if (typeof(MochiKit.DOM) == 'undefined') {
          throw '';
      }
  } catch (e) {
      throw 'MochiKit.Signal depends on MochiKit.DOM!';
  }

  try {
      if (typeof(MochiKit.Style) == 'undefined') {
          throw '';
      }
  } catch (e) {
      throw 'MochiKit.Signal depends on MochiKit.Style!';
  }

  if (typeof(MochiKit.Signal) == 'undefined') {
      MochiKit.Signal = {};
  }

  MochiKit.Signal.NAME = 'MochiKit.Signal';
  MochiKit.Signal.VERSION = '1.4';

  MochiKit.Signal._observers = [];

  /** @id MochiKit.Signal.Event */
  MochiKit.Signal.Event = function (src, e) {
      this._event = e || window.event;
      this._src = src;
  };

  MochiKit.Base.update(MochiKit.Signal.Event.prototype, {

      __repr__: function() {
          var repr = MochiKit.Base.repr;
          var str = '{event(): ' + repr(this.event()) +
              ', src(): ' + repr(this.src()) + 
              ', type(): ' + repr(this.type()) +
              ', target(): ' + repr(this.target()) +
              ', modifier(): ' + '{alt: ' + repr(this.modifier().alt) +
              ', ctrl: ' + repr(this.modifier().ctrl) +
              ', meta: ' + repr(this.modifier().meta) +
              ', shift: ' + repr(this.modifier().shift) + 
              ', any: ' + repr(this.modifier().any) + '}';
          
          if (this.type() && this.type().indexOf('key') === 0) {
              str += ', key(): {code: ' + repr(this.key().code) +
                  ', string: ' + repr(this.key().string) + '}';
          }

          if (this.type() && (
              this.type().indexOf('mouse') === 0 ||
              this.type().indexOf('click') != -1 ||
              this.type() == 'contextmenu')) {

              str += ', mouse(): {page: ' + repr(this.mouse().page) +
                  ', client: ' + repr(this.mouse().client);

              if (this.type() != 'mousemove') {
                  str += ', button: {left: ' + repr(this.mouse().button.left) +
                      ', middle: ' + repr(this.mouse().button.middle) +
                      ', right: ' + repr(this.mouse().button.right) + '}}';
              } else {
                  str += '}';
              }
          }
          if (this.type() == 'mouseover' || this.type() == 'mouseout') {
              str += ', relatedTarget(): ' + repr(this.relatedTarget());
          }
          str += '}';
          return str;
      },

       /** @id MochiKit.Signal.Event.prototype.toString */
      toString: function () {
          return this.__repr__();
      },

      /** @id MochiKit.Signal.Event.prototype.src */
      src: function () {
          return this._src;
      },

      /** @id MochiKit.Signal.Event.prototype.event  */
      event: function () {
          return this._event;
      },

      /** @id MochiKit.Signal.Event.prototype.type */
      type: function () {
          return this._event.type || undefined;
      },

      /** @id MochiKit.Signal.Event.prototype.target */
      target: function () {
          return this._event.target || this._event.srcElement;
      },

      _relatedTarget: null,
      /** @id MochiKit.Signal.Event.prototype.relatedTarget */
      relatedTarget: function () {
          if (this._relatedTarget !== null) {
              return this._relatedTarget;
          }

          var elem = null;
          if (this.type() == 'mouseover') {
              elem = (this._event.relatedTarget ||
                  this._event.fromElement);
          } else if (this.type() == 'mouseout') {
              elem = (this._event.relatedTarget ||
                  this._event.toElement);
          }
          if (elem !== null) {
              this._relatedTarget = elem;
              return elem;
          }
          
          return undefined;
      },

      _modifier: null,
      /** @id MochiKit.Signal.Event.prototype.modifier */
      modifier: function () {
          if (this._modifier !== null) {
              return this._modifier;
          }
          var m = {};
          m.alt = this._event.altKey;
          m.ctrl = this._event.ctrlKey;
          m.meta = this._event.metaKey || false; // IE and Opera punt here
          m.shift = this._event.shiftKey;
          m.any = m.alt || m.ctrl || m.shift || m.meta;
          this._modifier = m;
          return m;
      },

      _key: null,
      /** @id MochiKit.Signal.Event.prototype.key */
      key: function () {
          if (this._key !== null) {
              return this._key;
          }        
          var k = {};
          if (this.type() && this.type().indexOf('key') === 0) {

              /*

                  If you're looking for a special key, look for it in keydown or
                  keyup, but never keypress. If you're looking for a Unicode
                  chracter, look for it with keypress, but never keyup or
                  keydown.
      
                  Notes:
      
                  FF key event behavior:
                  key     event   charCode    keyCode
                  DOWN    ku,kd   0           40
                  DOWN    kp      0           40
                  ESC     ku,kd   0           27
                  ESC     kp      0           27
                  a       ku,kd   0           65
                  a       kp      97          0
                  shift+a ku,kd   0           65
                  shift+a kp      65          0
                  1       ku,kd   0           49
                  1       kp      49          0
                  shift+1 ku,kd   0           0
                  shift+1 kp      33          0
      
                  IE key event behavior:
                  (IE doesn't fire keypress events for special keys.)
                  key     event   keyCode
                  DOWN    ku,kd   40
                  DOWN    kp      undefined
                  ESC     ku,kd   27
                  ESC     kp      27
                  a       ku,kd   65
                  a       kp      97
                  shift+a ku,kd   65
                  shift+a kp      65
                  1       ku,kd   49
                  1       kp      49
                  shift+1 ku,kd   49
                  shift+1 kp      33

                  Safari key event behavior:
                  (Safari sets charCode and keyCode to something crazy for
                  special keys.)
                  key     event   charCode    keyCode
                  DOWN    ku,kd   63233       40
                  DOWN    kp      63233       63233
                  ESC     ku,kd   27          27
                  ESC     kp      27          27
                  a       ku,kd   97          65
                  a       kp      97          97
                  shift+a ku,kd   65          65
                  shift+a kp      65          65
                  1       ku,kd   49          49
                  1       kp      49          49
                  shift+1 ku,kd   33          49
                  shift+1 kp      33          33

              */

              /* look for special keys here */
              if (this.type() == 'keydown' || this.type() == 'keyup') {
                  k.code = this._event.keyCode;
                  k.string = (MochiKit.Signal._specialKeys[k.code] ||
                      'KEY_UNKNOWN');
                  this._key = k;
                  return k;
          
              /* look for characters here */
              } else if (this.type() == 'keypress') {
              
                  /*
              
                      Special key behavior:
                  
                      IE: does not fire keypress events for special keys
                      FF: sets charCode to 0, and sets the correct keyCode
                      Safari: sets keyCode and charCode to something stupid
              
                  */
              
                  k.code = 0;
                  k.string = '';
                          
                  if (typeof(this._event.charCode) != 'undefined' && 
                      this._event.charCode !== 0 &&
                      !MochiKit.Signal._specialMacKeys[this._event.charCode]) {
                      k.code = this._event.charCode;
                      k.string = String.fromCharCode(k.code);
                  } else if (this._event.keyCode && 
                      typeof(this._event.charCode) == 'undefined') { // IE
                      k.code = this._event.keyCode;
                      k.string = String.fromCharCode(k.code);
                  }
                  
                  this._key = k;
                  return k;
              }
          }
          return undefined;
      },

      _mouse: null,
      /** @id MochiKit.Signal.Event.prototype.mouse */
      mouse: function () {
          if (this._mouse !== null) {
              return this._mouse;
          }
          
          var m = {};
          var e = this._event;
          
          if (this.type() && (
              this.type().indexOf('mouse') === 0 ||
              this.type().indexOf('click') != -1 ||
              this.type() == 'contextmenu')) {
              
              m.client = new MochiKit.Style.Coordinates(0, 0);
              if (e.clientX || e.clientY) {
                  m.client.x = (!e.clientX || e.clientX < 0) ? 0 : e.clientX;
                  m.client.y = (!e.clientY || e.clientY < 0) ? 0 : e.clientY;
              }

              m.page = new MochiKit.Style.Coordinates(0, 0);
              if (e.pageX || e.pageY) {
                  m.page.x = (!e.pageX || e.pageX < 0) ? 0 : e.pageX;
                  m.page.y = (!e.pageY || e.pageY < 0) ? 0 : e.pageY;
              } else {
                  /*

                      The IE shortcut can be off by two. We fix it. See:
                      http://msdn.microsoft.com/workshop/author/dhtml/reference/methods/getboundingclientrect.asp
                      
                      This is similar to the method used in 
                      MochiKit.Style.getElementPosition().

                  */
                  var de = MochiKit.DOM._document.documentElement;
                  var b = MochiKit.DOM._document.body;
              
                  m.page.x = e.clientX +
                      (de.scrollLeft || b.scrollLeft) - 
                      (de.clientLeft || 0);
                  
                  m.page.y = e.clientY +
                      (de.scrollTop || b.scrollTop) - 
                      (de.clientTop || 0);
              
              }
              if (this.type() != 'mousemove') {
                  m.button = {};
                  m.button.left = false;
                  m.button.right = false;
                  m.button.middle = false;

                  /* we could check e.button, but which is more consistent */
                  if (e.which) {
                      m.button.left = (e.which == 1);
                      m.button.middle = (e.which == 2);
                      m.button.right = (e.which == 3);

                      /*
                  
                          Mac browsers and right click:
                      
                              - Safari doesn't fire any click events on a right
                                click:
                                http://bugzilla.opendarwin.org/show_bug.cgi?id=6595
                            
                              - Firefox fires the event, and sets ctrlKey = true
                            
                              - Opera fires the event, and sets metaKey = true
                      
                          oncontextmenu is fired on right clicks between 
                          browsers and across platforms.
                      
                      */
                  
                  } else {
                      m.button.left = !!(e.button & 1);
                      m.button.right = !!(e.button & 2);
                      m.button.middle = !!(e.button & 4);
                  }
              }
              this._mouse = m;
              return m;
          }
          return undefined;
      },

      /** @id MochiKit.Signal.Event.prototype.stop */
      stop: function () {
          this.stopPropagation();
          this.preventDefault();
      },

      /** @id MochiKit.Signal.Event.prototype.stopPropagation */
      stopPropagation: function () {
          if (this._event.stopPropagation) {
              this._event.stopPropagation();
          } else {
              this._event.cancelBubble = true;
          }
      },

      /** @id MochiKit.Signal.Event.prototype.preventDefault */
      preventDefault: function () {
          if (this._event.preventDefault) {
              this._event.preventDefault();
          } else if (this._confirmUnload === null) {
              this._event.returnValue = false;
          }
      },
      
      _confirmUnload: null,
      
      /** @id MochiKit.Signal.Event.prototype.confirmUnload */
      confirmUnload: function (msg) {
          if (this.type() == 'beforeunload') {
              this._confirmUnload = msg;
              this._event.returnValue = msg;
          }
      }
  });

  /* Safari sets keyCode to these special values onkeypress. */
  MochiKit.Signal._specialMacKeys = {
      3: 'KEY_ENTER',
      63289: 'KEY_NUM_PAD_CLEAR',
      63276: 'KEY_PAGE_UP',
      63277: 'KEY_PAGE_DOWN',
      63275: 'KEY_END',
      63273: 'KEY_HOME',
      63234: 'KEY_ARROW_LEFT',
      63232: 'KEY_ARROW_UP',
      63235: 'KEY_ARROW_RIGHT',
      63233: 'KEY_ARROW_DOWN',
      63302: 'KEY_INSERT',
      63272: 'KEY_DELETE'
  };

  /* for KEY_F1 - KEY_F12 */
  for (i = 63236; i <= 63242; i++) {
      MochiKit.Signal._specialMacKeys[i] = 'KEY_F' + (i - 63236 + 1); // no F0
  }

  /* Standard keyboard key codes. */
  MochiKit.Signal._specialKeys = {
      8: 'KEY_BACKSPACE',
      9: 'KEY_TAB',
      12: 'KEY_NUM_PAD_CLEAR', // weird, for Safari and Mac FF only
      13: 'KEY_ENTER',
      16: 'KEY_SHIFT',
      17: 'KEY_CTRL',
      18: 'KEY_ALT',
      19: 'KEY_PAUSE',
      20: 'KEY_CAPS_LOCK',
      27: 'KEY_ESCAPE',
      32: 'KEY_SPACEBAR',
      33: 'KEY_PAGE_UP',
      34: 'KEY_PAGE_DOWN',
      35: 'KEY_END',
      36: 'KEY_HOME',
      37: 'KEY_ARROW_LEFT',
      38: 'KEY_ARROW_UP',
      39: 'KEY_ARROW_RIGHT',
      40: 'KEY_ARROW_DOWN',
      44: 'KEY_PRINT_SCREEN', 
      45: 'KEY_INSERT',
      46: 'KEY_DELETE',
      59: 'KEY_SEMICOLON', // weird, for Safari and IE only
      91: 'KEY_WINDOWS_LEFT', 
      92: 'KEY_WINDOWS_RIGHT', 
      93: 'KEY_SELECT', 
      106: 'KEY_NUM_PAD_ASTERISK',
      107: 'KEY_NUM_PAD_PLUS_SIGN',
      109: 'KEY_NUM_PAD_HYPHEN-MINUS',
      110: 'KEY_NUM_PAD_FULL_STOP',
      111: 'KEY_NUM_PAD_SOLIDUS',
      144: 'KEY_NUM_LOCK',
      145: 'KEY_SCROLL_LOCK',
      186: 'KEY_SEMICOLON',
      187: 'KEY_EQUALS_SIGN',
      188: 'KEY_COMMA',
      189: 'KEY_HYPHEN-MINUS',
      190: 'KEY_FULL_STOP',
      191: 'KEY_SOLIDUS',
      192: 'KEY_GRAVE_ACCENT',
      219: 'KEY_LEFT_SQUARE_BRACKET',
      220: 'KEY_REVERSE_SOLIDUS',
      221: 'KEY_RIGHT_SQUARE_BRACKET',
      222: 'KEY_APOSTROPHE'
      // undefined: 'KEY_UNKNOWN'
  };

  /* for KEY_0 - KEY_9 */
  for (var i = 48; i <= 57; i++) {
      MochiKit.Signal._specialKeys[i] = 'KEY_' + (i - 48);
  }

  /* for KEY_A - KEY_Z */
  for (i = 65; i <= 90; i++) {
      MochiKit.Signal._specialKeys[i] = 'KEY_' + String.fromCharCode(i);
  }

  /* for KEY_NUM_PAD_0 - KEY_NUM_PAD_9 */
  for (i = 96; i <= 105; i++) {
      MochiKit.Signal._specialKeys[i] = 'KEY_NUM_PAD_' + (i - 96);
  }

  /* for KEY_F1 - KEY_F12 */
  for (i = 112; i <= 123; i++) {
      MochiKit.Signal._specialKeys[i] = 'KEY_F' + (i - 112 + 1); // no F0
  }

  MochiKit.Base.update(MochiKit.Signal, {

      __repr__: function () {
          return '[' + this.NAME + ' ' + this.VERSION + ']';
      },

      toString: function () {
          return this.__repr__();
      },

      _unloadCache: function () {
          var self = MochiKit.Signal;
          var observers = self._observers;
          
          for (var i = 0; i < observers.length; i++) {
              self._disconnect(observers[i]);
          }
          
          delete self._observers;
          
          try {
              window.onload = undefined;
          } catch(e) {
              // pass
          }

          try {
              window.onunload = undefined;
          } catch(e) {
              // pass
          }
      },

      _listener: function (src, func, obj, isDOM) {
          var E = MochiKit.Signal.Event;
          if (!isDOM) {
              return MochiKit.Base.bind(func, obj);
          } 
          obj = obj || src;
          if (typeof(func) == "string") {
              return function (nativeEvent) {
                  obj[func].apply(obj, [new E(src, nativeEvent)]);
              };
          } else {
              return function (nativeEvent) {
                  func.apply(obj, [new E(src, nativeEvent)]);
              };
          }
      },
      
      _browserAlreadyHasMouseEnterAndLeave: function () {
          /* Until isIE() gets out of New */
          return /MSIE/.test(navigator.userAgent);
      },

      _mouseEnterListener: function (src, sig, func, obj) {
          var E = MochiKit.Signal.Event;
          return function (nativeEvent) {
              var e = new E(src, nativeEvent);
              try {
                  e.relatedTarget().nodeName;
              } catch (err) {
                  /* probably hit a permission denied error; possibly one of
                   * firefox's screwy anonymous DIVs inside an input element.
                   * Allow this event to propogate up.
                   */
                  return;
              }
              e.stop();
              if (MochiKit.DOM.isChildNode(e.relatedTarget(), src)) {
                  /* We've moved between our node and a child. Ignore. */
                  return;
              }
              e.type = function () { return sig; };
              if (typeof(func) == "string") {
                  return obj[func].apply(obj, [e]);
              } else {
                  return func.apply(obj, [e]);
              }
          };
      },

      /** @id MochiKit.Signal.connect */
      connect: function (src, sig, objOrFunc/* optional */, funcOrStr) {
          src = MochiKit.DOM.getElement(src);
          var self = MochiKit.Signal;
          
          if (typeof(sig) != 'string') {
              throw new Error("'sig' must be a string");
          }
          
          var obj = null;
          var func = null;
          if (typeof(funcOrStr) != 'undefined') {
              obj = objOrFunc;
              func = funcOrStr;
              if (typeof(funcOrStr) == 'string') {
                  if (typeof(objOrFunc[funcOrStr]) != "function") {
                      throw new Error("'funcOrStr' must be a function on 'objOrFunc'");
                  }
              } else if (typeof(funcOrStr) != 'function') {
                  throw new Error("'funcOrStr' must be a function or string");
              }
          } else if (typeof(objOrFunc) != "function") {
              throw new Error("'objOrFunc' must be a function if 'funcOrStr' is not given");
          } else {
              func = objOrFunc;
          }
          if (typeof(obj) == 'undefined' || obj === null) {
              obj = src;
          }
          
          var isDOM = !!(src.addEventListener || src.attachEvent);
          if (isDOM && (sig === "onmouseenter" || sig === "onmouseleave")
                    && !self._browserAlreadyHasMouseEnterAndLeave()) {
              var listener = self._mouseEnterListener(src, sig.substr(2), func, obj);
              if (sig === "onmouseenter") {
                  sig = "onmouseover";
              } else {
                  sig = "onmouseout";
              }
          } else {
              var listener = self._listener(src, func, obj, isDOM);
          }
          
          if (src.addEventListener) {
              src.addEventListener(sig.substr(2), listener, false);
          } else if (src.attachEvent) {
              src.attachEvent(sig, listener); // useCapture unsupported
          }

          var ident = [src, sig, listener, isDOM, objOrFunc, funcOrStr];
          self._observers.push(ident);
          
         
          return ident;
      },
      
      _disconnect: function (ident) {
          // check isDOM
          if (!ident[3]) { return; }
          var src = ident[0];
          var sig = ident[1];
          var listener = ident[2];
          if (src.removeEventListener) {
              src.removeEventListener(sig.substr(2), listener, false);
          } else if (src.detachEvent) {
              src.detachEvent(sig, listener); // useCapture unsupported
          } else {
              throw new Error("'src' must be a DOM element");
          }
      },
      
       /** @id MochiKit.Signal.disconnect */
      disconnect: function (ident) {
          var self = MochiKit.Signal;
          var observers = self._observers;
          var m = MochiKit.Base;
          if (arguments.length > 1) {
              // compatibility API
              var src = MochiKit.DOM.getElement(arguments[0]);
              var sig = arguments[1];
              var obj = arguments[2];
              var func = arguments[3];
              for (var i = observers.length - 1; i >= 0; i--) {
                  var o = observers[i];
                  if (o[0] === src && o[1] === sig && o[4] === obj && o[5] === func) {
                      self._disconnect(o);
                      observers.splice(i, 1);
                      return true;
                  }
              }
          } else {
              var idx = m.findIdentical(observers, ident);
              if (idx >= 0) {
                  self._disconnect(ident);
                  observers.splice(idx, 1);
                  return true;
              }
          }
          return false;
      },
      
      /** @id MochiKit.Signal.disconnectAll */
      disconnectAll: function(src/* optional */, sig) {
          src = MochiKit.DOM.getElement(src);
          var m = MochiKit.Base;
          var signals = m.flattenArguments(m.extend(null, arguments, 1));
          var self = MochiKit.Signal;
          var disconnect = self._disconnect;
          var observers = self._observers;
          if (signals.length === 0) {
              // disconnect all
              for (var i = observers.length - 1; i >= 0; i--) {
                  var ident = observers[i];
                  if (ident[0] === src) {
                      disconnect(ident);
                      observers.splice(i, 1);
                  }
              }
          } else {
              var sigs = {};
              for (var i = 0; i < signals.length; i++) {
                  sigs[signals[i]] = true;
              }
              for (var i = observers.length - 1; i >= 0; i--) {
                  var ident = observers[i];
                  if (ident[0] === src && ident[1] in sigs) {
                      disconnect(ident);
                      observers.splice(i, 1);
                  }
              }
          }
          
      },

      /** @id MochiKit.Signal.signal */
      signal: function (src, sig) {
          var observers = MochiKit.Signal._observers;
          src = MochiKit.DOM.getElement(src);
          var args = MochiKit.Base.extend(null, arguments, 2);
          var errors = [];
          for (var i = 0; i < observers.length; i++) {
              var ident = observers[i];
              if (ident[0] === src && ident[1] === sig) {
                  try {
                      ident[2].apply(src, args);
                  } catch (e) {
                      errors.push(e);
                  }
              }
          }
          if (errors.length == 1) {
              throw errors[0];
          } else if (errors.length > 1) {
              var e = new Error("Multiple errors thrown in handling 'sig', see errors property");
              e.errors = errors;
              throw e;
          }
      }

  });

  MochiKit.Signal.EXPORT_OK = [];

  MochiKit.Signal.EXPORT = [
      'connect',
      'disconnect',
      'signal',
      'disconnectAll'
  ];

  MochiKit.Signal.__new__ = function (win) {
      var m = MochiKit.Base;
      this._document = document;
      this._window = win;

      try {
          this.connect(window, 'onunload', this._unloadCache);
      } catch (e) {
          // pass: might not be a browser
      }

      this.EXPORT_TAGS = {
          ':common': this.EXPORT,
          ':all': m.concat(this.EXPORT, this.EXPORT_OK)
      };

      m.nameFunctions(this);
  };

  MochiKit.Signal.__new__(this);

  //
  // XXX: Internet Explorer blows
  //
  if (MochiKit.__export__) {
//      connect = MochiKit.Signal.connect;
//      disconnect = MochiKit.Signal.disconnect;
//      disconnectAll = MochiKit.Signal.disconnectAll;
//      signal = MochiKit.Signal.signal;
  }

  MochiKit.Base._exportSymbols(MochiNameSpace, MochiKit.Signal);
  /***

  MochiKit.Async 1.4

  See <http://mochikit.com/> for documentation, downloads, license, etc.

  (c) 2005 Bob Ippolito.  All rights Reserved.

  ***/

  if (typeof(dojo) != 'undefined') {
      dojo.provide("MochiKit.Async");
      dojo.require("MochiKit.Base");
  }
  if (typeof(JSAN) != 'undefined') {
      JSAN.use("MochiKit.Base", []);
  }

  try {
      if (typeof(MochiKit.Base) == 'undefined') {
          throw "";
      }
  } catch (e) {
      throw "MochiKit.Async depends on MochiKit.Base!";
  }

  if (typeof(MochiKit.Async) == 'undefined') {
      MochiKit.Async = {};
  }

  MochiKit.Async.NAME = "MochiKit.Async";
  MochiKit.Async.VERSION = "1.4";
  MochiKit.Async.__repr__ = function () {
      return "[" + this.NAME + " " + this.VERSION + "]";
  };
  MochiKit.Async.toString = function () {
      return this.__repr__();
  };

  /** @id MochiKit.Async.Deferred */
  MochiKit.Async.Deferred = function (/* optional */ canceller) {
      this.chain = [];
      this.id = this._nextId();
      this.fired = -1;
      this.paused = 0;
      this.results = [null, null];
      this.canceller = canceller;
      this.silentlyCancelled = false;
      this.chained = false;
  };

  MochiKit.Async.Deferred.prototype = {
      /** @id MochiKit.Async.Deferred.prototype.repr */
      repr: function () {
          var state;
          if (this.fired == -1) {
              state = 'unfired';
          } else if (this.fired === 0) {
              state = 'success';
          } else {
              state = 'error';
          }
          return 'Deferred(' + this.id + ', ' + state + ')';
      },

      toString: MochiKit.Base.forwardCall("repr"),

      _nextId: MochiKit.Base.counter(),

      /** @id MochiKit.Async.Deferred.prototype.cancel */
      cancel: function () {
          var self = MochiKit.Async;
          if (this.fired == -1) {
              if (this.canceller) {
                  this.canceller(this);
              } else {
                  this.silentlyCancelled = true;
              }
              if (this.fired == -1) {
                  this.errback(new self.CancelledError(this));
              }
          } else if ((this.fired === 0) && (this.results[0] instanceof self.Deferred)) {
              this.results[0].cancel();
          }
      },
              
      _resback: function (res) {
          /***

          The primitive that means either callback or errback

          ***/
          this.fired = ((res instanceof Error) ? 1 : 0);
          this.results[this.fired] = res;
          this._fire();
      },

      _check: function () {
          if (this.fired != -1) {
              if (!this.silentlyCancelled) {
                  throw new MochiKit.Async.AlreadyCalledError(this);
              }
              this.silentlyCancelled = false;
              return;
          }
      },

      /** @id MochiKit.Async.Deferred.prototype.callback */
      callback: function (res) {
          this._check();
          if (res instanceof MochiKit.Async.Deferred) {
              throw new Error("Deferred instances can only be chained if they are the result of a callback");
          }
          this._resback(res);
      },

      /** @id MochiKit.Async.Deferred.prototype.errback */
      errback: function (res) {
          this._check();
          var self = MochiKit.Async;
          if (res instanceof self.Deferred) {
              throw new Error("Deferred instances can only be chained if they are the result of a callback");
          }
          if (!(res instanceof Error)) {
              res = new self.GenericError(res);
          }
          this._resback(res);
      },

      /** @id MochiKit.Async.Deferred.prototype.addBoth */
      addBoth: function (fn) {
          if (arguments.length > 1) {
              fn = MochiKit.Base.partial.apply(null, arguments);
          }
          return this.addCallbacks(fn, fn);
      },

      /** @id MochiKit.Async.Deferred.prototype.addCallback */
      addCallback: function (fn) {
          if (arguments.length > 1) {
              fn = MochiKit.Base.partial.apply(null, arguments);
          }
          return this.addCallbacks(fn, null);
      },

      /** @id MochiKit.Async.Deferred.prototype.addErrback */
      addErrback: function (fn) {
          if (arguments.length > 1) {
              fn = MochiKit.Base.partial.apply(null, arguments);
          }
          return this.addCallbacks(null, fn);
      },

      /** @id MochiKit.Async.Deferred.prototype.addCallbacks */
      addCallbacks: function (cb, eb) {
          if (this.chained) {
              throw new Error("Chained Deferreds can not be re-used");
          }
          this.chain.push([cb, eb]);
          if (this.fired >= 0) {
              this._fire();
          }
          return this;
      },

      _fire: function () {
          /***

          Used internally to exhaust the callback sequence when a result
          is available.

          ***/
          var chain = this.chain;
          var fired = this.fired;
          var res = this.results[fired];
          var self = this;
          var cb = null;
          while (chain.length > 0 && this.paused === 0) {
              // Array
              var pair = chain.shift();
              var f = pair[fired];
              if (f === null) {
                  continue;
              }
              try {
                  res = f(res);
                  fired = ((res instanceof Error) ? 1 : 0);
                  if (res instanceof MochiKit.Async.Deferred) {
                      cb = function (res) {
                          self._resback(res);
                          self.paused--;
                          if ((self.paused === 0) && (self.fired >= 0)) {
                              self._fire();
                          }
                      };
                      this.paused++;
                  }
              } catch (err) {
                  fired = 1;
                  if (!(err instanceof Error)) {
                      err = new MochiKit.Async.GenericError(err);
                  }
                  res = err;
              }
          }
          this.fired = fired;
          this.results[fired] = res;
          if (cb && this.paused) {
              // this is for "tail recursion" in case the dependent deferred
              // is already fired
              res.addBoth(cb);
              res.chained = true;
          }
      }
  };

  MochiKit.Base.update(MochiKit.Async, {
      /** @id MochiKit.Async.evalJSONRequest */
      evalJSONRequest: function (/* req */) {
          return eval('(' + arguments[0].responseText + ')');
      },

      /** @id MochiKit.Async.succeed */
      succeed: function (/* optional */result) {
          var d = new MochiKit.Async.Deferred();
          d.callback.apply(d, arguments);
          return d;
      },

      /** @id MochiKit.Async.fail */
      fail: function (/* optional */result) {
          var d = new MochiKit.Async.Deferred();
          d.errback.apply(d, arguments);
          return d;
      },

      /** @id MochiKit.Async.getXMLHttpRequest */
      getXMLHttpRequest: function () {
          var self = arguments.callee;
          if (!self.XMLHttpRequest) {
              var tryThese = [
                  function () { return new XMLHttpRequest(); },
                  function () { return new ActiveXObject('Msxml2.XMLHTTP'); },
                  function () { return new ActiveXObject('Microsoft.XMLHTTP'); },
                  function () { return new ActiveXObject('Msxml2.XMLHTTP.4.0'); },
                  function () {
                      throw new MochiKit.Async.BrowserComplianceError("Browser does not support XMLHttpRequest");
                  }
              ];
              for (var i = 0; i < tryThese.length; i++) {
                  var func = tryThese[i];
                  try {
                      self.XMLHttpRequest = func;
                      return func();
                  } catch (e) {
                      // pass
                  }
              }
          }
          return self.XMLHttpRequest();
      },

      _xhr_onreadystatechange: function (d) {
          // MochiKit.Logging.logDebug('this.readyState', this.readyState);
          var m = MochiKit.Base;
          if (this.readyState == 4) {
              // IE SUCKS
              try {
                  this.onreadystatechange = null;
              } catch (e) {
                  try {
                      this.onreadystatechange = m.noop;
                  } catch (e) {
                  }
              }
              var status = null;
              try {
                  status = this.status;
                  if (!status && m.isNotEmpty(this.responseText)) {
                      // 0 or undefined seems to mean cached or local
                      status = 304;
                  }
              } catch (e) {
                  // pass
                  // MochiKit.Logging.logDebug('error getting status?', repr(items(e)));
              }
              //  200 is OK, 304 is NOT_MODIFIED
              if (status == 200 || status == 304) { // OK
                  d.callback(this);
              } else {
                  var err = new MochiKit.Async.XMLHttpRequestError(this, "Request failed");
                  if (err.number) {
                      // XXX: This seems to happen on page change
                      d.errback(err);
                  } else {
                      // XXX: this seems to happen when the server is unreachable
                      d.errback(err);
                  }
              }
          }
      },

      _xhr_canceller: function (req) {
          // IE SUCKS
          try {
              req.onreadystatechange = null;
          } catch (e) {
              try {
                  req.onreadystatechange = MochiKit.Base.noop;
              } catch (e) {
              }
          }
          req.abort();
      },

      
      /** @id MochiKit.Async.sendXMLHttpRequest */
      sendXMLHttpRequest: function (req, /* optional */ sendContent) {
          if (typeof(sendContent) == "undefined" || sendContent === null) {
              sendContent = "";
          }

          var m = MochiKit.Base;
          var self = MochiKit.Async;
          var d = new self.Deferred(m.partial(self._xhr_canceller, req));
          
          try {
              req.onreadystatechange = m.bind(self._xhr_onreadystatechange,
                  req, d);
              req.send(sendContent);
          } catch (e) {
              try {
                  req.onreadystatechange = null;
              } catch (ignore) {
                  // pass
              }
              d.errback(e);
          }

          return d;

      },

      /** @id MochiKit.Async.doSimpleXMLHttpRequest */
      doSimpleXMLHttpRequest: function (url/*, ...*/) {
          var self = MochiKit.Async;
          var req = self.getXMLHttpRequest();
          if (arguments.length > 1) {
              var m = MochiKit.Base;
              var qs = m.queryString.apply(null, m.extend(null, arguments, 1));
              if (qs) {
                  url += "?" + qs;
              }
          }
          req.open("GET", url, true);
          return self.sendXMLHttpRequest(req);
      },

      /** @id MochiKit.Async.loadJSONDoc */
      loadJSONDoc: function (url) {
          var self = MochiKit.Async;
          var d = self.doSimpleXMLHttpRequest.apply(self, arguments);
          d = d.addCallback(self.evalJSONRequest);
          return d;
      },

      /** @id MochiKit.Async.sendJSONPRequest */
      sendJSONPRequest: function (url, callbackQuery, timeout/* = 30 */, /* optional */scriptElementAttr) {
          var m = MochiKit.Base;
          var self = MochiKit.Async;
          var callbackId = '_' + self.JSONPCallbacks.nextCallbackId();

          if (typeof(timeout) == "undefined" || timeout === null) {
              timeout = 30;
          }
          var options = {
              'type': 'text/javascript',
              'className': 'JSONPRequest'
          };
          m.update(options, scriptElementAttr || {});

          if(url.indexOf('?') >= 0) {
              var ary = url.split('?', 2);
              url = ary[0];
              var queryParams = m.parseQueryString(ary[1] || '');
          } else {
              var queryParams = {};
          }
          queryParams[callbackQuery] = 'BookmarkCommentViewer.JSONPCallbacks.' + callbackId;
          url += '?' + m.queryString(queryParams);

          var d = new self.Deferred();
          BookmarkCommentViewer.JSONPCallbacks[callbackId] = m.partial(self._jsonp_callback_handler, d);

          var script = document.createElement('script');
          m.update(script, options);
          m.update(script, {
              'src': url,
              'id': '_JSONPRequest_' + callbackId
          });

          // FIXME don't work opera.
          // setTimeout with appendChild(script) don't ASYNC timer...
          var timeout = setTimeout(
              function() {
                  d.canceller();
                  d.errback('JSONP Request timeout');
              }, Math.floor(timeout * 1000)
          );
          d.canceller = m.partial(self._jsonp_canceller, callbackId, timeout);
          
          setTimeout(function() {
              document.getElementsByTagName('head')[0].appendChild(script);
          }, 1); // setTimeout is for opera

          return d;
      },
      
      _jsonp_callback_handler: function(d, json) {
          d.canceller(); // remove script element and clear timeout
          d.callback(json);
      },

      _jsonp_canceller: function(callbackId, timeout) {
          try {
              clearTimeout(timeout);
          } catch (e) {
              // pass
          }
          try {
              /* remove script element */
              //var element = document.getElementById('_JSONPRequest_' + callbackId);
              //element.parentNode.removeChild(element);
          } catch (e) {
              // pass
          }
          //MochiKit.Async.JSONPCallbacks[callbackId] = function() {};
      },

      /** @id MochiKit.Async.wait */
      wait: function (seconds, /* optional */value) {
          var d = new MochiKit.Async.Deferred();
          var m = MochiKit.Base;
          if (typeof(value) != 'undefined') {
              d.addCallback(function () { return value; });
          }
          var timeout = setTimeout(
              m.bind("callback", d),
              Math.floor(seconds * 1000));
          d.canceller = function () {
              try {
                  clearTimeout(timeout);
              } catch (e) {
                  // pass
              }
          };
          return d;
      },

      /** @id MochiKit.Async.callLater */
      callLater: function (seconds, func) {
          var m = MochiKit.Base;
          var pfunc = m.partial.apply(m, m.extend(null, arguments, 1));
          return MochiKit.Async.wait(seconds).addCallback(
              function (res) { return pfunc(); }
          );
      }
  });


  /** @id MochiKit.Async.DeferredLock */
  MochiKit.Async.DeferredLock = function () {
      this.waiting = [];
      this.locked = false;
      this.id = this._nextId();
  };

  MochiKit.Async.DeferredLock.prototype = {
      __class__: MochiKit.Async.DeferredLock,
      /** @id MochiKit.Async.DeferredLock.prototype.acquire */
      acquire: function () {
          d = new MochiKit.Async.Deferred();
          if (this.locked) {
              this.waiting.push(d);
          } else {
              this.locked = true;
              d.callback(this);
          }
          return d;
      },
      /** @id MochiKit.Async.DeferredLock.prototype.release */
      release: function () {
          if (!this.locked) {
              throw TypeError("Tried to release an unlocked DeferredLock");
          }
          this.locked = false;
          if (this.waiting.length > 0) {
              this.locked = true;
              this.waiting.shift().callback(this);
          }
      },
      _nextId: MochiKit.Base.counter(),
      repr: function () {
          var state;
          if (this.locked) {
              state = 'locked, ' + this.waiting.length + ' waiting';
          } else {
              state = 'unlocked';
          }
          return 'DeferredLock(' + this.id + ', ' + state + ')';
      },
      toString: MochiKit.Base.forwardCall("repr")

  };

  /** @id MochiKit.Async.DeferredList */
  MochiKit.Async.DeferredList = function (list, /* optional */fireOnOneCallback, fireOnOneErrback, consumeErrors, canceller) {

      // call parent constructor
      MochiKit.Async.Deferred.apply(this, [canceller]);
      
      this.list = list;
      var resultList = [];
      this.resultList = resultList;

      this.finishedCount = 0;
      this.fireOnOneCallback = fireOnOneCallback;
      this.fireOnOneErrback = fireOnOneErrback;
      this.consumeErrors = consumeErrors;

      var cb = MochiKit.Base.bind(this._cbDeferred, this);
      for (var i = 0; i < list.length; i++) {
          var d = list[i];
          resultList.push(undefined);
          d.addCallback(cb, i, true);
          d.addErrback(cb, i, false);
      }

      if (list.length === 0 && !fireOnOneCallback) {
          this.callback(this.resultList);
      }
      
  };

  MochiKit.Async.DeferredList.prototype = new MochiKit.Async.Deferred();

  MochiKit.Async.DeferredList.prototype._cbDeferred = function (index, succeeded, result) {
      this.resultList[index] = [succeeded, result];
      this.finishedCount += 1;
      if (this.fired == -1) {
          if (succeeded && this.fireOnOneCallback) {
              this.callback([index, result]);
          } else if (!succeeded && this.fireOnOneErrback) {
              this.errback(result);
          } else if (this.finishedCount == this.list.length) {
              this.callback(this.resultList);
          }
      }
      if (!succeeded && this.consumeErrors) {
          result = null;
      }
      return result;
  };

  /** @id MochiKit.Async.gatherResults */
  MochiKit.Async.gatherResults = function (deferredList) {
      var d = new MochiKit.Async.DeferredList(deferredList, false, true, false);
      d.addCallback(function (results) {
          var ret = [];
          for (var i = 0; i < results.length; i++) {
              ret.push(results[i][1]);
          }
          return ret;
      });
      return d;
  };

  /** @id MochiKit.Async.maybeDeferred */
  MochiKit.Async.maybeDeferred = function (func) {
      var self = MochiKit.Async;
      var result;
      try {
          var r = func.apply(null, MochiKit.Base.extend([], arguments, 1));
          if (r instanceof self.Deferred) {
              result = r;
          } else if (r instanceof Error) {
              result = self.fail(r);
          } else {
              result = self.succeed(r);
          }
      } catch (e) {
          result = self.fail(e);
      }
      return result;
  };

  /** @id MochiKit.Async.JSONPCallbacks */
  if (typeof(MochiKit.Async.JSONPCallbacks) == 'undefined') {
      MochiKit.Async.JSONPCallbacks = {
              nextCallbackId: MochiKit.Base.counter()
      };
  }



  MochiKit.Async.EXPORT = [
      "AlreadyCalledError",
      "CancelledError",
      "BrowserComplianceError",
      "GenericError",
      "XMLHttpRequestError",
      "Deferred",
      "succeed",
      "fail",
      "getXMLHttpRequest",
      "doSimpleXMLHttpRequest",
      "loadJSONDoc",
      "sendJSONPRequest",
      "wait",
      "callLater",
      "sendXMLHttpRequest",
      "DeferredLock",
      "DeferredList",
      "gatherResults",
      "maybeDeferred"
  ];
      
  MochiKit.Async.EXPORT_OK = [
      "evalJSONRequest"
  ];

  MochiKit.Async.__new__ = function () {
      var m = MochiKit.Base;
      var ne = m.partial(m._newNamedError, this);
      
      ne("AlreadyCalledError", 
          /** @id MochiKit.Async.AlreadyCalledError */
          function (deferred) {
              /***

              Raised by the Deferred if callback or errback happens
              after it was already fired.

              ***/
              this.deferred = deferred;
          }
      );

      ne("CancelledError",
          /** @id MochiKit.Async.CancelledError */
          function (deferred) {
              /***

              Raised by the Deferred cancellation mechanism.

              ***/
              this.deferred = deferred;
          }
      );

      ne("BrowserComplianceError",
          /** @id MochiKit.Async.BrowserComplianceError */
          function (msg) {
              /***

              Raised when the JavaScript runtime is not capable of performing
              the given function.  Technically, this should really never be
              raised because a non-conforming JavaScript runtime probably
              isn't going to support exceptions in the first place.

              ***/
              this.message = msg;
          }
      );

      ne("GenericError", 
          /** @id MochiKit.Async.GenericError */
          function (msg) {
              this.message = msg;
          }
      );

      ne("XMLHttpRequestError",
          /** @id MochiKit.Async.XMLHttpRequestError */
          function (req, msg) {
              /***

              Raised when an XMLHttpRequest does not complete for any reason.

              ***/
              this.req = req;
              this.message = msg;
              try {
                  // Strange but true that this can raise in some cases.
                  this.number = req.status;
              } catch (e) {
                  // pass
              }
          }
      );


      this.EXPORT_TAGS = {
          ":common": this.EXPORT,
          ":all": m.concat(this.EXPORT, this.EXPORT_OK)
      };

      m.nameFunctions(this);

  };

  MochiKit.Async.__new__();

  MochiKit.Base._exportSymbols(MochiNameSpace, MochiKit.Async);
  /***

  MochiKit.Logging 1.4

  See <http://mochikit.com/> for documentation, downloads, license, etc.

  (c) 2005 Bob Ippolito.  All rights Reserved.

  ***/

  if (typeof(dojo) != 'undefined') {
      dojo.provide('MochiKit.Logging');
      dojo.require('MochiKit.Base');
  }

  if (typeof(JSAN) != 'undefined') {
      JSAN.use("MochiKit.Base", []);
  }

  try {
      if (typeof(MochiKit.Base) == 'undefined') {
          throw "";
      }
  } catch (e) {
      throw "MochiKit.Logging depends on MochiKit.Base!";
  }

  if (typeof(MochiKit.Logging) == 'undefined') {
      MochiKit.Logging = {};
  }

  MochiKit.Logging.NAME = "MochiKit.Logging";
  MochiKit.Logging.VERSION = "1.4";
  MochiKit.Logging.__repr__ = function () {
      return "[" + this.NAME + " " + this.VERSION + "]";
  };

  MochiKit.Logging.toString = function () {
      return this.__repr__();
  };


  MochiKit.Logging.EXPORT = [
      "LogLevel",
      "LogMessage",
      "Logger",
      "alertListener",
      "logger",
      "log",
      "logError",
      "logDebug",
      "logFatal",
      "logWarning"
  ];


  MochiKit.Logging.EXPORT_OK = [
      "logLevelAtLeast",
      "isLogMessage",
      "compareLogMessage"
  ];


  /** @id MochiKit.Logging.LogMessage */
  MochiKit.Logging.LogMessage = function (num, level, info) {
      this.num = num;
      this.level = level;
      this.info = info;
      this.timestamp = new Date();
  };

  MochiKit.Logging.LogMessage.prototype = {
       /** @id MochiKit.Logging.LogMessage.prototype.repr */
      repr: function () {
          var m = MochiKit.Base;
          return 'LogMessage(' + 
              m.map(
                  m.repr,
                  [this.num, this.level, this.info]
              ).join(', ') + ')';
      },
      /** @id MochiKit.Logging.LogMessage.prototype.toString */
      toString: MochiKit.Base.forwardCall("repr")
  };

  MochiKit.Base.update(MochiKit.Logging, {
      /** @id MochiKit.Logging.logLevelAtLeast */
      logLevelAtLeast: function (minLevel) {
          var self = MochiKit.Logging;
          if (typeof(minLevel) == 'string') {
              minLevel = self.LogLevel[minLevel];
          }
          return function (msg) {
              var msgLevel = msg.level;
              if (typeof(msgLevel) == 'string') {
                  msgLevel = self.LogLevel[msgLevel];
              }
              return msgLevel >= minLevel;
          };
      },

      /** @id MochiKit.Logging.isLogMessage */
      isLogMessage: function (/* ... */) {
          var LogMessage = MochiKit.Logging.LogMessage;
          for (var i = 0; i < arguments.length; i++) {
              if (!(arguments[i] instanceof LogMessage)) {
                  return false;
              }
          }
          return true;
      },

      /** @id MochiKit.Logging.compareLogMessage */
      compareLogMessage: function (a, b) {
          return MochiKit.Base.compare([a.level, a.info], [b.level, b.info]);
      },

      /** @id MochiKit.Logging.alertListener */
      alertListener: function (msg) {
          alert(
              "num: " + msg.num +
              "\nlevel: " +  msg.level +
              "\ninfo: " + msg.info.join(" ")
          );
      }

  });

  /** @id MochiKit.Logging.Logger */
  MochiKit.Logging.Logger = function (/* optional */maxSize) {
      this.counter = 0;
      if (typeof(maxSize) == 'undefined' || maxSize === null) {
          maxSize = -1;
      }
      this.maxSize = maxSize;
      this._messages = [];
      this.listeners = {};
      this.useNativeConsole = false;
  };

  MochiKit.Logging.Logger.prototype = {
      /** @id MochiKit.Logging.Logger.prototype.clear */
      clear: function () {
          this._messages.splice(0, this._messages.length);
      },

      /** @id MochiKit.Logging.Logger.prototype.logToConsole */
      logToConsole: function (msg) {
          if (typeof(window) != "undefined" && window.console
                  && window.console.log) {
              // Safari and FireBug 0.4
              // Percent replacement is a workaround for cute Safari crashing bug 
              //window.console.log(msg.replace(/%/g, '\uFF05'));
              window.console.log(msg);
          } else if (typeof(opera) != "undefined" && opera.postError) {
              // Opera
              opera.postError(msg);
          } else if (typeof(printfire) == "function") {
              // FireBug 0.3 and earlier
              printfire(msg);
          } else if (typeof(Debug) != "undefined" && Debug.writeln) {
              // IE Web Development Helper (?)
              // http://www.nikhilk.net/Entry.aspx?id=93
              Debug.writeln(msg);
          } else if (typeof(debug) != "undefined" && debug.trace) {
              // Atlas framework (?)
              // http://www.nikhilk.net/Entry.aspx?id=93
              debug.trace(msg);
          }
      },
      
      /** @id MochiKit.Logging.Logger.prototype.dispatchListeners */
      dispatchListeners: function (msg) {
          for (var k in this.listeners) {
              var pair = this.listeners[k];
              if (pair.ident != k || (pair[0] && !pair[0](msg))) {
                  continue;
              }
              pair[1](msg);
          }
      },

      /** @id MochiKit.Logging.Logger.prototype.addListener */
      addListener: function (ident, filter, listener) {
          if (typeof(filter) == 'string') {
              filter = MochiKit.Logging.logLevelAtLeast(filter);
          }
          var entry = [filter, listener];
          entry.ident = ident;
          this.listeners[ident] = entry;
      },

      /** @id MochiKit.Logging.Logger.prototype.removeListener */
      removeListener: function (ident) {
          delete this.listeners[ident];
      },

      /** @id MochiKit.Logging.Logger.prototype.baseLog */
      baseLog: function (level, message/*, ...*/) {
          var msg = new MochiKit.Logging.LogMessage(
              this.counter,
              level,
              MochiKit.Base.extend(null, arguments, 1)
          );
          this._messages.push(msg);
          this.dispatchListeners(msg);
          if (this.useNativeConsole) {
              this.logToConsole(msg.level + ": " + msg.info.join(" "));
          }
          this.counter += 1;
          while (this.maxSize >= 0 && this._messages.length > this.maxSize) {
              this._messages.shift();
          }
      },

      /** @id MochiKit.Logging.Logger.prototype.getMessages */
      getMessages: function (howMany) {
          var firstMsg = 0;
          if (!(typeof(howMany) == 'undefined' || howMany === null)) {
              firstMsg = Math.max(0, this._messages.length - howMany);
          }
          return this._messages.slice(firstMsg);
      },

      /** @id MochiKit.Logging.Logger.prototype.getMessageText */
      getMessageText: function (howMany) {
          if (typeof(howMany) == 'undefined' || howMany === null) {
              howMany = 30;
          }
          var messages = this.getMessages(howMany);
          if (messages.length) {
              var lst = map(function (m) {
                  return '\n  [' + m.num + '] ' + m.level + ': ' + m.info.join(' '); 
              }, messages);
              lst.unshift('LAST ' + messages.length + ' MESSAGES:');
              return lst.join('');
          }
          return '';
      },

      /** @id MochiKit.Logging.Logger.prototype.debuggingBookmarklet */
      debuggingBookmarklet: function (inline) {
          if (typeof(MochiKit.LoggingPane) == "undefined") {
              alert(this.getMessageText());
          } else {
              MochiKit.LoggingPane.createLoggingPane(inline || false);
          }
      }
  };

  MochiKit.Logging.__new__ = function () {
      this.LogLevel = {
          ERROR: 40,
          FATAL: 50,
          WARNING: 30,
          INFO: 20,
          DEBUG: 10
      };

      var m = MochiKit.Base;
      m.registerComparator("LogMessage",
          this.isLogMessage,
          this.compareLogMessage
      );

      var partial = m.partial;

      var Logger = this.Logger;
      var baseLog = Logger.prototype.baseLog;
      m.update(this.Logger.prototype, {
          debug: partial(baseLog, 'DEBUG'),
          log: partial(baseLog, 'INFO'),
          error: partial(baseLog, 'ERROR'),
          fatal: partial(baseLog, 'FATAL'),
          warning: partial(baseLog, 'WARNING')
      });

      // indirectly find logger so it can be replaced
      var self = this;
      var connectLog = function (name) {
          return function () {
              self.logger[name].apply(self.logger, arguments);
          };
      };

      /** @id MochiKit.Logging.log */
      this.log = connectLog('log');
      /** @id MochiKit.Logging.logError */
      this.logError = connectLog('error');
      /** @id MochiKit.Logging.logDebug */
      this.logDebug = connectLog('debug');
      /** @id MochiKit.Logging.logFatal */
      this.logFatal = connectLog('fatal');
      /** @id MochiKit.Logging.logWarning */
      this.logWarning = connectLog('warning');
      this.logger = new Logger();
      this.logger.useNativeConsole = true;

      this.EXPORT_TAGS = {
          ":common": this.EXPORT,
          ":all": m.concat(this.EXPORT, this.EXPORT_OK)
      };

      m.nameFunctions(this);

  };

  if (typeof(printfire) == "undefined" &&
          typeof(document) != "undefined" && document.createEvent &&
          typeof(dispatchEvent) != "undefined") {
      // FireBug really should be less lame about this global function
      printfire  = function () {
          printfire.args = arguments;
          var ev = document.createEvent("Events");
          ev.initEvent("printfire", false, true);
          dispatchEvent(ev);
      };
  }

  MochiKit.Logging.__new__();

  MochiKit.Base._exportSymbols(MochiNameSpace, MochiKit.Logging);

  /* END of mochikit code */

  with(MochiNameSpace) {
    /*
     * BookmarkCommentViewer.js
     * Copyright (C) 2006, hatena ( http://www.hatena.ne.jp/ ).
     *
     * MIT Licence.
     *
     *
     * - 1.2 2006/09/21
     *   [change] don't use global namespaces function
     *
     * - 1.1 2006/09/21
     *   [change] JSONPCallback Name
     *   [change] initCreateRelAfterIcon a.href string delete b's http://~
     *
     * - 1.0 2006/09/19 
     *   release
     */
    
    if (typeof(BookmarkCommentViewer) == 'undefined') {
        BookmarkCommentViewer = {};
    }
    BookmarkCommentViewer.NAME = "BookmarkCommentViewer";
    BookmarkCommentViewer.VERSION = "1.3";
    BookmarkCommentViewer.__repr__ = function () {
        return "[" + this.NAME + " " + this.VERSION + "]";
    };
    BookmarkCommentViewer.toString = function () {
        return this.__repr__();
    };
    BookmarkCommentViewer.JSONPCallbacks = {};
    
    update(BookmarkCommentViewer, {
        JSONURL: 'http://b.hatena.ne.jp/entry/jsonlite/?url=',
        ICONURL: 'http://r.hatena.ne.jp/images/popup.gif',
        B_ENTRY_ICONURL: 'http://r.hatena.ne.jp/images/b_entry.gif',
        B_APPEND_ENTRY_ICONURL: 'http://r.hatena.ne.jp/images/b_add.gif',
        LOADING_ICONURL: 'http://r.hatena.ne.jp/images/load_s.gif',
        COMMENT_CACHE: {},
        B_IMG_LINK_CACHE: {},
    
        options: {
            dateFormat: '%y蟷ｴ%m譛�%d譌･',
            bUserIcon: true,
            tags: true,
            blankCommentHide : false,
            screenshot: false,
            commentWidth: 400,
            maxLimit: 200,
            maxLimitIE: 100,
            maxListHeight: 300,
            firstShowLimit: 20,
            sortReverse: false
        },
    
        createAafterIcon: function(a) {
            if (!(a && a.tagName == 'A')) return;
            var img = IMG({
                src: this.ICONURL,
                alt: a.href + '縺ｮ繝悶ャ繧ｯ繝槭�繧ｯ繧ｳ繝｡繝ｳ繝�',
                title: a.href + '縺ｮ繝悶ャ繧ｯ繝槭�繧ｯ繧ｳ繝｡繝ｳ繝�'
            });
            addElementClass(img, 'hatena-bcomment-view-icon');
            a.parentNode.insertBefore(img, a.nextSibling);
    
            MochiKit.Signal.connect(img, 'onclick', this, partial(this.iconImageClickHandler, img, a.href));
        },
    
        iconImageClickHandler: function(img, url, ev) {
            this.toggleCommentView(img, url);
            (ev.src ? ev : new MochiKit.Signal.Event(img, ev)).stop();
            return false;
        },
    
        toggleCommentView: function(el, url) {
            var comment = this.popupCommentView(el, url);
            this.toggleElementDisplay(comment);
        },
    
        toggleElementDisplay: function(el) {
            el.style.display == 'none' ? showElement(el)
                                       : hideElement(el);
        },
    
        popupCommentView: function(el, url) {
            this.popupInit(el);
            var cacheKey = [el, url];
            var comment = this.COMMENT_CACHE[cacheKey];
            if(!comment) {
                el.src = this.LOADING_ICONURL;
                var comment = this.asyncCommnetView(url, bind(function(div) {
                    el.src = this.ICONURL;
                    this.commentAreaMove(div, el);
                }, this));
                this.COMMENT_CACHE[cacheKey] = comment;
                document.body.appendChild(comment);
                //el.parentNode.insertBefore(comment, el.nextSibling);
            }
            return comment;
        },
    
        commentAreaMove: function(comment, el) {
            var pos = getElementPosition(el);
            if( getViewportDimensions().w - pos.x < this.options.commentWidth ) {
                pos.x = getViewportDimensions().w - this.options.commentWidth - 20;
            }
            pos.x = Math.max(pos.x - 20, 0);
            pos.y += 15;
            setElementPosition(comment, pos);
        },
    
        popupInit: function() {
            if (this._popupInitLoaded) return;
            this._popupInitLoaded = true;
            MochiKit.Signal.connect(this, 'allHideComment', this, function(ev) {
                forEach(items(this.COMMENT_CACHE), compose(hideElement, itemgetter(1)));
            });
            MochiKit.Signal.connect(document.body, 'onclick', this, function(ev) {
                MochiKit.Signal.signal(this, 'allHideComment');
            });
        },
    
        includeParentALink: function(el) {
            if (el.toString().indexOf('http') >= 0) {
                return true;
            }
            if(el.parentNode) {
                return this.includeParentALink(el.parentNode);
            }
            return false;
        },
    
        asyncCommnetView: function(url, onCompleteCallback) {
            if( typeof onCompleteCallback != 'function') {
                onCompleteCallback = function(){};
            }
            var self = this;
            var div = DIV({'class': 'hatena-bcomment-view'});
            div.style.width = this.options.commentWidth;
            MochiKit.Signal.connect(div, 'onclick', function(ev) {
                if(!self.includeParentALink(ev.target())) {
                    ev.stop();
                }
            });
    
            var createView = partial(this.createView, url, onCompleteCallback, div);
            var d = sendJSONPRequest(
                this.JSONURL + encodeURIComponent(url), 'callback', null, {
                    charset: 'utf-8'
            });
            d.addCallback(function(json) {
                createView(json);
            });
            d.addErrback(function(e) { 
                // log(e);
                createView('繝��繧ｿ縺ｮ隱ｭ縺ｿ霎ｼ縺ｿ縺ｫ螟ｱ謨励＠縺ｾ縺励◆縲�', e);
            });
            return div;
        },
    
        createView: function(url, callback, div, json, error) {
            if(error) {
                appendChildNodes(div, this.createTitle(json, url));
            } else if(!json) {
                appendChildNodes(div, this.createTitle('縺ｾ縺�繝悶ャ繧ｯ繝槭�繧ｯ縺輔ｌ縺ｦ縺�∪縺帙ｓ縲�', url));
            } else {
                var ul = UL();
                MochiKit.Signal.connect(ul, 'refreshPosition', partial(this.commentListRefreshPosition, ul, this.options.maxListHeight));
                if( this.options.screenshot ) {
                    this.addScreenshot(ul, json.screenshot, json.title);
                }
                var liCreater = this.createBUserListFunction(json.eid);
                var bookmarks = json.bookmarks;
                if ( this.options.blankCommentHide ) {
                    bookmarks = list(ifilter(function(bookmark) {
                        return bookmark.comment.replace(/\s+/g,'').length != 0
                    }, bookmarks));
                }
                var bUserCount = bookmarks.length;
                if ( this.options.sortReverse ) {
                    bookmarks = bookmarks.reverse();
                }
                if ( /MSIE/.test(navigator.userAgent) && this.options.maxLimitIE ) {
                    var maxLimit = this.options.maxLimitIE;
                } else if ( this.options.maxLimit ) {
                    var maxLimit = this.options.maxLimit;
                } else {
                    var maxLimit = bUserCount;
                }
                appendChildNodes(div, this.createTitle(json.title, url));
    
                if (bUserCount > 0) {
                    var self = this;
                    
                    var loopCount = Math.min(this.options.firstShowLimit, maxLimit, bUserCount);
                    for (var i = 0; i < loopCount; i++) {
                        var ymd = self.getYMD(new Date(bookmarks[i].timestamp));
                        ul.appendChild(liCreater(bookmarks[i], ymd));
                    }
    
                    callLater(0, function() {
                        for (var i = loopCount; i < maxLimit; i++) {
                            var ymd = self.getYMD(new Date(bookmarks[i].timestamp));
                            ul.appendChild(liCreater(bookmarks[i], ymd));
                        }
                        if ( bUserCount > maxLimit ) {
                            appendChildNodes(ul, LI({'class': 'hatena-bcomment-view-moreread'}, self.createBEntryLink(url, '邯壹″繧定ｪｭ繧', '#comments')));
                        }
                        MochiKit.Signal.signal(ul, 'refreshPosition');
                    });
                    appendChildNodes(div, ul);
                }
            }
            showElement(div);
            if ( ul ) MochiKit.Signal.signal(ul, 'refreshPosition');
            callback(div);
        },
    
        commentListRefreshPosition: function(ul, height) {
            if ( ul.offsetHeight > height) ul.style.height = height.toString() + 'px';
        },
    
        createTitle: function(title, url) {
            return P({'class': 'hatena-bcomment-title'}, title, this.createBEntryLinkWithUsers(url), this.createBAppendLink(url) );
        },
    
        createBEntryWithImage: function(url) {
            return this.createBEntryLink(url, IMG({
                src: this.B_ENTRY_ICONURL,
                alt: '縺薙�繧ｨ繝ｳ繝医Μ繝ｼ繧貞性繧繝悶ャ繧ｯ繝槭�繧ｯ',
                border: 0,
                title: '縺薙�繧ｨ繝ｳ繝医Μ繝ｼ繧貞性繧繝悶ャ繧ｯ繝槭�繧ｯ'
            }));
       },
    
        createBEntryLink: function(url, el, comment) {
            return A({
                href: 'http://b.hatena.ne.jp/entry/' + url.replace('#', '%23') + (comment ? comment : '')
            }, el);
        },
    
        createBEntryLinkWithUsers: function(url) {
            return this.createBEntryLink(url, IMG({
                src: 'http://b.hatena.ne.jp/entry/image/' + url.replace('#', '%23'),
                alt: '縺薙�繧ｨ繝ｳ繝医Μ繝ｼ繧貞性繧繝悶ャ繧ｯ繝槭�繧ｯ',
                border: 0,
                title: '縺薙�繧ｨ繝ｳ繝医Μ繝ｼ繧貞性繧繝悶ャ繧ｯ繝槭�繧ｯ'
            }));
        },
    
        createBAppendLink: function(url) {
            return A({
                href: 'http://b.hatena.ne.jp/append?' + encodeURIComponent(url)
            }, IMG({
                src: this.B_APPEND_ENTRY_ICONURL,
                alt: '縺薙�繧ｨ繝ｳ繝医Μ繝ｼ繧偵ヶ繝�け繝槭�繧ｯ縺ｫ霑ｽ蜉�縺吶ｋ',
                border: 0,
                title: '縺薙�繧ｨ繝ｳ繝医Μ繝ｼ繧偵ヶ繝�け繝槭�繧ｯ縺ｫ霑ｽ蜉�縺吶ｋ'
            }));
        },
    
        addScreenshot: function(ul, screenshot, title) {
            var sImg = IMG({
                src: screenshot,
                'class': 'hatena-bcomment-screenshot',
                style: 'float: right',
                alt: title + '縺ｮ繧ｹ繧ｯ繝ｪ繝ｼ繝ｳ繧ｷ繝ｧ繝�ヨ',
                title: title + '縺ｮ繧ｹ繧ｯ繝ｪ繝ｼ繝ｳ繧ｷ繝ｧ繝�ヨ'
            });
            sImg.style.margin = '10px';
            ul.appendChild(sImg);
        },
    
        siprintf: function(str, replaceStrings/* ... */) {
            var strs = extend(null, arguments, 1);
            var len = strs.length;
            for (var i = 0; i < len; i++)
                str = str.replace('%s', strs[i]);
            return str;
        },
    
        createBUserListFunction: function(eid) {
            var self = this;
            return function(bookmark, ymd) {
                var ary = [];
                var options = self.options;
                if ( options.dateFormat ) {
                    ary.push(self.siprintf('<span class="hatena-bcomment-date">%s</span>',
                      escapeHTML(options.dateFormat.replace('%y', ymd[0]).replace('%m', ymd[1]).replace('%d', ymd[2]))
                    ));
                }
                if( options.bUserIcon ) {
                    ary.push(self.createBImageLink(bookmark.user));
                }
                ary.push(self.createBUserLink(bookmark.user, ymd, eid));
                if( options.tags ) {
                    ary.push(self.createUserTagsLink(bookmark.user, bookmark.tags));
                }
                ary.push(escapeHTML(bookmark.comment));
                var li = LI();
                li.innerHTML = ary.join('');
                return li;
            };
        },
    
        createUserTagsLink: function(bUserName, tags) {
            var len = tags.length;
            var res = [];
            var tmpl = '<span class="hatena-bcomment-tag"><a href="%s">%s</a></span>';
            for (var i = 0; i < len; i++) {
                var tag = tags[i];
                res.push(this.siprintf(tmpl, 'http://b.hatena.ne.jp/' + bUserName + '/' + encodeURIComponent(tag), escapeHTML(tag)));
            };
            return res.join(', ');
        },
    
        createBUserLink: function(bUserName, ymd, eid) {
              return this.siprintf('<a href="%s">%s</a>',
                    'http://b.hatena.ne.jp/' + bUserName + '/' + ymd.join('') + '#bookmark-' + eid,
                    bUserName);
        },
    
        getYMD: function(date) {
            var ymd = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
            ymd[1] = ymd[1].toString().length == 1 ? '0' + ymd[1] : ymd[1];
            ymd[2] = ymd[2].toString().length == 1 ? '0' + ymd[2] : ymd[2];
            return ymd;
        },
    
        createBImageLink: function(bUserName) {
            var bImg = this.B_IMG_LINK_CACHE[bUserName];
            if (!bImg) {
                bImg = this.siprintf('<a href="%s"><img height=16 width=16 border=0 src="%s" alt="%s" title="%s"></a>', 
                  'http://b.hatena.ne.jp/' + bUserName + '/',
                  'http://www.hatena.ne.jp/users/' + bUserName.substr(0, 2) + '/' + bUserName + '/profile_s.gif',
                  bUserName,
                  bUserName);
                this.B_IMG_LINK_CACHE[bUserName] = bImg;
            }
            return bImg;
        },
    
        initCreateRelAfterIcon: function() {
            var self = this;
            MochiKit.Signal.connect(window, 'onload', function() {
                forEach(document.getElementsByTagName('a'), function(a) {
                    if( a.rel && a.rel == 'bcomment-viewer' ) {
                        a.href = a.href.replace(/^http:\/\/b.hatena.ne.jp\/entry\//, '');
                        self.createAafterIcon(a);
                    }
                });
            });
        },
    
        updateOptions: function(options) {
            update(this.options, options);
        },
    
        EXPORT_TAGS: {
            ":all": ['iconImageClickHandler', 'initCreateRelAfterIcon']
        }
    });
    
    nameFunctions(BookmarkCommentViewer);
    bindMethods(BookmarkCommentViewer);
    MochiKit.Base._exportSymbols(window, BookmarkCommentViewer);
  }
}).apply({});
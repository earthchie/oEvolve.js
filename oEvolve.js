/**
 * @name oEvolve.js
 * @version 1.0.2
 * @update June 9, 2017
 * @website https://github.com/earthchie/oEvolve.js
 * @author Earthchie https://facebook.com/earthchie/
 * @license WTFPL v.2 - http://www.wtfpl.net/
 **/
function oEvolve(obj, options) {
    'use strict';

    obj = obj || {};
    options = options || {};
    options.proto = options.proto || {};

    if (typeof options.deep === 'undefined') {
        options.deep = 10;
    }

    var proto = options.proto,
        setPrototype = function (target, key, val) {
            proto[key] = val;
            Object.setPrototypeOf(target, proto);
            return target;
        },
        i;

    /*
     * clone this object
     */
    setPrototype(obj, '__clone', function (deep) {
        if (typeof deep === 'undefined') {
            deep = false;
        }
        if (deep) {
            return new oEvolve(JSON.parse(this.toString()), {
                proto: proto,
                deep: options.deep
            });
        } else {
            return new oEvolve(JSON.parse(this.toString()), {deep: options.deep});
        }
    });

    /*
     * get object data
     */
    setPrototype(obj, '__data', function () {
        return JSON.parse(this.toString());
    });

    /*
     * find diff compare to given object
     */
    setPrototype(obj, '__diff', function (obj1, obj2) {

        if (typeof obj2 === 'undefined') {
            obj2 = obj1 || {};
            obj1 = this;
        }

        if (obj1.__isEvolved) {
            obj1 = obj1.__data();
        }
        if (obj2.__isEvolved) {
            obj2 = obj2.__data();
        }

        return oEvolve.diff(obj1, obj2);

    });

    /*
     * compare if given string are identical to each other
     */
    setPrototype(obj, '__isEqual', function (obj2) {
        return oEvolve.isEqual(this.__data(), obj2);
    });

    /*
     * get value from given key (support flatted keys; e.g. 'user.contact.email')
     */
    setPrototype(obj, '__get', function (key) {
        return oEvolve.get(this, key);
    });

    /*
     * remove data binding
     */
    setPrototype(obj, '__unbindAll', function () {
        setPrototype(this, '__bindListeners', []);
    });

    /*
     * set data binding
     */
    setPrototype(obj, '__bind', function (modifier, dom) {
        if (typeof dom === 'undefined' && modifier instanceof HTMLElement) {
            dom = modifier;
            modifier = false;
        }

        if (dom instanceof HTMLElement) {
            var template = dom.innerHTML,
                self = this;

            setPrototype(self, '__ref', self);
            dom.innerHTML = self.toString(template);

            if (!self.__bindListeners) {
                setPrototype(self, '__bindListeners', []);
            }

            self.__bindListeners.push(function () {
                if (dom instanceof HTMLElement) {
                    if (typeof modifier === 'function') {
                        self = new oEvolve(modifier(self.__data()) || self.__data(), {deep: options.deep});
                    }
                    dom.innerHTML = self.toString(template);
                }
            });

            return {
                binder_id: self.__bindListeners.length - 1,
                unbind: function () {
                    if (self.__bindListeners[this.binder_id]) {
                        self.__bindListeners.splice(this.binder_id, 1);
                    }
                }
            };
        }

    });

    /*
     * set value of given key (support flatted keys; e.g. 'user.contact.email')
     */
    setPrototype(obj, '__set', function (key, value) {
        oEvolve.set(this, key, value);
    });

    /*
     * to string. support basic template mapping in mustach style. {{key}} or {{key||default value}}
     * if first parameter is boolean and true. this function will return formatted json string
     * if first parameter is string. this function evaluate that string as template and will attempt to render value into it.
     * template format: use {{key}} or {{key||default value}}
     */
    setPrototype(obj, 'toString', function (arg) {

        var self,
            found,
            temp,
            html;

        // mustache style templat engine
        if (typeof arg === 'string' && arg !== '') {

            self = this;
            html = arg;

            found = (html.match(/\{\{(.*?)\}\}/g) || []).map(function (item) {
                return item.replace(/\{|\}/g, '');
            }) || [];

            found.map(function (field) {
                temp = field.split('||');
                temp[1] = temp[1] || '';
                html = html.replace(new RegExp('{{' + field.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&') + '}}', 'g'), (self.__get(temp[0]) || temp[1]));
            });

            return html;

        } else {

            if (arg === true) { // beauty
                return JSON.stringify(this, '', 2);
            } else {
                return JSON.stringify(this);
            }

        }
    });

    // alias of __data()
    setPrototype(obj, 'toObject', function () {
        return this.__data();
    });

    /*
     * add event listener
     */
    setPrototype(obj, 'addEventListener', function (name, listener) {
        var self = this,
            listeners = {},
            listener_types = ['watch', 'create', 'update', 'delete'],
            success = false;
        setPrototype(self, '__ref', self);

        name.split(' ').forEach(function (item) {
            if (listener_types.indexOf(item) > -1) {

                var listener_type = '__' + item + 'Listeners',
                    listener_name;

                if (!self[listener_type]) {
                    setPrototype(self, listener_type, {});
                }

                listener_name = listener.name || Object.keys(self[listener_type]).length;

                if (!listeners[listener_type]) {
                    listeners[listener_type] = [];
                }
                listeners[listener_type].push(listener_name);

                self[listener_type][listener_name] = listener;
                success = success || true;
            }
        });
        if (success) {
            return {
                listeners: listeners,
                removeEventListener: function () {
                    var listeners = this.listeners,
                        i;
                    for (i in listeners) {
                        if (listeners.hasOwnProperty(i) && self[i]) {
                            listeners[i].forEach(function (listener_name) {
                                delete self[i][listener_name];
                            });
                        }
                    }
                }
            };
        } else {
            console.warn('addEventListener only support:', listener_types.join(', '));
        }
    });

    /*
     * remove event listener
     */
    setPrototype(obj, 'removeEventListener', function (name, listener) {
        var self = this;
        setPrototype(self, '__ref', self);

        name.split(' ').forEach(function (item) {
            var listeners = '__' + item + 'Listeners';
            if (self[listeners]) {
                if (typeof listener === 'function' && self[listeners][listener.name]) {
                    delete self[listeners][listener.name];
                }
            }
        });
    });

    /*
     * remove all event listeners
     */
    setPrototype(obj, 'removeAllEventListeners', function (name) {
        var self = this;
        setPrototype(self, '__ref', self);

        name.split(' ').forEach(function (item) {
            var listeners = '__' + item + 'Listeners';
            if (self[listeners]) {
                setPrototype(self, listeners, {});
            }
        });
    });

    obj = new Proxy(obj, {

        get: function (target, key) {

            if (key === 'length') {
                return Object.keys(target).length;
            } else if (key === '__isEvolved') {
                return true;
            } else {
                return target[key];
            }


        },
        set: function (target, key, value) {

            var oldval,
                newval,
                diff,
                i,
                keyname,
                listener,
                listener_types = {
                    watch: true,
                    bind: true,
                    create: false,
                    update: false,
                    'delete': false
                };

            if (target.__ref) {
                oldval = target.__ref.__data();
            }

            target[key] = value;

            if (target.__ref) {
                newval = target.__ref.__data();
            }

            diff = oEvolve.diff(oldval, newval);

            for (i in diff) {
                if (diff.hasOwnProperty(i)) {
                    listener_types[diff[i]] = listener_types[diff[i]] || true;
                }
            }

            for (i in listener_types) {
                if (listener_types.hasOwnProperty(i) && listener_types[i]) {
                    listener = target['__' + i + 'Listeners'];

                    for (keyname in listener) {
                        if (typeof listener[keyname] === 'function') {
                            listener[keyname](newval, oldval, diff);
                        }
                    }
                }
            }

            return value;
        },

        deleteProperty: function (target, prop) {
            if (target.hasOwnProperty(prop)) {

                var oldval,
                    newval,
                    diff,
                    key,
                    i,
                    listener,
                    listener_types = {
                        watch: true,
                        bind: true,
                        create: false,
                        update: false,
                        'delete': false
                    };

                if (target.__ref) {
                    oldval = target.__ref.__data();
                }

                delete target[prop];

                if (target.__ref) {
                    newval = target.__ref.__data();
                }

                diff = oEvolve.diff(oldval, newval);

                for (i in diff) {
                    if (diff.hasOwnProperty(i)) {
                        listener_types[diff[i]] = listener_types[diff[i]] || true;
                    }
                }

                for (i in listener_types) {
                    if (listener_types.hasOwnProperty(i) && listener_types[i]) {
                        listener = target['__' + i + 'Listeners'];
                        for (key in listener) {
                            if (typeof listener[key] === 'function') {
                                listener[key](newval, oldval, diff);
                            }
                        }
                    }
                }

                return true;
            }
        }
    });

    if (options.deep) {
        if (!isNaN(options.deep)) {
            options.deep = options.deep - 1;
        }
        for (i in obj) {
            if (obj.hasOwnProperty(i) && obj[i] instanceof Object) {
                obj[i] = new oEvolve(obj[i], options);
            }
        }
    }

    return obj;
}

oEvolve.diff = function (obj1, obj2) {
    'use strict';
    // https://stackoverflow.com/questions/8572826/generic-deep-diff-between-two-objects/8596559#8596559
    var deepDiffMapper = {
            VALUE_CREATED: 'create',
            VALUE_UPDATED: 'update',
            VALUE_DELETED: 'delete',
            VALUE_UNCHANGED: 'unchanged',
            map: function (obj1, obj2) {
                var key,
                    diff,
                    value2;
                if (this.isFunction(obj1) || this.isFunction(obj2)) {
                    throw 'Invalid argument. Function given, object expected.';
                }
                if (this.isValue(obj1) || this.isValue(obj2)) {
                    return this.compareValues(obj1, obj2);
                }

                diff = {};
                for (key in obj1) {
                    if (obj1.hasOwnProperty(key) && !this.isFunction(obj1[key])) {
                        value2 = undefined;
                        if (typeof (obj2[key]) !== 'undefined') {
                            value2 = obj2[key];
                        }

                        diff[key] = this.map(obj1[key], value2);
                    }
                }

                for (key in obj2) {
                    if (obj2.hasOwnProperty(key) && !(this.isFunction(obj2[key]) || (typeof (diff[key]) !== 'undefined'))) {
                        diff[key] = this.map(undefined, obj2[key]);
                    }
                }

                return diff;

            },
            compareValues: function (value1, value2) {
                if (value1 === value2) {
                    return this.VALUE_UNCHANGED;
                }
                if (this.isDate(value1) && this.isDate(value2) && value1.getTime() === value2.getTime()) {
                    return this.VALUE_UNCHANGED;
                }
                if (typeof value1 === 'undefined') {
                    return this.VALUE_CREATED;
                }
                if (typeof value2 === 'undefined') {
                    return this.VALUE_DELETED;
                }

                return this.VALUE_UPDATED;
            },
            isFunction: function (obj) {
                return {}.toString.apply(obj) === '[object Function]';
            },
            isArray: function (obj) {
                return {}.toString.apply(obj) === '[object Array]';
            },
            isObject: function (obj) {
                return {}.toString.apply(obj) === '[object Object]';
            },
            isDate: function (obj) {
                return {}.toString.apply(obj) === '[object Date]';
            },
            isValue: function (obj) {
                return !this.isObject(obj) && !this.isArray(obj);
            }
        },
        diff = oEvolve.deflate(deepDiffMapper.map(obj1 || {}, obj2 || {})),
        i,
        results = {};

    for (i in diff) {
        if (diff[i] === 'unchanged') {
            delete diff[i];
        }
    }

    return diff;
};

oEvolve.get = function (obj, key) {
    'use strict';
    key = key.replace(/\[(\w+)\]/g, '.$1').split('.');
    while (obj && key.length > 0) {
        obj = obj[key.shift()];
    }
    return obj;
};

oEvolve.set = function (obj, key, val) {
    'use strict';
    // http://stackoverflow.com/a/2061827
    var self = obj,
        setData = function (key, val, obj) {
            if (!obj) {
                obj = self; //outside (non-recursive) call, use "data" as our base object
            }
            var ka = key.replace(/\[(\w+)\]/g, '.$1').split(/\./), //split the key by the dots
                oldval;
            if (ka.length < 2) {
                oldval = obj[ka[0]];
                obj[ka[0]] = val; //only one part (no dots) in key, just set value
            } else {
                if (!obj[ka[0]]) {
                    obj[ka[0]] = {}; //create our "new" base obj if it doesn't exist
                }
                obj = obj[ka.shift()]; //remove the new "base" obj from string array, and hold actual object for recursive call
                setData(ka.join('.'), val, obj); //join the remaining parts back up with dots, and recursively set data on our new "base" obj
            }
        };
    setData(key, val);

    return self;
};

oEvolve.inflate = function (obj) {
    'use strict';
    var result = {},
        i;
    for (i in obj) {
        if (obj.hasOwnProperty(i)) {
            oEvolve.set(result, i, obj[i]);
        }
    }
    return result;
};

oEvolve.deflate = function (obj) {
    'use strict';
    //https://gist.github.com/penguinboy/762197
    var flattenObject = function (ob) {
        var toReturn = {},
            i,
            x,
            flatObject;

        for (i in ob) {
            if (ob.hasOwnProperty(i)) {

                if (typeof ob[i] === 'object') {
                    flatObject = flattenObject(ob[i]);

                    for (x in flatObject) {

                        if (flatObject.hasOwnProperty(x)) {
                            toReturn[i + '.' + x] = flatObject[x];
                        }

                    }

                } else {
                    toReturn[i] = ob[i];
                }
            }
        }
        return toReturn;
    };

    return flattenObject(obj);
};

oEvolve.isEqual = function (obj1, obj2) {
    'use strict';

    if (!(obj1 instanceof Function) && (obj1 instanceof Object) && !(obj2 instanceof Function) && (obj2 instanceof Object)) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    } else {
        return false;
    }
};
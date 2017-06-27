/**
 * @name oEvolve.js
 * @version 1.1.1
 * @update June 27, 2017
 * @website https://github.com/earthchie/oEvolve.js
 * @author Earthchie https://facebook.com/earthchie/
 * @license WTFPL v.2 - http://www.wtfpl.net/
 **/
function oEvolve(obj, options) {
    'use strict';

    obj = obj || {};
    options = options || {};
    options.proto = options.proto || {};

    var setPrototype = function (target, key, val) {
            options.proto[key] = val;
            if (proto_list.indexOf(key) === -1) {
                proto_list.push(key);
            }
            if (target instanceof Array) {
                target[key] = val;
            } else {
                Object.setPrototypeOf(target, options.proto);
            }

            return target;
        },
        proto_list = ['__ref'],
        i;

    if (obj instanceof Array) {
        for (var i in options.proto) {
            obj[i] = options.proto[i];
        }
    } else {
        Object.setPrototypeOf(obj, options.proto);
    }


    if (!(obj instanceof Array)) {

        /*
         * extend
         */
        setPrototype(obj, '__extend', function (obj2) {
            oEvolve.extend(this, obj2);
            return this;
        });
        setPrototype(obj, '__concat', function (obj2) {
            oEvolve.extend(this, obj2);
            return this;
        });

        /*
         * entries
         */
        setPrototype(obj, '__entries', function () {
            var data = this.__clone();
            return {
                next: function () {
                    if (data.length < 1) {
                        return {
                            value: undefined,
                            done: true
                        };
                    } else {
                        return {
                            value: data.__shift(true),
                            done: false
                        };
                    }
                }
            }
        });
        
        /*
         * every
         */
        setPrototype(obj, '__every', function (conditioner) {
            var result = true;
            this.__forEach(function (val, key, self) {
                result = result && conditioner(val, key, self);
            });
            return result;
        });

        /*
         * fill
         */
        setPrototype(obj, '__fill', function (val) {
            this.__map(function () {
                return val;
            });
            return this;
        });

        /*
         * filter
         */
        setPrototype(obj, '__filter', function (executor) {
            var self = this;
            for (i in self) {
                if (self.hasOwnProperty(i) && proto_list.indexOf(i) === -1) {
                    if (!executor(self[i], i, self)) {
                        delete self[i];
                    }
                }
            }
            return self;
        });

        /*
         * find
         */
        setPrototype(obj, '__find', function (conditioner) {
            var self = this;
            for (i in self) {
                if (self.hasOwnProperty(i) && proto_list.indexOf(i) === -1) {
                    if (conditioner(self[i], i, self)) {
                        return self[i];
                    }
                }
            }
        });

        /*
         * findIndex
         */
        setPrototype(obj, '__findIndex', function (conditioner) {
            var self = this;
            for (i in self) {
                if (self.hasOwnProperty(i) && proto_list.indexOf(i) === -1) {
                    if (conditioner(self[i], i, self)) {
                        return i;
                    }
                }
            }
            return false;
        });

        /*
         * forEach
         */
        setPrototype(obj, '__forEach', function (executor) {
            var self = this;
            for (i in self) {
                if (self.hasOwnProperty(i) && proto_list.indexOf(i) === -1) {
                    executor(self[i], i, self);
                }
            }
            return self;
        });

        /*
         * includes
         */
        setPrototype(obj, '__includes', function (val) {
            return !!this.__indexOf(val);
        });

        /*
         * indexOf
         * return false if not found
         */
        setPrototype(obj, '__indexOf', function (value, deep, prefix) {
            var self = this,
                found;

            prefix = prefix || '';

            for (i in self) {
                if (self.hasOwnProperty(i) && proto_list.indexOf(i) === -1) {

                    if (self[i] == value) {
                        return prefix + i;
                    }

                    if (self[i].__isEvolved && self[i].__isEqual(value)) {
                        return prefix + i;
                    }

                    if (self[i].__isEvolved && deep) {
                        found = self[i].__indexOf(value, deep, i + '.');
                        if (found !== false) {
                            return found;
                        }
                    }
                }
            }

            return false;
        });

        /*
         * join
         */
        setPrototype(obj, '__join', function (sep) {
            this.__reduce(function (a, b) {
                a = a + sep + b;
                return a;
            });
            return this.value;
        });

        /*
         * keys
         */
        setPrototype(obj, '__keys', function () {
            var data = this.__clone();
            return {
                next: function () {
                    if (data.length < 1) {
                        return {
                            value: undefined,
                            done: true
                        };
                    } else {
                        return {
                            value: data.__shift(true)[1],
                            done: false
                        };
                    }
                }
            }
        });

        /*
         * lastIndexOf
         */
        setPrototype(obj, '__lastIndexOf', function (value, deep, prefix) {
            var self = this,
                index = false,
                found;

            prefix = prefix || '';

            for (i in self) {
                if (self.hasOwnProperty(i) && proto_list.indexOf(i) === -1) {

                    if (self[i] == value) {
                        index = prefix + i;
                    }

                    if (self[i].__isEvolved && self[i].__isEqual(value)) {
                        index = prefix + i;
                    }

                    if (self[i].__isEvolved && deep) {
                        found = self[i].__lastIndexOf(value, deep, i + '.');
                        if (found !== false) {
                            index = found;
                        }
                    }
                }
            }

            return index;
        });

        /*
         * map
         */
        setPrototype(obj, '__map', function (executor) {
            var self = this;
            for (i in self) {
                if (self.hasOwnProperty(i) && proto_list.indexOf(i) === -1) {
                    self[i] = executor(self[i], i, self) || self[i];
                }
            }
            return self;
        });

        /*
         * pop
         */
        setPrototype(obj, '__pop', function (withKey) {
            var last, toPop;
            this.__forEach(function (val, key) {
                toPop = {};
                toPop[key] = val;
                last = key;
            });

            delete this[last];
            if (withKey) {
                return [toPop[last], last];
            } else {
                return toPop[last];
            }
        });

        /*
         * reduce
         */
        setPrototype(obj, '__reduce', function (executor) {
            var self = this,
                data = self.__clone(),
                prev,
                val,
                recieve;

            self.__filter(function () {
                return false;
            });

            data.__forEach(function (item) {
                if (typeof prev === 'undefined') {
                    prev = item;
                } else {
                    recieve = executor(prev, item);
                    if (typeof recieve !== 'undefined') {
                        val = recieve;
                    }
                    prev = val;
                }

            });

            if (typeof val !== 'undefined') {
                self.value = val;
            }
            return val;

        });

        /*
         * reduceRight
         */
        setPrototype(obj, '__reduceRight', function (executor) {
            var self = this;
            return self.__reverse().__reduce(executor);
        });

        /*
         * reverse
         */
        setPrototype(obj, '__reverse', function () {
            var self = this,
                data = this.__clone();

            self.__filter(function(){
                return false;
            });
            Object.keys(data).reverse().forEach(function(key){
                self[key] = data[key];
            });
            return self;
        });

        /*
         * shift
         */
        setPrototype(obj, '__shift', function (withKey) {
            var self = this,
                val;
            for (i in self) {
                if (self.hasOwnProperty(i) && proto_list.indexOf(i) === -1) {
                    val = self[i];
                    delete self[i]
                    if (withKey) {
                        return [val, i];
                    } else {
                        return val;
                    }
                }
            }
        });

        /*
         * some
         */
        setPrototype(obj, '__some', function (conditioner) {
            var result = false;
            this.__forEach(function (val, key, self) {
                result = result || conditioner(val, key, self);
            });
            return result;
        });

        /*
         * values
         */
        setPrototype(obj, '__values', function () {
            var data = this.__clone();
            return {
                next: function () {
                    if (data.length < 1) {
                        return {
                            value: undefined,
                            done: true
                        };
                    } else {
                        return {
                            value: data.__shift(true)[0],
                            done: false
                        };
                    }
                }
            }
        });

    }

    /*
     * clone this object
     */
    setPrototype(obj, '__clone', function (deep) {
        if (typeof deep === 'undefined') {
            deep = false;
        }
        if (deep) {
            return new oEvolve(JSON.parse(this.toString()), {
                proto: options.proto
            });
        } else {
            return new oEvolve(JSON.parse(this.toString()), {});
        }
    });

    /*
     * get object data
     */
    setPrototype(obj, '__data', function (data) {
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
                        self = new oEvolve(modifier(self.__data()) || self.__data(), {});
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
     * sort by keys
     */
    setPrototype(obj, '__sortKeys', function (key, value) {
        var self = this,
            data = this.__clone();

        self.__filter(function(){
            return false;
        });
        Object.keys(data).sort(function(a,b){
            return a-b;
        }).forEach(function(key){
            self[key] = data[key];
        });
        return self;
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
        if (typeof name === 'string' && typeof listener === 'function') {
            var self = this,
                listeners = {},
                listener_types = ['watch', 'create', 'update', 'delete'],
                success = false;

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
        }
    });

    /*
     * remove event listener
     */
    setPrototype(obj, 'removeEventListener', function (name, listener) {
        if (typeof name === 'string' && typeof listener === 'function') {
            var self = this;

            name.split(' ').forEach(function (item) {
                var listeners = '__' + item + 'Listeners';
                if (self[listeners]) {
                    if (typeof listener === 'function' && self[listeners][listener.name]) {
                        delete self[listeners][listener.name];
                    }
                }
            });
        }
    });

    /*
     * remove all event listeners
     */
    setPrototype(obj, 'removeAllEventListeners', function (name) {
        if (typeof name === 'string') {
            var self = this;

            name.split(' ').forEach(function (item) {
                var listeners = '__' + item + 'Listeners';
                if (self[listeners]) {
                    setPrototype(self, listeners, {});
                }
            });
        }
    });

    obj = new Proxy(obj, {

        get: function (target, key) {

            if (!(target instanceof Array) && key === 'length') {
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

            if (typeof obj[key] === 'object' && !obj[key].__isEvolved && proto_list.indexOf(key) === -1) {
                options.proto.__ref = target.__ref || obj;
                obj[key] = new oEvolve(obj[key], options);
            }

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
                if (listener_types.hasOwnProperty(i) && listener_types[i] && target.__ref) {
                    listener = target.__ref['__' + i + 'Listeners'];

                    for (keyname in listener) {
                        if (typeof listener[keyname] === 'function' && Object.keys(diff).length) {
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
                            if (typeof listener[key] === 'function' && Object.keys(diff).length) {
                                listener[key](newval, oldval, diff);
                            }
                        }
                    }
                }

                return true;
            }
        }
    });


    for (i in obj) {
        if (obj.hasOwnProperty(i) && !obj[i].__isEvolved && typeof obj[i] === 'object' && proto_list.indexOf(i) === -1) {
            options.proto.__ref = obj.__ref || obj;
            obj[i] = new oEvolve(obj[i], options);
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
    if (typeof key === 'string') {
        key = key.replace(/\[(\w+)\]/g, '.$1').split('.');
        while (obj && key.length > 0) {
            obj = obj[key.shift()];
        }
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

    if (typeof key === 'string') {
        setData(key, val);
        return self;
    }
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

        if (ob.__isEvolved) {
            ob = ob.__data();
        }
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

oEvolve.extend = function () {
    'use strict';

    var extended = arguments[0],
        argument,
        prop,
        key;

    for (key in arguments) {
        argument = arguments[key];
        for (prop in argument) {
            if (Object.prototype.hasOwnProperty.call(argument, prop)) {
                extended[prop] = argument[prop];
            }
        }
    }

    return extended;
}
oEvolve.concat = oEvolve.extend;
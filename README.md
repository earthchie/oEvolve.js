# oEvolve.js
Evolve the Object Literal to the next level.

## Features
- length of object ``obj.length``
- get, set object with string. E.g. ``obj.__get('user.profile.picture');``
- event listener on data change that supports create, update, delete without any dept constrain
- simple template engine in mustache style ``{{user.name}}`` or ``{{user.name||default value}}``
- reactive rendering
- compare and find diff of 2 objects
- deflate object, make object become 1 level dept.
- inflate deflated-object back to normal

# Demo
https://earthchie.github.io/oEvolve.js/

# Getting Start
```html
<script type="text/javascript" src="oEvolve.min.js"></script>
<script type="text/javascript">
  var obj = {
    some: 'data'
  };
  
  obj = new oEvolve(obj); // start with given object
  
  // or
  
  var obj2 = new oEvolve(); // start with empty object
</script>
```

Now you can use object the same way you did before, plus additional features below.

### ``obj.addEventListener(str_events, function_listener)``

Add event listerner to the object. There are 4 type of listerners
1. ``create`` fire only when new data has been inserted to the object
2. ``update`` fire only when exist data has been update
3. ``delete`` fire when data has been deleted with ``delete`` keyword
4. ``watch`` fire when data has been create, update or delete

Please note ``str_events`` can represent multitple event types, seperate with space. 
e.g. ``"create update"``

for example:
```javascript
// fire when data has changed in any way 
obj.addEventListener('watch', function (oldvalue, newvalue, diff) {
  console.log(oldvalue, newvalue, diff);
});

// fire when data has been update or delete
obj.addEventListener('update delete', function (oldvalue, newvalue, diff) {
  console.log(oldvalue, newvalue, diff);
});
```
There are 2 ways for you to remove listener
1. If you use named function as listener, then remove it with [obj.removeEventListener()](https://github.com/earthchie/oEvolve.js/#objremoveeventlistenerstr_events-function_listener)

```javascript
var watch_listener = function (newvalue, oldvalue, diff) {
  console.log(newvalue, oldvalue, diff)
};

obj.addEventListener('watch', watch_listener);

```
then

```javascript
obj.removeEventListener.('watch', watch_listener);
```

2. If you use anonymouse function as listener, you have to remove it like this.

```javascript
var watch_listener = obj.addEventListener('watch', function (oldvalue, newvalue, diff) {
  console.log(oldvalue, newvalue, diff);
});
```
then
```javascript
watch_listener.removeEventListener(); // remove listener
```

### ``obj.removeAllEventListeners(str_events)``

Remove all listeners of given type(s)

for example:
```javascript
obj.removeAllEventListeners('watch'); // remove all watch listeners

obj.removeAllEventListeners('create update'); // remove all create and update listeners
```

### ``obj.removeEventListener(str_events, function_listener)``

Remove particular listener. Doesn't work if that listener function is anonymous function.

for example:

If you bind listener like this

```javascript
var watch_listener = function (newvalue, oldvalue, diff) {
  console.log(newvalue, oldvalue, diff)
};

obj.addEventListener('watch', watch_listener);
```
This is how you remove listerner

```javascript
obj.removeEventListener.('watch', watch_listener);
```

### ``obj.toString()`` 
Return a json string of the object.

```javascript
var data = new oEvolve({
   A: 1,
   B: 2
});
console.log(data.toString());
```
Result:
```javascript
"{"A":1,"B":2}"
```

This object can also accept 1 parameter.

If the parameter is a boolean and set to ``true``, it will return formatted json string.
```javascript
console.log(data.toString(true));
```
Result:
```html
{
  "A": 1,
  "B": 2
}
```

If the parameter is a string, this function will treat that string as a mustache-style template.

```javascript
var template = 'The A is {{A}} and the B is {{B}}'
console.log(data.toString(template));
```
Result:
```javascript
"The A is 1 and the B is 2"
```

Furthermore, you can set a default value like this

```javascript
var template = 'The A is {{A}} and the B is {{B}} and the C is {{C||not exists}}'
console.log(data.toString(template));
```
Result:
```javascript
The A is 1 and the B is 2 and the C is not exists
```

### ``obj.__bind(DOM_element)``
Reactive rendering the object data to given DOM. Please see [obj.toString()](https://github.com/earthchie/oEvolve.js/#objtostring) for more info about template syntax.

```javascript
obj.__bind(document.getElementById('container'));
```
Furthermore, you can set the first parameter as function to be a data modifier. then pass DOM object to second parameter instead.

```javascript
obj.__bind(function (data) {
  data.foo = 'bar';
  return data; // don't forget to return data
}, document.getElementById('container'));
```

or ``obj.__bind(function_modifier, DOM_element)``

### ``obj.__clone()``

Return a copy of current object. You'll get evolved object as a result.

This function can also accept a boolean parameter ``obj.__clone(true)``. When the parameter is set to true, this function will perform a deep clone that copy prototype, listeners of original object too.


### ``obj.__data()``

Return the Object Literal of current object. (but why do you still need this?!)

Note: If you prefer, you may use ``obj.toObject()`` instead, these two functions are identical.

### ``obj.__diff(obj2)``

### ``obj.__get(str_key)``

Returns value of object by dot-notation-styled key, return undefined if that key doesn't exist.

E.g.
```javascript
var data = new oEvolve({
  A1: {
    A2: {
      A3: {
        A4: "A4"
      }
    }
  }
});

console.log(data.__get('A1.A2.A3'));
```

Result:
```javascript
{
  A4: "A4"
}
```

### ``obj.__isEqual(obj2)``

compare obj2 with current object, this equivalence to ``JSON.stringify(current+obj) === JSON.stringify(obj2)``

### ``obj.__set(str_key, value)``

Set value of object by dot-notation-styled key.

E.g.
```javascript
var data = new oEvolve({
  A1: {
    A2: {
      A3: {
        A4: "A4"
      }
    }
  }
});

data.__set('A1.A2.A3.A4', 'new value');

console.log(data.__data());
```

Result:
```javascript
{
  "A1": {
    "A2": {
      "A3": {
        "A4": "new value"
      }
    }
  }
}
```

### ``obj.__unbindAll()``

Unbind all reactive rendering that is currenly binding to the object.

## Static Functions

### ``oEvolve.diff(obj1, obj2)``

Return all the diff obj2 has, compared to the obj1. Will returns deflated-object of keys that has diff along side with diff type 
* create - keys that appeared in obj2 but not in obj1
* update - keys that appeared in both obj1 and obj2, but different values.
* delete - keys that appeared in obj1 but not in obj2

E.g.
```javascript
var obj1 = {

  A1: {
    A2: {
      data: 'A'
    }
  },
  
  B1: {
    B2: {
      data: 'B'
    }
  }
  
}, obj2 = {

  A1: {
    A2: {
      data: 'AA'
    }
  },
  
  B1: {
    B2: {
      newdata: 'BB'
    }
  },
  
  C1: {
    C2: {
      data: 'CC'
    }
  }
  
}

console.log(oEvolve.diff(obj1, obj2));

```
Result:
```json
{
  "A1.A2.data": "update",
  "B1.B2.data": "delete",
  "B1.B2.newdata": "create",
  "C1": "create"
}
```

### ``oEvolve.get(obj, key)``
Returns value of object by dot-notation-styled key, return undefined if that key doesn't exist.

E.g.
```javascript
var data = {
  A1: {
    A2: {
      A3: {
        A4: "A4"
      }
    }
  }
};

console.log(oEvolve.get(data, 'A1.A2.A3'));
```

Result:
```javascript
{
  A4: "A4"
}
```

### ``oEvolve.set(obj, key, value)``

Set value of object by dot-notation-styled key.

E.g.
```javascript
var data = {
  A1: {
    A2: {
      A3: {
        A4: "A4"
      }
    }
  }
};

oEvolve.set(data, 'A1.A2.A3.A4', 'new value');

console.log(data);
```

Result:
```javascript
{
  "A1": {
    "A2": {
      "A3": {
        "A4": "new value"
      }
    }
  }
}
```

### ``oEvolve.inflate(obj)``
Turn deflated object back into original structure

```javascript
var data = oEvolve.inflate({
  "A1.A2.A3":   "A3", 
  "A1.A2.foo":  "bar", 
  "A1.foo":     "bar"
});

console.log(data);
```
Result:
```javascript
{
  "A1": {
    "A2": {
      "A3": "A3",
      "foo": "bar"
    },
    "foo": "bar"
  }
}
```

### ``oEvolve.deflate(obj)``

Deflate object data to be 1-level depth

for example:
```javascript
var data = oEvolve.deflate({
  A1: {
    A2: {
      A3: 'A3',
      foo: 'bar'
    },
    foo: 'bar'
  }
});

console.log(data);
```

Result:

```javascript
{
  "A1.A2.A3":   "A3", 
  "A1.A2.foo":  "bar", 
  "A1.foo":     "bar"
}
```

### ``oEvolve.isEqual(obj1, obj2)``
compare 2 object, this equivalence to ``JSON.stringify(obj1) === JSON.stringify(obj2)``

## License
WTFPL 2.0 http://www.wtfpl.net/

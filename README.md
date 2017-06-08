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
```
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
```
// fire when data has changed in any way 
obj.addEventListener('watch', function(oldvalue, newvalue, diff){
  console.log(oldvalue, newvalue, diff);
});

// fire when data has been update or delete
obj.addEventListener('update delete', function(oldvalue, newvalue, diff){
  console.log(oldvalue, newvalue, diff);
});
```
There are 2 ways for you to remove listener
1. If you use named function as listener, then remove it with [obj.removeEventListener()](https://github.com/earthchie/oEvolve.js/#objremoveeventlistenerstr_events-function_listener)

```
var watch_listener = function(newvalue, oldvalue, diff){
  console.log(newvalue, oldvalue, diff)
};

obj.addEventListener('watch', watch_listener);

```
then

```
obj.removeEventListener.('watch', watch_listener);
```

2. If you use anonymouse function as listener, you have to remove it like this.

```
var watch_listener = obj.addEventListener('watch', function(oldvalue, newvalue, diff){
  console.log(oldvalue, newvalue, diff);
});
```
then
```
watch_listener.removeEventListener(); // remove listener
```

### ``obj.removeAllEventListeners(str_events)``

Remove all listeners of given type(s)

for example:
```
obj.removeAllEventListeners('watch'); // remove all watch listeners

obj.removeAllEventListeners('create update'); // remove all create and update listeners
```

### ``obj.removeEventListener(str_events, function_listener)``

Remove particular listener. Doesn't work if that listener function is anonymous function.

for example:

If you bind listener like this

```
var watch_listener = function(newvalue, oldvalue, diff){
  console.log(newvalue, oldvalue, diff)
};

obj.addEventListener('watch', watch_listener);

```
This is how you remove listerner

```
obj.removeEventListener.('watch', watch_listener);
```

### ``obj.toString()`` or ``obj.toString(boolean_isBeauty)`` or ``obj.toString(str_template)``

### ``obj.__bind(DOM_element)`` or ``obj.__bind(function_modifier, DOM_element)``

### ``obj.__clone()``

Return a copy of current object. You'll get evolved object as a result.

This function can also accept a boolean parameter ``obj.__clone(true)``. When the parameter is set to true, this function will perform a deep clone that copy prototype, listeners of original object too.


### ``obj.__data()`` and ``obj.toObject()`` (alias)

### ``obj.__deflate``

### ``obj.__diff(obj2)``

### ``obj.__get(str_key)``

### ``obj.__inflate()``

### ``obj.__isEqual(obj2)``

### ``obj.__set(str_key, value)``

### ``obj.__unbindAll()``


## Static Functions

### ``oEvolve.diff(obj1, obj2)``

### ``oEvolve.get(obj1, obj2)``

### ``oEvolve.set(obj1, obj2)``

### ``oEvolve.inflate(obj)``

### ``oEvolve.deflate(obj)``

### ``oEvolve.isEqual(obj1, obj2)``

## License
WTFPL 2.0 http://www.wtfpl.net/

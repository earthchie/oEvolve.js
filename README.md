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

# Static Functions
coming soon

# Functions
coming soon

## License
WTFPL 2.0 http://www.wtfpl.net/

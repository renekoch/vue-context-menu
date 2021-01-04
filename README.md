# vue-context-menu
Context Menu for VueJS

## Properies
- **offset**: type: `[number, object, array]`, default: `10`
- **position**: type: `String`, default : `''`



## Methods 

**show contextmenu**
 
`show(evt, position = null)`

- evt: `mouseevent`
- position: `String`, `Array` or `Object`, default `center bottom`


**close context menu**

 `close()`

## Events
 - open
 - close


### Example

```vue
<template>
<ContextMenu ref="menu" :offset="5" position="bottom center">
  <ul>
    <li @click="$refs.menu.close()">Item 1</li>
    <li @click="$refs.menu.close()">Item 2</li>
    <li @click="$refs.menu.close()">Item 3</li>
  </ul>
</ContextMenu>

<button @contextmenu="$refs.menu.show($event)"> show menu</button>
</template>

<script>
import ContextMenu from 'vue-context-menu/ContextMenu.vue';
export default {
  components: {ContextMenu},
}
</script>
```

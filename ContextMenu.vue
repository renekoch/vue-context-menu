<template>
  <transition name="vcm-fade" @enter="onOpening()">
    <div ref="menu" class="vcm-context-menu" v-if="open" @focusout="close()" tabindex="-1" :style="style">
      <slot></slot>
    </div>
  </transition>
</template>

<script>

const LEFT = 'left';
const RIGHT = 'right';
const TOP = 'top';
const BOTTOM = 'bottom';
const CENTER = 'center';

/**
 * Check if val is a number
 * @param val
 * @returns {boolean}
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Check if val is a valid offset (number[], {x:number, y: number} or number)
 *
 * @param val
 * @returns {boolean}
 */
function offsetValidate(val) {
  if (isNumber(val)) return true;
  if (!val) return false;
  if (Array.isArray(val)) return val.length === 2 && isNumber(val[0]) && isNumber(val[1]);
  return isNumber(val.x) && isNumber(val.y);
}

export default {
  props: {
    offset: {
      type: [Number, Object, Array],
      default: 10,
      offsetValidate
    },
    position: {type: String, default : ''}
  },
  data() {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      open: false,
      pos: null,
      style: {},
      override_offset: null,
    }
  },
  computed: {
    /**
     * @return {{x: number,, y: number}}
     */
    offsets() {
      const offset = this.override_offset || this.offset;
      console.log('offset', {offset});
      if (isNumber(offset)) return {x: offset, y: offset};
      if (Array.isArray(offset)) return {x: offset[0], y: offset[1]};
      return offset;
    }
  },
  methods: {
    /**
     * Show contextmenu
     * @param {MouseEvent} evt
     * @param {String|{target: HTMLElement|null, position: string, offset: Array|Object|Number|null}|null} position
     */
    show(evt, position = null) {
      evt.preventDefault();
      evt.stopPropagation();

      this.override_offset = null;
      let target = evt.target;

      if (position && typeof position === 'object') {
        if (position.target) target = position.target;
        if (offsetValidate(position.offset)) this.override_offset = position.offset;
        position = position.position;
      }

      position = position || this.position;
      if (position && target instanceof HTMLElement) {
        const {top, right, bottom, left} = target.getBoundingClientRect();
        this.left = left;
        this.top = top;
        this.bottom = bottom;
        this.right = right;
        this.pos = '' + position;
      }
      else {
        this.left = evt.pageX;
        this.top = evt.pageY;
        this.pos = '';
      }

      this.open = true;
      document.body.appendChild(this.$el);
    },

    /**
     * Close context menu
     */
    close() {
      this.open = false;
      this.$emit('close', this);
    },

    /**
     * Event: Position contextmenu when opening
     * @private
     */
    onOpening() {
      const menu = this.$refs.menu;
      const {height, width} = menu.getBoundingClientRect();
      const {innerWidth, innerHeight} = window;
      const style = {};
      let {top, right, bottom, left, pos} = this;
      const offset = this.offsets;
      if (pos) {
        pos = pos.toLowerCase().split(/\W/).filter((value, index, self) => self.indexOf(value) === index).sort().join(' ');
        let x, y;
        switch (pos) {
          case CENTER :
            y = CENTER;
            x = CENTER;
            break;
          case 'bottom center' :
            y = BOTTOM;
            x = CENTER;
            break;
          case 'center top' :
            y = TOP;
            x = CENTER;
            break;
          case 'center right' :
            y = CENTER;
            x = RIGHT;
            break;
          case 'center left' :
            y = CENTER;
            x = LEFT;
            break;
          case TOP :
          case 'left top' :
            y = TOP;
            x = LEFT;
            break;
          case 'right top' :
            y = TOP;
            x = RIGHT;
            break;
          case RIGHT :
          case 'bottom right' :
            y = BOTTOM;
            x = RIGHT;
            break;
          case 'bottom left' :
          default :
            y = BOTTOM;
            x = LEFT;
        }

        switch (x) {
          case LEFT:
            style.left = (left + offset.x) + 'px';
            break;
          case RIGHT:
            style.left = (right - width - offset.x) + 'px';
            break;
          default:
            style.left = (left + ((right - left) / 2) - (width / 2)) + 'px';
        }

        switch (y) {
          case TOP:
            style.top = (top - height - offset.y) + 'px';
            break;
          case CENTER:
            style.top = (top + ((bottom - top) / 2) - (height / 2)) + 'px';
            break;
          default:
            style.top = (bottom + offset.y) + 'px';
        }
      }
      else {
        if ((width + left) >= innerWidth) {
          left = left - width + offset.x;
        }
        else {
          left = left - offset.x;
        }

        if ((height + top) >= innerHeight) {
          top = top - height + offset.y;
        }
        else {
          top = top - offset.y;
        }

        style.left = left + 'px';
        style.top = top + 'px';
      }

      this.style = style;

      menu.focus();

      this.$emit('open', this);
    },
  }
}
</script>

<style  scoped>
.vcm-context-menu {
  position: absolute;
  left: -100vw;
  top: -100vh;
  z-index: 100;
  outline: none;
}

.vcm-context-menu.vcm-fade-enter-active,
.vcm-context-menu.vcm-fade-leave-active {
  transition: opacity .1s;
}

.vcm-context-menu.vcm-fade-enter,
.vcm-context-menu.vcm-fade-leave-to {
  opacity: 0;
}
</style>

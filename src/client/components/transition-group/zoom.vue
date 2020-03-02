<template>
  <transition-group :name="name"
                    :tag="tag"
                    v-on:before-enter="beforeEnter"
                    v-on:enter="enter"
                    v-on:leave="leave">
    <slot></slot>
  </transition-group>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

  @Component({
    name: 'TransitionGroupZoom'
  })
  export default class TransitionGroupZoom extends Vue {

    @Prop({ default: 'div' }) tag: string;
    @Prop({ default: 'xy' }) direction: 'x' | 'y' | 'xy';

    name = '';

    @Watch('direction', {
      immediate: true
    })
    onNameChange(val) {
      this.name = `transition-group-zoom-${val}`;
    }

    beforeEnter(el) {
    }

    enter(el, done) {

    }

    leave(el, done) {

    }
  }
</script>

<style lang="scss">
  :global {
    .transition-group-zoom-xy-enter-active,
    .transition-group-zoom-xy-leave-active,
    .transition-group-zoom-xy-move {
      transition: 300ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
      transition-property: opacity, transform;
    }

    .transition-group-zoom-xy-enter,
    .transition-group-zoom-xy-leave-to {
      opacity: 0;
      transform: scaleX(0.2) scaleY(0.2);
    }

    .transition-group-zoom-xy-leave-active {
      position: absolute !important;
    }
  }
</style>

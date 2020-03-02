<template>
  <transition-group :name="name"
                    v-on:before-enter="beforeEnter"
                    v-on:enter="enter"
                    v-on:leave="leave">
    <slot></slot>
  </transition-group>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

  @Component({
    name: 'TransitionGroupSlide'
  })
  export default class TransitionGroupSlide extends Vue {

    @Prop({ default: 'down' }) direction: 'up' | 'right' | 'down' | 'left';

    name = '';

    @Watch('direction', {
      immediate: true
    })
    onNameChange(val) {
      this.name = `transition-group-slide-${val}`;
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
    .transition-group-slide-down-enter-active,
    .transition-group-slide-down-leave-active,
    .transition-group-slide-down-move {
      transition: 300ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
      transition-property: opacity, transform;
    }

    .transition-group-slide-down-enter,
    .transition-group-slide-down-leave-to {
      opacity: 0;
      transform: translateY(-15px);
    }
  }
</style>

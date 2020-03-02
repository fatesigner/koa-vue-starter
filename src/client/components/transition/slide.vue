<template>
  <transition :name="name"
              v-on:before-enter="beforeEnter"
              v-on:enter="enter"
              v-on:leave="leave">
    <slot/>
  </transition>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

  @Component({
    name: 'TransitionSlide'
  })
  export default class TransitionSlide extends Vue {

    @Prop({ default: 'down' }) direction: 'up' | 'right' | 'down' | 'left';

    name = '';

    @Watch('direction', {
      immediate: true
    })
    onNameChange(val) {
      this.name = `transition-slide-${val}`;
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
    .transition-slide-down-enter-active,
    .transition-slide-down-leave-active,
    .transition-slide-down-move {
      transition: 300ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
      transition-property: opacity, transform;
    }

    .transition-slide-down-enter,
    .transition-slide-down-leave-to {
      opacity: 0;
      transform: translateY(-15px);
    }


    .transition-slide-up-enter-active,
    .transition-slide-up-leave-active,
    .transition-slide-up-move {
      transition: 300ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
      transition-property: opacity, transform;
    }

    .transition-slide-up-enter,
    .transition-slide-up-leave-to {
      opacity: 0;
      transform: translateY(15px);
    }
  }
</style>

<template>
  <div class="progress" :style="{
    'width': percent +'%',
    'height': height,
    'background-color': canSuccess? color : failedColor,
    'opacity': show ? 1 : 0
  }"></div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  import * as ProgressBarStore from './store';

  @Component({
    name: 'ProgressBar'
  })
  export default class ProgressBar extends Vue {
    get percent() {
      return this.$store.getters[ProgressBarStore.GetterKeys.percent];
    }

    get show() {
      return this.$store.getters[ProgressBarStore.GetterKeys.show];
    }

    get canSuccess() {
      return this.$store.getters[ProgressBarStore.GetterKeys.canSuccess];
    }

    get height() {
      return this.$store.getters[ProgressBarStore.GetterKeys.height];
    }

    get duration() {
      return this.$store.getters[ProgressBarStore.GetterKeys.duration];
    }

    get color() {
      return this.$store.getters[ProgressBarStore.GetterKeys.color];
    }

    get failedColor() {
      return this.$store.getters[ProgressBarStore.GetterKeys.failedColor];
    }

  }
</script>

<style lang="scss">
  :global {
    .progress {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: 999999;
      width: 0;
      height: 2px;
      background-color: #efc14e;
      opacity: 1;
      transition: width 0.2s, opacity 0.4s;
    }
  }
</style>

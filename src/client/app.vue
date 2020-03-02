<template>
  <div class="wrapper" id="app">
    <router-view name="header"/>
    <transition name="fade" mode="out-in">
      <router-view class="view"/>
    </transition>
    <router-view name="footer"/>
    <progress-bar/>
  </div>
</template>
<script lang="ts">
  // vuex 需要 promise
  import 'core-js/es/promise';
  import { Component, Vue } from 'vue-property-decorator';
  import { ProgressBar } from './components/progress-bar';

  import 'element-ui/lib/theme-chalk/index.css';
  import './styles/reset.scss';
  import './styles/vui.import.scss';

  @Component({
    name: 'AppPage',
    components: {
      ProgressBar
    }
  })
  export default class AppPage extends Vue {
  }
</script>

<style lang="scss">
  @import './theme/default.theme';

  :global {
    [v-cloak] {
      display: none !important;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      overflow-y: scroll;
      font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
      font-size: 15px;
      background-color: #f2f3f5;
    }

    .wrapper {
      position: relative;
    }

    .view {
      position: relative;
      max-width: 800px;
      min-height: 100vh;
      margin: 0 auto;
    }

    .container-fluid {
      max-width: 1140px;
      margin-right: auto;
      margin-left: auto;
    }

    .container {
      padding: 20px;
    }

    img {
      max-width: 100%;
      max-height: 100%;
    }

    .fade-enter-active {
      transition: all 0.2s ease;
    }

    .fade-enter,
    .fade-leave-active {
      opacity: 0;
    }
  }
</style>

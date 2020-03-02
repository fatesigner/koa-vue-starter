<template>
  <footer>
    <div class="container-fluid">
      <div class="vui-tc">koa-vue-starter © 2019-xxxx</div>
    </div>
  </footer>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    name: 'Footer'
  })
  export default class Footer extends Vue {
  }
</script>

<style lang="scss">
  :global {
    footer {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
      color: #333;
    }
  }
</style>

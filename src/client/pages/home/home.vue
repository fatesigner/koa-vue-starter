<template>
  <div class="view">
    <h2>Koa-vue-starte2</h2>
  </div>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    name: 'HomePage'
  })
  export default class HomePage extends Vue {
  }
</script>

<style lang="scss">
  :global {
    h2 {
      margin: 30px;
      font-size: 20px;
      text-align: center;
    }
  }
</style>

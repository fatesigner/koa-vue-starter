<template>
  <div>
    <h2>关于我</h2>
    <div class="vui-tc">
      <img width="100" height="100" src="../../../assets/img/avatar.jpg" alt="avatar" title="avatar"/>
      <div class="vui-f14 vui-mb20">{{session.username}}</div>
      <el-button @click="logout">登出</el-button>
    </div>
  </div>
</template>
<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { Button } from 'element-ui';

  import * as AppStore from '../../store';
  import { Auth } from '../../../public/auth';

  Vue.use(Button);

  @Component({
    name: 'PersonalPage'
  })
  export default class PersonalPage extends Vue {
    get session() {
      return this.$store.getters[AppStore.GetterKeys.session];
    }

    logout() {
      window.location.href = Auth.logoutPath;
    }
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

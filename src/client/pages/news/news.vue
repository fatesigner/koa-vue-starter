<template>
  <div class="view news-view">
    <div class="vui-padding">
      <el-input v-model="inputId" placeholder="请输入关键字..." @keyup.enter="reload"/>
    </div>
    <dl class="news">
    </dl>
    <el-dialog
      title="提示"
      :visible.sync="dialog.visible"
      center>
      <div class="vui-tc">
        <div class="vui-f12 vui-mb10">{{dialog.message}}</div>
        <el-button type="primary" @click="dialog.visible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { Button, Dialog, Input } from 'element-ui';

  import { RegisterStoreModule } from '../../../public/utils';
  import { NewsItem } from '../../components/news-item';
  import * as ProgressBarStore from '../../components/progress-bar/store';

  import * as NewsStore from './store';

  Vue.use(Input);
  Vue.use(Button);
  Vue.use(Dialog);

  @Component({
    name: 'NewsPage',
    components: {
      NewsItem
    }
  })
  export default class NewsPage extends Vue {
    @Prop({ default: null }) type: string;

    transition = 'slide-right';
    displayedPage = 1;
    inputId = '';

    dialog = {
      visible: false,
      message: ''
    };

    get downloadlinks() {
      return this.$store.getters[NewsStore.GetterKeys.downloadlinks];
    }

    get mgstage() {
      return this.$store.getters[NewsStore.GetterKeys.mgstage];
    }

    get tsuyoshii() {
      return this.$store.getters[NewsStore.GetterKeys.tsuyoshii];
    }

    asyncData({ store, route }) {
      RegisterStoreModule({ module: NewsStore.Store, moduleName: NewsStore.Name, store });
      if (route.params.id) {
        return store.dispatch(NewsStore.ActionKeys.fetchItems, {
          id: route.params.id
        });
      }
    }

    beforeCreate() {
      RegisterStoreModule({ module: NewsStore.Store, moduleName: NewsStore.Name, store: this.$store });
    }

    reload() {
      this.$store.dispatch(ProgressBarStore.ActionKeys.present);
      return this.$store.dispatch(NewsStore.ActionKeys.fetchItems, {
        id: this.inputId
      }).catch((err) => {
        this.dialog.visible = true;
        this.dialog.message = err.message;
      }).finally(() => {
        this.$store.dispatch(ProgressBarStore.ActionKeys.dismiss);
      });
    }

    destroyed() {
      console.log('_________destroyed___________');
      this.$store.unregisterModule(NewsStore.Name);
    }

    mounted() {
      this.inputId = this.$route.params.id;
      console.log('_________mounted___________');
      this.displayedPage = Number(this.$route.params.page) || 1;
    }

    beforeMount() {
      console.log('_________beforeMount___________');
      if ((this.$root as any)._isMounted) {
        // this.loadItems(this.page);
      }
    }

    beforeDestroy() {
      console.log('_________beforeDestroy___________');
    }
  }
</script>

<style lang="scss">
  :global {
    .news-view {
      padding-top: 45px;
    }

    .news-list-nav {
      position: fixed;
      top: 55px;
      right: 0;
      left: 0;
      z-index: 998;
      padding: 15px 30px;
      text-align: center;
      background-color: #fff;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

      a {
        margin: 0 1em;
      }
    }

    .news-list {
      margin: 30px 0;
      transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
    }

    .downloadlinks {
      em {
        color: red;
      }
    }

    .pics {
      overflow: hidden;

      dt {
        padding: 10px 10px;
        font-size: 20px;
        font-weight: bold;
      }

      dd {
        display: flex;
        align-items: center;
        justify-content: center;
        float: left;
        width: 120px;
        height: 120px;
        padding: 10px;
        margin: 5px;
        background-color: #fff;
        border: 1px solid #faa7a7;
      }
    }

    @media (max-width: 600px) {
      .news-list {
        margin: 10px 0;
      }
    }
  }
</style>

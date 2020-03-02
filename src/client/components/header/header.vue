<template>
  <header>
    <div class="header">
      <nav class="inner">
        <router-link to="/" exact>
          <img class="logo" src="../../../assets/img/logo-48.png" alt="logo" title=""/>
        </router-link>
        <router-link to="/" exact>Home</router-link>
        <router-link to="/news">News</router-link>
        <router-link to="/personal" v-if="session.username" class="user-status">
          <img src="../../../assets/img/avatar.jpg" alt="avatar" title="avatar"/>
          <span class="username">{{session.username}}</span>
        </router-link>
        <router-link class="user-login" to="/login" v-else>Login</router-link>
        <a class="github" href="https://github.com/jereation/koa-vue-starter" target="_blank" rel="noopener">Built with
          Vue.js</a>
      </nav>
    </div>
  </header>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { fromEvent, merge, of } from 'rxjs';
  import { map } from 'rxjs/operators'

  import { GetOffsetAwayFromDocument, GetScrollTop } from '@forgleaner/utils/document';

  import * as AppStore from '../../store';

  @Component({
    name: 'Header'
  })
  export default class Header extends Vue {

    get session() {
      return this.$store.getters[AppStore.GetterKeys.session];
    }

    mounted() {
      // 监控 body 滚动 调整 header 样式
      const $header: HTMLElement = document.querySelector('header');
      const $headerInner: HTMLElement = document.querySelector('.header');
      const anchorPos = GetOffsetAwayFromDocument($header).top;

      merge(fromEvent(document, 'scroll'), of(true))
        .pipe(map(() => {
          const top = GetScrollTop(document);
          return anchorPos < top;
        }))
        .subscribe((bool) => {
          if (bool) {
            $header.style.height = $headerInner.offsetHeight + 'px';
            $headerInner.classList.add('header-fixed');
          } else {
            $header.style.height = '';
            $headerInner.classList.remove('header-fixed');
          }
        });
    }
  }
</script>

<style lang="scss">
  @import '../../theme/default.theme';

  header {
    .logo {
      background-image: url('../../../assets/img/logo-48.png');
    }
  }

  :global {
    .header {
      min-height: 55px;
      background-color: #f60;

      .inner {
        max-width: 800px;
        padding: 0 5px;
        margin: 0 auto;
      }

      .logo {
        display: inline-block;
        width: 24px;
        margin-right: 10px;
        vertical-align: middle;
      }

      a:not(.user-status) {
        display: inline-block;
        height: 100%;
        margin-right: 1.8em;
        font-weight: 300;
        line-height: 55px;
        color: hsla(0, 0%, 100%, 0.8);
        letter-spacing: 0.075em;
        vertical-align: middle;
        transition: color 0.15s ease;

        &:nth-child(6) {
          margin-right: 0;
        }

        &.activated,
        &.exact-activated {
          font-weight: 400;
          color: #fff;
        }

        &:hover {
          color: #fff;
        }
      }

      .github {
        margin: 0;
        font-size: 0.9em;
        color: #fff;
      }
    }

    .header-fixed {
      position: fixed;
      top: 0;
      right: 0;
      left: 0;
      z-index: 999;
    }

    .user-status {
      display: flex;
      align-items: center;
      float: right;
      line-height: 55px;

      img {
        display: block;
        width: 24px;
        height: 24px;
      }

      .username {
        margin-left: 5px;
        font-size: 14px;
        color: #333;
      }
    }

    .user-login {
      float: right;
    }

    @media (max-width: 860px) {
      .header .inner {
        padding: 0 30px;
      }
    }

    @media (max-width: 600px) {
      .header .inner {
        padding: 0 15px;
      }

      .header a {
        margin-right: 1em;
      }

      .header .github {
        display: none !important;
      }
    }
  }
</style>

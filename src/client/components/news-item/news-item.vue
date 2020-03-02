<template>
  <li class="news-item">
    <span class="score">{{ item.id }}</span>
    <span class="title">{{ item.title }}</span>
  </li>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  import { INewsItem } from '../../../public/models/news';

  @Component({
    name: 'NewsItem'
  })
  export default class NewsItem extends Vue {
    @Prop({ default: null }) item: INewsItem;
  }
</script>

<style lang="scss">
  :global {
    .news-item {
      position: relative;
      padding: 20px 30px 20px 80px;
      line-height: 20px;
      background-color: #fff;
      border-bottom: 1px solid #eee;

      .score {
        position: absolute;
        top: 50%;
        left: 0;
        width: 80px;
        margin-top: -10px;
        font-size: 1.1em;
        font-weight: 700;
        color: #f60;
        text-align: center;
      }

      .host,
      .meta {
        font-size: 0.85em;
        color: #828282;
      }
    }
  }
</style>


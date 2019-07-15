<template>
  <footer class="ta-c footer">
    <div class="copyright">
      <div class="wrapper">
        <span class="fl copy-area">copyright @ 2019 cetdac.org all rights reserved.</span>
        <span>
          <b-form-select class="select-lang fr" v-model="lang.lang" :options="options"/>
        </span>
      </div>
    </div>
  </footer>
</template>

<script>
import Vue from "vue"
import { mapState } from "vuex"
import cookies from "~/plugins/cookies"

export default {
  data () {
    return {
      selected: '',
      options: [
        { value: 'en_US', text: 'English' },
        { value: 'zh_Hans_CN', text: '中文' }
      ]
    }
  },

  computed: Object.assign({
  },mapState([
    "lang"
  ])),
  
  watch:{
    'lang.lang': function(item){
      const date = new Date();
      const expire = new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000);
      cookies.setItem(document, "lang", item, expire, "/");
      location.href = location.origin
    }
  }
}
</script>

<style scoped lang="scss">
.footer{
  display: block;
  width: 100%;
  padding-top: 10px;
  background-color: #1e252f;

  position: absolute;
  bottom: 0;
  
  .wrapper {
    width: 60%;
    min-width: 1200px;
    margin: 0 auto;
    height: 200px;
    .logo-area{
      text-align: left;
      margin-top: 40px;
      margin-left: 50px;
      .icon{
        margin-right: 15px;
        font-size: 22px;
        color: #9b9b9b;
        cursor: pointer;
        &:hover{
          color: white;
        }
      }
      .icon-weibo{
        font-size: 24px;
      }
      .icon-reddit{
        font-size: 24px;
      }
      .slogan {
        margin-top: 10px;
        font-size: 20px;
        color: #9b9b9b;
      }
    }
    .feature-area {
      float: left;
      margin-right: 150px;
      text-align: left;
      padding-top: 40px;
      .title {
        color: white;
        font-size: 16px;
      }
      .content {
        a{
          color: #9b9b9b;
        }
      }
      &:last-child{
        margin-right: 50px;
      }
    }
  }
  .copyright{
    margin: 0 auto;
    background: #1a2029;
    .wrapper {
      padding-top: 9px;
      display: flex;
      justify-content: space-between;
      color: #666;
      width: 60%;
      margin: 0 auto;
      height: 50px;
      line-height: 50px;
      .select-lang {
        margin-right: 50px;
        display: inline-block;
        width: 150px;
        background: #9B9B9B url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E") no-repeat right 12px center;
        background-size: 8px 10px;
        color: white;
        border: 0;
        height: 26px;
        padding: 0 8px;
        margin-top: 4px;
      }
      .copy-area{
        margin-top: 8px;
        margin-left: 50px
      }
    }
  }
}
</style>

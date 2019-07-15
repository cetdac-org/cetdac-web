<template>
  <div class="cetdac-web-index">
    <div class="description-line">CETDAC是一个CET社区的去中心化组织</div>
    <div class="subscribe-line">
       <b-input-group>
        <b-form-input v-model="email" placeholder="输入邮箱，订阅最新动态"></b-form-input>
        <b-input-group-append>
          <b-button variant="info"> 订阅 </b-button>
        </b-input-group-append>
      </b-input-group>
    </div>
    <div class="brand-title-line">
      成员列表
    </div>
    <div class="brand-line">
      <a href="https://www.coinex.org/" target="_blank"><img height="50" src="~/assets/imgs/coinex.svg" style="vertical-align: middle"></a>
      <a class="ml-40" href="https://www.purewallet.org/" style="vertical-align: middle"><img height="50" src="~/assets/imgs/purewallet.jpg" style="border-radius:10px;vertical-align: middle;"><img style="margin-left:20px;vertical-align: middle" height="30" src="~/assets/imgs/pure-text.svg"></a>
    </div>
  </div>
</template>
<script>
import Vue from "vue"
import { mapState } from "vuex"
import cookies from "~/plugins/cookies"


export default {
  head() {
    return {
      title: 'CETDAC',
    }
  },

  computed:{
    ...mapState(["lang"]),
  },
  data () {
    return {
      email: ''
    }
  },

  mounted(){
  },

  methods:{
  },
  
  beforeDestroy(){
  }

  // async asyncData({ req, app, query, $axios }) {
  //   const ip = await $axios.$get('http://icanhazip.com')
  //   return {
  //     ip: ip
  //   }
  // },
}
</script>

<style lang="scss" scoped>
.cetdac-web-index {
  max-width: 1200px;
  min-height: 800px;
  margin:0 auto;
  padding: 15px;

  .description-line{
    margin-top: 60px;
    font-size: 20px;
    text-align: center;
  }
  .subscribe-line {
    width: 400px;
    margin: 0 auto;
    margin-top: 200px;
  }
  .brand-title-line{
    text-align: center;
    font-size: 20px;
    margin-top: 60px;
  }
  .brand-line {
    text-align: center;
    margin-top: 40px;
  }
}
</style>


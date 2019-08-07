<template>
  <header class="header">
    <b-navbar toggleable="md" type="dark">
      <b-navbar-brand href="/"><img src="~/assets/imgs/cetdac-logo.png" width="200"></b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item exact to="/">CETDAC</b-nav-item>
          <b-nav-item target="_blank" href="https://docs.cetdac.org/zh/buycet/">购买CET</b-nav-item>
          <b-nav-item to="/pool">CET矿池</b-nav-item>
          <b-nav-item target="_blank" href="https://docs.cetdac.org/">资料库</b-nav-item>
          <b-nav-item to="/words">海坡语录</b-nav-item>
          <b-nav-item target="_blank" href="https://www.coinex.org/">CoinEx Chain</b-nav-item>
          <b-nav-item to="/mall">周边商城</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </header>
</template>

<style lang="scss">
.header{
  max-width: 1200px;
  margin:0 auto;
  .navbar {
    align-items: center;
    justify-content: space-between;
  }

  .nav-item{
    .nav-link {
      color: #52cbca;
      padding: 8px 25px;
      height: 60px;
      line-height: 60px;
    }
    .dropdown-item{
      padding:1rem 2rem;
    }
  }
  .nav-link.active{
    color:white;
  }
}
</style>


<style lang="scss" scoped>
  .header{
    .icon-logo{
      font-size: 30px;
      color: #283149;
    }
    .nav-link {
      display: block;
      padding: 8px 24px;
    }
    .nuxt-link-active{
      color:white;
    }
    .develop{
      display:inline-block;
      font-weight:bold;
      padding-top:5px;
      margin-left:10px;
      color:#8c8c8c;
      font-size:14px;
    }
    .nav{
      .nav-item{
        font-size: 16px;
      }
    }
  }
</style>

<script>
import Vue from "vue";
import { mapState } from "vuex";

export default {
  data() {
    return {}
  },
  computed:Object.assign({
    hash(){
      if(process.browser){
        return location.hash
      }
    }
  }, mapState([
    "lang"
  ])),
  
  mounted(){
  }
};
</script>

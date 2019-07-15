<template>
  <header class="header">
    <div class="navbar d-flex">
      <img src="~/assets/imgs/cetdac-logo.png" width="200">
      <b-nav align="right">
        <b-nav-item active>CETDAC</b-nav-item>
        <b-nav-item>资料库</b-nav-item>
        <b-nav-item target="_blank" href="https://www.coinex.org/">CoinEx Chain</b-nav-item>
        <b-nav-item target="_blank" href="https://forum.coinex.org/">论坛</b-nav-item>
      </b-nav>
    </div>
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
    width: 60%;
    min-width: 1200px;
    margin:0 auto;
    .icon-logo{
      font-size: 30px;
      color: #283149;
    }
    .nav-link {
      display: block;
      padding: 8px 24px;
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

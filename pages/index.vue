<template>
  <div class="abct-web-index">
    <div class="banner">
      <div class="banner-content d-flex">
        <img src="~/assets/imgs/icon_abct@2x.png" width="93">
        <div class="banner-content-right">
          <div>
            <b-link to="/">什么是ABCT ></b-link>
          </div>
          <div class="mt-8">
            <span class="font-norwester fs-22" to="/">1 ABCT = 0.022 IOST</span>
            <img src="~/assets/imgs/icon_abct@2x.png" width="15">
          </div>
          <div class="mt-8">
            <span class="fs-14" to="/">当日涨幅: <span class="rising"> 1%</span><img class="ml-5" src="~/assets/imgs/icon_rise.svg" width="9"></span>
            <span class="ml-5">|</span>
            <span class="ml-5 fs-14" to="/">累计涨幅: <span class="rising"> 20%</span><img class="ml-5" src="~/assets/imgs/icon_rise2.svg" width="9"></span>
          </div>
        </div>
      </div>
    </div>
    <div class="vote">
      <div class="vote-content d-flex">
        <div class="w100p">
          <div>我的IOST: 0</div>
          <div class="on-voting d-flex mt-2">
            <span>投票中的IOST: 1,0000</span>
            <b-link to="/">马上赎回 ></b-link>
          </div>
        </div>
      </div>
      <b-button class="mt-20" size="lg" block variant="primary">投票免费抢</b-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.abct-web-index {
  padding: 15px;
  .mt-8 {
    margin-top: 8px;
  }
  .mt-20{
    margin-top: 20px;
  }
  .banner {
    a{
      color:white;
      opacity: 0.7;
    }
    background: #1F166B;
    border: 1px solid rgb(37, 27, 133);
    height: 170px;
    border-radius: 12px;
    .banner-content {
      align-items: center;
      height: 100%;
      .banner-content-right{
        margin-left:12px;
        .rising {
          color: #0DB767;
        }
      }
    }
  }
  .vote {
    .mt-1{
      margin-top: 2px;
    }
    margin-top: 40px;
    a{
      color:#FF768A;
    }
    .vote-content {
      padding:0 15px;
      align-items: center;
      background: #1F166B;
      height: 76px;
      border-radius: 8px;
      .on-voting {
        justify-content: space-between;
      }
    }
  }
}
</style>

<script>
import Vue from "vue"
import utils from "~/plugins/utils"
import { mapState } from "vuex"

export default {
  head() {
    return {
      title: this.title
    }
  },

  data() {
    return {
      title: 'ABCT',
    };
  },
  
  mounted(){
  },

  asyncData({ req, app, query }) {
    // return app.axios
    //   .init(req)
    //   .get("/api/promises?limit="+perPage + "&skip=0&count=1")
    //   .then(res => {
    //     if(!res.code){
    //       return {
    //         promises:res.data.data
    //       }
    //     }
    //   }).catch(e=>{
    //     console.error(e)
    //   });
  },

  watch:{
  }
};
</script>


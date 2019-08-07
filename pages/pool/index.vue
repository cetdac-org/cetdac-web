<template>
  <div class="cetdac-web-pool">
    <div>
      <b-carousel
        id="carousel-fade"
        style="text-shadow: 0px 0px 2px #000"
        fade
        indicators
        img-width="1200"
        img-height="200"
      >
        <b-carousel-slide
          caption="First slide"
          img-src="https://picsum.photos/1200/200/?image=10"
        ></b-carousel-slide>
        <b-carousel-slide
          caption="Second Slide"
          img-src="https://picsum.photos/1200/200/?image=12"
        ></b-carousel-slide>
        <b-carousel-slide
          caption="Third Slide"
          img-src="https://picsum.photos/1200/200/?image=22"
        ></b-carousel-slide>
      </b-carousel>
    </div>
    <div class="status-bar mt-20">
      <div>
        <div class="label">状态:</div> 
        <div>正常运行</div>
      </div>
      <div>
        <div class="label">矿池总量:</div> 
        <div>1,000,000 CET</div>
      </div>
      <div>
        <div class="label">七日年化利率:</div>
        <div>20%</div>
      </div>
      <div>
        <div class="label">已发放CET:</div>
        <div>100 CET</div>
      </div>
      <div>
        <div class="label">已发放DAC:</div>
        <div>1000 DAC</div>
      </div>
    </div>
    <b-container class="panel">
      <b-row>
        <b-col class="left-panel subpanel">
          <div class="wrapper">
            <div>我的收益</div>
            <b-link>收益记录 ></b-link>
          </div>
        </b-col>
        <b-col class="right-panel subpanel">
          <div class="wrapper">
            <div>加速任务</div>
            <b-link>任务记录 ></b-link>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <div class="invite-bar mt-20">
      <div>邀请返佣</div>
    </div>
    <div class="tx-panel mt-20">
      <div>交易记录</div>
    </div>
  </div>
</template>
<script>
import Vue from "vue"
import { mapState } from "vuex"

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
    }
  },

  mounted(){
  
  },

  methods:{
    buy: function(){

    }
  },
  
  beforeDestroy(){
  }
}
</script>

<style lang="scss" scoped>
.cetdac-web-pool {
  max-width: 1200px;
  margin:0 auto;

  .status-bar{
    height: 60px;
    border-radius: 10px;
    background: #1c2129;
    color:white;
    display: flex;
    align-items: center;
    padding:20px;
    justify-content: space-between;
    .label{
      opacity: 0.6;
    }
  }
  .panel{
    max-width:100%;
    padding:0;
    .row{
      margin-right: 0;
      margin-left: 0; 
      justify-content: space-between;
    }
    .col{
      padding:0;
    }
    .left-panel{
      padding-right:10px;
    }
    .right-panel{
      padding-left:10px;
    }
    .subpanel {
      padding-top:20px;
      min-width: 600px;
      color:white;
      border-radius: 10px;

      .wrapper{
        background: #1c2129;
        padding:20px;
        display: flex;
        height: 400px;
        justify-content: space-between;
      }
    }
  }
  .invite-bar{
    height: 80px;
    padding:20px;
    border-radius: 10px;
    background: #1c2129;
    color:white;
  }
  .tx-panel{
    height: 200px;
    padding:20px;
    border-radius: 10px;
    background: #1c2129;
    color:white;
  }
}
</style>


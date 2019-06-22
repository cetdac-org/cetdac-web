<template>
  <div class="abct-web-index">
    <div class="banner-bg">
      <div class="banner">
        <div class="banner-content d-flex">
          <img class="icon-abct" src="~/assets/imgs/icon_abct.svg" width="75">
          <div class="banner-content-right">
            <div>
              <b-link to="/">什么是ABCT ></b-link>
            </div>
            <div class="mt-8">
              <span class="font-norwester fs-22" to="/">1 ABCT = {{price}} IOST</span>
              <img class="switch" src="~/assets/imgs/icon_switch.svg" width="15">
            </div>
            <div class="mt-8">
              
              <span class="fs-14" to="/">当日涨幅：<DiffLabel slot="activator" :diff="priceInfo.percent_change_24h" :formatter="(text) => fixedTwo(text) + '%'" tag="sup" class="fz-12" /></span>
              <span class="ml-5">|</span>
              <span class="ml-5 fs-14" to="/">累计涨幅：<DiffLabel slot="activator" :diff="priceInfo.percent_change" :formatter="(text) => fixedTwo(text) + '%'" tag="sup" class="fz-12" /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="records mt-15">
      bitapp 刚刚获得了 10 ABCT 
    </div>
    <div class="vote mt-15">
      <div class="vote-content d-flex">
        <div class="w100p">
          <div>我的IOST：{{accountInfo.balance}}</div>
          <div class="on-voting d-flex mt-2">
            <span>投票中的IOST：{{votebalances}}</span>
            <b-link to="/">马上赎回 ></b-link>
          </div>
        </div>
      </div>
      <div class="vote-btn mt-20" @click="toRoute('vote')">投票免费抢</div>
      <div class="tips-view mt-15">
        <span>我的分红记录</span>
        <span>发行规则？</span>
      </div>
    </div>
    <div class="exchange mt-20">
      <div class="exchange-tip">
        <div class="exchange-pool">
          <span>回购资金池：{{fixedTwo(contractBalance.balance)}}</span>
          <span>回购规则</span>
        </div>
        <div class="mt-15">
          <div>我的ABCT：{{tokenbalance}}</div>
          <div>当前兑换价格 1 ABCT = {{ '\xa0'+price+'\xa0'}}IOST  = </div>
        </div>
      </div>
      <div class="exchange-btn mt-20" @click="toRoute('exchange')" >兑换IOST</div>
      <div class="tips-view mt-15">
        <span>我的兑换记录</span>
        <span>兑换规则？</span>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue"
import utils from "~/plugins/utils"
import { mapState } from "vuex"
import DiffLabel from '~/components/DiffLabel.vue'
export default {
  components: {
    DiffLabel
  },
  data () {
    return {
      walletAccount:'',
      price:0,
      priceInfo:{},
      contractBalance:{},
      accountInfo:{},
      tokenbalance:0,
      votebalances:0
    }
  },
  head() {
    return {
      title: 'ABCT',
      ip: null,
    }
  },
  
  mounted(){
    const _this = this
    setTimeout(function(){
      IWalletJS.enable().then((account) => {
        if(!account) {
          _this.walletAccount = null
        } else {
          _this.walletAccount = account
          _this.getAccountInfo()
          _this.$common.getTokenBalcnce(account).then( res =>{
            _this.tokenbalance = res.balance
            
          })
        }
      })
    },100)
    //资金池
    this.$common.getContractBalcnce().then( res =>{
      console.log('res',res)
      this.contractBalance = res
    })
    //价格
    this.$common.getPrice().then( res =>{
        console.log('res-',res)
      this.priceInfo = res
      this.price = res.price_ratio.toFixed(4)
    })
    //历史获得记录
    this.$common.getHistory().then( res =>{
      console.log('history',res)
    })
  },
  methods:{
    //账户信息
    getAccountInfo(){
      this.$rpc.blockchain.getAccountInfo('pwdev').then(account => {
        console.log('account',account)
        this.accountInfo = account
        this.votebalances= account.vote_infos.reduce((reduced, vote) => vote.votes ? reduced + vote.votes : 0, 0)
      })
    },
    //路由
    toRoute (route) {
      this.$router.push(`/${route}`)
    },
    fixedTwo(number){
      if (!number) {
        return 0
      }
      number = String(number).replace(/^(.*\..{2}).*$/,"$1");
      number = Number(number); 
      return number
    }
  },

  async asyncData({ req, app, query, $axios }) {
    const ip = await $axios.$get('http://icanhazip.com')
    return {
      ip: ip
    }
  },

  watch:{
  }
};
</script>

<style lang="scss" scoped>
.abct-web-index {
  padding: 15px;
  .mt-8 {
    margin-top: 8px;
  }
  .banner-bg {
    background: url(~assets/imgs/abct_bg@2x.png) 0 0 no-repeat #1f166b;
    background-size: cover;
    height: 157px;
    border-radius: 8px;
    box-shadow: #111 1px 1px 0;
    .banner{
      a{
        color:white;
        opacity: 0.7;
      }
      padding: 6px;
      height: 151px;
      border: 1px solid rgb(37, 27, 133);
      border-radius: 8px;
      background: transparent;
      .icon-abct{
        border-radius: 50px;
        box-shadow:#222 0 0 4px;
      }
      .banner-content {
        align-items: center;
        height: 100%;
        .switch{
          margin-left:10px;
        }
        .banner-content-right{
          margin-left:12px;
          flex: 1;
          .rising {
            color: #0DB767;
          }
        }
      }
    }
  }
  .records {
    text-align: center;
    color: #eee
  }
  .vote {
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
  .tips-view{
    display: flex;
    justify-content: space-between;
    color: rgba(255, 255, 255, 0.7);
  }
  .exchange{
    .exchange-tip{
      padding: 15px;
      background-color:#1F166B;
      .exchange-pool{
        display: flex;
        justify-content: space-between;
      }
    }
  }
}
</style>


<template>
  <div class="abct-web-index">
    <div class="banner-bg">
      <div class="banner">
        <div class="banner-content d-flex">
          <img class="icon-abct" src="~/assets/imgs/icon_abct.svg" width="75">
          <div class="banner-content-right">
            <div>
              <span @click="ruleModal('abct')">什么是ABCT ></span>
            </div>
            <div class="mt-8">
              <!-- fixedNumber(price,6) -->
              <img class="switch" src="~/assets/imgs/icon_switch.svg" @click="priceChange" width="15">
              <no-ssr>
                <span :class="[`font-norwester ml-1 ${font_size}`]" >1 ABCT = <div id="price"></div>{{`${changeType=='ratio'?' IOST':/cn/i.test(lang.lang)?' CNY':' USD'}`}}</span>
              </no-ssr>
            </div>
            <div class="mt-8">
              <!-- <span class="fs-14" to="/">当日涨幅：<DiffLabel slot="activator" :diff="priceInfo.percent_change_24h" :formatter="(text) => fixedNumber(text,2) + '%'" tag="sup" class="fz-12" /></span> -->
              <!-- <span class="ml-5">|</span> -->
              <span class="fs-14" to="/">涨幅：<DiffLabel slot="activator" :diff="changeType=='ratio'?priceInfo.percent_change_ratio:priceInfo.percent_change_price" :formatter="(text) => fixedNumber(text * 100,2) + '%'" tag="sup" class="fz-12" /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="records mt-15" style="overflow:hidden">
      <div v-if="historyInfo" :class="['animated', historyDirect ==='in'?'slideInUp':'slideOutUp', 'infinite', 'slow']">
        {{historyInfo.name + '\xa0'}} 刚刚获得了 {{ '\xa0'+fixedNumber(historyInfo.amount,4) + '\xa0'}} ABCT 
      </div>
    </div>
    <div class="vote mt-15">
      <div class="vote-content d-flex">
        <div class="w100p">
          <div>我的IOST：{{fixedNumber(accountInfo.balance,6)}}</div>
          <div class="on-voting d-flex mt-2">
            <span>投票中的IOST：{{votebalances}}</span>
          </div>
          <div class="frozen-line mt-2">
              <span>冻结中的IOST：{{frozenbalances}}</span>
              <b-link style="color:#FF768A;" @click="unvoteModal()">马上赎回</b-link>
            </div>
        </div>
      </div>
      <div class="vote-btn mt-20" @click="toRoute('vote')">投票免费抢</div>
      <div class="tips-view mt-15">
        <span @click="historyModal('issue')">我的分红记录</span>
        <span @click="ruleModal('issue')">发行规则</span>
      </div>
    </div>
    <div class="exchange mt-20">
      <div class="exchange-tip">
        <div class="abct-text fb">我的ABCT：{{tokenbalance}}</div>
        <div class="fb">
          <div>1 ABCT = {{ '\xa0'+fixedNumber(priceInfo.price_ratio,6)+'\xa0'}}IOST  = {{/cn/i.test(lang.lang)?(fixedNumber(priceInfo.price_cny,6) +'\xa0'+'CNY'):(fixedNumber(priceInfo.price_usd,6)+'\xa0'+'USD')}} </div>
        </div>
        <div class="exchange-pool mt-15">
          <span>兑换资金池：{{fixedNumber(contractBalance.balance,2)+ '\xa0 IOST'}}  </span>
          <img class="icon_largerise" src="~/assets/imgs/icon_largerise2.svg">
        </div>
      </div>
      <div class="tips-view mt-15" @click="historyModal('recharge')">资金池充值记录</div>
      <div class="exchange-btn mt-20" @click="toRoute('exchange')" >兑换IOST</div>
      <div class="tips-view mt-15">
        <span @click="historyModal('exchange')">我的兑换记录</span>
        <span @click="ruleModal('exchange')">兑换规则</span>
      </div>
    </div>
    <HistoryModal ref="historyModal" />
    <TipsModal ref="tipsModal" />
    <UnVoteModal ref="unvoteModal" @unVote="unvoteTip" />
    <div class="mask-view" v-show="isloading">
      <div class=" ld ld-spinner ld-spin-fast" style="font-size:64px;color:#8da"></div>
    </div>
    <b-modal ref="statusModal">
      <div style="color:#000;">{{modalText}}</div>
      <template slot="modal-footer" slot-scope="{cancel}">
        <b-button v-if="txhash != ''" size="sm" variant="info" @click="toTxHash">
          查看交易结果
        </b-button>
        <b-button size="sm" @click="cancel()">
          Cancel
        </b-button>
      </template>
    </b-modal>
  </div>
</template>
<script>
import Vue from "vue"
import DiffLabel from '~/components/DiffLabel.vue'
import HistoryModal from '~/components/HistoryModal.vue'
import TipsModal from '~/components/TipsModal.vue'
import UnVoteModal from '~/components/UnVoteModal.vue'
import { CountUp } from 'countup.js/dist/countUp';
import { mapState } from "vuex"

export default {
  components: {
    DiffLabel,
    TipsModal,
    HistoryModal,
    UnVoteModal
  },
  computed:{
    ...mapState(["lang"]),
  },
  data () {
    return {
      walletAccount:'',
      priceInfo:{},
      contractBalance:{},
      accountInfo:{},
      historyList:[],
      historyInfo:null,
      historyDirect:'in',
      showIndex:0,
      tokenbalance:0,
      votebalances:0,
      frozenbalances:0,
      navigator:{},
      startPrice:'',
      endPrice:'',
      priceTimePercent:0,
      font_size:'fs-20',
      changeType:'ratio',
      isloading: false,
      txhash:'',
      modalText:''
    }
  },
  head() {
    return {
      title: 'ABCT',
      ip: null,
    }
  },
  mounted(){
    this.initIwallet()
    //资金池
    this.$common.getContractBalcnce().then( res =>{
      this.contractBalance = res
    })
    this.navigator = window.navigator
    //价格
    this.getPriceDown()
    this.getObtainHistory()
    if (/ios|ipad|iphone/i.test(navigator.userAgent)) {
      if (window.innerWidth < 400){
        this.font_size = 'fs-18'
      }
    } else {
      if (window.innerWidth < 400) {
        this.font_size = 'fs-17'
      }
    }
  },  
  methods:{
    //账户信息
    getAccountInfo(){
      this.$rpc.blockchain.getAccountInfo(this.walletAccount).then(account => {
        this.accountInfo = account
        this.votebalances= account.vote_infos.reduce((reduced, vote) => vote.votes ? reduced + vote.votes : 0, 0)
        this.frozenbalances =  account.frozen_balances.reduce((reduced,frozen) => frozen.amount ? reduced+frozen.amount:0,0)
      })
    },
    toTxHash(){
      if (this.txhash) {
        window.location = `https://www.iostabc.com/tx/${this.txhash}`
      }
    },
    getPrice(){
      this.$common.getPrice().then( res =>{
        this.priceInfo = res
        this.priceTimePercent = (+new Date() -  new Date(this.priceInfo.created_at)) / (600 * 1000)
        if (this.changeType == 'price') {
          if (/cn/i.test(this.lang.lang)) {
            this.startPrice = this.priceInfo.price_cny_10m_ago + (this.priceInfo.price_cny - this.priceInfo.price_cny_10m_ago) * this.priceTimePercent
            this.endPrice = this.priceInfo.price_cny
          } else {
            this.startPrice = this.priceInfo.price_usd_10m_ago + this.priceTimePercent * (this.priceInfo.price_usd - this.priceInfo.price_usd_10m_ago)
            this.endPrice = this.priceInfo.price_usd
          }
        } else {
          this.startPrice = this.priceInfo.price_ratio_10m_ago + this.priceTimePercent * (this.priceInfo.price_ratio - this.priceInfo.price_ratio_10m_ago)
          this.endPrice = this.priceInfo.price_ratio
        }
        this.priceAnmate()
      })
    },
    unvoteTip(data){
      if (data.message) {
        this.txMessage = data.message
      }
      this.modalText = data.text
      this.txhash = data.txhash
      this.$refs.statusModal.show()
    },
    getPriceDown(){
      this.getPrice()
      setInterval(() => {
        this.getPrice()
      },610 * 1000)
    },
    priceAnmate(){
      const options = {
        startVal: this.fixedNumber(this.startPrice ,10),
        decimalPlaces: 10,
        useEasing: false,
        duration: 610 * (1 - this.priceTimePercent),
      };
      let countdown = new CountUp('price', this.fixedNumber(this.endPrice ,10), options)
      if (!countdown.error) {
        countdown.start()
      } else {
        console.error(countdown.error);
      }
    },
    priceChange(){
      this.priceTimePercent = (+new Date() -  new Date(this.priceInfo.created_at)) / (600 * 1000)
      if (this.changeType == 'ratio') {
        if (/cn/i.test(this.lang.lang)) {
          this.startPrice = this.priceInfo.price_cny_10m_ago + (this.priceInfo.price_cny - this.priceInfo.price_cny_10m_ago) * this.priceTimePercent
          this.endPrice = this.priceInfo.price_cny
        } else {
          this.startPrice = this.priceInfo.price_usd_10m_ago + this.priceTimePercent * (this.priceInfo.price_usd - this.priceInfo.price_usd_10m_ago)
          this.endPrice = this.priceInfo.price_usd
        }
        this.changeType = 'price'
      } else {
        this.startPrice = this.priceInfo.price_ratio_10m_ago + this.priceTimePercent * (this.priceInfo.price_ratio - this.priceInfo.price_ratio_10m_ago)
        this.endPrice = this.priceInfo.price_ratio
        this.changeType = 'ratio'
      }
      this.priceAnmate()
    },
    onReady(instance, CountUp) {
      const that = this
      instance.update(that.endVal + 100)
    },
    historyModal(type){
      this.$refs['historyModal'].showModal(type)
    },
    ruleModal(type){
      this.$refs['tipsModal'].showModal(type)
    },
    unvoteModal(){
      this.$refs['unvoteModal'].showModal()
    },
    //路由
    toRoute (route) {
      this.$router.push(`/${route}`)
    },
    historyChange(){
      this.historyInfo = this.historyList[this.showIndex]
      this.historyDirect = 'in'
      setTimeout(()=>{
        this.historyDirect = 'out'
      },2000)

      var timeInterval = setInterval(() => {
        if (this.showIndex > 19) {
          this.showIndex = 0
        }
        this.historyInfo = this.historyList[this.showIndex]
        this.historyDirect = 'in'
        setTimeout(()=>{
          this.historyDirect = 'out'
        },2000)
        this.showIndex ++
      }, 4000);
    },
    getObtainHistory(){
      //历史获得记录
      this.$common.getObtainHistory().then( res =>{
        this.historyList = res.data
        this.showIndex = 0
        this.historyChange()
      })
    },
    initIwallet(){
      const _this = this
      var timeInterval = setInterval(() => {
        if (window.IWalletJS) { 
          window.IWalletJS.enable().then((account) => {
          if(!account) {
            _this.walletAccount = null
          } else {
            clearInterval(timeInterval)
            _this.walletAccount = account
            _this.$store.commit('setWalletAccount', account) 
            _this.getAccountInfo()
            _this.$common.getTokenBalcnce(account).then( res =>{
              _this.tokenbalance = res.balance
            })
          }
        })
        }
      }, 1000);
    },
    fixedNumber(numbers,fixed){
      if (!numbers) {
        return 0
      }
      let number = new Number(numbers)
      number = number.toFixed(10)
      let str = "^(.*\\..{" + fixed + "}).*$" 
      number = String(number).replace( new RegExp(str),"$1")
      number = Number(number)
      return number
    }
  },
  
  beforeDestroy(){
    clearInterval()
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
    // box-shadow: #111 1px 1px 0;
    .banner{
      a{
        color:white;
        opacity: 0.7;
      }
      padding: 6px;
      height: 151px;
      border-radius: 8px;
      background: transparent;
      .icon-abct{
        border-radius: 50px;
        box-shadow:#222 0 0 4px;
      }
      .banner-content {
        align-items: center;
        height: 100%;
        .banner-content-right{
          margin-left:12px;
          flex: 1;
          #price{
            text-align: left;
            display: inline-block;
          }
          .rising {
            color: #0DB767;
          }
        }
      }
    }
  }
  .records {
    text-align: center;
    color: #eee;
    animation-duration: 2.01s;
    animation-iteration-count: infinite;
  }
  .vote {
    a{
      color:#FF768A;
    }
    .vote-content {
      padding:15px 15px;
      align-items: center;
      background: #1F166B;
      border-radius: 8px;
      .on-voting {
        justify-content: space-between;
      }
      .frozen-line{
        display: flex;
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
        .icon_largerise{
          height: 11px;
        }
        border-top: 1px solid #322886;
        padding-top: 10px;
      }
      .abct-text{
        line-height: 30px;
      }
    }
  }
  .mask-view{
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.6);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>


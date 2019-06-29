<template>
  <div class="vote-web-view">
    <b-alert
      variant="danger"
      dismissible
      fade
      :show="dismissCountDown"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
      {{alertText}}
    </b-alert>
    <div class="info-view">
      <div class="info-line" @click="voteNumber = fixedNumber(accountInfo.balance,6)">我的IOST：{{fixedNumber(accountInfo.balance,6)}}</div>
      <div class="info-line">投票中的IOST：{{votebalances}}</div>
      <div class="frozen-line">
        <span>冻结中的IOST：{{frozenbalances}}</span>
        <b-link href="javascript:;" style="color:#FF768A;" @click="unvoteModal">马上赎回</b-link>
      </div>
    </div>
    <div class="exchange-info mt-20">
      <div class="font-norwester fs-22 scale-title">1 ABCT = {{'\xa0' + fixedNumber(price, 6) + '\xa0'}} {{`${changeType=='ratio'?'IOST':/cn/i.test(lang.lang)?'CNY':'USD'}`}}
        <img class="switch" src="~/assets/imgs/icon_switch.svg" @click="priceChange" width="15">
      </div>
      <div class="scale-desc">投票给 IOSTABC 节点即可免费获得 ABCT</div>
      <b-input-group>
        <b-form-input v-model="voteNumber" placeholder="" @update="inputChange"></b-form-input>
        <b-input-group-append>
          <div class="all-btn" @click="voteNumber = fixedNumber(accountInfo.balance,6);inputChange()">全部</div>
        </b-input-group-append>
      </b-input-group>
      <div style="padding:10px">
        <div class="scale-tip">投 {{'\xa0'+(voteNumber || 0)+'\xa0'}} IOST 给 IOSTABC，你将参与瓜分每天{{'\xa0'+dayABCT+'\xa0'}}个 ABCT</div>
        <div class="scale-tip">当前IOSTABC总票数{{'\xa0'+parseInt(producerVotes) + '\xa0'}}, 每天可分得 {{'\xa0'+fixedNumber(abctNumber,6) + '\xa0'}} ABCT </div> 
        <div class="scale-tip mt-2 fb">{{fixedNumber(abctNumber,6) + '\xa0'}} ABCT = {{'\xa0'+fixedNumber(iostNumber,6) + '\xa0'}} IOST = {{fixedNumber(priceNumber,6) + (/cn/i.test(lang.lang)?' CNY':' USD')}}</div>
      </div>
    </div>
    <div class="exchange-view">
      <div class="icon-view">
        <img class="icon-img" src="@/assets/imgs/icon_token.svg">
        <img class="icon-to" src="@/assets/imgs/icon_to.svg">
        <img class="icon-img" src="@/assets/imgs/icon_abc.svg">
      </div>
      <div class="vote-btn mt-20" @click="vote">马上投票抢 ABCT</div>
      <div class="mt-10 history-tip" @click="historyModal('issue')">我的ABCT分红记录</div>
      <div class="mt-10 exchange-tip"><span @click="ruleModal('abct')">什么是ABCT</span> <span @click="ruleModal('publish')">发行规则</span> <span @click="ruleModal('exchange')">兑换规则</span></div>
    </div>
    <HistoryModal ref="historyModal" />
    <TipsModal ref="tipsModal" />
    <UnVoteModal ref="unvoteModal" />
    <b-modal ref="statusModal" class="statusmodal" centered hide-footer hide-header>
      <p style="color:#000;">{{modalText}}</p>
      <p style="color:#000;">{{txhash}}</p>
      <div class="mt-2" v-if="faileddes != ''">
        {{faileddes.message||faileddes}}
      </div>
    </b-modal>
  </div>
</template>
<script>
import HistoryModal from '~/components/HistoryModal.vue'
import TipsModal from '~/components/TipsModal.vue'
import UnVoteModal from '~/components/UnVoteModal.vue'
import IOST from 'iost'
import {CountUp} from 'countUp.js'
import { mapState } from "vuex"

export default {
  components: {
    TipsModal,
    UnVoteModal,
    HistoryModal
  },
  computed:{
    ...mapState(["lang"]),
  },
  data(){
    return {
      voteNumber:'',
      alertText:'',
      price:0,
      priceInfo:{},
      contractBalance:{},
      accountInfo:{},
      tokenbalance:0,
      frozenbalances:0,
      votebalances:0,
      producerVotes:'-',

      abctNumber:'-',
      iostNumber:'-',
      priceNumber:'-',

      dayABCT:86400,

      startPrice:'',
      endPrice:'',
      changeType:'ratio',

      dismissSecs: 3,
      dismissCountDown: 0,
      
      faileddes:'',
      modalText:'',
      txhash:''
    }
  },
  head() {
    return {
      title: 'ABCT',
    }
  },
  mounted () {
    if (this.$store.getters.getWalletAccount) {
      this.walletAccount = this.$store.getters.getWalletAccount
      this.getAccountInfo()
    } else{
      this.initIwallet()
    }
    this.$common.getContractBalcnce().then( res => {
      this.contractBalance = res
    })
    this.$common.getProducerInfo('iostabc').then( res => {
      this.producerVotes = res.votes
    })
    this.getPriceDown()
    
  },
  methods:{
    getAccountInfo(){
      this.$rpc.blockchain.getAccountInfo(this.walletAccount).then(account => {
        this.accountInfo = account
        this.votebalances= account.vote_infos.reduce((reduced, vote) => vote.votes ? reduced + vote.votes : 0, 0)
        this.frozenbalances =  account.frozen_balances.reduce((reduced,frozen) => frozen.amount ? reduced+frozen.amount:0,0)
      })
    },
    vote(){
      if (this.voteNumber < 1) {
        this.alertText = '投票数量不能小于1'
        this.dismissCountDown = this.dismissSecs
        return
      } 
      if (this.voteNumber > this.accountInfo.balance) {
        this.alertText = '投票数量超过可使用余额'
        this.dismissCountDown = this.dismissSecs
        return
      }
      const iost = IWalletJS.newIOST(IOST)
      const ctx = iost.callABI('vote_producer.iost', "vote", [this.walletAccount, 'iostabc', this.voteNumber.toString()])
      ctx.gasLimit = 1000000
      iost.signAndSend(ctx).on('pending', (trx) => {
        
      })
      .on('success', (result) => {
        this.modalText = '投票成功'
        this.txhash = result.tx_hash
        this.voteNumber = ''
        this.$refs.statusModal.show()
        this.getAccountInfo()
      })
      .on('failed', (failed) => {
        if (/rejected/i.test(failed)) {
          return
        }
        this.modalText = '投票失败'
        this.faileddes = failed
        this.$refs.statusModal.show()
      })
    },
    inputChange(){
      this.abctNumber = ((this.voteNumber || 0)/parseInt(this.producerVotes)) * this.dayABCT
      this.iostNumber = this.abctNumber * this.priceInfo.price_ratio 
      this.priceNumber = /cn/i.test(this.lang.lang)? this.abctNumber * this.priceInfo.price_cny : this.abctNumber * this.priceInfo.price_usd
      if (this.priceNumber < 0.000001) {
        this.priceNumber = 0.000001
      }
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
          }
        })
        }
      }, 1000);
    },
    getPrice(){
      this.$common.getPrice().then( res =>{
        this.priceInfo = res
        this.price = this.priceInfo.price_ratio
        this.inputChange()
      })
    },
    getPriceDown(){
      this.getPrice()
      setInterval(() => {
        this.getPrice()
      },1000*610)
    },
    priceChange(){
      if (this.changeType == 'ratio') {
        if (/cn/i.test(this.lang.lang)) {
          this.price = this.priceInfo.price_cny
        } else {
          this.price = this.priceInfo.price_usd
        }
        this.changeType = 'price'
      } else {
        this.price = this.priceInfo.price_ratio
        this.changeType = 'ratio'
      }
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    fixedNumber(number,fixed){
      if (!number) {
        return 0
      }
      let str = "^(.*\\..{" + fixed + "}).*$" 
      number = String(number).replace( new RegExp(str),"$1");
      number = Number(number)
      return number
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
  }
  
}
</script>

<style lang="scss" scoped>
.input-group{
  background-color: #0F0258;
  .form-control{
    color: #FFF;
    background-color: #0F0258;
    border: none;
    border-radius: 10px;
  }
  .form-control:focus{
    box-shadow: none;
  }
}
.vote-web-view{
  padding: 15px;
  .info-view{
    padding: 15px;
    background: #1F166B;
    .info-line{
      line-height: 25px;
    }
    .frozen-line{
      display: flex;
      justify-content: space-between;
    }
  }
  .exchange-info{
    padding: 15px;
    background: #1F166B;
    #price{
      display: inline-block;
      width: 140px;
    }
    .switch{
      margin-left:5px;
    }
    .all-btn{
      color: #FF768A;
      width: 60px;
      line-height: 38px;
      text-align: center;
    }
    .scale-title{
      text-align: center;
    }
    .scale-desc{
      text-align: center;
      padding: 20px;
    }
    .scale-tip{
      line-height: 20px;
      color: rgba(255, 255, 255, 0.6);
    }
  }
  .exchange-view{
    padding-top: 50px;
    .icon-view{
      display: flex;
      justify-content: center;
      align-items: center;
      .icon-img{
        height: 40px;
      }
      .icon-to{
        margin: 0 10px;
        height: 15px;
      }
    }
    .history-tip{
      color: rgba(255, 255, 255, 0.6);
    }
    .exchange-tip{
      color: rgba(255, 255, 255, 0.6);
      display: flex;
      justify-content: space-between;
    }
  }
  .statusmodal{
    padding: 20px;
  }
}

</style>

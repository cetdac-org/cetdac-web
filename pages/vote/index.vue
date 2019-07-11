<template>
  <div class="vote-web-view">
    <b-alert
      :variant="variant"
      fade
      :show="dismissCountDown"
      @dismissed="dismissCountDown=0"
      @dismiss-count-down="countDownChanged"
    >
      <div>{{alertText}}</div>
      <div class="mt-2" v-if="faileddes != ''">
        {{faileddes.message||faileddes}}
      </div>
    </b-alert>
    <!-- <b-link to="/" style="color:#FF768A;">{{backStr}}</b-link> -->
    <div class="mt-15 info-view">
      <div class="info-line" @click="voteNumber = fixedNumber(accountInfo.balance,6)">我的IOST：{{fixedNumber(accountInfo.balance,6)}}</div>
      <div class="info-line">投票中的IOST：{{votebalances}}</div>
      <div class="frozen-line">
        <span>冻结中的IOST：{{frozenbalances}}</span>
        <b-link style="color:#FF768A;" @click="unvoteModal">马上赎回</b-link>
      </div>
    </div>
    <div class="exchange-info mt-20">
      <div class="font-norwester fs-20 scale-title">1 ABCT = {{fixedNumber(price, 6)}} {{`${changeType=='ratio'?'IOST':/cn/i.test(lang.lang)?'CNY':'USD'}`}}
        <img class="switch" src="~/assets/imgs/icon_switch.svg" @click="priceChange" width="15">
      </div>
      <div class="scale-desc">投票给 IOSTABC 节点即可免费获得 ABCT</div>
      <b-input-group>
        <b-form-input type="number" v-model="voteNumber" placeholder="请输入投票数量" @update="inputChange" autocomplete="off"></b-form-input>
        <b-input-group-append>
          <div class="all-btn" @click="voteNumber = fixedNumber(accountInfo.balance,6);inputChange()">全部</div>
        </b-input-group-append>
      </b-input-group>
      <div style="padding:10px">
        <div class="scale-tip">当前IOSTABC总票数{{'\xa0'+parseInt(producerVotes) + '\xa0'}}, 投 {{'\xa0'+(voteNumber || 0)+'\xa0'}} IOST 给 IOSTABC，每天可分得 {{'\xa0'+fixedNumber(abctNumber,6) + '\xa0'}} ABCT </div> 
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
      <div class="mt-10 exchange-tip"><span @click="ruleModal('abct')">什么是ABCT</span> <span @click="ruleModal('issue')">发行规则</span> <span @click="ruleModal('exchange')">兑换规则</span></div>
    </div>
    <HistoryModal ref="historyModal" />
    <TipsModal ref="tipsModal" />
    <UnVoteModal ref="unvoteModal" @unVote="unvoteTip" />
    <div class="mask-view" v-show="isloading">
      <div class=" ld ld-spinner ld-spin-fast" style="font-size:64px;color:#8da"></div>
    </div>
    <b-modal ref="statusModal" >
      <div style="color:#000;">{{modalText}}</div>
      <div style="color:#721c24">{{txMessage}}</div>
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
import HistoryModal from '~/components/HistoryModal.vue'
import TipsModal from '~/components/TipsModal.vue'
import UnVoteModal from '~/components/UnVoteModal.vue'
import IOST from 'iost'
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
      accountInfo:{balance:0},
      tokenbalance:0,
      frozenbalances:0,
      votebalances:0,
      producerVotes:'-',

      abctNumber:'-',
      iostNumber:'-',
      priceNumber:'-',
      backStr:'< 返回',

      dayABCT:864000,

      startPrice:'',
      endPrice:'',
      changeType:'ratio',

      dismissSecs: 3,
      dismissCountDown: 0,
      variant:'danger',
      faileddes:'',

      isloading:false,
      isshowModal:false,//避免弹框两次
      modalText:'',
      txMessage:'',
      txhash:'',
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
      this.$rpc.blockchain.getAccountInfo(this.walletAccount,true).then(account => {
        this.accountInfo = account
        this.votebalances= account.vote_infos.reduce((reduced, vote) => vote.votes ? reduced + vote.votes : 0, 0)
        this.frozenbalances =  account.frozen_balances.reduce((reduced,frozen) => frozen.amount ? reduced+frozen.amount:0,0)
      })
    },
    vote(){
      let tmpvoteNumber = this.voteNumber || 0
      if (tmpvoteNumber <= 0) {
        this.variant = 'danger'
        this.alertText = '投票数量不能小于0'
        this.dismissCountDown = this.dismissSecs
        return
      } 
      if (tmpvoteNumber > this.accountInfo.balance) {
        this.variant = 'danger'
        this.alertText = '投票数量超过可使用余额'
        this.dismissCountDown = this.dismissSecs
        return
      }
      this.isshowModal = false
      this.modalText = `投票已完成，投给iostabc ${'\xa0'+tmpvoteNumber+'\xa0'}票，按当前节点总票数，每天会分得${'\xa0'+ this.fixedNumber(this.abctNumber,6)+'\xa0'} abct`
      this.txMessage = ''
      const iost = IWalletJS.newIOST(IOST)
      const ctx = iost.callABI('vote_producer.iost', "vote", [this.walletAccount, 'iostabc',tmpvoteNumber.toString()])
      ctx.gasLimit = 1000000
      iost.signAndSend(ctx).on('pending', (trx) => {
        if (!this.isshowModal) {
          this.isshowModal = true
          this.txhash = trx
          this.voteNumber = ''
          this.$refs.statusModal.show()
          ga('send','event',{
            eventCategory: `ABCTvote`, //类型 vote  
            eventAction: `voteToIOSTABC`, // 投票的节点
            eventLabel:`account:${this.walletAccount},amount:${tmpvoteNumber},status:success`,
            eventValue: parseInt(tmpvoteNumber) //投票的数量 失败为0 不统计
          })
        }
        // this.isloading = true
      })
      .on('success', (result) => {
        // this.isloading = false
        // this.variant = 'success'
        // this.alertText = '投票成功'
        // this.voteNumber = ''
        // this.getAccountInfo()
        // this.dismissCountDown = this.dismissSecs
        if (result.tx_hash) {
          this.getAccountInfo()
        }
        if (!this.isshowModal) {
          this.isshowModal = true
          this.txhash = result.tx_hash
          this.voteNumber = ''
          this.$refs.statusModal.show()
          ga('send','event',{
            eventCategory: `ABCTvote`, //类型 vote  
            eventAction: `voteToIOSTABC`, // 投票的节点 
            eventLabel:`account:${this.walletAccount},amount:${tmpvoteNumber},status:success`,
            eventValue: parseInt(tmpvoteNumber) //投票的数量 失败为0 不统计
          })
        }
      })
      .on('failed', (failed) => {
        // this.isloading = false
        if (/rejected/i.test(failed)) {
          return
        }
        if (!this.isshowModal) {
          this.isshowModal = true
          this.modalText = '投票失败'
          this.txhash = failed.tx_hash?failed.tx_hash:''
          this.txMessage = JSON.stringify(failed)
          this.$refs.statusModal.show()
          ga('send','event',{
            eventCategory: `ABCTvoteFailed`, //类型 vote  
            eventAction: `voteToIOSTABC`, // 投票的节点 
            eventLabel:`account:${this.walletAccount},amount:${tmpvoteNumber},message:${JSON.stringify(failed)}`,
          })
        }
        // this.variant = 'danger'
        // this.alertText = '投票失败'
        // this.faileddes = failed
        // this.dismissCountDown = this.dismissSecs
      })
    },
    toTxHash(){
      if (this.txhash) {
        window.location = `https://www.iostabc.com/tx/${this.txhash}`
      }
    },
    unvoteTip(data){
      if (data.message) {
        this.txMessage = data.message
      }
      this.modalText = data.text
      this.txhash = data.txhash
      this.$refs.statusModal.show()
    },
    inputChange(){
      this.abctNumber = ((this.voteNumber || 0)/parseInt(this.producerVotes)) * this.dayABCT
      this.iostNumber = this.abctNumber * this.priceInfo.price_ratio 
      this.priceNumber = /cn/i.test(this.lang.lang)? this.abctNumber * this.priceInfo.price_cny : this.abctNumber * this.priceInfo.price_usd
      if (this.priceNumber < 0.000001 && this.priceNumber != 0) {
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
    fixedNumber(numbers,fixed){
      if (!numbers) {
        return 0
      }
      let number = new Number(numbers)
      number = number.toFixed(10)
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

<template>
  <div class="exchange-web-view">
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
      <img class="icon-img" src="@/assets/imgs/icon_abc.svg">
      <div class="ml-5 abct-balance">
        <div @click="exchangeNumber = tokenbalance;">我的ABCT：{{tokenbalance}}</div>
      </div>
    </div>
    <div class="exchange-info mt-20">
      <div class="font-norwester fs-20 scale-title">1 ABCT = {{fixedNumber(price, 6)}} {{`${changeType=='ratio'?'IOST':/cn/i.test(lang.lang)?'CNY':'USD'}`}}
        <img class="switch" src="~/assets/imgs/icon_switch.svg" @click="priceChange" width="15">
      </div>
      <div class="scale-desc">你可以在任何时间选择把 ABCT 兑换为IOST我们只收取0.5%的手续费</div>
      <b-input-group>
        <b-form-input focus v-model="exchangeNumber" placeholder="" @update="inputChange"></b-form-input>
        <b-input-group-append>
          <div class="all-btn" @click="exchangeNumber = tokenbalance;inputChange()">全部</div>
        </b-input-group-append>
      </b-input-group>
      <div class="scale-tip">{{exchangeNumber || 0}} ABCT = {{fixedNumber(exchangeNumber * price, 6)}} IOST = {{ priceNumber + (/cn/i.test(lang.lang)?" CNY":" USD") }}</div>
    </div>
    <div class="exchange-view">
      <div class="icon-view">
        <img class="icon-img" src="@/assets/imgs/icon_abc.svg">
        <img class="icon-to" src="@/assets/imgs/icon_to.svg">
        <img class="icon-img" src="@/assets/imgs/icon_iost.svg">
      </div>
      <div class="exchange-btn mt-20" @click="exchange">兑换 IOST</div>
      <div class="mt-10 history-tip" @click="historyModal('exchange')">我的兑换记录</div>
      <div class="mt-10 exchange-tip"><span @click="ruleModal('abct')">什么是ABCT</span> <span @click="ruleModal('issue')">发行规则</span> <span @click="ruleModal('exchange')">兑换规则</span></div>
    </div>
    <HistoryModal ref="historyModal" />
    <TipsModal ref="tipsModal" />
    <b-modal  ref="statusModal" >
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
import { mapState } from "vuex"
import IOST from 'iost'

export default {
  components: {
    TipsModal,
    HistoryModal
  },
  computed:{
    ...mapState(["lang"]),
  },
  data(){
    return {
      exchangeNumber: '',
      price:0,
      priceInfo: {},
      changeType: 'ratio',
      contractBalance:{},
      accountInfo:{},
      tokenbalance:0,

      dismissSecs: 3,
      dismissCountDown: 0,

      backStr:'< 返回',

      abctNumber:'-',
      iostNumber:'-',
      priceNumber:'-',

      variant:'danger',
      alertText:'',
      faileddes:'',
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
      this.getTokenBalance()
    } else{
      this.initIwallet()
    }
    this.$common.getContractBalcnce().then( res => {
      this.contractBalance =  res
    })
    this.getPriceDown()
  },
  methods:{
    getTokenBalance(){
      this.$common.getTokenBalcnce(this.walletAccount).then( res =>{
        this.tokenbalance = res.balance
      })
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
    exchange(){
      let exchangeNumber = this.exchangeNumber || 0
      if (exchangeNumber <= 0) {
        this.variant = 'danger'
        this.alertText = '兑换数量不能小于0'
        this.dismissCountDown = this.dismissSecs
        return
      } 
      if (exchangeNumber > this.tokenbalance) {
        this.variant = 'danger'
        this.alertText = '兑换数量超过可使用余额'
        this.dismissCountDown = this.dismissSecs
        return
      }
      const iost = IWalletJS.newIOST(IOST)
      this.isshowModal = false
      // this.modalText = '兑换已完成'
      this.modalText = `兑换完成，${exchangeNumber + '\xa0'}ABCT 兑换为 ${this.fixedNumber(exchangeNumber * this.price, 6) +'\xa0'}IOST`
      this.txMessage = ''
      const ctx = iost.callABI('ContractGBxLy1B1jfGoAWUHGDW9k8hG7NRo4owwcerJmrNTK8xZ', "exchange", [this.walletAccount, exchangeNumber,''])
      ctx.gasLimit = 1000000
      iost.signAndSend(ctx).on('pending', (trx) => {
        if (!this.isshowModal) {
          this.isshowModal = true
          this.txhash = trx
          this.$refs.statusModal.show()
        }
      })
      .on('success', (result) => {
        // alert('2222')
        // this.variant = 'success'
        // this.alertText = '兑换成功'
        // this.exchangeNumber = ''
        // this.getTokenBalance()
        // this.dismissCountDown = this.dismissSecs
        if (!this.isshowModal) {
          this.isshowModal = true
          this.txhash = result.tx_hash
          this.$refs.statusModal.show()
        }
      })
      .on('failed', (failed) => {
        if (/rejected/i.test(failed)) {
          return
        }
        if (!this.isshowModal) {
          this.isshowModal = true
          this.modalText = '兑换失败'
          this.txhash = failed.tx_hash ? failed.tx_hash:''
          this.txMessage = JSON.stringify(failed)
          this.$refs.statusModal.show()
        }
        // this.variant = 'danger'
        // this.alertText = '兑换失败'
        // this.faileddes = failed
        // this.dismissCountDown = this.dismissSecs

      })
    },
    toTxHash(){
      if (this.txhash) {
        window.location = `https://www.iostabc.com/tx/${this.txhash}`
      }
    },
    inputChange(){
      this.priceNumber = this.fixedNumber(/cn/i.test(this.lang.lang)? this.exchangeNumber * this.priceInfo.price_cny : this.exchangeNumber * this.priceInfo.price_usd, 6)
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
            _this.getTokenBalance()
          }
        })
        }
      }, 1000);
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
.exchange-web-view{
  padding: 15px;
  .info-view{
    display: flex;
    padding: 15px;
    background: #1F166B;
    .icon-img{
      height: 40px;
    }
    .abct-balance{
      display: flex;
      align-items: center;
    }
  }
  .exchange-info{
    padding: 15px;
    background: #1F166B;
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
      padding: 20px;
      text-align: center;
    }
    .scale-tip{
      padding: 10px;
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
}

</style>

<template>
  <div class="exchange-web-view">
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
    <b-link to="/" style="color:#FF768A;">< 返回</b-link>
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
      <div class="mt-10 exchange-tip"><span @click="ruleModal('abct')">什么是ABCT</span> <span @click="ruleModal('publish')">发行规则</span> <span @click="ruleModal('exchange')">兑换规则</span></div>
    </div>
    <HistoryModal ref="historyModal" />
    <TipsModal ref="tipsModal" />
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

      abctNumber:'-',
      iostNumber:'-',
      priceNumber:'-',

      alertText:'',
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
      if (this.exchangeNumber < 1) {
        this.alertText = '兑换数量不能小于1'
        this.dismissCountDown = this.dismissSecs
        return
      } 
      if (this.exchangeNumber > this.tokenbalance) {
        this.alertText = '兑换数量超过可使用余额'
        this.dismissCountDown = this.dismissSecs
        return
      }
      const iost = IWalletJS.newIOST(IOST)
      const ctx = iost.callABI('ContractGBxLy1B1jfGoAWUHGDW9k8hG7NRo4owwcerJmrNTK8xZ', "exchange", [this.walletAccount, this.exchangeNumber,''])
      ctx.gasLimit = 1000000
      iost.signAndSend(ctx).on('pending', (trx) => {
        
      })
      .on('success', (result) => {
        this.modalText = '兑换成功'
        this.txhash = result.tx_hash
        this.exchangeNumber = ''
        this.$refs.statusModal.show()
        this.getTokenBalance()
      })
      .on('failed', (failed) => {
        if (/rejected/i.test(failed)) {
          return
        }
        this.modalText = '兑换失败'
        this.faileddes = failed
        this.$refs.statusModal.show()
      })
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
    .switch{
      margin-left:5px;
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

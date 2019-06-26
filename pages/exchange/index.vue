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
    <div class="info-view">
      <img class="icon-img" src="@/assets/imgs/icon_abc.svg">
      <div class="ml-5">
        <div>我的ABCT：{{tokenbalance}}</div>
        <div>回购资金池：{{fixedNumber(contractBalance.balance,4)}}</div>
      </div>
    </div>
    <div class="exchange-info mt-20">
      <div class="scale-title font-norwester fs-22">1 ABTC = {{'\xa0' + price + '\xa0'}}IOST</div>
      <div class="scale-desc">你可以在任何时间选择把 ABCT 兑换为IOST我们只收取0.5%的手续费</div>
      <b-form-input v-model="exchangeNumber" placeholder=""></b-form-input>
      <div class="scale-tip">兑换 1000 ABCT = 2000 IOST = ¥ xxx，及时到账</div>
    </div>
    <div class="exchange-view">
      <div class="icon-view">
        <img class="icon-img" src="@/assets/imgs/icon_abc.svg">
        <img class="icon-to" src="@/assets/imgs/icon_to.svg">
        <img class="icon-img" src="@/assets/imgs/icon_token.svg">
      </div>
      <div class="exchange-btn mt-20" @click="exchange">兑换回 IOST</div>
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
import IOST from 'iost'

export default {
  components: {
    TipsModal,
    HistoryModal
  },
  data(){
    return {
      exchangeNumber:'',
      price:0,
      contractBalance:{},
      accountInfo:{},
      tokenbalance:0,
      dismissSecs: 3,
      dismissCountDown: 0,

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
    const _this = this
    setTimeout(function(){
      IWalletJS.enable().then((account) => {
        if(!account) {
          _this.walletAccount = null
        } else {
          _this.walletAccount = account
          _this.getTokenBalance()
        }
      })
    },100)
    this.$common.getContractBalcnce().then( res => {
      this.contractBalance =  res
    })
    this.$common.getPrice().then( res =>{
      this.price = this.fixedNumber(res.price_ratio,4)
    })
  },
  methods:{
    getTokenBalance(){
      this.$common.getTokenBalcnce(this.walletAccount).then( res =>{
        this.tokenbalance = res.balance
      })
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
.exchange-web-view{
  padding: 15px;
  .info-view{
    display: flex;
    padding: 15px;
    background: #1F166B;
    .icon-img{
      height: 40px;
    }
  }
  .exchange-info{
    padding: 15px;
    background: #1F166B;
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

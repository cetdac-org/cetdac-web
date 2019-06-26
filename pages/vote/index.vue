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
      <div class="info-line">我的IOST：{{accountInfo.balance}}</div>
      <div class="info-line">投票中的IOST：{{votebalances}}</div>
      <div class="frozen-line">
        <span>冻结中的IOST：{{frozenbalances}}</span>
        <span>马上赎回</span>
      </div>
      <div class="info-line">回购资金池：{{fixedNumber(contractBalance.balance,4)}}</div>
    </div>
    <div class="exchange-info mt-20">
      <div class="font-norwester fs-22 scale-title">1 ABTC = {{ price }} IOST</div>
      <div class="scale-desc">投票给 IOSTABC 节点即可免费获得 ABCT</div>
      <b-form-input v-model="voteNumber" placeholder=""></b-form-input>
      <div class="scale-tip">投 1000 IOST，你每天将参与瓜分10000个 ABCT，当前IOSTABC总票数xxx,你每天可分得 20 ABCT = 40 IOST = ¥ xxx</div>
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
      voteNumber:'',
      alertText:'',
      price:0,
      priceInfo:{},
      contractBalance:{},
      accountInfo:{},
      tokenbalance:0,
      frozenbalances:0,
      votebalances:0,

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
    const _this = this
    setTimeout(function(){
      IWalletJS.enable().then((account) => {
        if(!account) {
          _this.walletAccount = null
        } else {
          _this.walletAccount = account
          _this.getAccountInfo()
        }
      })
    },100)
    this.$common.getContractBalcnce().then( res => {
      this.contractBalance = res
    })
    this.$common.getPrice().then( res =>{
      this.priceInfo = res
      this.price = res.price_ratio.toFixed(4)
    })
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
    .scale-title{
      text-align: center;
    }
    .scale-desc{
      text-align: center;
      padding: 20px;
    }
    .scale-tip{
      padding: 10px;
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

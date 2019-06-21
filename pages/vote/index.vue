<template>
  <div class="vote-web-view">
    <div class="info-view">
      <div class="info-line">我的IOST：{{accountInfo.balance}}</div>
      <div class="info-line">投票中的IOST：{{votebalances}}</div>
      <div class="frozen-line">
        <span>冻结中的IOST：{{frozenbalances}}</span>
        <span>马上赎回</span>
      </div>
      <div class="info-line">回购资金池:{{fixedTwo(contractBalance.balance)}}</div>
    </div>
    <div class="exchange-info mt-20">
      <div class="font-norwester fs-22 scale-title">1 ABTC = {{ price }} IOST</div>
      <div class="scale-desc">投票给 IOSTABC 节点即可免费获得 ABCT</div>
      <b-form-input v-model="text" placeholder="Enter your name"></b-form-input>
      <div class="scale-tip">投 1000 IOST，你每天将参与瓜分10000个 ABCT，当前IOSTABC总票数xxx,你每天可分得 20 ABCT = 40 IOST = ¥ xxx</div>
    </div>
    <div class="exchange-view">
      <div class="icon-view">
        <img class="icon-img" src="@/assets/imgs/icon_token.svg">
        <img class="icon-to" src="@/assets/imgs/icon_to.svg">
        <img class="icon-img" src="@/assets/imgs/icon_abc.svg">
      </div>
      <div class="vote-btn mt-20">马上投票抢 ABCT</div>
      <div class="mt-10 history-tip">我的ABCT分红记录</div>
      <div class="mt-10 exchange-tip"><span>什么是ABCT</span> <span>发行规则</span> <span>兑换规则</span></div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      text:'',
      price:0,
      priceInfo:{},
      contractBalance:{},
      accountInfo:{},
      tokenbalance:0,
      frozenbalances:0,
      votebalances:0
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
          _this.$common.getTokenBalcnce(account).then( res =>{
            console.log('res--',res)
          })
        }
      })
    },100)
    this.$common.getContractBalcnce().then( res => {
      console.log('res',res)
      this.contractBalance = res
    })
    this.$common.getPrice().then( res =>{
      console.log('price',res)
      this.priceInfo = res
      this.price = res.price_ratio.toFixed(4)
    })
  },
  methods:{
    getAccountInfo(){
      this.$rpc.blockchain.getAccountInfo('pwdev').then(account => {
        console.log('account',account)
        this.accountInfo = account
        this.votebalances= account.vote_infos.reduce((reduced, vote) => vote.votes ? reduced + vote.votes : 0, 0)
        this.frozenbalances =  account.frozen_balances.reduce((reduced,frozen) => frozen.amount ? reduced+frozen.amount:0,0)

      })
    },
    fixedTwo(number){
      if (!number) {
        return 0
      }
      number = String(number).replace(/^(.*\..{2}).*$/,"$1");
      number = Number(number); 
      return number
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
}

</style>

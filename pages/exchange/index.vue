<template>
  <div class="exchange-web-view">
    <div class="info-view">
      <img class="icon-img" src="@/assets/imgs/icon_abc.svg">
      <div class="ml-5">
        <div>我的ABCT：{{tokenbalance}}</div>
        <div>回购资金池：{{fixedTwo(contractBalance.balance)}}</div>
      </div>
    </div>
    <div class="exchange-info mt-20">
      <div class="scale-title font-norwester fs-22">1 ABTC = {{price}}IOST</div>
      <div class="scale-desc">你可以在任何时间选择把 ABCT 兑换为IOST我们只收取0.5%的手续费</div>
      <b-form-input v-model="text" placeholder="Enter your name"></b-form-input>
      <div class="scale-tip">兑换 1000 ABCT = 2000 IOST = ¥ xxx，及时到账</div>
    </div>
    <div class="exchange-view">
      <div class="icon-view">
        <img class="icon-img" src="@/assets/imgs/icon_abc.svg">
        <img class="icon-to" src="@/assets/imgs/icon_to.svg">
        <img class="icon-img" src="@/assets/imgs/icon_token.svg">
      </div>
      <div class="exchange-btn mt-20">兑换回 IOST</div>
      <div class="mt-10 history-tip">我的兑换记录</div>
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
      contractBalance:{},
      accountInfo:{},
      tokenbalance:0,
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
            _this.tokenbalance = res.balance
          })
        }
      })
    },100)
    this.$common.getContractBalcnce().then( res => {
      console.log('res',res)
      this.contractBalance =  res
    })
    this.$common.getPrice().then( res =>{
      console.log('res',res)
      // this.price = res.ratio.toFixed(4)
    })
  },
  methods:{
    getAccountInfo(){
      this.$rpc.blockchain.getAccountInfo('pwdev').then(account => {
        console.log('account',account)
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

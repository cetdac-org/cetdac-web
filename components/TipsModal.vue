<template>
  <b-modal  ref="tips-modal" hide-footer class="modal">
    <template slot="modal-title">
     <div style="color:#000" class="fs-22 fb">{{titleOption[type]}}</div>
    </template>
    <b-card class="mb-2" body-class="center-body">
      <b-card-text class="modal-text-info">
        <div v-if="type == 'abct'">
          <p class="tips-title fs-20 fb ">什么是 ABCT</p>
          <p class="tips-info-text">ABCT是IOSTABC团队基于IOST主网投票收益的利润，在IOST网络上发行的权益代币，只要给IOSTABC账户投票的用户，除了享受IOSTABC作为第一梯队节点的高额回报之外，我们还将根据你的投票数量，每天定时定量的派发ABCT，参与投票就相当于参与ABCT挖矿，持有的ABCT可以随时兑换成IOST</p>
        </div>
        <div v-if="type == 'abct' || type == 'issue' " class="mt-10">
          <p class="tips-title fs-20 fb ">发行规则</p>
          <div>
            <b-table stacked outlined :items="tabitems" :fields="fields"></b-table>
          </div>
          <img style="width:100%" v-if="/cn/i.test(lang.lang)" src="~/assets/imgs/icon_issue.png">
          <img style="width:100%" v-else src="~/assets/imgs/icon_issue_en.png">
          <p class="tips-info-text">现阶段ABCT将以免费赠与的方式发行，总量20亿，以天为周期定量解锁，每天最多解锁864000。</p>
          <p class="tips-info-text">1. 投票给IOSTABC节点的用户，将参与瓜分每天的864000个ABCT，根据投票数占IOSTABC总票池的比例自动分发。</p>
          <p class="tips-info-text">2. 另外会不定期做一些活动赠与部分ABCT，这部分具体数⽬要视情况⽽定。</p>
        </div>
        <div v-if="type == 'abct' || type == 'exchange' " class="mt-10">
          <p class="tips-title fs-20 fb ">兑换规则</p>
          <p class="tips-info-text">1. 你可以在任何时间把ABCT兑换成IOST，我们会每天把IOSTABC节点奖励收益的50%充值到兑换奖金池，兑换奖金池的余额越多，兑换的价格就越高。</p>
          <p class="tips-info-text">2. 兑换得到的IOST即时到账。</p>
          <p class="tips-info-text">3. 完成兑换ABCT立即销毁。</p>
        </div>
      </b-card-text>
    </b-card>
  </b-modal>
</template>

<script>

import { mapState } from "vuex"

export default {
  data(){
    return {
      titleOption:{
        abct:'什么是ABCT？',
        issue:'发行规则？',
        exchange:'兑换规则'
      },
      type:'abct',
      fields:[
        {key:'vote',label:'我的票数'},
        {key:'abctnumber',label:'我的ABCT/日'},
        {key:'voteincome',label:'投票收益/日'},
        {key:'otherincome',label:'额外收益/日'},
        {key:'votes',label:'节点票数(浮动)'},
        {key:'iostnumber',label:'回购资金/日'},
        {key:'abctday',label:'ABCT发行量/日'},
        {key:'abctprice',label:'兑换价格'},
      ],
      tabitems:[
        {vote:'100,0000', abctnumber:26181,voteincome:'88.64 IOST',otherincome:'181.8125 IOST', votes:'3300万', iostnumber:'6000 IOST', abctday :'864000',abctprice:'0.006944 IOST/ABCT'}
      ]
    }
  },
  computed:{
    ...mapState(["lang"]),
  },
  mounted(){
    // this.initData()
  },
  methods:{
    // initData(){
    //   this.walletAccount = this.$store.getters.getWalletAccount
    //   Promise.all([this.$rpc.blockchain.getAccountInfo(this.walletAccount)])
    // },
    showModal(type){
      this.type = type
      this.$refs['tips-modal'].show()
    }
  }
}
</script>
<style lang="scss">

.modal{
  .card{
    border: none;
  }
  .center-body{
    padding: 0px;
  }
  .modal-head{
    color: #000;
    font-weight: bold;
  }
  .modal-text-info{
    color: #000;
    .tips-title{
      margin-bottom: 10px;
    }
    .tips-info-text{
      line-height: 25px;
    }
  }
}

</style>



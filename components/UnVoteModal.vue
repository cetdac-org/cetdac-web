<template>
  <div>
    <b-modal  ref="vote-modal" hide-footer class="modal">
      <div class="nodata-view" v-if="voteList.length<1">
        暂无数据
      </div>
      <div v-else>
        <b-list-group >
          <b-list-group-item class="item" v-for="(item,index) in voteList" :key="index">
            <span>节点：{{item.option}}</span> <span >票数：{{item.votes}}</span>  <div class="unvote-btn" @click="unVote(item)">取消投票</div>
          </b-list-group-item>
        </b-list-group>
      </div>
    </b-modal>
  </div>
</template>

<script>
import IOST from 'iost'

export default {
  data() {
    return{
      voteList:[],
      walletAccount:'',
      isshowModal:false,//避免弹框两次
    }
  },
  methods:{
    getAccountInfo(){
      this.$rpc.blockchain.getAccountInfo(this.walletAccount).then(account => {
        let votelist = account.vote_infos
        this.voteList = votelist.filter(item => item.option != 'iostabc')
      })
    },
    showModal(){
      this.walletAccount = this.$store.getters.getWalletAccount
      this.getAccountInfo()
      this.$refs['vote-modal'].show()
    },
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    unVote(item){
      this.$refs['vote-modal'].hide()
      this.isshowModal = false
      const iost = IWalletJS.newIOST(IOST)
      const ctx = iost.callABI('vote_producer.iost', "unvote", [this.walletAccount, item.option, item.votes.toString()])
      iost.signAndSend(ctx).on('pending', (trx) => {
        if (!this.isshowModal) {
          this.isshowModal = true
          this.$emit('unVote',{status:'pending',text:`撤回投票完成,撤回投给${'\xa0'+item.option+'\xa0' + item.votes+'\xa0'}票`,txhash:trx})
          ga('send','event',{
            eventCategory: `Unvote`, //类型 unvote  
            eventAction: `Unvote`, // 投票的节点
            eventLabel:`account:${this.walletAccount},producer:${item.option},amount:${item.votes},status:success`,
            eventValue: parseInt(item.votes) //投票的数量 失败为0 不统计
          })
        }
      })
      .on('success', (result) => {
        if (!this.isshowModal) {
          this.isshowModal = true
          this.$emit('unVote',{status:'success',text:`撤回投票完成,撤回投给${'\xa0'+item.option+'\xa0' + item.votes+'\xa0'}票`,txhash:result.tx_hash})
          ga('send','event',{
            eventCategory: `Unvote`, //类型 unvote  
            eventAction: `Unvote`, // 投票的节点
            eventLabel:`account:${this.walletAccount},producer:${item.option},amount:${item.votes},status:success`,
            eventValue: parseInt(item.votes) //投票的数量 失败为0 不统计
          })
        }
      })
      .on('failed', (failed) => {
        if (/rejected/i.test(failed)) {
          return
        }
        if (!this.isshowModal) {
          this.isshowModal = true
          this.$emit('unVote',{status:'failed',text:'取消投票失败',txhash:failed.tx_hash?failed.tx_hash:'',message:JSON.stringify(failed)})
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.modal{
  .nodata-view{
    text-align: center;
    line-height: 30px;
    color: #000;
  }
  .item{
    color: #000;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .unvote-btn{
      display: inline-block;
      background-color: #007bff;
      padding: 5px 10px;
      color: #FFF;
      border-radius: 5px;
    }
  }
}


</style>



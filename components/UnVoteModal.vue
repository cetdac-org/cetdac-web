<template>
  <div>
    <b-modal centered ref="vote-modal" hide-footer class="modal">
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
    }
  },
  methods:{
    getAccountInfo(){
      this.$rpc.blockchain.getAccountInfo(this.walletAccount).then(account => {
        this.voteList = account.vote_infos
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
      const iost = IWalletJS.newIOST(IOST)
      const ctx = iost.callABI('vote_producer.iost', "unvote", [this.walletAccount, item.option, item.votes.toString()])
      iost.signAndSend(ctx).on('pending', (trx) => {
        
      })
      .on('success', (result) => {
        console.log('result',result)
        this.$emit('unVote',{status:'success',text:'取消投票成功'})
      })
      .on('failed', (failed) => {
        if (/rejected/i.test(failed)) {
          return
        }
        console.log('failed',failed)
        this.$emit('unVote',{status:'failed',text:'取消投票失败',faileddes:failed})
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



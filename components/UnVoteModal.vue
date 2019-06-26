<template>
  <div>
    <b-modal centered ref="vote-modal" class="modal">
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
      <template slot="modal-footer" slot-scope="{cancel}">
        <b-button size="sm" @click="cancel()">
          Cancel
        </b-button>
      </template>
    </b-modal>
    <b-modal ref="statusModal" class="statusmodal" centered hide-footer hide-header>
      <p style="color:#000;">{{modalText}}</p>
      <p style="color:#000;">{{txhash}}</p>
      <div class="mt-2" style="color:#000;" v-if="faileddes != ''">
        {{faileddes.message||faileddes}}
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
      modalText:'',
      txhash:'',
      faileddes:'',
      walletAccount:''
    }
  },
  mounted(){
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
  },
  methods:{
    getAccountInfo(){
      this.$rpc.blockchain.getAccountInfo(this.walletAccount).then(account => {
        this.voteList = account.vote_infos
      })
    },
    showModal(){
      this.$refs['vote-modal'].show()
    },
    unVote(item){
      this.$refs['vote-modal'].hide()
      const iost = IWalletJS.newIOST(IOST)
      const ctx = iost.callABI('vote_producer.iost', "unvote", [this.walletAccount, item.option, item.votes.toString()])
      iost.signAndSend(ctx).on('pending', (trx) => {
        
      })
      .on('success', (result) => {
        this.modalText = '撤回投票成功'
        this.txhash = result.tx_hash
        this.$refs.statusModal.show()

      })
      .on('failed', (failed) => {
        if (/rejected/i.test(failed)) {
          return
        }
        this.modalText = '撤回投票失败'
        this.faileddes = failed
        this.$refs.statusModal.show()
        
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



<template>
  <b-modal centered ref="history-modal" class="modal" @hide="modalHide">
    <div class="nodata-view" v-if="(issueList.length == 0 && type == 'issue') || (exchangeList.length == 0&& type == 'exchange') ">
      暂无数据
    </div>
    <div v-else>
      <b-list-group v-if="issueList.length>0">
        <b-list-group-item class="item"  v-for="(item,index) in issueList" :key="index">
          <span>分红数量：{{item.amount}}</span> <span class="ml-2">分红块：{{item.block}}</span>
        </b-list-group-item>
      </b-list-group>
      <b-list-group v-if="exchangeList.length>0">
        <b-list-group-item class="item"  v-for="(item,index) in exchangeList" :key="index">
          <span>ABCT数量：{{item.abct_amount}}</span> <span class="ml-2">兑换IOST数量：{{item.iost_amount}}</span> <span class="ml-2">所在块：{{item.block}}</span>
        </b-list-group-item>
      </b-list-group>
      <div class="pagination-view">
        <b-pagination
          v-model="pagination.page"
          :total-rows="totalCount"
          :per-page="pagination.size"
          @change="pageChange"
          ></b-pagination>
      </div>
    </div>
    <template slot="modal-footer" slot-scope="{cancel}">
      <b-button size="sm" @click="cancel()">
        Cancel
      </b-button>
    </template>
  </b-modal>
</template>

<script>
export default {
  data(){
    return{
      walletAccount:'',
      issueList:[],
      type:'',
      exchangeList:[],
      totalCount:0,
      pagination: {
        page: 1,
        size: 10,
      }
    }
  },
  methods:{
    showModal(type){
      this.walletAccount = this.$store.getters.getWalletAccount
      this.type = type
      this.getList(type)
      this.$refs['history-modal'].show()
    },
    modalHide(){
      this.exchangeList = []
      this.issueList = []
      this.totalCount = 0
      this.pagination.page = 1
    },
    pageChange(page){
      if (page == this.pagination.page) {
        return
      }
      this.pagination.page = page
      this.getList(this.type)
    },
    getList(type){
      if (type == 'issue') {
        this.$common.getIssueHistory(this.walletAccount,this.pagination).then( res =>{
          this.issueList = res.actions
          this.totalCount = res.total
        })
      } else if (type == 'exchange') {
        this.$common.getExchangeHistory(this.walletAccount,this.pagination).then( res =>{
          this.exchangeList = res.actions
          this.totalCount = res.total
        })
      }
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
  }
  .pagination-view{
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
}


</style>



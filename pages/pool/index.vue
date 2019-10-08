<template>
  <div class="cetdac-web-pool">
    <div>
      <b-carousel
        id="carousel-fade"
        style="text-shadow: 0px 0px 2px #000"
        fade
        indicators
        img-width="1200"
        img-height="200"
      >
        <b-carousel-slide
          caption="First slide"
          img-src="https://picsum.photos/1200/200/?image=10"
        ></b-carousel-slide>
        <b-carousel-slide
          caption="Second Slide"
          img-src="https://picsum.photos/1200/200/?image=12"
        ></b-carousel-slide>
        <b-carousel-slide
          caption="Third Slide"
          img-src="https://picsum.photos/1200/200/?image=22"
        ></b-carousel-slide>
      </b-carousel>
    </div>
    <div class="status-bar mt-20">
      <div>
        <div class="label">状态:</div> 
        <div>正常运行</div>
      </div>
      <div>
        <div class="label">矿池总量:</div> 
        <div>{{poolinfo.poolamount}} CET</div>
      </div>
      <div>
        <div class="label">七日年化利率:</div>
        <div>20%</div>
      </div>
      <div>
        <div class="label">已发放CET:</div>
        <div>{{poolinfo.cetamount}} CET</div>
      </div>
      <div>
        <div class="label">已发放DAC:</div>
        <div>{{poolinfo.dacamount}} DAC</div>
      </div>
    </div>
    <!-- <b-button @click="sendToList" pill class="mt-20" size="lg" type="submit"  variant="primary">SendTX</b-button> -->
    <b-container class="panel">
      <b-row>
        <b-col class="left-panel subpanel">
          <div class="wrapper" v-if="!isShowIncome">
            <div class="tip mb-10">
              <div class="font-blod">挖矿</div>
            </div>
            <div class="wrapper-content">
              <div class="flex-sp">
                <div class="fb">参与额度</div>
                <div class="flex-sp">
                  <b-form-input autocomplete="off" v-model="amount"></b-form-input>
                  <b-input-group-append>
                    <b-button variant="light">Button</b-button>
                  </b-input-group-append>
                  <span class="ml-5">CET</span></div>
              </div>
              <div class="flex-sp mt-10">
                <div>预估收益</div>
                <div>CET/日</div>
              </div>
              <div class="flex-sp mt-10">
                <div>预估年化</div>
                <div>10%</div>
              </div>
              <div class="mt-10">
                <b-button block variant="success" @click="sendToList">button</b-button>
              </div>

            </div>
          </div>
          <div class="wrapper" v-else>
            <div class="tip">
              <div class="fb">我的收益</div>
              <b-link>收益记录 ></b-link>
            </div>
            <div class="wrapper-content">
              <div class="flex-sp mt-10">
                <div>
                  <div>总收益</div>
                  <div>+ CET</div>
                </div>
                <div>
                  <div>昨日收益</div>
                  <div>+ CET</div>
                </div>
                <div>
                  <div>本金</div>
                  <div>CET</div>
                </div>
              </div>
              <div class="flex-sp mt-10">
                <div class="flex text-center mr-10">
                  <b-button block variant="success">button</b-button>
                </div>
                <div class="flex text-center ml-10">
                  <b-button block variant="success">button</b-button>
                </div>
              </div>
            </div>
          </div>
        </b-col>
        <b-col class="right-panel subpanel">
          <div class="wrapper">
            <div class="tip">
              <div>加速任务</div>
              <b-link>任务记录 ></b-link>
            </div>
            <div class="wrapper-content">

            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <div class="invite-bar mt-20">
      <div>邀请返佣</div>
    </div>
    <div class="tx-panel mt-20">
      <div>交易记录</div>
      <div class="list-view">
        <b-table dark fixed :items="recordlist" :fields="fields">
          <template slot="[tx_hash]" slot-scope="{ item }">
            <div class="hash-text">{{item.tx_hash}}</div>
          </template>
          <template slot="[type]" slot-scope="{ item }">
            <div>{{typeOptions[item.type]}}</div>
          </template>
          <template slot="[create_time]" slot-scope="{ item }">
            {{dateformat(item.create_time,'YYYY-MM-DD HH:mm:ss')}}
          </template>
        </b-table>
        
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue"
import { mapState } from "vuex"
import moment from 'moment'
import Mockjs from 'mockjs'


export default {
  head() {
    return {
      title: 'CETDAC',
    }
  },
  computed:{
    ...mapState(["lang"]),
  },
  data () {
    return {
      isShowIncome:false,
      amount:'',
      poolinfo:{},
      recordlist:[],
      fields:{
        type:{
          label:'操作'
        },
        amount:{
          label:'数量'
        },
        tx_hash:{
          label:'交易'
        },
        create_time:{
          label:'时间'
        }
      },
      typeOptions:{
        1:'参与矿池',
        2:'赎回'
      }
    }
  },
  mounted(){    
    this.getRecordList()
    this.getPoolInfo()
  },
  methods:{
    dateformat(time,format){
      return moment(time).format(format) 
    },
    sendTx(){
      if (window.WalletJS) {
        WalletJS.enable().then((account) => {
          if (!account) {
            return
          }
          let to_address = 'cettest1m0qkcm7x50ffrl9gj5p22nzedp8ezqqfd3h38d'
          let amount = Mockjs.mock('@integer(10, 80)')
          WalletJS.createTxInfo('bankx/MsgSend','cet',{from_address:account,to_address,amount,memo:'123'}).then(res=> { 
            WalletJS.signAndSend(res).on('pending', (ctx) => {
              console.log('pending',ctx)
            }).on('success', ( result)=>{
              console.log('success',result)
              let param = {address:account,amount}
              this.sendToList(param)
              
            }).on('failed',(failed)=>{
              console.log('failed',failed)
              this.$store.commit('setErrorText', failed)
            })
          })
        }).catch(e=>{
          this.$store.commit('setErrorText', e)
        })
      }
    },
    sendToList(){
      // if (!this.amount) {
      //   this.$store.commit('setErrorText', 'amount is required')
      //   return
      // }
      let params = Mockjs.mock({
        'type|1-2':1,
        'tx_hash':'@id',
        'address':'coinex18ntqxlq9wvfdfu2ljcse6df6he9a85rwxrj6gj',
        'amount|1-100.2':1
      })
      this.axios.post('/record',params).then(res => {
        if (res.code == 0) {
          this.amount = ''
          this.$store.commit('setSuccessText', 'success')
          this.getRecordList()
        }
      })
    },
    getRecordList(){
      this.axios.get('/record',{params:{address:'cettest19uqtkxqwmx7wpf486tmzwh2eht94uyyr368wcz',page:1,size:10}}).then(res=>{
        this.recordlist = res.data
      })
    },
    getPoolInfo(){
      this.axios.get('/poolinfo').then(res=>{
        this.poolinfo = res.poolinfo
      })
    }
    
  },
  
  beforeDestroy(){

  }
}
</script>

<style lang="scss" scoped>
.cetdac-web-pool {
  max-width: 1200px;
  margin:0 auto;
  .status-bar{
    border-radius: 10px;
    background: #1c2129;
    color:white;
    display: flex;
    align-items: center;
    padding:20px;
    justify-content: space-between;
    .label{
      opacity: 0.6;
    }
  }
  .panel{
    max-width:100%;
    padding:0;
    .row{
      margin-right: 0;
      margin-left: 0; 
      justify-content: space-between;
    }
    .col{
      padding:0;
    }
    .left-panel{
      padding-right:10px;
    }
    .right-panel{
      padding-left:10px;
    }
    .subpanel {
      padding-top:20px;
      min-width: 600px;
      color:white;
      border-radius: 10px;

      .wrapper{
        background: #1c2129;
        padding:15px;
        display: flex;
        flex-direction: column;
        .tip{
          display: flex;
          justify-content: space-between;
        }
        .wrapper-content{
          flex: 1;
          color: #FFF;
          max-height: 350px;
          overflow-x: hidden;
          overflow-y: scroll;
        }
      }
    }
  }
  .invite-bar{
    height: 80px;
    padding:20px;
    border-radius: 10px;
    background: #1c2129;
    color:white;
  }
  .tx-panel{
    padding:20px;
    border-radius: 10px;
    background: #1c2129;
    color:white;
    .list-view{
      color: #FFF;
      .hash-text{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
    }
  }
}
</style>


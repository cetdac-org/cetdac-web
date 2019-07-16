<template>
  <div class="cetdac-web-index">
    <div class="description-title-line">尊贵的CET持币者: </div>
    <div class="description-line">CETDAC是一个去中心化自治社区，社区建立的使命是为了让所有CET持币人都可以参与到CET生态的建设中来，参与社区共建，同时领取回报，把区块链的去中心化优点发挥出来，目前CoinEx公链尚处于测试网阶段，CETDAC也处在早期，如果你是CET真核粉丝，请在下面把想对CET说的话写下来给我们，写下你对CET的第一个贡献，我们将会根据您提供意见的价值为您配发CoinEx Chain Dex上线后的第一个代币: CETDAC，以表达我们对您意见的重视。</div>
    <div class="description-end-line">CETDAC</div>
    <div class="message-line-wrapper">
      <div class="message-line">
        <b-form @submit="onSubmit">
          <b-form-group>
            <b-form-input
              size="lg"
              v-model="form.name"
              maxlength=20
              required
              placeholder="怎么称呼您"
            ></b-form-input>
          </b-form-group>
          <b-form-textarea
            size="lg"
            maxlength=400
            v-model="form.text"
            placeholder="想对CET说的话"
            rows="4"
            max-rows="4"
          ></b-form-textarea>
          <b-button @click="onConfirm" pill class="mt-20" size="lg" type="submit"  variant="primary">发送弹幕留言</b-button>
        </b-form>
      </div>
    </div>
    <!-- <div class="brand-title-line">
      社区成员
    </div>
    <div class="brand-line">
      <a href="https://www.coinex.org/" target="_blank"><img height="50" src="~/assets/imgs/coinex.svg" style="vertical-align: middle"></a>
      <a class="ml-40" href="https://www.purewallet.org/" style="vertical-align: middle"><img height="50" src="~/assets/imgs/purewallet.jpg" style="border-radius:10px;vertical-align: middle;"><img style="margin-left:20px;vertical-align: middle" height="30" src="~/assets/imgs/pure-text.svg"></a>
    </div> -->
  </div>
</template>
<script>
import Vue from "vue"
import { mapState } from "vuex"
import cookies from "~/plugins/cookies"

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
      bullet: true,
      form:{
        name:'',
        text:''
      }
    }
  },

  mounted(){
    const _this = this
    this.axios.get('/cetdac/',{
        withCredentials:false
      }).then(res=>{
        const loop = function () {
          for(let i=0;i<res.data.data.length;i++){
          let element = res.data.data[i], index = i
          let item= {
            index:index,
            info:element.name + ": " +element.content, //文字 
            close:false, //显示关闭按钮 
            speed:  12 + Math.random()*10,
            bottom: Math.random()* 500,
            old_ie_color:'#000000', //ie低版兼容色,不能与网页背景相同,默认黑色 
          };
          (function(item){
            setTimeout(()=>{
              $('body').barrager(item)
              if(item.index >= res.data.data.length - 1){
                if(_this.bullet) {
                  setTimeout(function(){
                    loop()
                  }, 15000)
                }
              }
            }, 1000 + Math.random() * 3000)
          })(item)
        }
      }
      loop() 
    })
  },

  methods:{
    onSubmit: function(evt){
      evt.preventDefault()
    },

    onConfirm: function(){
      const _this = this
        if(_this.form.name && _this.form.text){
        this.axios.post('/cetdac/', {
          name:_this.form.name,
          content: _this.form.text
        },{
          withCredentials:false
        }).then(res=>{
          _this.$store.commit('setSuccessText', '留言成功')
          $('body').barrager({info:_this.form.name + ': ' +_this.form.text, color: '#13cfb8'})
          _this.form = {
            name:'',
            text:''
          }
        }).catch(e=>{
          _this.$store.commit('setErrorText', e.message)
        })
      }
    }
  },
  
  beforeDestroy(){
    $.fn.barrager.removeAll()
    this.bullet = false
  }

  // async asyncData({ req, app, query, $axios }) {
  //   const ip = await $axios.$get('http://icanhazip.com')
  //   return {
  //     ip: ip
  //   }
  // },
}
</script>

<style lang="scss" scoped>
.cetdac-web-index {
  max-width: 1200px;
  min-height: 800px;
  margin:0 auto;
  padding: 15px;

  .description-title-line{
    margin-top: 60px;
    font-size: 20px;
    text-align: left;
  }
  .description-line{
    margin-top: 40px;
    font-size: 20px;
    text-align: left;
  }
  .description-end-line{
    margin-top: 40px;
    font-size: 16px;
    padding-right: 15px;
    text-align: right;
  }
  .message-title-line{
    font-size: 20px;
    text-align: center;
    margin-top: 40px;
  }
  .carousel-line{
     margin: 0 auto;
     margin-top: 40px;
     height: 300px;
  }
  .message-line-wrapper {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    .message-line {
      width: 600px;
    }
    .signature{
      font-size: 20px;
    }
  }
  
  .brand-title-line{
    text-align: center;
    font-size: 20px;
    margin-top: 60px;
  }
  .brand-line {
    text-align: center;
    margin-top: 40px;
  }
}
</style>


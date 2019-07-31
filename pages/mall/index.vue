<template>
  <div class="cetdac-web-mall">
    <b-card-group class="mt-30">
      <b-card
        title="CoinEx保温杯"
        img-src="/mall/cup.jpeg"
        img-alt="Image"
        img-top
        tag="article"
        style="max-width: 300px;"
        class="mb-10"
        >
        <b-card-text>
          CoinEx保温杯，可显示温度，炒币人必备的保温杯
        </b-card-text>
        <b-card-text class="text-muted">价格：1000 CET / 0.05 BCH</b-card-text>
        <b-button variant="primary" @click="buy">购买</b-button>
      </b-card>
    </b-card-group>
  </div>
</template>
<script>
import Vue from "vue"
import { mapState } from "vuex"

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
    }
  },

  mounted(){
  
  },

  methods:{
    buy: function(){

    }
  },
  
  beforeDestroy(){
  }
}
</script>

<style lang="scss" scoped>
.cetdac-web-mall {
  max-width: 1200px;
  margin:0 auto;
}
</style>


<template>
  <div class="cetdac-web-pool">
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
.cetdac-web-pool {
  max-width: 1200px;
  margin:0 auto;
}
</style>


<template>
    <div style="max-width:1200px;margin:0 auto;">
      <b-alert class="ta-c" variant="danger" dismissible v-if="errorText?true:false" :show="5" @dismissed="close">
          {{errorText}}
      </b-alert>
      <b-alert class="ta-c" variant="success" dismissible v-if="successText?true:false" :show="5" @dismissed="close">
          {{successText}}
      </b-alert>
    </div>
</template>

<script>
import { mapState } from "vuex"

export default {
  computed:mapState([
    "errorText",
    "successText"
  ]),
  methods:{
    close:function(){
      this.$store.commit("setErrorText",null)
      this.$store.commit("setSuccessText",null)
    }
  }
}
</script>
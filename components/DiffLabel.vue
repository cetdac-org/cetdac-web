<template>
  <div class='diff-label green-text' v-if="diff > 0">{{text}} <img class="icon-img" src="@/assets/imgs/icon_rise.svg"/> </div>
  <div class='diff-label red-text' v-else>{{text}} <img class="icon-img" src="@/assets/imgs/icon_rise3.svg"/> </div>
</template>

<style lang="scss">
  .diff-label {
    display: inline-block;
    font-weight: 500;
    font-family: "Chinese Quote", -apple-system, system-ui, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
  .green-text{
    color: green;
    .icon-img{
      width: 12px;
    }
  }
  .red-text{
    color: red;
    .icon-img{
      width: 12px;
      transform: rotate(180deg);
    }
  }
</style>

<script>
export default {
  name: 'DiffLabel',
  data(){
    return {
      text:''
    }
  },
  props: {
    diff: Number,
    formatter: Function,
    tag: {
      type: String,
      default: 'span'
    }
  },
  mounted(){
    const { diff, formatter } = this
    this.text = formatter ? formatter(Math.abs(diff)) : Math.abs(diff)
  },
  watch:{
    diff(){
      this.text = this.formatter ? this.formatter(Math.abs(this.diff)) : Math.abs(this.diff)
    }
  }
  
}
</script>

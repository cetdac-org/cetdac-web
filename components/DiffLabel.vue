<style lang="scss">
  .diff-label {
    font-weight: 500;
    font-family: "Chinese Quote", -apple-system, system-ui, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  }
  .green-text{
    color: green;
  }
  .red-text{
    color: red;
  }
</style>

<script>
export default {
  name: 'DiffLabel',
  props: {
    diff: Number,
    formatter: Function,
    tag: {
      type: String,
      default: 'span'
    }
  },
  render() {
    const { diff, formatter } = this
    const text = formatter ? formatter(Math.abs(diff)) : Math.abs(diff)

    if (diff > 0) return <span class='diff-label green-text'>{text} </span>
    if (diff < 0) return <span class='diff-label red-text'>{text} </span>
    return null
  }
}
</script>

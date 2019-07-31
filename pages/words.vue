<template>
  <div class="cetdac-web-words">
    <b-card-group class="mt-30" deck>
      <b-card
        overlay
        img-src="/haipo/0718-1.jpeg"
        img-width="600"
        img-alt="海坡语录"
        text-variant="dark"
        title="海坡语录 by 喵小思"
        sub-title="2019.07.18"
        >
      </b-card>
      <b-card
        overlay
        img-src="/haipo/0730.jpeg"
        img-width="600"
        img-alt="海坡语录"
        text-variant="dark"
        title="海坡语录 by 喵小思"
        sub-title="2019.07.30"
        >
      </b-card>
    </b-card-group>
    <b-card-group class="mt-30" deck>
      <b-card
        overlay
        img-src="/haipo/0715.jpeg"
        img-width="600"
        img-alt="海坡语录"
        text-variant="dark"
        title="海坡语录 by 喵小思"
        sub-title="2019.07.15"
        >
      </b-card>
      <b-card
        overlay
        img-src="/haipo/0718.jpeg"
        img-width="600"
        img-alt="海坡语录"
        text-variant="dark"
        title="海坡语录 by 浔"
        sub-title="2019.07.18"
        >
      </b-card>
    </b-card-group>
    <b-card-group class="mt-30" deck>
      <b-card
        overlay
        img-src="/haipo/0711-2.jpeg"
        img-width="600"
        img-alt="海坡语录"
        text-variant="dark"
        title="海坡语录 by 喵小思"
        sub-title="2019.07.11"
        >
      </b-card>
      <b-card
        overlay
        img-src="/haipo/0713.jpeg"
        img-width="600"
        img-alt="海坡语录"
        text-variant="dark"
        title="海坡语录 by 喵小思"
        sub-title="2019.07.13"
        >
      </b-card>
    </b-card-group>
    <b-card-group class="mt-30" deck>
      <b-card
        overlay
        img-src="/haipo/0710.jpeg"
        img-width="600"
        img-alt="海坡语录"
        text-variant="dark"
        title="海坡语录 by 浔"
        sub-title="2019.07.10"
        >
      </b-card>
      <b-card
        overlay
        img-src="/haipo/0711-1.jpeg"
        img-width="600"
        img-alt="海坡语录"
        text-variant="dark"
        title="海坡语录 by 喵小思"
        sub-title="2019.07.11"
        >
      </b-card>
    </b-card-group>
    <b-card-group class="mt-30" deck>
      <b-card
        overlay
        img-src="/haipo/0705-1.jpeg"
        img-width="600"
        img-alt="海坡语录"
        text-variant="dark"
        title="海坡语录 by 浔"
        sub-title="2019.07.05"
        >
      </b-card>
      <b-card
        overlay
        img-src="/haipo/0705-2.jpeg"
        img-width="600"
        img-alt="海坡语录"
        text-variant="dark"
        title="海坡语录 by 喵小思"
        sub-title="2019.07.05"
        >
      </b-card>
    </b-card-group>
    <b-card-group class="mt-30" deck>
      <b-card
        overlay
        img-src="/haipo/0703.jpeg"
        img-width="600"
        img-alt="海坡语录"
        text-variant="dark"
        title="海坡语录 by 喵小思"
        sub-title="2019.07.03"
        >
      </b-card>
      <b-card
        overlay
        img-src="/haipo/0704.jpeg"
        img-width="600"
        img-alt="海坡语录"
        text-variant="dark"
        title="海坡语录 by 喵小思"
        sub-title="2019.07.04"
        >
      </b-card>
    </b-card-group>
    <b-card-group class="mt-30" deck>
      <b-card
        overlay
        img-src="/haipo/0629.jpeg"
        img-width="600"
        img-alt="海坡语录"
        text-variant="dark"
        title="海坡语录 by 喵小思"
        sub-title="2019.06.29"
        >
      </b-card>
      <b-card
        overlay
        img-src="/haipo/0702.jpeg"
        img-width="600"
        img-alt="海坡语录"
        text-variant="dark"
        title="海坡语录 by 喵小思"
        sub-title="2019.07.02"
        >
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

  },
  
  beforeDestroy(){
  }
}
</script>

<style lang="scss" scoped>
.cetdac-web-words {
  max-width: 1200px;
  margin:0 auto;
}
</style>


<template>
  <b-modal centered ref="tips-modal" class="modal">
    <b-card
      title="Card Title"
      class="mb-2"
    >
      <b-card-text class="modal-text-info">
        Some quick example text to build on the card title and make up the bulk of the card's content.
      </b-card-text>
    </b-card>
    <template slot="modal-footer" slot-scope="{cancel}">
      <b-button size="sm" @click="cancel()">
        Cancel
      </b-button>
    </template>
  </b-modal>
</template>

<script>
export default {
  methods:{
    showModal(type){
      this.$refs['tips-modal'].show()
    }
  }
}
</script>
<style lang="scss" scoped>
.modal{
  .modal-text-info{
    color: #000;
  }
}

</style>



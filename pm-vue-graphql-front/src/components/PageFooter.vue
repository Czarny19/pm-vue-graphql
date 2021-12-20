<template>
  <v-footer v-if="visible" app bottom fixed padless height="80">
    <div class="text-left pt-2 pl-4 pr-4" v-html="$t('footer')"/>
    <v-spacer></v-spacer>
    <v-btn class="mr-8" color="accent" @click="hide">{{ $t('common.close') }}</v-btn>
  </v-footer>
</template>

<script>
export default {
  name: 'PageFooter',
  data() {
    return {
      visible: false
    }
  },
  methods: {
    hide() {
      this.visible = false
    }
  }
}
</script>

<style scoped>

</style>
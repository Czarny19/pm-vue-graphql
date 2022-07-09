<template>
  <div/>
</template>

<script>
export default {
  name: 'WidgetHelper',
  props: {
    widget: Object
  },
  data() {
    return {}
  },
  computed: {
    groups() {
      return this.widget ? this.widget.propGroups : []
    },
    cssProps() {
      let props = []
      this.groups.forEach((group) => props = props.concat(group.props))
      return props
    },
    cssPropsComputed() {
      return this.cssProps.map((prop) => {
        return {[prop.id]: prop.value}
      })
    }
  },
  methods: {
    setActive(widget) {
      this.$emit('setActive', widget)
    }
  }
}
</script>

<style scoped>

</style>
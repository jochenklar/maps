<template>
  <Navbar :maps="maps" :map="map" @changeMap="changeMap" @changeCenter="changeCenter"/>
  <Map :map="map" :center="center" :zoom="zoom" />
</template>

<script>
  import Map from './components/Map.vue'
  import Navbar from './components/Navbar.vue'

  export default {
    name: 'App',
    data() {
      return {
        maps: this.$config.maps,
        map: this.$config.maps[0],
        center: this.$config.view.center,
        zoom: this.$config.view.zoom
      }
    },
    components: {
      Map,
      Navbar
    },
    methods: {
      changeMap(index) {
        this.map = this.maps[index]
      },
      changeCenter(center) {
        this.center = center
      }
    }
  }
</script>

<style lang="scss">
  html,
  body {
    margin: 0;
    padding: 0;
  }
  .app {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }
</style>

<template>
  <Navbar :maps="maps" :currentView="currentView" :currentMap="currentMap" @changeMap="changeMap" />
  <Map :currentView="currentView" :currentMap="currentMap" />
</template>

<script>
  import Map from './components/Map.vue'
  import Navbar from './components/Navbar.vue'

  export default {
    name: 'App',
    data() {
      return {
        maps: this.$config.maps,
        currentView: this.$config.view,
        currentMap: this.$config.maps[0],
      }
    },
    components: {
      Map,
      Navbar
    },
    methods: {
      changeMap(index) {
        this.currentMap = this.maps[index]
      }
    }
  }
</script>

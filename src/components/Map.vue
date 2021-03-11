<template>
  <div id="map"></div>
</template>

<script>
  import "leaflet/dist/leaflet.css";
  import L from "leaflet";

  export default {
    name: 'Map',
    props: {
      currentView: Object,
      currentMap: Object
    },
    data() {
      return {
        map: null
      }
    },
    methods: {
      setupLeafletMap: function () {
        if (this.map === null) {
          this.map = L.map("map")
          this.map.setView(this.currentView.center, this.currentView.zoom)
        }

        L.tileLayer(this.currentMap.url, this.currentMap.options).addTo(this.map)
      }
    },
    watch: {
      currentMap() {
        this.setupLeafletMap()
      }
    },
    mounted() {
      this.setupLeafletMap()
    }
  }
</script>

<style scoped>
  #map {
    position: absolute;
    width: 100%;
    top: 55px;
    bottom: 0;
  }
</style>

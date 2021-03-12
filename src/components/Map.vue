<template>
  <div id="map"></div>
</template>

<script>
  import 'leaflet/dist/leaflet.css'
  import L from 'leaflet'

  export default {
    name: 'Map',
    props: {
      map: Object,
      center: Array,
      zoom: Number
    },
    data() {
      return {
        leafletMap: null
      }
    },
    methods: {
      setupLeafletMap: function() {
        this.leafletMap = L.map('map')
        this.changeView()
        this.changeMap()
      },
      changeMap: function() {
        L.tileLayer(this.map.url, this.map.options).addTo(this.leafletMap)
      },
      changeView: function() {
        this.leafletMap.setView(this.center, this.zoom)
      }
    },
    watch: {
      map() {
        this.changeMap()
      },
      center() {
        this.changeView()
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
    top: 40px;
    bottom: 0;
  }
</style>

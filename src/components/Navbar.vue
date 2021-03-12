<template>
  <nav>
    <select v-model="currentMapIndex" @update="changeMap(index)">
      <option v-for="(map, index) in maps" :key="index" :value="index">
        {{ map.name }}
      </option>
    </select>

    <form @submit.prevent="searchLocation()">
      <input type="search" placeholder="Search address" v-model="searchString" />
    </form>
  </nav>
</template>

<script>
  export default {
    name: 'Navbar',
    props: {
      maps: Array,
      map: Object
    },
    data() {
      return {
        currentMapIndex: this.maps.indexOf(this.map),
        searchString: ''
      }
    },
    watch: {
      currentMapIndex: function(index) {
        this.$emit('changeMap', index)
      }
    },
    methods: {
      searchLocation: function() {
        if (this.searchString) {
          const url = 'https://nominatim.openstreetmap.org/search?format=json&q=Berlin ' + encodeURIComponent(this.searchString)
          fetch(url)
            .then(response => response.json())
            .then(json => {
              if (json.length > 0) {
                this.$emit('changeCenter', [json[0].lat, json[0].lon])
              }
            })
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  nav {
    background-color: black;
    color: white;

    display: flex;
    align-items: center;
    justify-content: space-between;

    height: 40px;

    padding: 0 10px;

    .nav-left {
      display: flex;
      align-items: center;

      .brand {
        display: block;
        line-height: 20px;
        margin-right: 20px;
      }
    }

    select {
      background-color: white;
    }

    input[type="search"] {
      width: 400px;
    }

    select,
    input[type="search"] {
      padding-left: 4px;
      margin: 0;
      height: 24px;
      border: none;

      &:focus {
        outline: none;
      }
    }
  }
</style>

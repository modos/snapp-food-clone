<template>
  <v-container fill-height fluid class="py-6">
    <v-row align="center" justify="center">
      <v-card width="40%">
        <v-card-title class="d-flex justify-center">ورود مشتری</v-card-title>

        <div id="map" class="map"></div>
        <h3 class="my-3 mx-3">{{district}}</h3>

        <v-form class="px-6">
          <v-text-field label="شماره موبایل" v-model="mobile"></v-text-field>
          <v-text-field
            :rules="[rules.required, rules.min, rules.hasNumber]"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            label="رمز عبور"
            v-model="password"
            @click:append="show1 = !show1"
          ></v-text-field>
          <v-text-field label="نام" v-model="name"></v-text-field>
          <v-text-field label="آدرس" v-model="address"></v-text-field>
          <v-card-actions>
            <v-btn color="success" @click="submit">ورود</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import geo from "../assets/geo.json"

var hasNumber = /\d/;
export default {
  map: '',
  name: "Login",
  mounted() {
    this.initMap()
  },
  data() {
    return {
      show1: false,
      mobile: "",
      password: "",
      rules: {
        required: (value) => !!value || "اجباری",
        min: (v) => v.length >= 8 || " حداقل 8 کارکتر",
        hasNumber: (v) => hasNumber.test(v) || "باید حاوی عدد باشد",
      },
      address: "",
      district: "منطقه خودتان را روی نقشه مشخص کنید",
      name: ""
    };
  },
  methods: {
    onEachFeature(feature, layer) {
      if (feature.properties && feature.properties.name) {
        
        layer.bindPopup(feature.properties.name)
        layer.on('mouseover', () => { layer.openPopup() })
        layer.on('mouseout', () => { layer.closePopup() })
        layer.on('click', ()  => {this.district = feature.properties.name});
      }
   },
    initMap() {
  let map = L.map('map', {
    center: [35.715298, 51.404343],
    zoom: 10
});
L.tileLayer(
       "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibW9kb3NhbSIsImEiOiJja3Ezc3Y2b3UwZ24wMm5vNmxzb2dsaXVmIn0.d91AwhSxpvxChVI7PsyFew",
       {
         attribution:
           'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
         maxZoom: 18,
         id: "mapbox/streets-v11",
         accessToken:"pk.eyJ1IjoibW9kb3NhbSIsImEiOiJja3Ezc3Y2b3UwZ24wMm5vNmxzb2dsaXVmIn0.d91AwhSxpvxChVI7PsyFew",
       }
     ).addTo(map);
      L.geoJSON(geo, {onEachFeature: this.onEachFeature}).addTo(map);
    },
    submit() {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.name,
          mobile: this.mobile,
          district: this.district,
          address: this.address,
          password: this.password
        })
      }
      fetch('http://localhost:3000/client/register', requestOptions)
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                localStorage.setItem('name', this.name)
                localStorage.setItem('mobile', this.mobile)
                localStorage.setItem('district', this.district)
                localStorage.setItem('address', this.address)
                localStorage.setItem('password', this.password)
                localStorage.setItem('property', data.property)
                this.$router.push({ name: 'Dashboard', params: { id: data.id } })
        }})
    }
  }
}
</script>

<style>
* {
  font-family: "Yekan";
}

.map {
  height: 500px;
}
</style>

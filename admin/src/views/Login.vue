<template>
  <v-container fill-height fluid class="py-6">
    <v-row align="center" justify="center">
      <v-card width="40%">

        <v-card-title class="d-flex justify-center">ورود مدیر</v-card-title>
        <h4>مناطقی که سرویس می دهید را مشخص کنید:</h4>
         <div id="map" class="map"></div>
         <h3 class="my-3 mx-3">{{service_d}}</h3>
        <v-form class="px-6">
          <v-text-field label="ایمیل" v-model="email"></v-text-field>
          <v-text-field
            :rules="[rules.required, rules.min, rules.hasNumber]"
            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show1 ? 'text' : 'password'"
            label="رمز عبور"
            v-model="password"
            @click:append="show1 = !show1"
          ></v-text-field>
          <v-text-field label="نام رستوران" v-model="restaurant"></v-text-field>
          <v-text-field
            label="منطقه ی رستوران"
            v-model="restaurant_d"
          ></v-text-field>
          <v-text-field label="آدرس" v-model="address"></v-text-field>
          <v-text-field label="ساعت شروع" v-model="open_time"></v-text-field>
          <v-text-field label="ساعت پایان" v-model="close_time"></v-text-field>
          <v-text-field
            label="زمان ثابت ارسال"
            v-model="fixed_time"
          ></v-text-field>
          <v-text-field
            label="هزینه ی ثابت ارسال"
            v-model="fixed_cost"
          ></v-text-field>
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
  name: "Login",
  mounted() {
    this.initMap()
  },
  data() {
    return {
      show1: false,
      email: "",
      password: "",
      rules: {
        required: (value) => !!value || "اجباری",
        min: (v) => v.length >= 8 || " حداقل 8 کارکتر",
        hasNumber: (v) => hasNumber.test(v) || "باید حاوی عدد باشد",
      },
      restaurant: "",
      restaurant_d: "",
      address: "",
      service_d: [],
      open_time: "",
      close_time: "",
      fixed_time: "",
      fixed_cost: "",
    };
  },
  methods: {
     onEachFeature(feature, layer) {
      if (feature.properties && feature.properties.name) {
        
        layer.bindPopup(feature.properties.name)
        layer.on('mouseover', () => { layer.openPopup() })
        layer.on('mouseout', () => { layer.closePopup() })
        layer.on('click', ()  => {this.service_d.push(feature.properties.name)});
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
        body: JSON.stringify({ 	restaurant_name: this.restaurant,
	restaurant_district: this.restaurant_d,
	address: this.address,
	service_districts: this.service_d, 
	openning_hour: this.open_time, 
	closing_hour: this.close_time,
	fixed_cost: this.fixed_cost,
	fixed_time: this.fixed_time,
	password: this.password,
	email: this.email })
      }
      fetch('http://localhost:3000/admin/register', requestOptions)
        .then((response) => response.json())
        .then((data) => {
            if (data) {
              localStorage.setItem('name', this.restaurant)
              localStorage.setItem('email', this.email)
              localStorage.setItem('password', this.password)
              localStorage.setItem('fixed_time', this.fixed_time)
              localStorage.setItem('fixed_cost', this.fixed_cost)
              localStorage.setItem('closing_hour', this.close_time)
              localStorage.setItem('openning_hour', this.open_time)
              localStorage.setItem('service_districts', this.service_d)
              localStorage.setItem('address', this.address)
              localStorage.setItem('restaurant_district', this.restaurant_d)
                this.$router.push({ name: 'Dashboard', params: { id: data } })
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

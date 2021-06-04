<template>
  <v-container fill-height fluid class="py-6">
    <v-row align="center" justify="center">
      <v-card width="40%">
        <v-card-title class="d-flex justify-center">ورود مدیر</v-card-title>
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
          <v-text-field
            label="مناطق سرویس دهی"
            v-model="service_d"
          ></v-text-field>
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
var hasNumber = /\d/;
export default {
  name: "Login",
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
      service_d: "",
      open_time: "",
      close_time: "",
      fixed_time: "",
      fixed_cost: "",
    };
  },
  methods: {
    submit() {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 	restaurant_name: this.restaurant,
	restaurant_district: this.restaurant_d,
	address: this.address,
	service_districts: this.service_d.split(","), 
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
                this.$router.push({ name: 'About', params: { id: data } })
        }})
    }
  }
}
</script>

<style>
* {
  font-family: "Yekan";
}
</style>

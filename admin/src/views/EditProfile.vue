<template>
  <v-container fill-height fluid class="py-6">
    <v-row align="center" justify="center">
      <v-card width="40%">
        <v-card-title class="d-flex justify-center">ویرایش مدیر</v-card-title>
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
            <v-btn color="success" @click="submit">ثبت تغییرات</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-row>

<v-alert class=" mt-12 success white--text" v-model="success">تغییرات با موفقیت انجام شد</v-alert>

  </v-container>
</template>

<script>
var hasNumber = /\d/;
export default {
  name: "EditProfile",
  data() {
    return {
      show1: false,
      success: false,
      email: localStorage.getItem('email'),
      password: localStorage.getItem('password'),
      rules: {
        required: (value) => !!value || "اجباری",
        min: (v) => v.length >= 8 || " حداقل 8 کارکتر",
        hasNumber: (v) => hasNumber.test(v) || "باید حاوی عدد باشد",
      },
      restaurant: localStorage.getItem('name'),
      restaurant_d: localStorage.getItem('restaurant_district'),
      address: localStorage.getItem('address'),
      service_d: localStorage.getItem('service_districts'),
      open_time: localStorage.getItem('openning_hour'),
      close_time: localStorage.getItem('closing_hour'),
      fixed_time: localStorage.getItem('fixed_time'),
      fixed_cost: localStorage.getItem('fixed_cost'),
    };
  },
  methods: {
    submit() {
      const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
    id: this.$route.params.id,
    restaurant_name: this.restaurant,
	restaurant_district: this.restaurant_d,
	address: this.address,
	service_districts: this.service_d.split(","), 
	openning_hour: this.open_time, 
	closing_hour: this.close_time,
	fixed_cost: this.fixed_cost,
	fixed_time: this.fixed_time,
	password: this.password,
	email: this.email})
      }
      fetch('http://localhost:3000/admin/updateprofile', requestOptions)
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
              this.success = true
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

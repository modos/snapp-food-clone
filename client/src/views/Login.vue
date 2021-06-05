<template>
  <v-container fill-height fluid class="py-6">
    <v-row align="center" justify="center">
      <v-card width="40%">
        <v-card-title class="d-flex justify-center">ورود مشتری</v-card-title>
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
          <v-text-field label="منطقه" v-model="district"></v-text-field>
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
var hasNumber = /\d/;
export default {
  name: "Login",
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
      district: "",
      name: ""
    };
  },
  methods: {
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
</style>

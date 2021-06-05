<template>

        <v-container fill-height fluid class="py-6">
    <v-row align="center" justify="center">
      <v-card width="40%">
        <v-card-title class="d-flex justify-center">ویرایش پروفایل</v-card-title>
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
            <v-btn color="success" @click="submit">ثبت تغییرات</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>

    </v-row>

     <v-alert class="mt-12 success white--text" v-model="success">
        تغییرات با موفقیت ثبت شد
    </v-alert>
    </v-container>
</template>
<script>
    var hasNumber = /\d/;
export default {

    data(){
        return {
            success: false,
            show1: false,
            rules: {
        required: (value) => !!value || "اجباری",
        min: (v) => v.length >= 8 || " حداقل 8 کارکتر",
        hasNumber: (v) => hasNumber.test(v) || "باید حاوی عدد باشد",
      },
            name: localStorage.getItem('name'),
            mobile: localStorage.getItem('mobile'),
            password: localStorage.getItem('password'),
            district: localStorage.getItem('district'),
            address: localStorage.getItem('address')
        }
    },
    methods: {
        async submit() {
            localStorage.setItem('name', this.name)
            localStorage.setItem('mobile', this.mobile)
            localStorage.setItem('password', this.password)
            localStorage.setItem('district', this.district)
            localStorage.setItem('address', this.address)

             const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: this.name,
          mobile: this.mobile,
          password: this.password,
          district: this.district,
          address: this.address,
          id: this.$route.params.id
        })
      }
         let response = await fetch('http://localhost:3000/client/updateprofile', requestOptions)
         if (response.status === 200){
             this.success = true
         }


        }
    }
}
</script>

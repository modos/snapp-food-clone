<template>
  <v-container>
    <v-container>
      <h1>{{res_dist}}</h1>
    </v-container>
    <v-col cols="6" offset="3">
      <v-text-field label="نام غذا" v-model="name"></v-text-field>
      <v-text-field label="قیمت" v-model="price"></v-text-field>
      <v-btn color="success" @click="submit">افزودن به منو</v-btn>
      <v-alert type="success" v-model="success" class="my-12">غذای مورد نظر با موفقیت در منو ثبت شد</v-alert>
    </v-col>
  </v-container>
</template>

<script>
export default {
  async created() {
      let id = this.$route.params.id
      let res = await fetch(`http://localhost:3000/admin/findNameAndDistrcitsById/${id}`)
      res = await res.json()
      this.res_name = res.restaurant_name
      this.res_dist = res.service_districts

  },
    data(){
        return {
            id : this.$route.params.id,
            name: '',
            price: '',
            success: false,
            res_name: '',
            res_dist: []
        }
    },
    methods: {
        submit() {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                owner_id: this.id,
                name: this.name,
                price: this.price,
                restaurant_name: this.res_name,
                districts: this.res_dist
            })}
            fetch('http://localhost:3000/admin/createFood', requestOptions)
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                this.success = true
        }}
        )
        }
    }
}
</script>
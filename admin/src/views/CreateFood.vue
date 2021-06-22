<template>
  <div>
    <v-container>
    <v-col cols="6" offset="3">
      <v-text-field label="نام غذا" v-model="name"></v-text-field>
      <v-text-field label="قیمت" v-model="price"></v-text-field>
      <v-btn color="success" @click="submit">افزودن به منو</v-btn>
      <v-alert type="success" v-model="success" class="my-12">غذای مورد نظر با موفقیت در منو ثبت شد</v-alert>
    </v-col>

  </v-container>

<center>
  <v-container>
      <h3 class="my-12">لیست غذاهای شما</h3>
</v-container>
</center>

 <v-col cols="8" offset="2" class="mt-12">
          <v-list two-line>
        <template v-for="(item, index) in foods">
          <v-list-item :key="item.id">
            <template>
              <v-list-item-content>
                <v-list-item-title>نام غذا: {{item.name}}</v-list-item-title>
                <v-list-item-subtitle>شناسه غذا ها: {{item.id}}</v-list-item-subtitle>
                <v-list-item-subtitle>قیمت: {{item.price}}</v-list-item-subtitle>
                <v-list-item-subtitle>وضعیت: {{showstatus(item.status)}}</v-list-item-subtitle>
                <v-list-item-action>
                   <v-row class="mt-12" align="center" justify="center">
                    <v-btn color="error" @click="deleteFood(item.id)">حذف</v-btn>
                    <v-btn color="warning" class="mr-2" @click="disableFood(item.id)" >غیر قابل سفارش</v-btn>
                   </v-row>
                </v-list-item-action>
              </v-list-item-content>
            </template>
          </v-list-item>

          <v-divider
            v-if="index < foods.length - 1"
            :key="index"
          ></v-divider>
        </template>
    </v-list>
     </v-col>

  </div>
</template>

<script>
export default {
  async created() {

      let id = this.$route.params.id
      let res = await fetch(`http://localhost:3000/admin/findNameAndDistrcitsById/${id}`)
      res = await res.json()
      this.res_name = res.restaurant_name
      this.res_dist = res.service_districts

      let res2 = await fetch(`http://localhost:3000/admin/foods/${id}`)
      let foods = await res2.json()
      this.foods = foods
  },
    data(){
        return {
            id : this.$route.params.id,
            foods: [],
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
                delivery_cost: localStorage.getItem('fixed_cost'),
                time: localStorage.getItem('fixed_time'),
                districts: this.res_dist
            })}
            fetch('http://localhost:3000/admin/createFood', requestOptions)
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                this.success = true
                
            this.updateList()
                
      
        }}
        )
        },
        async updateList() {
          let id = this.$route.params.id
let res2 = await fetch(`http://localhost:3000/admin/foods/${id}`)
      let foods = await res2.json()
      this.foods = foods
        },
        showstatus(status) {
                let s = "";
                switch (status) {
                    case 0:
                        s = "غیر قابل سفارش"
                        break;
                    case 1:
                        s = "قابل سفارش"
                        break;      
                    default:
                        break;
                }

                return s
        },
        async deleteFood(id){
              const requestOptions = {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: id
            })}

            let res = await fetch('http://localhost:3000/admin/deleteFood', requestOptions)
            if (res.status === 200){
              this.updateList()
            }
        },
        async disableFood(id){
              const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  status: 0,
                    id: id
            })}

            let res = await fetch('http://localhost:3000/admin/updateFood', requestOptions)
            if (res.status === 200){
              this.updateList()
            }
        },
    }
}
</script>
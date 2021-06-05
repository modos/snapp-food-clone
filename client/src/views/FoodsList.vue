<template>

  <v-container>
     
    <v-col cols="8" offset="2">
         <h1>موجودی شما: {{property}} تومان</h1>
        <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="جستجو"
        single-line
        hide-details

        class="my-12"
      ></v-text-field>
          <v-data-table 
          v-model="selected"
    :headers="headers"
    :items="foods"
    :search="search"
            item-key="id"
        show-select
    hide-default-footer
    class="elevation-1 mb-12"
  ></v-data-table>

  <h1>سبد خرید شما:</h1>

    <ul class="mb-12">
  <li v-for="item in selected" :key="item.id">
    {{ item.name }} - {{item.price}} تومان
  </li>
</ul>


<h2>کل هزینه: {{allcost}}</h2>

<v-btn class="success mt-12" @click="submit">ثبت سفارش</v-btn>

<v-alert class="mt-12" v-model="success"
  type="success"
>سفارش شما با موفقیت ثبت شد</v-alert>
    </v-col>
  </v-container>
</template>

<script>
export default {
    async created() {
        const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          district: localStorage.getItem('district'),
        })
      }
         let response = await fetch('http://localhost:3000/client/allfoods', requestOptions)
         let foods = await response.json() 
         this.foods = foods
    },
    mounted (){
        this.property = localStorage.getItem('property')
    },
    data() {
        return {
            success: false,
            selected_id: [],
            selected: [],
            property: '',
            search: '',
            foods: [],
            headers: [
                {
                    text: 'نام غذا', value: 'name'
                },{
                    text: 'قیمت', value: 'price'
                },{
                    text: 'شناسه رستوران', value: 'owner_id'
                },{
                    text: 'نام رستوران', value: 'restaurant_name'
                },
                {
                    text: 'شناسه غذا', value: 'id'
                },
                {
                    text: 'هزینه ارسال', value: 'delivery_cost'
                },
                {
                    text: 'زمان ارسال', value: 'time'
                }
            ],
        }
    },
    computed: {
    allcost: function () {
        let cost = 0
        for (let index = 0; index < this.selected.length; index++) {
            cost += this.selected[index].price + this.selected[index].delivery_cost;
            this.selected_id.push(this.selected[index].id)
            
        }
      return cost
    }
  },
  methods: {
      async submit() {
           const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: this.$route.params.id,
          restaurant_id: this.selected[0].owner_id,
          foods_id: [...new Set(this.selected_id)],
          price: this.allcost,
          status: 1
        })
      }
         let response = await fetch('http://localhost:3000/client/order', requestOptions)
         if (response.status === 200){
             let newProperty = this.property - this.allcost
             this.property = newProperty
             localStorage.setItem('property', newProperty)
             this.success = true
         }
      }
  }

}
</script>
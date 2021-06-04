<template>

  <v-container>
    <v-container>
      <h1>{{ id }}</h1>
    </v-container>
    <v-col cols="6" offset="3">
        <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="جستجو"
        single-line
        hide-details
        class="my-12"
      ></v-text-field>
          <v-data-table
    :headers="headers"
    :items="foods"
    :search="search"
    hide-default-footer
    class="elevation-1"
  ></v-data-table>
    </v-col>
  </v-container>
</template>

<script>
export default {
    async created() {
         let response = await fetch('http://localhost:3000/client/allfoods')
         let foods = await response.json() 
         this.foods = foods
    },
    data() {
        return {
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
                },{
                    text: 'منطقه ها', value: 'districts'
                }
            ],
        }
    }

}
</script>
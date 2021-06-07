<template>
     <v-col cols="8" offset="2">
          <v-list two-line>
        <template v-for="(item, index) in history">
          <v-list-item :key="item.id">
            <template>
              <v-list-item-content>
                  <center>
                      <v-rating
  color="red"
  empty-icon="mdi-heart-outline"
  full-icon="mdi-heart"
  half-icon="mdi-heart-half-full"
  hover
  length="5"
  size="20"
  :id="item.id"
  @input="addRating($event, item.id)"
></v-rating>
                  </center>
                <v-list-item-title>نام غذا: {{item.name}}</v-list-item-title>
                <v-list-item-subtitle>نام رستوران: {{item.restaurant_name}}</v-list-item-subtitle>
                <v-list-item-subtitle>قیمت: {{item.price}}</v-list-item-subtitle>
                <v-list-item-action>
                   <v-row class="mt-12" align="center" justify="center">
                    <v-btn color="success"> درحال آماده سازی</v-btn>
                    <v-btn color="primary" class="mr-2" >در حال ارسال توسط پیک</v-btn>
                    <v-btn color="warning" class="mr-2" >تحویل داده شده</v-btn>
                   </v-row>
                </v-list-item-action>
              </v-list-item-content>
            </template>
          </v-list-item>

          <v-divider
            v-if="index < history.length - 1"
            :key="index"
          ></v-divider>
        </template>
    </v-list>
     </v-col>
</template>

<script>
export default {
    async created(){
        const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: this.$route.params.id
            })}

            let res = await fetch('http://localhost:3000/client/history', requestOptions)
            res = await res.json()
            this.history = res

    },

    data() {
        return {
            history: [],
            rating: 0
        }
    },
    methods: {
    async addRating(value, id) {
      const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: parseInt(id),
                    rate: parseInt(value)
            })}

       let res = await  fetch('http://localhost:3000/client/ratefood', requestOptions)
       
    }
  }
}
</script>
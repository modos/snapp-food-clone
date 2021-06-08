<template>
     <v-col cols="8" offset="2">
       <center>
         <v-alert
      v-model="alert"
      border="left"
      color="red"
      dark
      dismissible
    >
     شما قبلا برای این غذا نظر داده اید.
    </v-alert>
       </center>
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
                
                <center>
                  <div style="max-width:50%;" class="mt-12">
                  <v-text-field
                  placeholder="نظر دهید"
                  @input="commentText($event, item.id)"
                  >
                  </v-text-field>
                </div>
                </center>
                <v-list-item-action>
                   <v-row class="mt-12" align="center" justify="center">
                    <v-btn color="primary" @click="submit(item)">ثبت نظر</v-btn>
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
            rating: 0,
            content: "",
            food_id: '',
            alert: false
        }
    },
    methods: {
    async addRating(value, id) {  
      this.food_id = parseInt(id);
      this.rating = parseInt(value)  
    },

    async commentText(value, id) {
      this.content = value
    },
    
    async submit(item){
      const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: this.$route.params.id,
                    content: this.content,
                    rate: this.rating,
                    food_id: this.food_id,
                    res_id: item.owner_id
            })}

       let res = await  fetch('http://localhost:3000/client/comment', requestOptions)

       if (res.status !== 200){
         this.alert = true;
       }
    }
  }
}
</script>
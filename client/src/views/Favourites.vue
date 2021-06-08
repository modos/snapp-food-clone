<template>
<v-col cols="8" offset="2">
     <v-list two-line>
        <template v-for="(item, index) in favourites">
          <v-list-item :key="item.id">
            <template>
              <v-list-item-content>
                <v-list-item-title>نام غذا: {{item.name}}</v-list-item-title>
                <v-list-item-subtitle>نام رستوران: {{item.restaurant_name}}</v-list-item-subtitle>
                <v-list-item-subtitle>قیمت: {{item.price}}</v-list-item-subtitle>
                
              </v-list-item-content>
            </template>
          </v-list-item>

          <v-divider
            v-if="index < favourites.length - 1"
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

           try {
                let res = await fetch('http://localhost:3000/client/fav', requestOptions)
            res = await res.json()
            this.favourites = res
           } catch (error) {
               console.log(error)
           }

    },

    data() {
        return {
            favourites: [],
        }
    },
}
</script>
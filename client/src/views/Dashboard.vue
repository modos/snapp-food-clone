<template>

<div>
            <Navigation></Navigation>

           <v-container v-if="this.$route.path === `/dashboard/${this.$route.params.id}`">
              <h1>{{name}} خوش آمدید</h1>
           </v-container>
           <v-col cols="8" offset="2" v-if="this.$route.path === `/dashboard/${this.$route.params.id}`">
          <v-list two-line>
        <template v-for="(item, index) in orders">
          <v-list-item :key="item.id">
            <template>
              <v-list-item-content>
                <v-list-item-subtitle>شناسه غذا ها: {{item.foods_id}}</v-list-item-subtitle>
                <v-list-item-subtitle>وضعیت: {{showstatus(item.status)}}</v-list-item-subtitle>
              </v-list-item-content>
            </template>
          </v-list-item>

          <v-divider
            v-if="index < orders.length - 1"
            :key="index"
          ></v-divider>
        </template>
    </v-list>
     </v-col>
      <router-view/>
</div>

</template>

<script>
import  Navigation  from "../components/Navigation";
export default {
components: {
     Navigation,
 },

  async created () {
    let response = await fetch(`http://localhost:3000/client/getorders/${this.$route.params.id}`)
    let orders = await response.json()
    this.orders = orders
  },
  data (){
    return {
      id: this.$route.params.id,
      name: localStorage.getItem('name'),
      orders: []
    }
  },
   methods: {
        showstatus(status) {
                let s = "";
                switch (status) {
                    case 0:
                        s = "در انتظار تائید"
                        break;
                    case 1:
                        s = "در حال آماده  سازی"
                        break;

                    case 2:
                        s = "در حال ارسال توسط پیک"  
                        break;
                    case 3:
                        s = "تحویل داده شده"
                        break;      
                    default:
                        break;
                }

                return s
        },
}}
</script>


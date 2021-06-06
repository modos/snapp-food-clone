<template>
     <v-col cols="8" offset="2">
          <v-list two-line>
        <template v-for="(item, index) in orders">
          <v-list-item :key="item.id">
            <template>
              <v-list-item-content>
                <v-list-item-title>شناسه مشتری: {{item.client_id}}</v-list-item-title>
                <v-list-item-subtitle>شناسه غذا ها: {{item.foods_id}}</v-list-item-subtitle>
                <v-list-item-subtitle>وضعیت: {{showstatus(item.status)}}</v-list-item-subtitle>
                <v-list-item-action>
                   <v-row class="mt-12" align="center" justify="center">
                    <v-btn color="success" @click="preparing(item)">درحال آماده سازی</v-btn>
                    <v-btn color="primary" class="mr-2" @click="sending(item)">در حال ارسال توسط پیک</v-btn>
                    <v-btn color="warning" class="mr-2" @click="recieved(item)">تحویل داده شده</v-btn>
                   </v-row>
                </v-list-item-action>
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
</template>

<script>
export default {
    async created(){
        let response = await fetch(`http://localhost:3000/admin/orders/${this.$route.params.id}`)
        let orders = await response.json()
        this.orders = orders
    },
    data() {
        return {
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
        preparing(item){
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 1,
                    id: item.id
            })}
            fetch('http://localhost:3000/admin/checkorder', requestOptions)
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                let index = this.orders.findIndex((v) => v.id === item.id)
                //this.$delete(this.orders,indexForRemove)
                this.orders[index].status = 1
        }}
        )},
        sending(item){
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 2,
                    id: item.id
            })}
            fetch('http://localhost:3000/admin/checkorder', requestOptions)
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                let index = this.orders.findIndex((v) => v.id === item.id)
                //this.$delete(this.orders,indexForRemove)
                this.orders[index].status = 2
        }}
        )},
        recieved(item){
            const requestOptions = {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 3,
                    id: item.id
            })}
            fetch('http://localhost:3000/admin/checkorder', requestOptions)
        .then((response) => response.json())
        .then((data) => {
            if (data) {
                let index = this.orders.findIndex((v) => v.id === item.id)
                //this.$delete(this.orders,indexForRemove)
                this.orders[index].status = 3
        }}
        )
        }
    },

}
</script>
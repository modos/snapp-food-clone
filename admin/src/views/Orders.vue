<template>
     <v-col cols="8" offset="2">
          <v-list two-line>
        <template v-for="(item, index) in orders">
          <v-list-item :key="item.id">
            <template>
              <v-list-item-content>
                <v-list-item-title>شناسه مشتری: {{item.client_id}}</v-list-item-title>
                <v-list-item-subtitle>شناسه غذا ها: {{item.foods_id}}</v-list-item-subtitle>
                <v-list-item-action>
                   <v-row class="mt-12" align="center" justify="center">
                        <v-btn class="ml-2" color="error" @click="reject(item)">رد</v-btn>
                    <v-btn color="success" @click="accept(item)">پذیرش</v-btn>
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
        accept(item){
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
                let indexForRemove = this.orders.findIndex((v) => v.id === item.id)
                this.$delete(this.orders,indexForRemove)
        }}
        )},
        reject(item){
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
                let indexForRemove = this.orders.findIndex((v) => v.id === item.id)
                this.$delete(this.orders,indexForRemove)
        }}
        )
        }
    }
}
</script>
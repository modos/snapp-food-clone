<template>
  <nav>
      <v-app-bar>
          <v-app-bar-nav-icon class="grey--text" @click="toggle()"></v-app-bar-nav-icon>
          <v-toolbar-title>داشبورد</v-toolbar-title>
      </v-app-bar>
      <v-navigation-drawer right app clipped  v-model="drawer" class="indigo">
         <v-list
        dense
        nav
      >
        <v-list-item link  router :to="{ name: 'EditProfile', params: { id: this.id }}">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-account</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text">ویرایش پروفایل</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link  router :to="{ name: 'FoodsList', params: { id: this.id }}">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-note-plus</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text">سفارش غذا</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      
           </v-navigation-drawer>      
  </nav>
</template>

<script>

export default {
 name: 'Navigation',
  data (){
    return {
      id: this.$route.params.id,
      drawer: false
    };
  },
  methods: {
        toggle () {
            this.drawer = !this.drawer
        },
    }
}
</script>


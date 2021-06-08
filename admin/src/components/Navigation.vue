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
        <v-list-item link  router :to="{ name: 'CreateFood', params: { id: this.id }}">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-note-plus</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text">افزودن غذا</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
            <v-list-item link  router :to="{ name: 'Orders', params: { id: this.id }}">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-format-list-checks</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text">سفارش ها</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

         </v-list-item>
            <v-list-item link  router :to="{ name: 'Comments', params: { id: this.id }}">
          <v-list-item-icon>
            <v-icon class="white--text">mdi-comment</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="white--text">نظرات</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      
           </v-navigation-drawer>      
  </nav>
</template>

<script>
            //<v-list-item> <v-btn router :to="editProfile">ویرایش پروفایل</v-btn></v-list-item>
           //<v-list-item> <v-btn router :to="{ name: 'CreateFood', params: { id: this.id }}">افزودن غذا</v-btn></v-list-item>
export default {
 name: 'Navigation',
  data (){
    return {
      id: this.$route.params.id,
      drawer: false,
    };
  },
  methods: {
        toggle () {
            this.drawer = !this.drawer
        },
    }
}
</script>


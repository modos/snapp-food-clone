<template>
       <v-col cols="8" offset="2">
          <v-list two-line>
        <template v-for="(item, index) in comments">
          <v-list-item :key="item.id">
            <template>
              <v-list-item-content>
                <v-list-item-title>شناسه مشتری: {{item.client_id}}</v-list-item-title>
                <v-list-item-subtitle>شناسه غذا: {{item.food_id}}</v-list-item-subtitle>
                <v-list-item-subtitle>متن نظر: {{item.content}}</v-list-item-subtitle>
                <v-list-item-subtitle>امتیاز: {{item.rate}}</v-list-item-subtitle>

<center>
                  <div style="max-width:50%;" class="mt-12">
                  <v-text-field
                  placeholder="متن جواب"
                  @input="commentText($event, item.id)"
                  >
                  </v-text-field>
                </div>
                </center>

                <v-list-item-action>
                   <v-row class="mt-12" align="center" justify="center">
                    <v-btn color="primary" @click.prevent="submit(item)">جواب بده</v-btn>
                   </v-row>
                </v-list-item-action>
              </v-list-item-content>
            </template>
          </v-list-item>

          <v-divider
            v-if="index < comments.length - 1"
            :key="index"
          ></v-divider>
        </template>
    </v-list>
     </v-col>
</template>

<script>
export default {
     async created(){
        let response = await fetch(`http://localhost:3000/admin/getcomments/${this.$route.params.id}`)
        let comments = await response.json()
        this.comments = comments
        console.log(comments)
    },
    data() {
        return {
            comments: [],
            content: ''
        }
    },

    methods: {
        async submit(item){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    admin_id: this.$route.params.id,
                    reply_to_id: item.id,
                    content: this.content
            })}
            let res = fetch('http://localhost:3000/admin/comment', requestOptions)
        },
        async commentText(value, id) {
      this.content = value
    },
    }
}
</script>
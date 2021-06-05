<template>

<div>
            <Navigation></Navigation>
      <router-view/>
</div>

</template>

<script>
import  Navigation  from "../components/Navigation";
export default {
components: {
     Navigation,
 },
  data (){
    return {
      id: this.$route.params.id,
    }
  }
}
</script>


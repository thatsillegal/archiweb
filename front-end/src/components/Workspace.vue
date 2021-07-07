<template>
  <div>
    hello
  </div>
</template>

<script>
import storage from '@/storage';
export default {
  
  name: "Workspace",
  mounted() {
    let user = storage.get('username');
    if (!user) {
      this.$router.push('/login');
    }
  }
}
</script>

<style scoped>

</style>
<template>
  <v-app>
   
     

    <v-main>
      <v-img
        src="./assets/aiko.png"
        contain
        height="100"
      ></v-img>
      <!-- Substitua o texto pela imagem -->
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* Adicione estilos globais aqui */

</style>

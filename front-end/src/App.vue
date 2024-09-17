<template>
  <v-app>
    <v-app-bar app>
     
      <!-- Imagem centralizada -->
      <v-col cols="auto" class="d-flex justify-center">
        <v-toolbar-title>
          <v-img src="./assets/aiko.png" contain height="45"></v-img>
        </v-toolbar-title>
      </v-col>

      <!-- Botões com cor azul e fonte comum -->
      <v-col cols="8" class="d-flex justify-center">
        <v-btn text color="blue--text" class="custom-font"><b>Soluções</b></v-btn>
        <v-btn text color="blue--text" class="custom-font"><b>Sobre Nós</b></v-btn>
        <v-btn text color="blue--text" class="custom-font"><b>Contato</b></v-btn>
      </v-col>

    </v-app-bar>

    <v-main>
      <!-- Substitua o texto pela imagem -->
      <router-view></router-view>
    </v-main>

    <!-- Footer azul -->
    <v-footer app padless>
      <v-col class="text-center" cols="12" style="background-color: #1976D2; color: white; padding: 16px;">
        Desenvolvido por Lennon Moreira
      </v-col>
    </v-footer>

  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>

<style>
/* Adicione estilos globais aqui */
.custom-font {
  font-family: Georgia, sans-serif; /* Altere para uma fonte mais comum */
}
</style>


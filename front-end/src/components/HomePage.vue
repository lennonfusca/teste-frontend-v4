<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" class="text-center">
        <v-img class="my-3" contain height="5" />
      </v-col>
      <v-col cols="auto">
        <v-card class="custom-card">
          <v-container class="mt-5">
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="selectedEquipamento"
                  :items="equipamentoModelo"
                  item-text="name"
                  item-value="id"
                  outlined
                  dense
                  class="text-center"
                  label="Selecione modelo"
                  :menu-props="{ maxHeight: '120px' }"
                  @change="onEquipamentoSelected"
                  clearable
                />
              </v-col>

              <v-col v-if="selectedEquipamento.length != 0" cols="12">
                <v-autocomplete
                  v-model="selectedModel"
                  :items="equipamentoFilter"
                  item-text="name"
                  item-value="id"
                  outlined
                  dense
                  label="Selecione Equipamento"
                  :menu-props="{ maxHeight: '120px' }"
                  clearable
                />
              </v-col>
            </v-row>
          </v-container>
          <v-btn color="primary" :disabled="disable" @click="openMap()">
            Pesquisar Equipamento
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Mapa Leaflet fixo abaixo do card -->

    <v-container class="mt-8">
      <v-col v-if="textVisible" class="h5"><h5>OBS:Últimos cinco registros de datas que serão exibidos.</h5></v-col>
      <v-row justify="center" align="center" >
        <v-col>
          <leaflet-map
            :center="mapCenter"
            :zoom="mapZoom"
            :markerPositions="markerPositions"
          ></leaflet-map>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import equipment from "../data/equipment.json";
import equipmentPositionHistory from "../data/equipmentPositionHistory.json";
import equipmentState from "../data/equipmentState.json";
import equipmentStateHistory from "../data/equipmentStateHistory.json";
import equipmentModel from "../data/equipmentModel.json";
import { format } from "date-fns";

import LeafletMap from "./LeafletMap.vue";

export default {
  name: "HomePage",
  components: {
    LeafletMap,
  },
  data() {
    return {
      equipamento: [],
      equipamentoPosition: [],
      selectedEquipamento: [],
      equipamentoState: [],
      equipamentoHistorico: [],
      selectedModel: [],
      positionFilter: [],
      equipamentoFilter: [],
      equipamentoModelo: [],
      markerPositions: [],
      textVisible:false,
      mapCenter: { lat: 51.505, lng: -0.09 }, // valores padrão
      mapZoom: 10,
    };
  },

  mounted() {
    // Carrega os dados do JSON no 'mounted'
    this.loadEquipment();
  },
  methods: {
    loadEquipment() {
      // Simula uma requisição para obter os dados do JSON
      this.equipamentoModelo = equipmentModel;
      this.equipamentoPosition = equipmentPositionHistory;
      this.equipamentoState = equipmentState;
      this.equipamento = equipment;
      this.equipamentoHistorico = equipmentStateHistory;
    },

    async onEquipamentoSelected() {
      // Filtrar os equipamentos com base no equipamento selecionado
      this.equipamentoFilter = await this.equipamento.filter(
        (equipamento) =>
          equipamento.equipmentModelId === this.selectedEquipamento
      );
    },
    async openMap() {
      // Filtrar o equipamento com base no equipamento selecionado e retornar apenas o nome do primeiro resultado
      const equipamentoSelecionado = this.equipamento.find(
        (equipamento) =>
          equipamento.equipmentModelId === this.selectedEquipamento
      );

      // Se o equipamento foi encontrado, pegar o nome
      const equipamentoNome = equipamentoSelecionado
        ? equipamentoSelecionado.name
        : "";

      // Aqui você pode usar `equipamentoNome` e `modeloNome` conforme a necessidade

      // Filtra os dados baseados no modelo selecionado
      this.positionFilter = await this.equipamentoPosition.filter(
        (equipamento) => equipamento.equipmentId === this.selectedModel
      );

      // Pega as primeiras 5 posições ou todas as que precisar
      const firstFivePositions = this.positionFilter[0].positions.slice(0, 5);

      // Extrai as informações de "lat" e "lon" de cada uma dessas posições
      this.markerPositions = firstFivePositions.map((position) => {
        return {
          lat: position.lat,
          lon: position.lon,
          date: format(position.date, "dd-MM-yyyy (HH:mm)"),
          name: equipamentoNome,
        };
      });

      console.log(this.markerPositions, "Informações Extraídas");

      // Aqui você pode definir a localização (latitude/longitude) do equipamento selecionado
      this.mapCenter = this.mapCenter = {
        lat: this.markerPositions[0].lat,
        lng: this.markerPositions[0].lon,
      }; // exemplo
      this.textVisible = true
      this.mapZoom = 10;
    },
  
  },

  computed: {
    search() {
      console.log(this.selectedEquipamento);
      return this.selectedEquipamento.length == 0;
    },
    model() {
      return this.selectedModel.length == 0;
    },
    disable() {
      return this.search || this.model;
    },
  },
};
</script>

<style scoped>
.fill-height {
  height: 50vh;
}

.custom-card {
  padding: 20px;
  text-align: center;
  max-width: 400px;
  border-radius: 20px;
  background-color: rgb(237, 239, 250);
}

#map {
  width: 100%; /* Ajusta a largura para preencher o contêiner pai */
  height: 400px; /* Ajuste a altura conforme necessário */
}

/* Style for autocomplete to make sure it's on top */
.autocomplete .v-autocomplete__content {
  z-index: 9999; /* Ensure it's on top of other elements */
}

.v-btn {
  border-radius: 15px;
}

.h5 {
  text-transform: none; /* Remove a transformação para maiúsculas */
  font-size: 12px; /* Define o tamanho da fonte */
  color:rgb(64, 64, 66);
}
</style>

<template>
  <v-container class="fill-height" fluid>
    <v-row justify="center" align="center">
      <v-col cols="12" class="text-center">
        <v-img class="my-3" contain height="5" />
      </v-col>
      <v-col cols="auto">
        <v-card class="custom-card">
          <!-- Imagem no topo do card -->
          <v-img
            src="@/assets/aiko.png"
            contain
            height="50"
            class="mt-5"
          ></v-img>

          <v-container class="mt-7">
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="selectedEquipamento"
                  :items="equipamentoModelo"
                  item-text="name"
                  item-value=""
                  outlined
                  dense
                  class="text-center"
                  label="Selecione modelo"
                  :menu-props="{ maxHeight: '150px' }"
                  @change="onEquipamentoSelected"
                  clearable
                  return-object
                />
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="selectedModel"
                  :items="equipamentoFilter"
                  item-text="name"
                  item-value=""
                  outlined
                  dense
                  label="Selecione Equipamento"
                  :menu-props="{ maxHeight: '150px' }"
                  clearable
                  return-object
                />
              </v-col>

              <v-col cols="12">
                <v-select
                  v-model="selectedsearchPosition"
                  :items="selectedSearch"
                  item-text="name"
                  item-value="id"
                  outlined
                  dense
                  class="text-center"
                  label="Posições de pesquisa"
                  :menu-props="{ maxHeight: '150px' }"
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

      <!-- Mapa Leaflet fixo abaixo do card -->

      <v-container class="mt-3">
        <v-row justify="center" align="center">
          <v-col>
            <leaflet-map
              :center="mapCenter"
              :zoom="mapZoom"
              :markerPositions="markerPositions"
            ></leaflet-map>
          </v-col>
        </v-row>
      </v-container>
    </v-row>
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
      selectedSearch: [
        { id: 1, value: 5, name: "Últimas 5" },
        { id: 2, value: 10, name: "Últimas 10" },
        { id: 3, value: 0, name: "Todas" },
      ],
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
          equipamento.equipmentModelId === this.selectedEquipamento.id
      );
    },
    async openMap() {
      // Filtra os dados baseados no modelo selecionado
      this.positionFilter = await this.equipamentoPosition.filter(
        (equipamento) => equipamento.equipmentId === this.selectedModel.id
      );
      this.stateFilter = await this.equipamentoHistorico.filter(
        (equipamentoState) =>
          equipamentoState.equipmentId === this.selectedModel.id
      );

      // Pega as primeiras 5 posições e inverte a ordem
      let firstFivePositions;
      let firstFiveStates;

      if (this.selectedsearchPosition == 1) {
        firstFivePositions = this.positionFilter[0].positions
          .reverse()
          .slice(0, 5);
        firstFiveStates = this.stateFilter[0].states.reverse().slice(0, 5);
      } else if (this.selectedsearchPosition == 2) {
        firstFivePositions = this.positionFilter[0].positions
          .reverse()
          .slice(0, 10);
        firstFiveStates = this.stateFilter[0].states.reverse().slice(0, 10);
      } else {
        firstFivePositions = this.positionFilter[0].positions.reverse();

        firstFiveStates = this.stateFilter[0].states.reverse();
        this.selectedsearchPosition = 3
      }
      // Extrai as informações de "lat", "lon", "date", "name", e agora "equipmentStateId"
      this.markerPositions = firstFivePositions.map((position, index) => {
        const stateId = firstFiveStates[index]?.equipmentStateId || "N/A"; // Pega o equipmentStateId correspondente, ou 'N/A' se não houver
        let stateName; // Para o texto
        let stateColor; // Para a cor

        switch (stateId) {
          case "0808344c-454b-4c36-89e8-d7687e692d57":
            stateName = "Operando";
            stateColor = "#2ecc71"; // Cor verde
            break;
          case "baff9783-84e8-4e01-874b-6fd743b875ad":
            stateName = "Parado";
            stateColor = "#f1c40f"; // Cor amarela
            break;
          case "03b2d446-e3ba-4c82-8dc2-a5611fea6e1f":
            stateName = "Manutenção";
            stateColor = "#e74c3c"; // Cor vermelha
            break;
          default:
            stateName = "Estado desconhecido";
            stateColor = "#7f8c8d"; // Cor cinza
        }

        // Retornar texto com a cor definida usando HTML
        const stateText = `<span style="color: ${stateColor};"><strong>${stateName}</strong></span>`;

        return {
          lat: position.lat,
          lon: position.lon,
          date: format(
            position.date,
            "dd-MM-yyyy '<br><strong>Hora:</strong>' HH:mm"
          ),
          name:
            this.selectedEquipamento.name +
            "<br><strong>Equipamento: </strong>" +
            this.selectedModel.name,
          stateId: stateText, // Adiciona o equipmentStateId ao marcador
        };
      });
      // Calcular o centro do mapa com base nos marcadores
      if (this.markerPositions.length > 0) {
        const latitudes = this.markerPositions.map((marker) => marker.lat);
        const longitudes = this.markerPositions.map((marker) => marker.lon);

        const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
        const avgLng =
          longitudes.reduce((a, b) => a + b, 0) / longitudes.length;

        this.mapCenter = { lat: avgLat, lng: avgLng }; // Atualiza o centro do mapa
      }
    },
  },

  computed: {
    search() {
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
  height: 500px; /* Ajuste a altura conforme necessário */

  /* Para centralizar o card no meio da página com um pequeno deslocamento, você pode usar margin auto */
  margin-left: auto;
  margin-right: auto;
  left: 30px; /* Deslocamento opcional para ajustar mais */
  /* Opcional: adicione uma sombra para dar destaque */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

#map {
  width: 110%; /* Ajusta a largura para preencher o contêiner pai */
  height: 600px; /* Ajuste a altura conforme necessário */
  right: 30px; /* Deslocamento opcional para ajustar mais */
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
  color: rgb(64, 64, 66);
}
</style>

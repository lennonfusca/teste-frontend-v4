<template>
  <div id="map"></div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Importa o CSS do Leaflet


export default {
  name: "LeafletMap",
  props: {
    center: {
      type: Object,
      required: true,
    },
    zoom: {
      type: Number,
      required: true,
    },
    markerPositions: {
      type: Array,
      default: () => [], // Array vazio como valor padrão
    },
  },
  mounted() {
    // Inicializa o mapa
    this.map = L.map("map").setView(
      [this.center.lat, this.center.lng],
      this.zoom
    );

    // Adiciona os tiles (blocos) do OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    // Adiciona os marcadores
    this.addMarkers(this.markerPositions);

    // Força o ajuste dos tiles do mapa após renderização
    this.$nextTick(() => {
      setTimeout(() => {
        this.map.invalidateSize();
      }, 100);
    });
  },
  watch: {
    center(newCenter) {
      this.map.setView([newCenter.lat, newCenter.lng], this.zoom);
    },
    markerPositions(newPositions) {
      this.addMarkers(newPositions);
    },
  },
  methods: {
    addMarkers(positions) {
  // Define o ícone customizado com sua imagem
  const customIcon = L.icon({
    iconUrl: require("@/assets/marcador3.png"), // Caminho para sua imagem de marcador personalizada
    iconSize: [20, 20], // Tamanho do ícone
    iconAnchor: [12, 24], // O ponto do ícone que corresponderá à localização do marcador
    popupAnchor: [0, -24], // Onde o popup deve aparecer em relação ao ícone
  });

  // Remove todos os marcadores existentes antes de adicionar novos
  if (this.markers) {
    this.markers.forEach((marker) => this.map.removeLayer(marker));
  }

  // Adiciona novos marcadores com o ícone customizado
  this.markers = positions.map((position) => {
    const marker = L.marker([position.lat, position.lon], {
      icon: customIcon,
    }).addTo(this.map);

    // Exibe o nome, modelo, data e estado no popup
    const popupContent = `
      <strong>Nome:</strong> ${position.name}<br>
      <strong>Data:</strong> ${position.date}<br>
      <strong>Estado:</strong> ${position.stateId}
    `;
    marker.bindPopup(popupContent).openPopup(); // Popup com nome, data e estado

    return marker;
  });
}
  }
}

</script>

<style scoped>
#map {
  width: 100%;
  height: 400px;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
</style>

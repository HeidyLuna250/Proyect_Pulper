import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import BotonEliminarEdad from "./BotonEliminacionEdad.js";

const TablaEdades = ({ edades, eliminarEdad, editarEdad }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Edades</Text>

      {/* Encabezado de la tabla */}
      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celda, styles.textoEncabezado]}>Nombre</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Edad</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Acciones</Text>
      </View>

      {/* Contenido de la tabla */}
      <ScrollView>
        {edades.map((item) => (
          <View key={item.id} style={styles.fila}>
            <Text style={styles.celda}>{item.nombre}</Text>
            <Text style={styles.celda}>{item.edad}</Text>
            <View style={styles.celdaAcciones}>
              <TouchableOpacity
                style={styles.botonActualizar}
                onPress={() => editarEdad(item)}
              >
                <Text>✏️</Text>
              </TouchableOpacity>
              <BotonEliminarEdad id={item.id} eliminarEdad={eliminarEdad} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignSelf: "stretch" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  fila: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    alignItems: "center",
  },
  encabezado: { backgroundColor: "#dcedf3ff" },
  celda: { flex: 1, fontSize: 16, textAlign: "center" },
  celdaAcciones: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  textoEncabezado: { fontWeight: "bold", fontSize: 17, textAlign: "center" },
  botonActualizar: {
    padding: 4,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#99c99aff",
  },
});

export default TablaEdades;
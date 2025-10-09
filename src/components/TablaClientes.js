import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import BotonEliminarCliente from "./BotonEliminarCliente";

const TablaClientes = ({ clientes, eliminarCliente }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Tabla de Clientes</Text>

      {/* Encabezado */}
      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celda, styles.textoEncabezado]}>Nombre</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Apellido</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Sexo</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Acciones</Text>
      </View>

      {/* Contenido */}
      <ScrollView>
        {clientes.map((item) => (
          <View key={item.id} style={styles.fila}>
            <Text style={styles.celda}>{item.nombre}</Text>
            <Text style={styles.celda}>{item.apellido}</Text>
            <Text style={styles.celda}>{item.sexo}</Text>
            <View style={styles.celdaAcciones}>
              <BotonEliminarCliente id={item.id} eliminarCliente={eliminarCliente} />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignSelf: "stretch"
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10
  },
  fila: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 6,
    alignItems: 'center'
  },
  encabezado: {
    backgroundColor: '#dcedf3ff'
  },
  celda: {
    flex: 1,
    fontSize: 16,
    textAlign: 'center'
  },
  celdaAcciones: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8
  },
  textoEncabezado: {
    fontWeight: 'bold',
    fontSize: 17,
    textAlign: 'center'
  },
});

export default TablaClientes;

import React from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";

const FormularioEdades = ({
  nuevaEdad,
  manejoCambio,
  guardarEdad,
  actualizarEdad,
  modoEdicion,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {modoEdicion ? "Actualizar Edad" : "Registro de Edades"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nuevaEdad.nombre}
        onChangeText={(valor) => manejoCambio("nombre", valor)}
      />
      <TextInput
        style={styles.input}
        placeholder="Edad"
        value={nuevaEdad.edad}
        onChangeText={(valor) => manejoCambio("edad", valor)}
        keyboardType="numeric"
      />
      <Button
        title={modoEdicion ? "Actualizar" : "Guardar"}
        onPress={modoEdicion ? actualizarEdad : guardarEdad}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
});

export default FormularioEdades;
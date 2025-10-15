import React from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";

const FormularioClientes = ({
  nuevoCliente,
  manejoCambio,
  guardarCliente,
  actualizarCliente,
  modoEdicion,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {modoEdicion ? "Actualizar Cliente" : "Registro de Clientes"}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nuevoCliente.nombre}
        onChangeText={(valor) => manejoCambio("nombre", valor)}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={nuevoCliente.apellido}
        onChangeText={(valor) => manejoCambio("apellido", valor)}
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Sexo:</Text>
        <Picker
          selectedValue={nuevoCliente.sexo}
          onValueChange={(valor) => manejoCambio("sexo", valor)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione..." value="" />
          <Picker.Item label="Masculino (M)" value="M" />
          <Picker.Item label="Femenino (F)" value="F" />
        </Picker>
      </View>

      <Button
        title={modoEdicion ? "Actualizar" : "Guardar"}
        onPress={modoEdicion ? actualizarCliente : guardarCliente}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderRadius: 4,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingTop: 5,
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default FormularioClientes;
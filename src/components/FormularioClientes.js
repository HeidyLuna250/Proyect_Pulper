import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker"; // 👈 Asegúrate de tener este paquete
import { db } from "../database/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";

const FormularioClientes = ({ cargarDatos }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [sexo, setSexo] = useState(""); // M o F

  const guardarCliente = async () => {
    if (nombre && apellido && sexo) {
      try {
        await addDoc(collection(db, "Clientes"), { nombre, apellido, sexo });
        setNombre("");
        setApellido("");
        setSexo("");
        cargarDatos(); // recarga la lista
      } catch (error) {
        console.error("Error al registrar cliente: ", error);
      }
    } else {
      alert("Por favor, complete todos los campos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Clientes</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={apellido}
        onChangeText={setApellido}
      />

      {/* Selector de sexo */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Sexo:</Text>
        <Picker
          selectedValue={sexo}
          onValueChange={(value) => setSexo(value)}
          style={styles.picker}
        >
          <Picker.Item label="Seleccione..." value="" />
          <Picker.Item label="Masculino (M)" value="M" />
          <Picker.Item label="Femenino (F)" value="F" />
        </Picker>
      </View>

      <Button title="Guardar" onPress={guardarCliente} />
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

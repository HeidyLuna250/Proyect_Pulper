import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { ref, set, push, onValue } from "firebase/database";
import { realtimeDB } from "../database/firebaseconfig";

const IMCRealtime = () => {
  const [nombre, setNombre] = useState("");
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [registros, setRegistros] = useState([]);

  // Función para calcular el IMC
  const calcularIMC = (peso, altura) => {
    const alt = parseFloat(altura);
    const pes = parseFloat(peso);
    if (!alt || !pes || alt <= 0) return 0;
    return (pes / (alt * alt)).toFixed(2);
  };

  // Guardar los datos en Realtime Database
    const guardarEnRT = async () => {
    if (!nombre || !peso || !altura) {
        alert("Rellena todos los campos");
        return;
    }

    const pesoNum = parseFloat(peso);
    const alturaNum = parseFloat(altura);

    if (isNaN(pesoNum) || isNaN(alturaNum) || pesoNum <= 0 || alturaNum <= 0) {
        alert("Ingresa valores numéricos válidos (mayores a 0)");
        return;
    }

    try {
        const imc = calcularIMC(pesoNum, alturaNum);

        const referencia = ref(realtimeDB, "imc_rt");
        const nuevoRef = push(referencia);

        await set(nuevoRef, {
        nombre,
        peso: pesoNum,
        altura: alturaNum,
        imc: Number(imc),
        });

        setNombre("");
        setPeso("");
        setAltura("");

        alert("IMC registrado en Realtime");
    } catch (error) {
        console.log("Error al guardar:", error);
    }
    };

  // Leer los registros en tiempo real
  const leerRT = () => {
    const referencia = ref(realtimeDB, "imc_rt");

    onValue(referencia, (snapshot) => {
      if (snapshot.exists()) {
        const dataObj = snapshot.val();
        const lista = Object.entries(dataObj).map(([id, datos]) => ({
          id,
          ...datos,
        }));
        setRegistros(lista);
      } else {
        setRegistros([]);
      }
    });
  };

  useEffect(() => {
    leerRT();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de IMC</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Peso (kg)"
        keyboardType="numeric"
        value={peso}
        onChangeText={setPeso}
      />
      <TextInput
        style={styles.input}
        placeholder="Altura (m)"
        keyboardType="numeric"
        value={altura}
        onChangeText={setAltura}
      />

      <Button title="Calcular y Guardar" onPress={guardarEnRT} />

      <Text style={styles.subtitulo}>Registros guardados:</Text>

      {registros.length === 0 ? (
        <Text>No hay registros</Text>
      ) : (
        registros.map((r) => (
          <Text key={r.id}>
            {r.nombre} - Peso: {r.peso}kg, Altura: {r.altura}m → IMC: {r.imc}
          </Text>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  subtitulo: { fontSize: 18, marginTop: 20, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default IMCRealtime;

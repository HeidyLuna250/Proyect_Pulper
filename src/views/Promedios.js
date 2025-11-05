import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore";
import TituloPromedio from "../components/TituloPromedio.js";
import FormularioEdades from "../components/FormularioEdades.js";
import TablaEdades from "../components/TablaEdades.js";
import ListaEdades from "../components/ListaEdades.js";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";

const Promedios = ({ cerrarSesion }) => {
  const [edades, setEdades] = useState([]);
  const [promedio, setPromedio] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [edadId, setEdadId] = useState(null);
  const [nuevaEdad, setNuevaEdad] = useState({
    nombre: "",
    edad: "",
  });

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "edades"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        nombre: doc.data().nombre || "",
        edad: doc.data().edad || 0,
      }));
      setEdades(data);
      if (data.length > 0) calcularPromedioAPI(data);
      else setPromedio(null);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  const cargarDatosFirebase = async (nombreColeccion) => {
      if (!nombreColeccion || typeof nombreColeccion !== 'string') {
        console.error("Error: Se requiere un nombre de colección válido.");
        return;
      }
    
      try {
        const datosExportados = {};
    
        // Obtener la referencia a la colección específica
        const snapshot = await getDocs(collection(db, nombreColeccion));
    
        // Mapear los documentos y agregarlos al objeto de resultados
        datosExportados[nombreColeccion] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
    
        return datosExportados;
      } catch (error) {
        console.error(`Error extrayendo datos de la colección '${nombreColeccion}':`, error);
      }
    };
    
    const exportarDatos = async () => {
      try {
        const datos = await cargarDatosFirebase("edades");
        console.log("Datos cargados:", datos);
    
        // Formatea los datos para el archivo y el portapapeles
        const jsonString = JSON.stringify(datos, null, 2);
        const baseFileName = "datos_firebase.txt";
    
        // Copiar datos al portapapeles
        await Clipboard.setStringAsync(jsonString);
        console.log("Datos (JSON) copiados al portapapeles.");
    
        // Verificar si la función de compartir está disponible
        if (!(await Sharing.isAvailableAsync())) {
          alert("La función Compartir/Guardar no está disponible en tu dispositivo");
          return;
        }
    
        // Guardar el archivo temporalmente
        const fileUri = FileSystem.cacheDirectory + baseFileName;
    
        // Escribir el contenido JSON en el caché temporal
        await FileSystem.writeAsStringAsync(fileUri, jsonString);
    
        // Abrir el diálogo de compartir
        await Sharing.shareAsync(fileUri, {
          mimeType: "text/plain",
          dialogTitle: "Compartir datos de Firebase (JSON)",
        });
    
        alert("Datos copiados al portapapeles y listos para compartir.");
      } catch (error) {
        console.error("Error al exportar y compartir:", error);
        alert("Error al exportar y compartir: " + error.message);
      }
    };

  const calcularPromedioAPI = async (lista) => {
    try {
      const response = await fetch(
        "https://kb1eixlgtd.execute-api.us-east-2.amazonaws.com/calcularpromediopulper",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ edades: lista }),
        }
      );
      const data = await response.json();
      setPromedio(data.promedio || null);
    } catch (error) {
      console.error("Error al calcular promedio en API:", error);
    }
  };

  const eliminarEdad = async (id) => {
    try {
      await deleteDoc(doc(db, "edades", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const manejoCambio = (nombre, valor) => {
    setNuevaEdad((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  const guardarEdad = async () => {
    try {
      if (nuevaEdad.nombre.trim() && nuevaEdad.edad.trim()) {
        await addDoc(collection(db, "edades"), {
          nombre: nuevaEdad.nombre.trim(),
          edad: parseInt(nuevaEdad.edad),
        });
        setNuevaEdad({ nombre: "", edad: "" });
        cargarDatos();
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al guardar la edad: ", error);
    }
  };

  const actualizarEdad = async () => {
    try {
      if (nuevaEdad.nombre.trim() && nuevaEdad.edad.trim()) {
        await updateDoc(doc(db, "edades", edadId), {
          nombre: nuevaEdad.nombre.trim(),
          edad: parseInt(nuevaEdad.edad),
        });
        setNuevaEdad({ nombre: "", edad: "" });
        setModoEdicion(false);
        setEdadId(null);
        cargarDatos();
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al actualizar edad: ", error);
    }
  };

  const editarEdad = (edad) => {
    setNuevaEdad({
      nombre: edad.nombre,
      edad: edad.edad.toString(),
    });
    setEdadId(edad.id);
    setModoEdicion(true);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ marginVertical: 10 }}>
        <Button title="Exportar" onPress={exportarDatos} />
      </View>
      <TituloPromedio promedio={promedio} />
      <FormularioEdades
        nuevaEdad={nuevaEdad}
        manejoCambio={manejoCambio}
        guardarEdad={guardarEdad}
        actualizarEdad={actualizarEdad}
        modoEdicion={modoEdicion}
      />
      <ListaEdades edades={edades} />
      <TablaEdades
        edades={edades}
        eliminarEdad={eliminarEdad}
        editarEdad={editarEdad}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});

export default Promedios;
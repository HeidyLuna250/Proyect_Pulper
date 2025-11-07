import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { db } from '../database/firebaseconfig.js';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import ListaClientes from '../components/ListaClientes.js';
import FormularioClientes from '../components/FormularioClientes.js';
import TablaClientes from '../components/TablaClientes.js';
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";

const Clientes = ({ cerrarSesion }) => {
  const [clientes, setClientes] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [clienteId, setClienteId] = useState(null);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    apellido: "",
    sexo: "",
  });

  // Cargar clientes desde Firebase
  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Clientes"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        nombre: doc.data().nombre || "",
        apellido: doc.data().apellido || "",
        sexo: doc.data().sexo || "",
      }));
      setClientes(data);
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
      const datos = await cargarDatosFirebase("Clientes");
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

  // Función para convertir ArrayBuffer a base64:
const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// Implementar su API para generar Excel de Clientes
const generarExcelClientes = async () => {
  try {
    const datosParaExcel = [
      { nombre: "Alexander", apellido: "Pérez", sexo: "Masculino" },
      { nombre: "Lujania", apellido: "Leiva", sexo: "Femenino" },
      { nombre: "Alejandro", apellido: "Garcia", sexo: "Masculino" }
    ];

    const response = await fetch("https://j8w86lcg4c.execute-api.us-east-2.amazonaws.com/generarexcel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ datos: datosParaExcel })
    });

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    // Obtención de ArrayBuffer y conversión a base64
    const arrayBuffer = await response.arrayBuffer();
    const base64 = arrayBufferToBase64(arrayBuffer);

    // Ruta para guardar el archivo temporalmente
    const fileUri = FileSystem.documentDirectory + "clientes.xlsx";

    // Escribir el archivo Excel en el sistema de archivos
    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64
    });

    // Compartir el archivo generado
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'Descargar Reporte Excel de Clientes'
      });
    } else {
      alert("Compartir no disponible. Revisa la consola para logs.");
    }

  } catch (error) {
    console.error("Error generando Excel:", error);
    alert("Error: " + error.message);
  }
};

  // Eliminar cliente
  const eliminarCliente = async (id) => {
    try {
      await deleteDoc(doc(db, "Clientes", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  // Manejar cambios en los inputs
  const manejoCambio = (nombre, valor) => {
    setNuevoCliente((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  // Guardar nuevo cliente
  const guardarCliente = async () => {
    try {
      if (nuevoCliente.nombre && nuevoCliente.apellido && nuevoCliente.sexo) {
        await addDoc(collection(db, "Clientes"), {
          nombre: nuevoCliente.nombre,
          apellido: nuevoCliente.apellido,
          sexo: nuevoCliente.sexo,
        });
        setNuevoCliente({ nombre: "", apellido: "", sexo: "" });
        cargarDatos();
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al registrar cliente: ", error);
    }
  };

  // Actualizar cliente existente
  const actualizarCliente = async () => {
    try {
      if (nuevoCliente.nombre && nuevoCliente.apellido && nuevoCliente.sexo) {
        await updateDoc(doc(db, "Clientes", clienteId), {
          nombre: nuevoCliente.nombre,
          apellido: nuevoCliente.apellido,
          sexo: nuevoCliente.sexo,
        });
        setNuevoCliente({ nombre: "", apellido: "", sexo: "" });
        setModoEdicion(false);
        setClienteId(null);
        cargarDatos();
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al actualizar cliente: ", error);
    }
  };

  // Editar cliente
  const editarCliente = (cliente) => {
    setNuevoCliente({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      sexo: cliente.sexo,
    });
    setClienteId(cliente.id);
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
    <View style={{ marginVertical: 10 }}>
        <Button title="Generar Excel" onPress={generarExcelClientes} />
      </View>
      <FormularioClientes
        nuevoCliente={nuevoCliente}
        manejoCambio={manejoCambio}
        guardarCliente={guardarCliente}
        actualizarCliente={actualizarCliente}
        modoEdicion={modoEdicion}
      />
      <ListaClientes clientes={clientes} />
      <TablaClientes
        clientes={clientes}
        eliminarCliente={eliminarCliente}
        editarCliente={editarCliente}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});

export default Clientes;
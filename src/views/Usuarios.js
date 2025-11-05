import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Button } from 'react-native';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../database/firebaseconfig.js';
import FormularioUsuarios from '../components/FormularioUsuarios.js';
import ListaUsuarios from '../components/ListaUsuarios.js';
import TablaUsuarios from '../components/TablaUsuarios.js';
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";

const Usuarios = ({ cerrarSesion }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: "",
    correo: "",
    telefono: "",
    edad: "",
  });

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Usuarios"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsuarios(data);
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
          const datos = await cargarDatosFirebase("Usuarios");
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

  const eliminarUsuario = async (id) => {
    try {
      await deleteDoc(doc(db, "Usuarios", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar: ", error);
    }
  };

  const manejoCambio = (nombre, valor) => {
    setNuevoUsuario((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  const guardarUsuario = async () => {
    const datosValidados = await validarDatos(nuevoUsuario);
    if (datosValidados) {
      try {
        await addDoc(collection(db, "Usuarios"), {
          nombre: datosValidados.nombre,
          correo: datosValidados.correo,
          telefono: parseInt(datosValidados.telefono),
          edad: parseInt(datosValidados.edad),
        });
        cargarDatos();
        setNuevoUsuario({ nombre: "", correo: "", telefono: "", edad: "" });
        Alert.alert("Éxito", "Usuario registrado correctamente.");
      } catch (error) {
        console.error("Error al registrar usuario:", error);
      }
    }
  };

  const actualizarUsuario = async () => {
    const datosValidados = await validarDatos(nuevoUsuario);
    if (datosValidados) {
      try {
        await updateDoc(doc(db, "Usuarios", usuarioId), {
          nombre: datosValidados.nombre,
          correo: datosValidados.correo,
          telefono: parseInt(datosValidados.telefono),
          edad: parseInt(datosValidados.edad),
        });
        setNuevoUsuario({ nombre: "", correo: "", telefono: "", edad: "" });
        setModoEdicion(false);
        setUsuarioId(null);
        cargarDatos();
        Alert.alert("Éxito", "Usuario actualizado correctamente.");
      } catch (error) {
        console.error("Error al actualizar usuario:", error);
      }
    }
  };

  const editarUsuario = (usuario) => {
    setNuevoUsuario({
      nombre: usuario.nombre,
      correo: usuario.correo,
      telefono: usuario.telefono.toString(),
      edad: usuario.edad.toString(),
    });
    setUsuarioId(usuario.id);
    setModoEdicion(true);
  };

  const validarDatos = async (datos) => {
    try {
      const response = await fetch("https://zntx5r359a.execute-api.us-east-2.amazonaws.com/validarusuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      const resultado = await response.json();

      if (resultado.success) {
        return resultado.data;
      } else {
        Alert.alert("Errores en los datos", resultado.errors.join("\n"));
        return null;
      }
    } catch (error) {
      console.error("Error al validar con Lambda:", error);
      Alert.alert("Error", "No se pudo validar la información con el servidor.");
      return null;
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ marginVertical: 10 }}>
        <Button title="Exportar" onPress={exportarDatos} />
      </View>
      <FormularioUsuarios
        nuevoUsuario={nuevoUsuario}
        manejoCambio={manejoCambio}
        guardarUsuario={guardarUsuario}
        actualizarUsuario={actualizarUsuario}
        modoEdicion={modoEdicion}
      />
      <ListaUsuarios usuarios={usuarios} />
      <TablaUsuarios
        usuarios={usuarios}
        editarUsuario={editarUsuario}
        eliminarUsuario={eliminarUsuario}
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

export default Usuarios;
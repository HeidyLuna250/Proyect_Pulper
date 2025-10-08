import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { db } from '../database/firebaseconfig.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import ListaClientes from '../components/ListaClientes.js';
import FormularioClientes from '../components/FormularioClientes.js';
import TablaClientes from '../components/TablaClientes.js';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);

  // Cargar clientes desde Firebase
  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Clientes"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        nombre: doc.data().nombre || "",
        apellido: doc.data().apellido || "",
        sexo: doc.data().sexo || "", // agregando campo sexo
      }));
      setClientes(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  // Eliminar cliente
  const eliminarCliente = async (id) => {
    try{
      await deleteDoc(doc(db, "Clientes", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar: ", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.container}>
      <FormularioClientes cargarDatos={cargarDatos}/>
      <ListaClientes clientes={clientes}/>
      <TablaClientes
        clientes={clientes}
        eliminarCliente={eliminarCliente}
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

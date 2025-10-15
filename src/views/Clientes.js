import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { db } from '../database/firebaseconfig.js';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
import ListaClientes from '../components/ListaClientes.js';
import FormularioClientes from '../components/FormularioClientes.js';
import TablaClientes from '../components/TablaClientes.js';

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
      <Button title="Cerrar Sesión" onPress={cerrarSesion} />
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
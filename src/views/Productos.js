import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import { db } from "../database/firebaseconfig.js";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc, query, where, orderBy, limit, } from 'firebase/firestore';
import ListaProductos from "../components/ListaProductos";
import FormularioProductos from "../components/FormularioProductos";
import TablaProductos from "../components/TablaProductos.js";

const Productos = ({ cerrarSesion }) => {
  const [productos, setProductos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoId, setProductoId] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
  });

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Productos"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(data);
      console.log("Productos traídos:", data);
    } catch (error) {
      console.error("Error al obtener documentos: ", error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "Productos", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const manejoCambio = (nombre, valor) => {
    setNuevoProducto((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  const guardarProducto = async () => {
    try {
      if (nuevoProducto.nombre && nuevoProducto.precio) {
        await addDoc(collection(db, "Productos"), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });
        cargarDatos();
        setNuevoProducto({ nombre: "", precio: "" });
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al registrar producto: ", error);
    }
  };

  const actualizarProducto = async () => {
    try {
      if (nuevoProducto.nombre && nuevoProducto.precio) {
        await updateDoc(doc(db, "Productos", productoId), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });
        setNuevoProducto({ nombre: "", precio: "" });
        setModoEdicion(false);
        setProductoId(null);
        cargarDatos();
      } else {
        alert("Por favor, complete todos los campos");
      }
    } catch (error) {
      console.error("Error al actualizar producto: ", error);
    }
  };

  const editarProducto = (producto) => {
    setNuevoProducto({
      nombre: producto.nombre,
      precio: producto.precio.toString(),
    });
    setProductoId(producto.id);
    setModoEdicion(true);
  };

  // CONSULTAS
    const pruebaConsulta1 = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        where("pais", "==", "Guatemala"),
        orderBy("poblacion", "desc"),
        limit(2)
      );
      const snapshot = await getDocs(q);
      console.log("---------- Consulta 1 ----------");
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, País: ${data.pais}, Población: ${data.poblacion}`);
      });
    } catch (error) {
      console.error("Error en consulta 1:", error);
    }
  };

    const pruebaConsulta2 = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        where("pais", "==", "Honduras"),
        where("poblacion", ">", 700),
        orderBy("nombre", "asc"),
        limit(3)
      );
      const snapshot = await getDocs(q);
      console.log("---------- Consulta 2 ----------");
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, País: ${data.pais}, Población: ${data.poblacion}`);
      });
    } catch (error) {
      console.error("Error en consulta 2:", error);
    }
  };

    const pruebaConsulta3 = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        where("pais", "==", "El Salvador"),
        orderBy("poblacion", "asc"),
        limit(2)
      );
      const snapshot = await getDocs(q);
      console.log("---------- Consulta 3 ----------");
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, País: ${data.pais}, Población: ${data.poblacion}`);
      });
    } catch (error) {
      console.error("Error en consulta 3:", error);
    }
  };

    const pruebaConsulta4 = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        where("poblacion", "<=", 300),
        orderBy("pais", "desc"),
        limit(4)
      );
      const snapshot = await getDocs(q);
      console.log("---------- Consulta 4 ----------");
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, País: ${data.pais}, Población: ${data.poblacion}`);
      });
    } catch (error) {
      console.error("Error en consulta 4:", error);
    }
  };

    const pruebaConsulta5 = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        where("poblacion", ">", 900),
        orderBy("nombre", "asc"),
        limit(3)
      );
      const snapshot = await getDocs(q);
      console.log("---------- Consulta 5 ----------");
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, País: ${data.pais}, Población: ${data.poblacion}`);
      });
    } catch (error) {
      console.error("Error en consulta 5:", error);
    }
  };

    const pruebaConsulta6 = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        where("pais", "==", "Guatemala"),
        orderBy("poblacion", "desc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      console.log("---------- Consulta 6 ----------");
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, País: ${data.pais}, Población: ${data.poblacion}`);
      });
    } catch (error) {
      console.error("Error en consulta 6:", error);
    }
  };

  const pruebaConsulta7 = async () => {
  try {
    const q = query(
      collection(db, "ciudades"),
      where("poblacion", ">=", 200),
      where("poblacion", "<=", 600),
      orderBy("pais", "asc"),
      limit(5)
    );
    const snapshot = await getDocs(q);
    console.log("---------- Consulta 7 ----------");
    snapshot.forEach((doc) => {
      const data = doc.data();
      console.log(
        `ID: ${doc.id}, Nombre: ${data.nombre}, País: ${data.pais}, Población: ${data.poblacion}`
      );
    });
  } catch (error) {
    console.error("Error en consulta 7:", error);
  }
};

  const pruebaConsulta8 = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        orderBy("poblacion", "desc"),
        orderBy("region", "desc"),
        limit(5)
      );
      const snapshot = await getDocs(q);
      console.log("---------- Consulta 8 ----------");
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, Nombre: ${data.nombre}, País: ${data.pais}, Región: ${data.region}, Población: ${data.poblacion}`);
      });
    } catch (error) {
      console.error("Error en consulta 8:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
    pruebaConsulta1();
    pruebaConsulta2();
    pruebaConsulta3();
    pruebaConsulta4();
    pruebaConsulta5();
    pruebaConsulta6();
    pruebaConsulta7();
    pruebaConsulta8();
  }, []);

  return (
    <View style={styles.container}>
      <FormularioProductos
        nuevoProducto={nuevoProducto}
        manejoCambio={manejoCambio}
        guardarProducto={guardarProducto}
        actualizarProducto={actualizarProducto}
        modoEdicion={modoEdicion}
      />
      <ListaProductos productos={productos} />
      <TablaProductos
        productos={productos}
        eliminarProducto={eliminarProducto}
        editarProducto={editarProducto}
      />
      <Button title="Cerrar Sesión" onPress={cerrarSesion} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});

export default Productos;
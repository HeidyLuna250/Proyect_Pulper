import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Productos from "./src/views/Productos";
import Clientes from "./src/views/Clientes";
import Promedios from "./src/views/Promedios";
import Usuarios from "./src/views/Usuarios";
import ProductosRealtime from "./src/views/ProductosRealtime";
import Login from "./src/views/Login";

import Encabezado from "./src/components/Encabezado";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./src/database/firebaseconfig";

export default function App() {
  const [usuario, setUsuario] = useState(null); 
  const [pantalla, setPantalla] = useState("productos");

  // Monitorear estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
    });
    return unsubscribe;
  }, []);

  // Función para cerrar sesión
  const cerrarSesion = async () => {
    try {
      await signOut(auth);
      setUsuario(null);
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  // Mostrar pantalla de login si no hay usuario autenticado
  if (!usuario) {
    return <Login onLoginSuccess={() => setUsuario(auth.currentUser)} />;
  }

  // Renderizar pantallas según el estado
  const renderPantalla = () => {
    switch (pantalla) {
      case "productos":
        return <Productos cerrarSesion={cerrarSesion} />;
      case "clientes":
        return <Clientes />;
      case "promedios":
        return <Promedios />;
      case "usuarios":
        return <Usuarios />;
      case "productosRealtime": 
        return <ProductosRealtime />;
      default:
        return <Productos cerrarSesion={cerrarSesion} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <Encabezado
        titulo={
          pantalla === "productos"
            ? "Gestión de Productos"
            : pantalla === "clientes"
            ? "Gestión de Clientes"
            : pantalla === "promedios"
            ? "Promedios"
            : pantalla === "usuarios"
            ? "Gestión de Usuarios"
            : "Productos Realtime"
        }
      />

      {/* Menú de navegación */}
      <View style={styles.menu}>
        <TouchableOpacity
          style={[styles.boton, pantalla === "productos" && styles.activo]}
          onPress={() => setPantalla("productos")}
        >
          <Text style={styles.textoBoton}>Productos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.boton, pantalla === "clientes" && styles.activo]}
          onPress={() => setPantalla("clientes")}
        >
          <Text style={styles.textoBoton}>Clientes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.boton, pantalla === "promedios" && styles.activo]}
          onPress={() => setPantalla("promedios")}
        >
          <Text style={styles.textoBoton}>Promedios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.boton, pantalla === "usuarios" && styles.activo]}
          onPress={() => setPantalla("usuarios")}
        >
          <Text style={styles.textoBoton}>Usuarios</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.boton, pantalla === "productosRealtime" && styles.activo]}
          onPress={() => setPantalla("productosRealtime")}
        >
          <Text style={styles.textoBoton}>Realtime</Text>
        </TouchableOpacity>
      </View>

      {/* Contenido dinámico */}
      <View style={styles.contenido}>{renderPantalla()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },

  menu: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#e5e5e5",
    paddingVertical: 10,
  },

  boton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },

  textoBoton: {
    fontSize: 14,
    color: "#333",
  },

  activo: {
    borderBottomWidth: 2,
    borderBottomColor: "#007bff",
  },

  contenido: {
    flex: 1,
  },
});

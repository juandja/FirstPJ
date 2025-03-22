import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock: number;
}

function Inventario() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", precio: "", stock: "" });
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login"); // Si no hay token, redirigir a Login
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/productos/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setProductos(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
        if (error.response && error.response.status === 401) {
          navigate("/login"); // Si el token es inválido, redirigir
        }
      });
  }, []);

  // 🔹 Agregar producto
  const agregarProducto = () => {
    axios
      .post("http://127.0.0.1:8000/api/productos/", nuevoProducto, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      })
      .then((response) => {
        setProductos([...productos, response.data]);
        setNuevoProducto({ nombre: "", precio: "", stock: "" }); // Limpiar formulario
      })
      .catch((error) => console.error("Error al agregar producto:", error));
  };

  // 🔹 Eliminar producto
  const eliminarProducto = (id: number) => {
    axios
      .delete(`http://127.0.0.1:8000/api/productos/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setProductos(productos.filter((prod) => prod.id !== id)))
      .catch((error) => console.error("Error al eliminar producto:", error));
  };

  // 🔹 Editar producto
  const editarProducto = (id: number, nuevoNombre: string, nuevoPrecio: number, nuevoStock: number) => {
    axios
      .put(
        `http://127.0.0.1:8000/api/productos/${id}/`,
        { nombre: nuevoNombre, precio: nuevoPrecio, stock: nuevoStock },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        setProductos(productos.map((prod) => (prod.id === id ? response.data : prod)));
      })
      .catch((error) => console.error("Error al editar producto:", error));
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventario</h1>

      {/* Formulario para agregar productos */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Nombre"
          value={nuevoProducto.nombre}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Precio"
          value={nuevoProducto.precio}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Stock"
          value={nuevoProducto.stock}
          onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={agregarProducto} className="bg-blue-500 text-white p-2">Agregar</button>
      </div>

      {/* Tabla de productos */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Precio</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((product) => (
            <tr key={product.id} className="text-center">
              <td className="border p-2">{product.id}</td>
              <td className="border p-2">
                <input
                  type="text"
                  defaultValue={product.nombre}
                  onBlur={(e) => editarProducto(product.id, e.target.value, product.precio, product.stock)}
                  className="border p-1"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  defaultValue={product.precio}
                  onBlur={(e) => editarProducto(product.id, e.target.value, product.precio, product.stock)}
                  className="border p-1"
                />
              </td>
              <td className="border p-2">
                <input
                  type="number"
                  defaultValue={product.stock}
                  onBlur={(e) => editarProducto(product.id, product.nombre, product.precio, parseInt(e.target.value))}
                  className="border p-1"
                />
              </td>
              <td className="border p-2">
                <button onClick={() => eliminarProducto(product.id)} className="bg-red-500 text-white p-1">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventario;

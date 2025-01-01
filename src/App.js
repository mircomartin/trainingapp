import React, { useState, useEffect } from "react";
import axios from "axios";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { API_URL } from "./config"; // Importar la URL del backend

function App() {
  const [newTraining, setNewTraining] = useState({
    date: "",
    activity: "Hyrox",
    work: "",
  });
  const [trainings, setTrainings] = useState([]);
  const [editingComment, setEditingComment] = useState({ id: null, comment: "" });

  // Editor para "Trabajo"
  const workEditor = useEditor({
    extensions: [StarterKit],
    content: newTraining.work,
    onUpdate: ({ editor }) => {
      setNewTraining({ ...newTraining, work: editor.getHTML() });
    },
  });

  // Editor para "Comentarios"
  const commentEditor = useEditor({
    extensions: [StarterKit],
    content: editingComment.comment,
    onUpdate: ({ editor }) => {
      setEditingComment({ ...editingComment, comment: editor.getHTML() });
    },
  });

  // Cargar entrenamientos al montar el componente
  useEffect(() => {
    axios.get(`${API_URL}/trainings`).then((res) => {
      setTrainings(res.data);
    });
  }, []);

  // Agregar un nuevo entrenamiento
  const addTraining = () => {
    axios
      .post(`${API_URL}/trainings`, newTraining)
      .then((res) => {
        setTrainings([...trainings, res.data]);
        setNewTraining({ date: "", activity: "Hyrox", work: "" });
        workEditor.commands.clearContent();
      })
      .catch((err) => console.error(err));
  };

  // Guardar un comentario para un entrenamiento existente
  const saveComment = () => {
    axios
      .patch(`${API_URL}/trainings/${editingComment.id}`, {
        comment: editingComment.comment,
      })
      .then((res) => {
        setTrainings((prev) =>
          prev.map((t) => (t.id === editingComment.id ? res.data : t))
        );
        setEditingComment({ id: null, comment: "" });
        commentEditor.commands.clearContent();
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Entrenamientos</h1>

      {/* Formulario para agregar un entrenamiento */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Nuevo Entrenamiento</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addTraining();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Fecha</label>
            <input
              type="date"
              value={newTraining.date}
              onChange={(e) => setNewTraining({ ...newTraining, date: e.target.value })}
              className="border rounded px-3 py-2 w-full"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Actividad</label>
            <select
              value={newTraining.activity}
              onChange={(e) => setNewTraining({ ...newTraining, activity: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            >
              <option value="Hyrox">Hyrox</option>
              <option value="Crossfit">Crossfit</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Trabajo</label>
            <EditorContent editor={workEditor} className="border rounded p-2 min-h-[150px]" />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Agregar Entrenamiento
          </button>
        </form>
      </div>

      {/* Lista de entrenamientos */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Entrenamientos</h2>
        <ul className="space-y-4">
          {trainings.map((training) => (
            <li key={training.id} className="border rounded p-4">
              <p className="font-bold">
                {training.date} - {training.activity}
              </p>
              <div dangerouslySetInnerHTML={{ __html: training.work }} className="my-2" />
              <div>
                <label className="block text-sm font-medium">Comentario</label>
                {editingComment.id === training.id ? (
                  <div>
                    <EditorContent
                      editor={commentEditor}
                      className="border rounded p-2 min-h-[100px]"
                    />
                    <button
                      onClick={saveComment}
                      className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Guardar Comentario
                    </button>
                  </div>
                ) : (
                  <div>
                    <div
                      dangerouslySetInnerHTML={{ __html: training.comment || "Sin comentario" }}
                      className="my-2"
                    />
                    <button
                      onClick={() =>
                        setEditingComment({ id: training.id, comment: training.comment || "" })
                      }
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Editar Comentario
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

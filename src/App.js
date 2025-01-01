import React, { useState, useEffect } from "react";

import axios from "axios";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import { API_URL } from "./config"; // Importar la URL del backend
import TrainingForm from "./components/TrainingForm";
import TrainingList from './components/TrainingList'

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

      <TrainingForm addTraining={addTraining} />
      <TrainingList
        trainings={trainings}
        editingComment={editingComment}
        setEditingComment={setEditingComment}
        saveComment={saveComment}
      />
    </div>
  );
}

export default App;

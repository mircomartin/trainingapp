import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function TrainingForm({ addTraining }) {
  const [formData, setFormData] = useState({
    date: "",
    activity: "Hyrox",
    work: "",
  });

  const workEditor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setFormData({ ...formData, work: editor.getHTML() });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTraining(formData);
    setFormData({ date: "", activity: "Hyrox", work: "" });
    workEditor.commands.clearContent();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6">
      <div>
        <label className="block text-sm font-medium">Fecha</label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="border rounded px-3 py-2 w-full"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Actividad</label>
        <select
          value={formData.activity}
          onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
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
  );
}

export default TrainingForm;
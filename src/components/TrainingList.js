import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function TrainingList({ trainings, editingComment, setEditingComment, saveComment }) {
  const commentEditor = useEditor({
    extensions: [StarterKit],
    content: editingComment.comment,
    onUpdate: ({ editor }) => {
      setEditingComment({ ...editingComment, comment: editor.getHTML() });
    },
  });

  const handleSaveComment = () => {
    saveComment(editingComment.id, editingComment.comment);
    commentEditor.commands.clearContent();
  };

  return (
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
                  onClick={handleSaveComment}
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
  );
}

export default TrainingList;
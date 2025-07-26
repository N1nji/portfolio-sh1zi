import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableArt({ art, onDelete, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: art.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group rounded overflow-hidden shadow-md"
    >
      {art.type === 'video' ? (
        <video src={art.source} className="w-full h-32 object-cover rounded" muted autoPlay loop />
      ) : (
        <img src={art.source} alt={art.title} className="w-full h-32 object-cover rounded" />
      )}

      <button
        onClick={onDelete}
        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition text-sm"
      >
        ❌
      </button>
      <button
        onClick={onEdit}
        className="absolute bottom-2 right-2 bg-yellow-400 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition text-sm"
      >
        ✏️
      </button>
    </div>
  );
}

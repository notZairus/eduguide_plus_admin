import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableSection({ section, children }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="w-full h-full"
    >
      <div
        {...listeners}
        className="cursor-grab w-full bg-nc-blue h-4 rounded-t"
      />

      <div>{children}</div>
    </div>
  );
}

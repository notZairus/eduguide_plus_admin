import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useHandbookContext } from "../contexts/HandbookContext";

export default function SortableTopic({
  topic,
  children,
}: {
  topic: Topic;
  children: React.ReactNode;
}) {
  const { handbook } = useHandbookContext();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: topic._id });

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
        style={{ backgroundColor: handbook?.color }}
        className="cursor-grab w-full h-4 rounded-t"
      />

      <div>{children}</div>
    </div>
  );
}

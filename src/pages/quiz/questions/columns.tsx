import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EditQuestionDialog from "../../../components/EditQuestionDialog";

const typeConfig: Record<string, { label: string; className: string }> = {
  "multiple-choice": {
    label: "Multiple Choice",
    className: "bg-violet-100 text-violet-700",
  },
  identification: {
    label: "Identification",
    className: "bg-amber-100 text-amber-700",
  },
  "true-or-false": {
    label: "True or False",
    className: "bg-teal-100 text-teal-700",
  },
};

export function columns(
  handleDeleteClick: (question_id: string) => void,
  topics: Topic[],
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>,
): ColumnDef<Question>[] {
  return [
    {
      accessorKey: "question",
      header: "Question",
      cell: ({ row }) => {
        const question: string = row.getValue("question");
        return (
          <p className="max-w-sm text-sm text-gray-800 font-medium leading-snug line-clamp-2">
            {question}
          </p>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type: string = row.getValue("type");
        const conf = typeConfig[type];
        if (conf) {
          return (
            <span
              className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${conf.className}`}
            >
              {conf.label}
            </span>
          );
        }
        return (
          <span className="text-xs text-gray-600 capitalize">
            {type.replace(/-/g, " ")}
          </span>
        );
      },
    },
    {
      accessorKey: "topic_id",
      header: "Topic",
      cell: ({ row }) => {
        const topicId = row.getValue("topic_id");
        const currentTopic = topics.find((t) => t._id === topicId);
        const topicTitle = currentTopic ? currentTopic.title : "—";
        return (
          <span className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full max-w-36 truncate">
            {topicTitle}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <span className="text-xs text-gray-500">
            {date.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const question = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <EditQuestionDialog
                  question={question}
                  topics={topics}
                  setQuestions={setQuestions}
                />
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDeleteClick(question._id)}
                asChild
              >
                <p className="text-sm cursor-pointer">Delete</p>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}

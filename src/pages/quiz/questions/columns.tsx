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

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export function columns(
  handleDelete: (question_id: string) => void,
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
          <div className="max-w-48 whitespace-normal wrap-break-word">
            {question}
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type: string = row.getValue("type");
        return type.charAt(0).toUpperCase() + type.slice(1);
      },
    },
    {
      accessorKey: "topic_id",
      header: "Topic",
      cell: ({ row }) => {
        const topicId = row.getValue("topic_id");
        const currentTopic = topics.find((t) => t._id === topicId);
        const topicTitle = currentTopic ? currentTopic.title : "N/A";

        return (
          <div className="max-w-24 whitespace-normal wrap-break-word">
            {topicTitle}
          </div>
        );
      },
    },
    {
      accessorKey: "section_id",
      header: "Section",
      cell: ({ row }) => {
        const sectionId = row.getValue("section_id");
        const topicId = row.getValue("topic_id");
        const currentTopic = topics.find((t) => t._id === topicId);
        const currentSection = currentTopic?.sections.find(
          (s) => s._id === sectionId,
        );
        const sectionTitle = currentSection ? currentSection.title : "N/A";

        return (
          <div className="max-w-24 whitespace-normal wrap-break-word">
            {sectionTitle}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Date Created",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return date.toLocaleString();
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
                className="text-destructive"
                onClick={() => handleDelete(question._id)}
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

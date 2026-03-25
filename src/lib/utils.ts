import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { generateHTML } from "@tiptap/html";
import { TableKit } from "@tiptap/extension-table";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";
import { generateText } from "@tiptap/core";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function wait(second: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, second * 1000);
  });
}

export function fileToBase64(file: File) {
  const reader = new FileReader();

  if (!reader) return;

  reader.onload = () => {
    const base64String = reader.result;
    return base64String;
  };

  reader.readAsDataURL(file);
}

export function jsonToHTML(tiptapJSON) {
  const extensions = [
    TableKit.configure({ table: { resizable: true } }),
    StarterKit.configure({
      horizontalRule: false,
      link: { openOnClick: false, enableClickSelection: true },
    }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Highlight.configure({ multicolor: true }),
    Image,
    Typography,
    Superscript,
    Subscript,
    Selection,
  ];
  const html = generateHTML(tiptapJSON, extensions);

  return html;
}

export function jsonToText(tiptapJSON) {
  const extensions = [
    TableKit.configure({ table: { resizable: true } }),
    StarterKit.configure({
      horizontalRule: false,
      link: { openOnClick: false, enableClickSelection: true },
    }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Highlight.configure({ multicolor: true }),
    Image,
    Typography,
    Superscript,
    Subscript,
    Selection,
  ];
  const text = generateText(tiptapJSON, extensions);

  return text;
}

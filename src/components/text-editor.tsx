"use client";
import {
  useEditor,
  EditorContent,
  type Editor,
  type UseEditorOptions,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import {
  Bold,
  Strikethrough,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Unlink,
} from "lucide-react";
import { Toggle } from "~/components/ui/toggle";
import { Separator } from "~/components/ui/separator";
import { useCallback } from "react";
import { Skeleton } from "./ui/skeleton";

const SkeletonEditor = () => (
  <div className="mt-2 flex h-[246px] w-full flex-col gap-2 rounded-md border p-2">
    <Skeleton className="h-[40px] w-[300px]" />
    <Skeleton className="h-[200px] w-full" />
  </div>
);

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

type GetEditorConfigArgs = {
  value: string;
  onChange?: (value: string) => void;
};

const getEditorConfig = ({
  value,
  onChange,
}: GetEditorConfigArgs): UseEditorOptions => ({
  editorProps: {
    attributes: {
      class:
        "render-anchors h-[200px] w-full rounded-md rounded-t-none border border-input bg-transparent px-3 py-2 border-t-0 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto",
    },
  },
  extensions: [
    StarterKit.configure({
      orderedList: {
        HTMLAttributes: {
          class: "list-decimal pl-4",
        },
      },
      bulletList: {
        HTMLAttributes: {
          class: "list-disc pl-4",
        },
      },
    }),

    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: "https",
      protocols: ["http", "https"],
      isAllowedUri: (url, ctx) => {
        try {
          // construct URL
          const parsedUrl = url.includes(":")
            ? new URL(url)
            : new URL(`${ctx.defaultProtocol}://${url}`);

          // use default validation
          if (!ctx.defaultValidate(parsedUrl.href)) {
            return false;
          }

          // disallowed protocols
          const disallowedProtocols = ["ftp", "file", "mailto"];
          const protocol = parsedUrl.protocol.replace(":", "");

          if (disallowedProtocols.includes(protocol)) {
            return false;
          }

          // only allow protocols specified in ctx.protocols
          const allowedProtocols = ctx.protocols.map((p) =>
            typeof p === "string" ? p : p.scheme,
          );

          if (!allowedProtocols.includes(protocol)) {
            return false;
          }

          // disallowed domains
          const disallowedDomains = [
            "example-phishing.com",
            "malicious-site.net",
          ];
          const domain = parsedUrl.hostname;

          if (disallowedDomains.includes(domain)) {
            return false;
          }

          // all checks have passed
          return true;
        } catch (error) {
          console.error(error);
          return false;
        }
      },
      shouldAutoLink: (url) => {
        try {
          // construct URL
          const parsedUrl = url.includes(":")
            ? new URL(url)
            : new URL(`https://${url}`);

          // only auto-link if the domain is not in the disallowed list
          const disallowedDomains = [
            "example-no-autolink.com",
            "another-no-autolink.com",
          ];
          const domain = parsedUrl.hostname;

          return !disallowedDomains.includes(domain);
        } catch (error) {
          console.error(error);

          return false;
        }
      },
    }),
  ],
  content: value, // Set the initial content with the provided value
  onUpdate: ({ editor }) => {
    if (onChange) onChange(editor.getHTML()); // Call the onChange callback with the updated HTML content
  },
});

const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editor = useEditor(getEditorConfig({ value, onChange }));

  return (
    <div>
      {!!editor ? (
        <>
          <RichTextEditorToolbar editor={editor} />
          <EditorContent editor={editor} />
        </>
      ) : (
        <SkeletonEditor />
      )}
    </div>
  );
};

const RichTextEditorToolbar = ({ editor }: { editor: Editor }) => {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href as string;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);
  return (
    <div className="flex flex-row items-center gap-1 rounded-t-md border border-input bg-transparent p-1">
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>
      <Separator orientation="vertical" className="h-8 w-[1px]" />
      <Toggle
        size="sm"
        pressed={editor.isActive("bulletList")}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("orderedList")}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        pressed={editor.isActive("link")}
        onPressedChange={setLink}
      >
        <LinkIcon className="h-4 w-4" />
      </Toggle>
      <Toggle
        size="sm"
        disabled={!editor.isActive("link")}
        onPressedChange={() => editor.chain().focus().unsetLink().run()}
      >
        <Unlink className="h-4 w-4" />
      </Toggle>
    </div>
  );
};

export default RichTextEditor;

interface ReadOnlyProps {
  value: string;
}
export const ReadOnly: React.FC<ReadOnlyProps> = ({ value }) => {
  const config: UseEditorOptions = {
    ...getEditorConfig({ value }),
    editorProps: {
      attributes: {
        class:
          "render-anchors h-[200px] w-full border-input çpy-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 overflow-auto",
      },
    },
    editable: false,
    shouldRerenderOnTransaction: false,
  };

  const editor = useEditor(config);

  return (
    <div>
      {!!editor ? (
        <>
          <EditorContent editor={editor} />
          {/* {value} */}
        </>
      ) : (
        <SkeletonEditor />
      )}
    </div>
  );
};

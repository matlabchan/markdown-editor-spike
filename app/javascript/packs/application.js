import MarkdownIt from 'markdown-it'
import "@github/markdown-toolbar-element";

document.addEventListener("DOMContentLoaded", function () {
  const md = new MarkdownIt()
  const editor = document.getElementById("markdown-editor-textarea")
  const preview = document.getElementById("markdown-preview")
  const tools = document.getElementById("markdown-tools")

  editor.addEventListener("input", function () {
    console.log('input changed')
    editor.style.height = `${editor.scrollHeight}px`;
  })

  const editButton = document.getElementById("editor-edit");
  editButton.addEventListener("click", function () {
    if (preview.classList.contains("active")) {
      editor.classList.add("active")
      tools.classList.add("active")
      preview.classList.remove("active")
    }
  });

  const previewButton = document.getElementById("editor-preview");
  previewButton.addEventListener("click", function () {
    if (editor.classList.contains("active")) {
      preview.classList.add("active")
      editor.classList.remove("active")
      tools.classList.remove("active")

      let markdownText = editor.value
      if (editor.value == "") {
        markdownText = 'Nothing to preview...'
      }
      const html = md.render(markdownText)
      preview.innerHTML = html
    }
  });

  function insertOrWrapText(textarea, wrapperStart, wrapperEnd = wrapperStart, placeholder = "", cursorOffset = null) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    let selectedText = textarea.value.substring(start, end);
    const isTextSelected = start !== end;

    let trailingNewline = "";
    if (isTextSelected && selectedText.endsWith("\n")) {
      trailingNewline = "\n";
      selectedText = selectedText.slice(0, -1);
    }

    const textToInsert = isTextSelected
      ? wrapperStart + selectedText + wrapperEnd + trailingNewline
      : wrapperStart + placeholder + wrapperEnd;

    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);
    textarea.value = before + textToInsert + after;

    let cursorPosition;
    if (isTextSelected) {
      cursorPosition = start + textToInsert.length;
    } else if (cursorOffset !== null) {
      cursorPosition = start + cursorOffset;
    } else {
      cursorPosition = start + wrapperStart.length;
    }

    textarea.selectionStart = textarea.selectionEnd = cursorPosition;
    textarea.focus();
  }


  document.querySelectorAll(".style-tool").forEach(button => {
    button.addEventListener("click", () => {
      const textarea = document.getElementById("markdown-editor-textarea");

      switch (button.id) {
        case "tool-bold":
          insertOrWrapText(textarea, "**", "**", "", 2);
          break;
        case "tool-italic":
          insertOrWrapText(textarea, "_", "_", "", 1);
          break;
        case "tool-strikethrough":
          insertOrWrapText(textarea, "~~", "~~", "", 2);
          break;
        case "tool-code":
          insertOrWrapText(textarea, "`", "`", "", 1);
          break;
        case "tool-link": {
          insertOrWrapText(textarea, "[", "](url)", "", 1);
          break;
        }
        case "tool-ul":
          insertOrWrapText(textarea, "- ", "", "", 2);
          break;
        case "tool-ol":
          insertOrWrapText(textarea, "1. ", "", "", 3);
          break;
        case "tool-code-block":
          insertOrWrapText(textarea, "```matlab\n\n", "```", "", 10);
          break;
        case "tool-image":
          insertOrWrapText(textarea, '![Alt text](image-url) ', "", "", 12);
            break;
        default:
          insertOrWrapText(textarea, "### ", "", "", 4);
      }

    });
  });


  // ✅ Keyboard Shortcuts
  document.addEventListener("keydown", (e) => {
    if (!e.metaKey && !e.ctrlKey) return;

    const textarea = document.getElementById("markdown-editor-textarea");
    if (!textarea.matches(":focus")) return;

    switch (e.key.toLowerCase()) {
      case "b":
        e.preventDefault();
        insertOrWrapText(textarea, "**", "**", "", 2);
        break;
      case "i":
        e.preventDefault();
        insertOrWrapText(textarea, "_", "_", "", 1);
        break;
      case "e":
        e.preventDefault();
        insertOrWrapText(textarea, "`", "`", "", 1);
        break;
      case "k":
        e.preventDefault();
        insertOrWrapText(textarea, "[", "](url)", "", 1);
    }
  })

  document.getElementById("markdown-editor-textarea").addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const textarea = e.target;
      const start = textarea.selectionStart;
      const before = textarea.value.substring(0, start);
      const after = textarea.value.substring(start);

      const lines = before.split("\n");
      const currentLine = lines[lines.length - 1];

      const ulMatch = currentLine.match(/^(\s*)[-*+] ?$/);
      const olMatch = currentLine.match(/^(\s*)(\d+)\. ?$/);
      const ulContinueMatch = currentLine.match(/^(\s*)[-*+] /);
      const olContinueMatch = currentLine.match(/^(\s*)(\d+)\. /);

      // Auto-remove empty unordered list item
      if (ulMatch) {
        e.preventDefault();
        const indent = ulMatch[1];
        const newText = "\n";
        textarea.value = before.replace(/[-*+] ?$/, "") + newText + after;
        const cursorPos = start - currentLine.length + indent.length + 1;
        textarea.selectionStart = textarea.selectionEnd = cursorPos;
        return;
      }

      // Auto-remove empty ordered list item
      if (olMatch) {
        e.preventDefault();
        const indent = olMatch[1];
        const newText = "\n";
        textarea.value = before.replace(/\d+\. ?$/, "") + newText + after;
        const cursorPos = start - currentLine.length + indent.length + 1;
        textarea.selectionStart = textarea.selectionEnd = cursorPos;
        return;
      }

      // Continue unordered list
      if (ulContinueMatch) {
        e.preventDefault();
        const indent = ulContinueMatch[1];
        const insertText = `\n${indent}- `;
        textarea.value = before + insertText + after;
        const cursorPos = start + insertText.length;
        textarea.selectionStart = textarea.selectionEnd = cursorPos;
        return;
      }

      // Continue ordered list
      if (olContinueMatch) {
        e.preventDefault();
        const indent = olContinueMatch[1];
        const number = parseInt(olContinueMatch[2], 10) + 1;
        const insertText = `\n${indent}${number}. `;
        textarea.value = before + insertText + after;
        const cursorPos = start + insertText.length;
        textarea.selectionStart = textarea.selectionEnd = cursorPos;
        return;
      }
    }
  });


});

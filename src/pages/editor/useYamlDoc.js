import { useMemo, useRef, useState } from "react";
import { parseDocument } from "yaml";

// How a file is written back: no re-wrapping of long lines, and [a, b] rather than [ a, b ],
// to match how the files are written by hand
export const OUTPUT = { lineWidth: 0, flowCollectionPadding: false };

// A YAML file held in memory for editing. It is a Document, not a plain object, so the
// comments and the layout of the file come back out when it is written: cards.yaml
// documents itself in comments, and dumping a parsed object would throw all of them away.
//
//   data            the current contents as a plain object, for the UI to read
//   change(edit)    runs `edit(doc)` on the Document and re-renders
//   dirty           whether it differs from what was loaded
//   text()          the file as it would be written
//   reset()         back to what was loaded
export function useYamlDoc(raw) {
  const doc = useRef(null);
  const baseline = useRef("");
  if (!doc.current) {
    doc.current = parseDocument(raw);
    // compared against a round trip of the original, not the original itself, since
    // writing a file back can tidy small things (quote style) without any edit
    baseline.current = doc.current.toString(OUTPUT);
  }

  const [version, setVersion] = useState(0);
  const text = () => doc.current.toString(OUTPUT);

  const data = useMemo(() => doc.current.toJS() ?? {}, [version]);
  const dirty = useMemo(() => text() !== baseline.current, [version]);

  return {
    data,
    dirty,
    text,
    change(edit) {
      edit(doc.current);
      setVersion(value => value + 1);
    },
    reset() {
      doc.current = parseDocument(raw);
      setVersion(value => value + 1);
    }
  };
}

// Saves text as a file through the browser, the way a download link would
export function download(filename, text) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/yaml" }));
  const link = Object.assign(document.createElement("a"), { href: url, download: filename });
  link.click();
  URL.revokeObjectURL(url);
}

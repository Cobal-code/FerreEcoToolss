import { Check, Info, Minus } from "lucide-react";

/**
 * Renderizador de descripciones de producto con mini-sintaxis:
 *
 *   ## Título de sección
 *   ### Subtítulo
 *   > Texto destacado (callout)
 *   - Viñeta simple
 *   * Viñeta con check
 *   | Columna | Valor |      (primera fila = encabezado)
 *   [[Título|Texto]]          (tarjeta resaltada, se agrupan en grid)
 *   ---                       (separador)
 *
 * Formato en línea: **negrita**
 */

const renderInline = (text: string, keyPrefix: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((chunk, i) => {
    if (chunk.startsWith("**") && chunk.endsWith("**") && chunk.length > 4) {
      return (
        <strong key={`${keyPrefix}-b-${i}`} className="font-bold text-foreground">
          {chunk.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${keyPrefix}-t-${i}`}>{chunk}</span>;
  });

type Block =
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "callout"; items: string[] }
  | { type: "bullets"; items: string[]; check: boolean }
  | { type: "table"; rows: string[][] }
  | { type: "cards"; items: { title: string; body: string }[] }
  | { type: "divider" };

const parse = (raw: string): Block[] => {
  const lines = raw.replace(/\r/g, "").split("\n");
  const blocks: Block[] = [];
  let i = 0;

  const push = (block: Block) => blocks.push(block);

  while (i < lines.length) {
    const line = lines[i].trim();

    if (!line) {
      i++;
      continue;
    }

    if (line === "---") {
      push({ type: "divider" });
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      push({ type: "heading", level: 3, text: line.slice(4).trim() });
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      push({ type: "heading", level: 2, text: line.slice(3).trim() });
      i++;
      continue;
    }

    if (line.startsWith("|") && line.endsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length) {
        const current = lines[i].trim();
        if (!current.startsWith("|") || !current.endsWith("|")) break;
        const cells = current.slice(1, -1).split("|").map((c) => c.trim());
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells);
        i++;
      }
      push({ type: "table", rows });
      continue;
    }

    if (line.startsWith("[[") && line.endsWith("]]")) {
      const items: { title: string; body: string }[] = [];
      while (i < lines.length) {
        const current = lines[i].trim();
        if (!current.startsWith("[[") || !current.endsWith("]]")) break;
        const [title, ...rest] = current.slice(2, -2).split("|");
        items.push({ title: title.trim(), body: rest.join("|").trim() });
        i++;
      }
      push({ type: "cards", items });
      continue;
    }

    if (line.startsWith("> ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        items.push(lines[i].trim().slice(2).trim());
        i++;
      }
      push({ type: "callout", items });
      continue;
    }

    if (line.startsWith("- ") || line.startsWith("* ")) {
      const check = line.startsWith("* ");
      const items: string[] = [];
      while (i < lines.length) {
        const current = lines[i].trim();
        const isCheck = current.startsWith("* ");
        const isDash = current.startsWith("- ");
        if ((!isCheck && !isDash) || isCheck !== check) break;
        items.push(current.slice(2).trim());
        i++;
      }
      push({ type: "bullets", items, check });
      continue;
    }

    const paragraph: string[] = [];
    while (i < lines.length) {
      const current = lines[i].trim();
      if (
        !current ||
        current === "---" ||
        /^(#{2,3} |> |- |\* |\|)/.test(current) ||
        current.startsWith("[[")
      )
        break;
      paragraph.push(current);
      i++;
    }
    push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
};

interface ProductDescriptionRendererProps {
  description: string;
}

export const ProductDescriptionRenderer = ({
  description,
}: ProductDescriptionRendererProps) => {
  const blocks = parse(description);

  return (
    <div className="space-y-5">
      {blocks.map((block, index) => {
        const key = `block-${index}`;

        switch (block.type) {
          case "heading":
            return block.level === 2 ? (
              <h3
                key={key}
                className="flex items-center gap-3 text-lg md:text-xl font-black uppercase tracking-wide text-foreground pt-2"
              >
                <span className="h-6 w-1.5 rounded-full bg-primary" />
                {renderInline(block.text, key)}
              </h3>
            ) : (
              <h4
                key={key}
                className="text-base font-bold text-primary tracking-wide"
              >
                {renderInline(block.text, key)}
              </h4>
            );

          case "paragraph":
            return (
              <p key={key} className="text-sm md:text-base leading-relaxed text-muted-foreground">
                {renderInline(block.text, key)}
              </p>
            );

          case "callout":
            return (
              <div
                key={key}
                className="flex gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4"
              >
                <Info className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                <div className="space-y-1">
                  {block.items.map((item, i) => (
                    <p
                      key={`${key}-c-${i}`}
                      className="text-sm md:text-base leading-relaxed text-foreground"
                    >
                      {renderInline(item, `${key}-c-${i}`)}
                    </p>
                  ))}
                </div>
              </div>
            );

          case "bullets":
            return (
              <ul key={key} className="space-y-2">
                {block.items.map((item, i) => (
                  <li key={`${key}-i-${i}`} className="flex gap-3 items-start">
                    {block.check ? (
                      <Check className="h-4 w-4 shrink-0 text-primary mt-1" />
                    ) : (
                      <Minus className="h-4 w-4 shrink-0 text-primary mt-1" />
                    )}
                    <span className="text-sm md:text-base leading-relaxed text-muted-foreground">
                      {renderInline(item, `${key}-i-${i}`)}
                    </span>
                  </li>
                ))}
              </ul>
            );

          case "table":
            return (
              <div
                key={key}
                className="overflow-x-auto rounded-xl border border-border"
              >
                <table className="w-full text-sm">
                  <thead className="bg-primary/10">
                    <tr>
                      {block.rows[0]?.map((cell, i) => (
                        <th
                          key={`${key}-h-${i}`}
                          className="px-4 py-2.5 text-left font-bold uppercase tracking-wide text-foreground"
                        >
                          {renderInline(cell, `${key}-h-${i}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.slice(1).map((row, r) => (
                      <tr
                        key={`${key}-r-${r}`}
                        className="border-t border-border odd:bg-muted/40"
                      >
                        {row.map((cell, c) => (
                          <td
                            key={`${key}-r-${r}-${c}`}
                            className="px-4 py-2.5 text-muted-foreground align-top"
                          >
                            {renderInline(cell, `${key}-r-${r}-${c}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );

          case "cards":
            return (
              <div key={key} className="grid gap-3 sm:grid-cols-2">
                {block.items.map((item, i) => (
                  <div
                    key={`${key}-k-${i}`}
                    className="rounded-xl border-2 border-border bg-background p-4 hover:border-primary/40 transition-colors"
                  >
                    <p className="mb-1 text-sm font-black uppercase tracking-wide text-primary">
                      {renderInline(item.title, `${key}-k-${i}-t`)}
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {renderInline(item.body, `${key}-k-${i}-b`)}
                    </p>
                  </div>
                ))}
              </div>
            );

          case "divider":
            return <div key={key} className="h-px w-full bg-border" />;

          default:
            return null;
        }
      })}
    </div>
  );
};

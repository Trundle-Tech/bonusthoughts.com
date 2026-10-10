import { PenLine } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { WritingDraft } from "@/lib/briefing/types";

export function WritingSection({ drafts }: { drafts: WritingDraft[] }) {
  return (
    <Card id="writing" className="scroll-mt-20 gap-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <PenLine className="size-4" /> Writing
        </CardTitle>
        <CardDescription>Drafts and outlines for bonusthoughts.com. Drafts only; nothing here is published.</CardDescription>
      </CardHeader>
      <CardContent>
        {drafts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No drafts in this briefing.</p>
        ) : (
          <Accordion type="multiple" className="w-full">
            {drafts.map((d, i) => (
              <AccordionItem key={i} value={String(i)}>
                <AccordionTrigger className="gap-3 text-sm">
                  <span className="flex flex-1 flex-wrap items-center gap-2 text-left">
                    {d.title || d.file || "Draft"}
                    {d.status && (
                      <Badge variant="secondary" className="text-[10px] uppercase">
                        {d.status}
                      </Badge>
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  {d.file && <div className="text-muted-foreground mb-2 font-mono text-[11px]">{d.file}</div>}
                  <pre className="bg-muted/50 max-h-96 overflow-auto rounded-md border p-3 font-sans text-sm leading-relaxed whitespace-pre-wrap">
                    {d.body || ""}
                  </pre>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}

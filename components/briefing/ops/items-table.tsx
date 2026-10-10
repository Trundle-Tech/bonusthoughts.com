"use client";

import * as React from "react";
import {
  flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel,
  useReactTable, type ColumnDef, type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LabelBadge } from "../label-badge";
import { isHttpUrl } from "@/lib/briefing/format";
import type { Item, LabelKey } from "@/lib/briefing/model";
import { useOps } from "./context";
import { EmptyState } from "./ui";

const LABEL_ORDER: Record<LabelKey, number> = { sourced: 0, estimate: 1, inferred: 2, unlabeled: 3 };

function SortHead({ column, children }: { column: import("@tanstack/react-table").Column<Item, unknown>; children: React.ReactNode }) {
  const s = column.getIsSorted();
  return (
    <Button variant="ghost" size="sm" className="-ml-2 h-7 px-2 text-xs" onClick={() => column.toggleSorting(s === "asc")}>
      {children}
      {s === "asc" ? <ArrowUp /> : s === "desc" ? <ArrowDown /> : <ArrowUpDown className="opacity-50" />}
    </Button>
  );
}

export function ItemsTable({ items, fixedAgent, pageSize = 12 }: { items: Item[]; fixedAgent?: string; pageSize?: number }) {
  const { openItem } = useOps();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [q, setQ] = React.useState("");
  const [agent, setAgent] = React.useState("all");
  const [label, setLabel] = React.useState("all");

  const agentNames = React.useMemo(() => Array.from(new Set(items.map((i) => i.agent))), [items]);

  const data = React.useMemo(
    () =>
      items.filter((i) => {
        if (!fixedAgent && agent !== "all" && i.agent !== agent) return false;
        if (label !== "all" && i.label !== label) return false;
        if (q) {
          const hay = `${i.title} ${i.detail} ${i.source ?? ""} ${i.tags.join(" ")}`.toLowerCase();
          if (!hay.includes(q.toLowerCase())) return false;
        }
        return true;
      }),
    [items, fixedAgent, agent, label, q]
  );

  const columns = React.useMemo<ColumnDef<Item>[]>(
    () => [
      ...(fixedAgent
        ? []
        : [{ accessorKey: "agent", header: ({ column }) => <SortHead column={column}>Agent</SortHead>, cell: ({ row }) => <span className="text-xs font-medium whitespace-nowrap">{row.original.agent}</span> } as ColumnDef<Item>]),
      {
        accessorKey: "title",
        header: ({ column }) => <SortHead column={column}>Item</SortHead>,
        cell: ({ row }) => (
          <div className="min-w-0 max-w-[26rem]">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-medium">{row.original.title}</span>
              {row.original.isNew && <Badge className="h-4 gap-0.5 px-1 text-[9px]"><Sparkles className="size-2.5" />NEW</Badge>}
            </div>
            {row.original.tags.length > 0 && <div className="text-muted-foreground truncate text-[11px]">{row.original.tags.join(" · ")}</div>}
          </div>
        ),
      },
      {
        accessorKey: "label",
        header: ({ column }) => <SortHead column={column}>Label</SortHead>,
        sortingFn: (a, b) => LABEL_ORDER[a.original.label] - LABEL_ORDER[b.original.label],
        cell: ({ row }) => <LabelBadge label={row.original.label === "unlabeled" ? undefined : row.original.label} />,
      },
      {
        accessorKey: "source",
        header: ({ column }) => <SortHead column={column}>Source</SortHead>,
        cell: ({ row }) => {
          const s = row.original.source;
          return s ? (
            <span className="text-muted-foreground block max-w-48 truncate font-mono text-[11px]" title={s}>
              {isHttpUrl(s) ? new URL(s).hostname : s}
            </span>
          ) : (
            <span className="text-muted-foreground text-[11px]">none</span>
          );
        },
      },
      {
        accessorKey: "date",
        header: ({ column }) => <SortHead column={column}>Date</SortHead>,
        sortUndefined: "last",
        cell: ({ row }) => <span className="font-mono text-[11px] whitespace-nowrap">{row.original.date ?? "—"}</span>,
      },
      {
        id: "seen",
        accessorFn: (r) => r.history.length,
        header: ({ column }) => <SortHead column={column}>Days seen</SortHead>,
        cell: ({ row }) => <span className="text-xs tabular-nums">{row.original.history.length}</span>,
      },
    ],
    [fixedAgent]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });


  return (
    <Card className="gap-3 py-3">
      <CardContent className="space-y-3 px-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-48 flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter title, detail, source, tags" className="h-8 pl-8 text-sm" aria-label="Filter items" />
          </div>
          {!fixedAgent && (
            <Select value={agent} onValueChange={setAgent}>
              <SelectTrigger size="sm" className="w-40" aria-label="Filter by agent"><SelectValue placeholder="Agent" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All agents</SelectItem>
                {agentNames.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
          <ToggleGroup type="single" variant="outline" size="sm" value={label} onValueChange={(v) => setLabel(v || "all")} aria-label="Filter by label">
            {["all", "sourced", "estimate", "inferred", "unlabeled"].map((l) => (
              <ToggleGroupItem key={l} value={l} className="px-2 text-xs capitalize">{l}</ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>

        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((h) => (
                    <TableHead key={h.id} className="h-9">{h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}</TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer" tabIndex={0} onClick={() => openItem(r.original)} onKeyDown={(e) => e.key === "Enter" && openItem(r.original)}>
                    {r.getVisibleCells().map((c) => <TableCell key={c.id} className="py-2">{flexRender(c.column.columnDef.cell, c.getContext())}</TableCell>)}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="p-3">
                    <EmptyState title={items.length ? "No items match these filters" : "No items in this briefing"} className="min-h-24 border-0" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground tabular-nums">
            {data.length} of {items.length} {items.length === 1 ? "item" : "items"}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground tabular-nums">Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}</span>
            <Button variant="outline" size="sm" className="h-7" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Prev</Button>
            <Button variant="outline" size="sm" className="h-7" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

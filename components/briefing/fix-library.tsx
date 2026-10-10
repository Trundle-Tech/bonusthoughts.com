import { Library } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function FixLibrary() {
  return (
    <Card id="library" className="scroll-mt-20 gap-4 border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Library className="size-4" /> Chokepoint and fix library
        </CardTitle>
        <CardDescription>
          Reserved. A growing, sourced map of data center operations chokepoints and repeatable fixes, read in OUE terms, will live here.
        </CardDescription>
        <CardAction>
          <Badge variant="outline" className="border-dashed">Coming later</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Chokepoint</TableHead>
              <TableHead>Labor category</TableHead>
              <TableHead>Fix pattern</TableHead>
              <TableHead>OUE direction</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Sites tested</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={6} className="text-muted-foreground py-8 text-center">
                No entries yet.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

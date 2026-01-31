"use client";

interface MatrixRow {
  task: string;
  recommended: string;
  runner: string;
  reason: string;
}

interface DecisionMatrixProps {
  rows: MatrixRow[];
}

export function DecisionMatrix({ rows }: DecisionMatrixProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#F4EDE4]/20">
            <th className="text-left py-3 px-4 font-semibold text-[#F4EDE4]">Task</th>
            <th className="text-left py-3 px-4 font-semibold text-cyan-400">Best Tool</th>
            <th className="text-left py-3 px-4 font-semibold text-[#5a8a65]">Runner-up</th>
            <th className="text-left py-3 px-4 font-semibold text-[#D4C4B0]">Why</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-[#F4EDE4]/10 hover:bg-[#F4EDE4]/5">
              <td className="py-3 px-4 text-[#F4EDE4]">{row.task}</td>
              <td className="py-3 px-4 text-cyan-400 font-medium">{row.recommended}</td>
              <td className="py-3 px-4 text-[#5a8a65]">{row.runner}</td>
              <td className="py-3 px-4 text-[#D4C4B0]">{row.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

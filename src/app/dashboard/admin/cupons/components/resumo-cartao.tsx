'use client';

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Ticket, XCircle } from "lucide-react";

interface ResumoCartaoProps {
  titulo: string;
  valor: number;
  descricao: string;
  icone: string; // Nomes dos ícones que podemos usar
}

export function ResumoCartao({ titulo, valor, descricao, icone }: ResumoCartaoProps) {
  return (
    <Card className="border border-gray-100 dark:border-gray-800 shadow-sm rounded-[10px]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {titulo}
            </p>
            <h3 className="mt-1 text-2xl font-semibold">
              {valor}
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {descricao}
            </p>
          </div>
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            {icone === 'Ticket' && <Ticket className="h-6 w-6" />}
            {icone === 'CheckCircle' && <CheckCircle className="h-6 w-6" />}
            {icone === 'XCircle' && <XCircle className="h-6 w-6" />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

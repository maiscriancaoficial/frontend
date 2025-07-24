import { Card, CardContent } from "@/components/ui/card";

interface ResumoCartaoProps {
  titulo: string;
  valor: number;
  descricao: string;
  icone?: React.ReactNode;
}

export function ResumoCartao({ titulo, valor, descricao, icone }: ResumoCartaoProps) {
  return (
    <Card className="border border-gray-100 dark:border-gray-800 shadow-sm rounded-[10px]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{titulo}</p>
            <h3 className="text-2xl font-bold mt-1">{valor}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{descricao}</p>
          </div>
          {icone && (
            <div className="text-gray-400 dark:text-gray-500">
              {icone}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type Message = {
  id: number;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

export function ChatFlutuante() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: 'Olá! Como posso ajudar com livros infantis personalizados?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Função para simular resposta do atendente
  const simulateResponse = (userMessage: string) => {
    setIsTyping(true);

    // Respostas pré-definidas baseadas em palavras-chave
    const keywords = {
      'entrega': 'Realizamos entregas em todo o Brasil. Nossos livros personalizados são enviados em até 7 dias úteis após a aprovação da personalização.',
      'pagamento': 'Aceitamos cartões de crédito, débito, PIX, boleto bancário e transferência. Parcelamos em até 6x sem juros!',
      'devolução': 'Por se tratar de um produto personalizado, não realizamos trocas ou devoluções, exceto em caso de defeito na produção do livro.',
      'horário': 'Nosso atendimento funciona de segunda a sexta, das 9h às 18h, e aos sábados das 9h às 14h.',
      'presente': 'Oferecemos opções de embalagens para presente e cartões personalizados para tornar seu presente ainda mais especial!',
      'frete': 'O valor do frete é calculado de acordo com o CEP de entrega. Temos frete grátis para compras acima de R$250.',
      'personalização': 'Nossos livros podem ser personalizados com nome, características físicas, dedicatória e até fotos da criança.',
      'idade': 'Temos livros adequados para crianças de 0 a 12 anos, com histórias adaptadas para cada faixa etária.',
    };

    // Verificar se a mensagem contém alguma das palavras-chave
    let response = 'Agradecemos seu contato! Um de nossos atendentes retornará em breve. Se preferir, entre em contato pelo WhatsApp (11) 9999-8888 ou e-mail contato@livrosmaiscrianca.com.br';
    
    for (const [key, value] of Object.entries(keywords)) {
      if (userMessage.toLowerCase().includes(key)) {
        response = value;
        break;
      }
    }

    // Simula tempo de resposta entre 1 e 2 segundos
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: response,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, Math.random() * 1000 + 1000);
  };

  // Enviar mensagem
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      content: newMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    simulateResponse(newMessage);
  };

  // Formatar horário
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botão do chat */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-16 h-16 rounded-full bg-[#27b99a] text-white shadow-lg flex items-center justify-center",
          "hover:bg-[#27b99a]/80 transition-colors duration-300",
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>

      {/* Janela do chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="w-80 sm:w-96 h-[500px] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 dark:border-gray-800"
          >
            {/* Header do chat */}
            <div className="bg-[#27b99a]/90 p-4 text-white flex items-center justify-between rounded-t-3xl">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-[#ff0080]"></div>
                <h3 className="font-semibold">Atendimento Mais Criança</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-pink-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mensagens */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.isUser ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl p-3",
                      message.isUser
                        ? "bg-[#27b99a]/90 text-white rounded-br-none"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-none"
                    )}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <Avatar className="w-6 h-6">
                        {message.isUser ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <img src="/logo-icon.png" alt="Atendente" />
                        )}
                      </Avatar>
                      <span className="text-xs opacity-75">
                        {message.isUser ? "Você" : "Consultor"}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-75 text-right mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {/* Indicador de digitação */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 dark:bg-gray-800/80 rounded-2xl p-3 max-w-[80%] rounded-bl-none">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Digitando...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input de mensagem */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-800 flex space-x-2 bg-gray-50 dark:bg-gray-900">
              <Input
                type="text"
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 rounded-full border-gray-200 dark:border-gray-700 focus-visible:ring-[#27b99a]/50"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={!newMessage.trim()} 
                className="rounded-full bg-[#27b99a] hover:bg-[#27b99a]/80 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

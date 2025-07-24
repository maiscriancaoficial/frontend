// Este arquivo é apenas para teste e deve redirecionar para a página principal
// mas com uma configuração que sobrescreva completamente o layout
// Podemos usá-lo temporariamente para verificar a página sem header/footer

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NoLayoutPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Verifica se estamos no navegador
    if (typeof window !== 'undefined') {
      // Remove estilos ou elementos específicos que podem estar vindo do layout global
      document.body.style.margin = '0';
      document.body.style.padding = '0';
      
      // Procura por elementos de header e footer e os esconde
      const hideGlobalElements = () => {
        // Tenta encontrar e esconder o header
        const headers = document.querySelectorAll('header');
        headers.forEach(header => {
          header.style.display = 'none';
        });
        
        // Tenta encontrar e esconder o footer
        const footers = document.querySelectorAll('footer');
        footers.forEach(footer => {
          footer.style.display = 'none';
        });
        
        // Verifica se há outros elementos que possam ser o header/footer
        const possibleHeaders = document.querySelectorAll('nav, [id*="header"], [class*="header"], [id*="nav"], [class*="nav"]');
        possibleHeaders.forEach(el => {
          if (el.tagName !== 'MAIN' && el.tagName !== 'ARTICLE') {
            el.style.display = 'none';
          }
        });
        
        const possibleFooters = document.querySelectorAll('[id*="footer"], [class*="footer"]');
        possibleFooters.forEach(el => {
          el.style.display = 'none';
        });
      };
      
      // Executa a função imediatamente e também após um pequeno delay
      // para garantir que todos os elementos foram carregados
      hideGlobalElements();
      setTimeout(hideGlobalElements, 100);
      setTimeout(hideGlobalElements, 500);
      setTimeout(hideGlobalElements, 1000);
      
      // Se quisermos voltar para a página original
      // router.push('/categoria/[slug]/livro/[livroSlug]/previa-livro');
    }
  }, []);
  
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100%', 
      background: '#fff',
      zIndex: 9999,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <h2>Carregando visualização do livro...</h2>
      <p>Removendo elementos globais do layout...</p>
    </div>
  );
}

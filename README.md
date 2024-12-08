# YouTube Comments Pro

Uma ferramenta profissional para extrair e analisar comentários de vídeos do YouTube.

## Funcionalidades

- Extração de comentários de qualquer vídeo do YouTube
- Paginação de resultados
- Filtro de comentários em tempo real
- Exportação para CSV
- Tema claro/escuro
- Interface responsiva e moderna
- Cache de resultados para melhor performance
- Tratamento de erros robusto

## Tecnologias Utilizadas

- HTML5
- CSS3 (com variáveis CSS para temas)
- JavaScript (ES6+)
- Bootstrap 5.3.2
- Font Awesome 6.4.2
- Axios para requisições HTTP
- YouTube Data API v3

## Configuração

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure sua chave da API do YouTube:
   - Renomeie o arquivo `.env.example` para `.env`
   - Adicione sua chave da API do YouTube no arquivo `.env`:
   ```
   YOUTUBE_API_KEY=sua_chave_aqui
   ```

4. Inicie o servidor de desenvolvimento:
```bash
npm start
```

## Estrutura do Projeto

```
├── src/
│   ├── js/
│   │   ├── api.js      # Configuração e chamadas da API
│   │   ├── ui.js       # Componentes da interface
│   │   └── main.js     # Lógica principal da aplicação
│   └── css/
│       └── styles.css  # Estilos personalizados
├── index.html          # Página principal
├── package.json        # Dependências e scripts
└── README.md          # Documentação
```

## Como Usar

1. Cole o link do vídeo do YouTube no campo de busca
2. Clique em "Buscar" ou pressione Enter
3. Use o campo de filtro para buscar comentários específicos
4. Navegue entre as páginas usando os controles de paginação
5. Clique em "Baixar CSV" para exportar os comentários

## Limitações da API

- Máximo de 100 comentários por requisição
- Quota diária limitada pela API do YouTube
- Alguns vídeos podem ter comentários desativados

## Contribuindo

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

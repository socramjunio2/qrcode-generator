# QR Code Generator

Este é um projeto de um gerador de QR Code em React que permite criar QR Codes do tipo vCard e URL.
você consegue acessar e gerar gratuitamente através da url [http://qrcode-gratis.vmtech.net.br/](http://qrcode-gratis.vmtech.net.br/)

Procurei em vários locais geradores de QRCodes, não encontrei geradores descentes e gratuítos de verdade.
resolvi criar esse projeto open source para ajudar as pessoas a executar essa tarefa simples.

## Funcionalidades

- Gerar QR Codes do tipo vCard e URL
- Personalizar a cor do QR Code
- Visualizar uma prévia da imagem do QR Code
- Baixar o QR Code gerado em formato SVG

## Tecnologias Utilizadas

- React
- TypeScript
- QRCode.react
- FileSaver.js

## Como Executar o Projeto

### Pré-requisitos

Para executar este projeto, você precisa ter instalado:

- Node.js
- npm ou yarn

### Passos para Instalação

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/qr-code-generator.git
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd qr-code-generator
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```
   ou
   ```bash
   yarn install
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm start
   ```
   ou
   ```bash
   yarn start
   ```

O projeto será executado em `http://localhost:3006`.

## Estrutura do Projeto

- `src/components/QRCodeForm.tsx`: Componente principal que contém o formulário para gerar QR Codes.
- `src/assets/vmtech-logo.png`: Logotipo utilizado no projeto.

## Como Usar

1. Selecione o tipo de QR Code (vCard ou URL).
2. Preencha os campos com as informações necessárias.
3. Selecione a cor do QR Code.
4. Visualize a prévia do QR Code gerado.
5. Clique no botão de download para baixar o QR Code em formato SVG.

## Contribuição

Se você quiser contribuir com este projeto, siga os passos abaixo:

1. Fork o repositório
2. Crie uma branch para a sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faça um push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## Contato

Para mais informações, entre em contato com:

- [Marcos Moraes](mailto:socramjunio@gmail.com)
- GitHub: [@socramjunio2](https://github.com/socramjunio2)

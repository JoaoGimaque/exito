<div align="center">

# Êxito Multimarcas

### Estoque de veículos, atendimento direto e gestão em um só lugar.

Catálogo público para encontrar veículos sem criar uma conta, com contato pelo WhatsApp e painel administrativo para gerenciar o estoque.

<br>

![Angular](https://img.shields.io/badge/Angular-17-DD0031?logo=angular&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.2-6DB33F?logo=springboot&logoColor=white)
![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)

</div>

<br>

## Visão geral

A Êxito Multimarcas é uma aplicação web composta por uma interface Angular e uma API Spring Boot. O visitante pode consultar o estoque e falar com a loja sem cadastro; a equipe administra os veículos em uma área autenticada.

| Área | Endereço local |
| --- | --- |
| Site | `http://localhost:4200` |
| API | `http://localhost:8080` |
| Banco de dados | MySQL, banco `exito` |

## O que dá para fazer

- Explorar o estoque público, pesquisar veículos e filtrar por marca e categoria.
- Abrir os detalhes de um veículo, navegar pelas fotos e iniciar uma conversa no WhatsApp com uma mensagem preenchida.
- Simular uma parcela estimada e enviar o pedido de condições pelo WhatsApp.
- Solicitar avaliação para vender um veículo e enviar mensagens de contato.
- Administrar o estoque: cadastrar, editar e excluir veículos, anexar várias fotos e registrar o proprietário.

> O nome do proprietário é informação interna: aparece no painel e nas respostas administrativas, mas não no catálogo público nem nos detalhes acessíveis a visitantes.

## Páginas

| Página | Rota |
| --- | --- |
| Início | `/` |
| Estoque público | `/estoque` |
| Detalhe do veículo | `/customer/car/:id` |
| Simulação de financiamento | `/financiamento` |
| Avaliação de veículo | `/venda-seu-carro` |
| Contato | `/contato` |
| Acesso da equipe | `/login` |
| Painel administrativo | `/admin/dashboard` |

## Tecnologias

**Frontend:** Angular 17, TypeScript, SCSS e NG-ZORRO.  
**Backend:** Java 21, Spring Boot 3, Spring Security, JWT e Spring Data JPA.  
**Persistência:** MySQL.

## Requisitos

- Node.js compatível com Angular 17 e npm.
- Java Development Kit (JDK) 21.
- MySQL em execução e um banco chamado `exito`.

## Configuração

1. Crie o banco de dados no MySQL:

   ```sql
   CREATE DATABASE exito CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Configure a conexão, o usuário e a senha do banco no arquivo `exito-spring/src/main/resources/application.properties`. A aplicação usa `spring.jpa.hibernate.ddl-auto=update` para atualizar as tabelas conforme as entidades.

3. Configure uma chave JWT própria e segura para o ambiente. Não publique senhas, tokens ou chaves secretas em commits ou documentação.

Para desenvolvimento local, a aplicação usa os valores padrão de `localhost:3306/exito`. Configure sua senha local do MySQL em `SPRING_DATASOURCE_PASSWORD` antes de iniciar a API. A conexão e a chave JWT podem ser substituídas pelas variáveis `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD` e `JWT_KEY`.

4. Instale as dependências do frontend:

   ```powershell
   cd exito-angular
   npm ci
   ```

## Executar localmente

Abra dois terminais PowerShell na pasta raiz do projeto.

**Terminal 1: API**

```powershell
cd exito-spring
.\mvnw.cmd spring-boot:run
```

**Terminal 2: site**

```powershell
cd exito-angular
npm start
```

Depois, acesse `http://localhost:4200`.

> O backend está configurado para Java 21. Se o Maven informar que a versão 21 não está disponível, instale e selecione um JDK 21 antes de iniciar.

## Testes e build

**Angular**

```powershell
cd exito-angular
npm run build
npm test -- --watch=false
```

**Spring Boot**

```powershell
cd exito-spring
.\mvnw.cmd test
```

## API

| Método | Endpoint | Acesso |
| --- | --- | --- |
| `GET` | `/api/customer/cars` | Público |
| `GET` | `/api/customer/car/{id}` | Público |
| `POST` | `/api/auth/login` | Público |
| `POST` | `/api/auth/signup` | Público |
| `GET` | `/api/admin/cars` | Administrador autenticado |
| `GET` | `/api/admin/car/{id}` | Administrador autenticado |
| `POST` | `/api/admin/car` | Administrador autenticado, `multipart/form-data` |
| `PUT` | `/api/admin/car/{id}` | Administrador autenticado, `multipart/form-data` |
| `DELETE` | `/api/admin/car/{id}` | Administrador autenticado |
| `POST` | `/api/admin/car/search` | Administrador autenticado |

Para cadastrar ou atualizar fotos, envie os arquivos como campos repetidos `images`. O campo `ownerName` é enviado junto aos dados do veículo e só é devolvido pelas rotas administrativas.

## Estrutura

```text
exito-angular/   Interface web Angular
exito-spring/    API, autenticação e persistência Spring Boot
README.md        Guia do projeto
```

## Observações

- Os botões de contato usam o número de WhatsApp definido no frontend. Atualize o número nos componentes caso a loja utilize outra linha.
- A parcela apresentada na página de financiamento é uma estimativa, não uma proposta de crédito. A aprovação e as condições dependem da instituição financeira.
- O catálogo e os detalhes são públicos. As operações de gestão permanecem protegidas pela autenticação administrativa.
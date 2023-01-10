# TFC: Trybe Futebol Clube

# Funcionamento da aplicação

Para rodar está aplicação é necessário ter **Git**, **Docker**, **Node** e o **Docker Compose** instalados no seu computador. O Docker Compose precisa estar na versão **1.29** ou superior e o Node na versão **16**.

### 1 - Clone o repositório e entre na pasta do projeto

```
git clone git@github.com:GabrielGomesFer/TFC.git && cd trybe-futebol-clube
```

### 2 - Execute o comando para criação dos containers do Docker

```
npm run compose:up
```

### 3 - Acesse a aplicação no seu navegador pelo link

http://localhost:3000/

### 4 - Utilize uma das credenciais abaixo para logar na aplicação e testar

#### Administrador

* email: admin@admin.com
* password: secret_admin

#### Usuário comum

* email: user@user.com
* password: secret_user

O projeto trata-se de um desafio para consolidar todo o aprendizado até então em backend. Sendo o projeto mais desafiador da Trybe até o momento, tivemos que utilizar todos os conceitos ensinados e praticados desde então - utilização de HOFs, CRUD, Sequelize, manipulação do banco de dados, criação e validação de tokens JWT para login/cadastro de usuários, validação/criptografia de senhas com o BCrypt e muito mais.

Com isso, o projeto trata-se de um sistema de gerenciamento de campeonato do *Trybe Futebol Clube* (vide nome do projeto). Nele, é possível realizar login como um usuário comum ou como um administrador; visualizar partidas em andamento e já finalizadas; alterar o placar das partidas em andamento; finalizar partidas em andamento; adicionar novas partidas e visualizar o placar geral do campeonato.

A parte do frontend da aplicação já veio pronta pela Trybe. No entanto, todo o Backend e validações foram realizadas por mim. Além de tudo isso, implementei testes de integração que garantem o funcionamento do código.

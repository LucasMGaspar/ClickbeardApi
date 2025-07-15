# ClickBeard - Sistema de Agendamento para Barbearia

Observação: Fiquei em dúvida se deveria utilizar Next.js no frontend ou se poderia empregar o Prisma ORM com MySQL no backend, pois o PDF não mencionava esses requisitos. No fim, optei por desenvolver o frontend apenas com React e utilizei Prisma + MySQL para persistência de dados. Além disso, o visual não ficou tão elaborado, já que executei o desafio somente após meu expediente e o tempo era limitado.

Sistema  para gerenciamento de agendamentos de barbearia, desenvolvido com Node.js (NestJS) no backend e React com TypeScript no frontend.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com **NestJS**
- **TypeScript**
- **Prisma ORM**
- **MySQL** 
- **JWT** para autenticação
- **Docker** para o banco de dados

### Frontend
- **React** com **TypeScript**
- **React Router DOM** para navegação
- **React Hook Form** + **Zod** para validação
- **Axios** para requisições HTTP
- **CSS** puro para estilização

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Docker e Docker Compose
- Git
- Precisa estar com docker rodando!!
## 🔧 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/LucasMGaspar/ClickbeardApi.git
cd ClickbeardApi.git
```

### 2. Configure o Backend

#### 2.1. Entre na pasta do backend
```bash
cd click-beard
```

#### 2.2. Instale as dependências
```bash
npm install
```

#### 2.3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do backend com o seguinte conteúdo:

```env
# Database
DATABASE_URL="mysql://root:12345678@localhost:3306/click-beard"

# JWT
JWT_PRIVATE_KEY=JWT_PRIVATE_KEY="LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tDQpNSUlFdlFJQkFEQU5CZ2txaGtp
Rzl3MEJBUUVGQUFTQ0JLY3dnZ1NqQWdFQUFvSUJBUUM4VkhaYVZMZUlRbXZyDQpj
OG4zOUNGQmpPYy9xVkFXS0JrdXBzbTNUcG9mbjFwMkU5RVgrSlplOEpFbVZ2R1Ey
eTBNSDV3Y2l0ODhTNTZODQpkYjQ2YVMzc2t6VHBhR05uaEh1YUNvdEQyNkVwNEJL
U3k2OTQrVW5TSHJuamJIY2x4aVlraGtQY1JhUVFzUE5UDQpyME9EWHJSUXJVc0RC
NDUraTJBSWgvb1N3eEM3QjdiMlVZelh6bzI1SmNjMVRWUnFGN1VVNmJwWVFES04z
QW5zDQpOZzdDUXR5UGsrL0N3Uk55QTVEeUhkZUxVdnhneGU2aHZ3UXFLQ2xUQm1p
aURiclpTWmhyQXN6aTlGSTR0QXNXDQozWFhXUmcwVjMzTTN4RFVSVk9KTTRJekxQ
V0RaeDlFdENQcXg2NEJlaXVZRXNqR2pBNU4zQmUySy9UbDVGbGx5DQo5Si9TVXFN
UkFnTUJBQUVDZ2dFQUFwUy84RS9tQXBMMzdBaTJrK1hyTHNMTmEzS3FPZlQzRjhB
NHM0RDdMcXgrDQpQVUYrRndhOWd3Vm5qeUVqWG1hdU9CaXVGSDdLQTFqT3NVdk4v
Vzd5SXVoQmtoejdhSUgzbFlLdzhCcjJHelpFDQp4UlFWam5sdG5UWEhVZzBsYVQv
WTNyUmVMNHBIdEo1K0NLNGU5c0FoNHJCeHJVZzVtQlZNamRGZ3R1dExTbENGDQpu
T0U4V1BxVkJLWUtsNXZXYkJyV3Rma29oRGh0WDhlU0N3d2prN2hYMFdvQ2NoMTdI
K2dvclRvWFRuak85bDA2DQo4M08yY3BVNkVWMkhmbWJSL3NsWUMzdEluM3V2Mlls
SDhFMXVjeTZrQlYzcFNMZ3ZGcFNDOXppN2d3QncveE5pDQp4d3UwNDZxVVRvaWxR
TENNV3ovRDNwOVZpU2xQS2ZLbzJJai9OeUZ6Z1FLQmdRRHl3aC9aalBYdDVic3k2
OGRHDQpqOFFSTmlybFFIcDJGVFdma2RBMWtwL0VkUUJyRnh3Qy85OGNCeFIvUnVR
RTNRckFBSjJmVHk4UmpqaUtkQzZ4DQozOU9KQ1poOEhzV0dqYlh6R0hZVG82TExQ
V0NBUmdXMFZLblhEVmM1K3NzUDZJTlFNTzAvTUpuSWVoQmc1aFdjDQpCSXU1SjRJ
ZkpqOGRWT3hSemhwQW9nN21iUUtCZ1FER21renJkVHNJN3J4Q2RPRXpMbFZUTmd6
KzRnWDBsbFYzDQo2T2hxdmZaem8zeW5KZmNiamdUOWI3Mmk4QWppTVVlT002WWpi
SHBidnVoYzlJVEFlKzMvZnJzR0x2TitoUEdtDQpraDdHSklyUkxzeHh4NmsxQThj
MWdkbk5GZ0U5eldiTXgrT3VBTDdDV3F3RTE3bHBBWjdkNFNkcUlla2lEYXdJDQpM
elhiVVQyWXRRS0JnQUw2WnJHZ2pSUFNFYTNhUHFPYTkrak9KVkNTcmUzczdLOThk
blZ4eXd2NTgzdGMyVGNnDQpOSGgvamJ6Ui9kSWhkQlJPN2FBYXRKVWVqWXNGU2Qx
Y3haZVV5bzRiUW9rWUMvZGpnVzlVUHBjSHRidGRJSXpKDQp6UnVhU2t1bnkvM3gr
RXB2anptTE94ZStoNXpvdGJNb1N4NkdZWTVJUmRYeVNNUG9KMkpMbXFzeEFvR0Fh
eWhjDQpNbnRaZEJOa0xyTmp3enJQdlFzZjdmTEVaZGtybW54bjB4aFdQc1RLZ0dH
Q3VESmp6Tjhhd2l5ampuQXFmTGF2DQpnTk9LSGJDZkxYQ2RwRUg2QTI0OHVUUmlH
elRlTWhNTFdidmp6c1JpZVUzU3BaRTVUa3lXMlFwemR3WTUzbXBJDQpGZDIvRDV6
ZXplb2IxMldSYzRTRndNVTFSak44VEJvMUEvWU10elVDZ1lFQXR3YXk5eHcwN2o2
emMvNGJjcldKDQo5THZaaTlTNG5UZkFuN0hzZ3RvWGE0TTcrMUlkZEdqZFg1dTEx
QkN0emZqNGFvZmpGMFJiM1dpczZMaCtaR1ErDQo3VDFYNFFRNnppSFpFOXNKc2Vl
Q3RLRDV4WU5UVXdEeUVDcUNGQjc0ZUZzNmZtZEQwbzZpTVVzQ1lDd2FaRXg1DQpO
U1pwWGRkY2h4bEdDNC8vTnVhUE9Ccz0NCi0tLS0tRU5EIFBSSVZBVEUgS0VZLS0t
LS0NCg==
"

JWT_PUBLIC_KEY=JWT_PUBLIC_KEY="LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0NCk1JSUJJakFOQmdrcWhraUc5dzBC
QVFFRkFBT0NBUThBTUlJQkNnS0NBUUVBdkZSMldsUzNpRUpyNjNQSjkvUWgNClFZ
em5QNmxRRmlnWkxxYkp0MDZhSDU5YWRoUFJGL2lXWHZDUkpsYnhrTnN0REIrY0hJ
cmZQRXVlalhXK09ta3QNCjdKTTA2V2hqWjRSN21ncUxROXVoS2VBU2tzdXZlUGxK
MGg2NTQyeDNKY1ltSklaRDNFV2tFTER6VTY5RGcxNjANClVLMUxBd2VPZm90Z0NJ
ZjZFc01RdXdlMjlsR00xODZOdVNYSE5VMVVhaGUxRk9tNldFQXlqZHdKN0RZT3dr
TGMNCmo1UHZ3c0VUY2dPUThoM1hpMUw4WU1YdW9iOEVLaWdwVXdab29nMjYyVW1Z
YXdMTTR2UlNPTFFMRnQxMTFrWU4NCkZkOXpOOFExRVZUaVRPQ015ejFnMmNmUkxR
ajZzZXVBWG9ybUJMSXhvd09UZHdYdGl2MDVlUlpaY3ZTZjBsS2oNCkVRSURBUUFC
DQotLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0NCg==
"

# Server
PORT=3333
```

**Nota**: Se precisar  gerar  novas chaves JWT, você pode usar:
```bash
# Gerar chave privada
openssl genrsa -out private.pem 2048

# Gerar chave pública
openssl rsa -in private.pem -pubout -out public.pem
```
#### Mas acredito que só ultlizar as mesmas chaves JWT, que esta acima

#### 2.4. Inicie o banco de dados com Docker
```bash
docker-compose up -d
```

#### 2.5. Execute as migrations do Prisma
```bash
npx prisma generate   
```

#### 2.6. Trouxe essa opção para popular o banco com dados iniciais (Vai gerara esse user admin: admin@clickbeard.com, senha: admin123 )
```bash
npx prisma db seed


```

#### 2.7. Inicie o servidor
```bash
npm run start:dev
```

O backend estará rodando em `http://localhost:3333`


### Como Cliente (USER)

1. **Cadastro**: Acesse a aplicação e clique em "Cadastre-se"
2. **Login**: Entre com seu email e senha
3. **Agendar**: 
   - Clique em "Novo Agendamento"
   - Escolha a especialidade desejada
   - Selecione o barbeiro
   - Escolha a data (exceto domingos)
   - Selecione um horário disponível
4. **Cancelar**: Você pode cancelar agendamentos com até 2h de antecedência

### Como Administrador (ADMIN)

Para criar um usuário admin, você precisa atualizar diretamente no banco:

```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'seu-email@example.com';
```

Como admin você pode:
- Cadastrar novos barbeiros
- Criar especialidades
- Visualizar todos os agendamentos

## 🏗️ Estrutura do Projeto

### Backend
```
click-beard/
├── src/
│   ├── controllers/     # Controllers da aplicação
│   ├── auth/           # Módulo de autenticação
│   ├── prisma/         # Configuração do Prisma
│   ├── pipes/          # Pipes de validação
│   └── app.module.ts   # Módulo principal
├── prisma/
│   └── schema.prisma   # Schema do banco de dados
├── docker-compose.yml  # Configuração do Docker
└── package.json
```


##  API Endpoints

### Autenticação
- `POST /accounts` - Criar conta
- `POST /sessions` - Login

### Barbeiros
- `GET /barbers` - Listar barbeiros
- `POST /barbers` - Criar barbeiro (Admin)

### Especialidades
- `GET /specialties` - Listar especialidades
- `POST /specialties` - Criar especialidade (Admin)

### Agendamentos
- `GET /appointments/my` - Meus agendamentos
- `POST /appointments` - Criar agendamento
- `PATCH /appointments/:id/cancel` - Cancelar agendamento
- `GET /appointments/available-times` - Horários disponíveis

##  Regras de Negócio

1. **Horário de funcionamento**: 8h às 18h
2. **Dias de funcionamento**: Segunda a Sábado (fechado aos domingos)
3. **Duração do atendimento**: 30 minutos
4. **Cancelamento**: Mínimo 2 horas de antecedência
5. **Agendamento**: Apenas em horários futuros



### Erro de conexão com o banco
- Verifique se o Docker está rodando: `docker ps`
- Verifique as credenciais no `.env`


### Erro ao criar agendamento
- Verifique se o barbeiro possui a especialidade selecionada
- Confirme que o horário está disponível
- Certifique-se que não é domingo


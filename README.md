# Clean Architecture - Full Cycle

[![Tests](https://github.com/seu-usuario/fc-clean-architecture/workflows/Tests/badge.svg)](https://github.com/seu-usuario/fc-clean-architecture/actions)

Projeto demonstrativo de implementação de **Clean Architecture** utilizando TypeScript, Domain-Driven Design (DDD) e Test-Driven Development (TDD).

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Arquitetura](#arquitetura)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Principais Conceitos](#principais-conceitos)
- [Testes](#testes)
- [Tecnologias](#tecnologias)
- [Como Executar](#como-executar)
- [API REST](#api-rest)

## 🎯 Sobre o Projeto

Este projeto implementa um sistema de e-commerce simples seguindo os princípios da Clean Architecture e Domain-Driven Design. O sistema gerencia **Clientes**, **Produtos** e **Pedidos** através de uma API REST, aplicando conceitos avançados de arquitetura de software.

## 🏛️ Arquitetura

A arquitetura é dividida em **4 camadas principais**, seguindo os princípios da Clean Architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Infrastructure                        │
│  (API REST, Database, External Services)                 │
├─────────────────────────────────────────────────────────┤
│                      Use Cases                           │
│        (Application Business Rules)                      │
├─────────────────────────────────────────────────────────┤
│                       Domain                             │
│     (Enterprise Business Rules, Entities)                │
├─────────────────────────────────────────────────────────┤
│                      @shared                             │
│  (Common patterns and utilities across domains)          │
└─────────────────────────────────────────────────────────┘
```

### 1. **Domain Layer** (Camada de Domínio)

Contém as **regras de negócio da empresa**. É a camada mais interna e não depende de nada externo.

**Responsabilidades:**
- **Entities**: Objetos de negócio com identidade única (Customer, Product, Order)
- **Value Objects**: Objetos sem identidade, definidos apenas por seus valores (Address)
- **Domain Services**: Lógica de negócio que não pertence a uma entidade específica
- **Domain Events**: Eventos que representam mudanças de estado no domínio
- **Validators**: Validação de regras de negócio usando Yup
- **Factories**: Criação de entidades complexas

**Características:**
- ✅ Independente de frameworks
- ✅ Independente de UI
- ✅ Independente de banco de dados
- ✅ Testável sem dependências externas

**Exemplo - Entity:**
```typescript
class Product extends Entity {
  constructor(id: string, name: string, price: number) {
    super();
    this._id = id;
    this._name = name;
    this._price = price;
    this.validate(); // Validação de regras de negócio
  }
}
```

### 2. **Use Cases Layer** (Camada de Casos de Uso)

Contém as **regras de negócio da aplicação**. Orquestra o fluxo de dados entre a camada de domínio e a infraestrutura.

**Responsabilidades:**
- Implementar casos de uso específicos (criar, listar, atualizar, buscar)
- Coordenar entidades e repositories
- Transformar dados (DTOs - Input/Output)

**Estrutura por Use Case:**
- `create/` - Criação de entidades
- `find/` - Busca por ID
- `list/` - Listagem de entidades
- `update/` - Atualização de entidades

**Exemplo - Use Case:**
```typescript
class CreateProductUseCase {
  async execute(input: InputDto): Promise<OutputDto> {
    const product = ProductFactory.create(input.type, input.name, input.price);
    await this.productRepository.create(product);
    return { id: product.id, name: product.name, price: product.price };
  }
}
```

### 3. **Infrastructure Layer** (Camada de Infraestrutura)

Contém os **detalhes de implementação** e adaptadores para o mundo externo.

**Responsabilidades:**
- **API REST**: Endpoints HTTP usando Express
- **Repositories**: Implementação usando Sequelize (ORM)
- **Database**: Modelos e configurações do banco de dados
- **Presenters**: Formatação de dados para saída

**Características:**
- ✅ Implementações concretas dos contratos da camada de domínio
- ✅ Sequelize com SQLite (pode ser trocado facilmente)
- ✅ API REST com Express
- ✅ Separação clara entre rotas, presenters e controllers

### 4. **@shared Layer** (Camada Compartilhada)

Contém **padrões e utilitários comuns** utilizados em múltiplos domínios.

**Componentes:**
- **Entity Abstract**: Classe base para todas as entidades
- **Event Dispatcher**: Sistema de eventos do domínio
- **Notification Pattern**: Pattern para acumular erros de validação
- **Repository Interface**: Contrato genérico para repositórios
- **Validator Interface**: Contrato para validadores

## 📁 Estrutura de Pastas

```
fc-clean-architecture/
├── src/
│   ├── domain/                    # Camada de Domínio
│   │   ├── @shared/               # Componentes compartilhados
│   │   │   ├── entity/            # Entity base
│   │   │   ├── event/             # Sistema de eventos
│   │   │   ├── notification/      # Notification pattern
│   │   │   ├── repository/        # Interface de repositório
│   │   │   └── validator/         # Interface de validador
│   │   │
│   │   ├── customer/              # Contexto de Cliente
│   │   │   ├── entity/            # Customer entity
│   │   │   ├── factory/           # Customer factory
│   │   │   ├── repository/        # Repository interface
│   │   │   ├── validator/         # Validadores Yup
│   │   │   └── value-object/      # Address value object
│   │   │
│   │   ├── product/               # Contexto de Produto
│   │   │   ├── entity/            # Product entities
│   │   │   ├── event/             # Domain events
│   │   │   ├── factory/           # Product factory
│   │   │   ├── repository/        # Repository interface
│   │   │   ├── service/           # Domain services
│   │   │   └── validator/         # Validadores Yup
│   │   │
│   │   └── checkout/              # Contexto de Pedido
│   │       ├── entity/            # Order, OrderItem
│   │       ├── factory/           # Order factory
│   │       ├── repository/        # Repository interface
│   │       ├── service/           # Order service
│   │       └── validator/         # Validadores Yup
│   │
│   ├── usecase/                   # Camada de Casos de Uso
│   │   ├── customer/
│   │   │   ├── create/            # Criar cliente
│   │   │   ├── find/              # Buscar cliente
│   │   │   ├── list/              # Listar clientes
│   │   │   └── update/            # Atualizar cliente
│   │   │
│   │   └── product/
│   │       ├── create/            # Criar produto
│   │       ├── find/              # Buscar produto
│   │       ├── list/              # Listar produtos
│   │       └── update/            # Atualizar produto
│   │
│   └── infrastructure/            # Camada de Infraestrutura
│       ├── api/                   # API REST
│       │   ├── express.ts         # Configuração Express
│       │   ├── server.ts          # Servidor
│       │   ├── routes/            # Rotas HTTP
│       │   ├── presenters/        # Formatadores de saída
│       │   └── __tests__/         # Testes E2E
│       │
│       ├── customer/
│       │   └── repository/
│       │       └── sequelize/     # Implementação Sequelize
│       │
│       ├── product/
│       │   └── repository/
│       │       └── sequelize/     # Implementação Sequelize
│       │
│       └── order/
│           └── repository/
│               └── sequilize/     # Implementação Sequelize
│
├── .github/
│   └── workflows/
│       └── test.yml               # GitHub Actions CI/CD
│
├── jest.config.ts                 # Configuração Jest
├── tsconfig.json                  # Configuração TypeScript
└── package.json                   # Dependências
```

## 🔑 Principais Conceitos

### Notification Pattern

Utilizado para **acumular erros de validação** ao invés de lançar exceção na primeira falha.

```typescript
// Ao invés de:
if (!name) throw new Error("Name is required");
if (!price) throw new Error("Price is required");

// Usamos:
this.notification.addError({ context: "product", message: "Name is required" });
this.notification.addError({ context: "product", message: "Price is required" });

if (this.notification.hasErrors()) {
  throw new NotificationError(this.notification.getErrors());
}
```

**Benefícios:**
- ✅ Retorna todos os erros de uma vez
- ✅ Melhor UX (usuário vê todos os problemas)
- ✅ Menos requisições para corrigir erros

### Domain Events

Sistema de eventos para desacoplar ações no domínio.

```typescript
// Quando um produto é criado, dispara evento
const event = new ProductCreatedEvent(productData);
eventDispatcher.notify(event);

// Handler do evento
class SendEmailWhenProductIsCreatedHandler {
  handle(event: ProductCreatedEvent): void {
    console.log("Sending email to .....");
  }
}
```

### Factory Pattern

Centraliza a criação de entidades complexas.

```typescript
class ProductFactory {
  static create(type: string, name: string, price: number): ProductInterface {
    switch (type) {
      case "a":
        return new Product(uuid(), name, price);
      case "b":
        return new ProductB(uuid(), name, price);
      default:
        throw new Error("Product type not supported");
    }
  }
}
```

### Repository Pattern

Abstrai o acesso a dados, permitindo trocar a implementação facilmente.

```typescript
// Interface (Domain)
interface ProductRepositoryInterface {
  create(entity: Product): Promise<void>;
  update(entity: Product): Promise<void>;
  find(id: string): Promise<Product>;
  findAll(): Promise<Product[]>;
}

// Implementação (Infrastructure)
class ProductRepository implements ProductRepositoryInterface {
  // Implementação usando Sequelize
}
```

## 🧪 Testes

O projeto possui **cobertura de testes em 3 níveis**:

### 1. **Testes Unitários** (Unit Tests)

Testam **componentes isolados** sem dependências externas.

**Características:**
- ✅ Rápidos (< 1ms por teste)
- ✅ Sem banco de dados
- ✅ Sem infraestrutura
- ✅ Testam regras de negócio puras

**Localização:** `*.unit.spec.ts`

**Exemplo:**
```typescript
describe("Product unit tests", () => {
  it("should throw error when name is empty", () => {
    expect(() => {
      new Product("1", "", 100);
    }).toThrow("Name is required");
  });
});
```

### 2. **Testes de Integração** (Integration Tests)

Testam **integração com infraestrutura** (banco de dados, repositories).

**Características:**
- ✅ Usam banco de dados real (SQLite em memória)
- ✅ Testam persistência
- ✅ Validam mapeamento ORM
- ✅ Mais lentos que unitários

**Localização:** `*.integration.spec.ts`

**Exemplo:**
```typescript
describe("Create product integration tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
    });
    await sequelize.sync();
  });

  it("should create a product", async () => {
    const repository = new ProductRepository();
    const usecase = new CreateProductUseCase(repository);
    const output = await usecase.execute(input);
    expect(output.id).toBeDefined();
  });
});
```

### 3. **Testes E2E** (End-to-End)

Testam **fluxos completos** através da API HTTP.

**Características:**
- ✅ Testam API REST
- ✅ Validam rotas HTTP
- ✅ Verificam status codes
- ✅ Testam integração completa

**Localização:** `*.e2e.spec.ts`

**Exemplo:**
```typescript
describe("E2E test for product", () => {
  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({ name: "Product", price: 100 });
    
    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product");
  });
});
```

### Cobertura de Testes

```bash
npm test -- --coverage
```

**Estatísticas do Projeto:**

| Tipo de Teste | Quantidade | Descrição |
|---------------|------------|-----------|
| **Unit Tests** | ~60 testes | Testes de entidades, value objects, services |
| **Integration Tests** | ~20 testes | Testes de use cases com banco de dados |
| **E2E Tests** | ~7 testes | Testes de API REST |
| **TOTAL** | **87 testes** | **29 suítes de teste** |

**Tempo de Execução:** ~1 segundo (todos os testes)

**Áreas Testadas:**
- ✅ Entidades (Product, Customer, Order)
- ✅ Value Objects (Address)
- ✅ Domain Services
- ✅ Use Cases (CRUD completo)
- ✅ Repositories (Sequelize)
- ✅ Validators (Yup)
- ✅ Factories
- ✅ Event Dispatcher
- ✅ Notification Pattern
- ✅ API REST (endpoints)

### Executar Testes

```bash
# Todos os testes
npm test

# Com cobertura
npm test -- --coverage

# Modo watch
npm test -- --watch

# Testes específicos
npm test -- product
```

## 🛠️ Tecnologias

### Core
- **TypeScript** - Linguagem tipada
- **Node.js** - Runtime JavaScript

### Domain & Application
- **Yup** - Validação de schemas
- **UUID** - Geração de IDs únicos

### Infrastructure
- **Express** - Framework web
- **Sequelize** - ORM
- **Sequelize-TypeScript** - Decorators para Sequelize
- **SQLite** - Banco de dados (desenvolvimento)

### Testing
- **Jest** - Framework de testes
- **SWC** - Compilador rápido para Jest
- **Supertest** - Testes de API HTTP

### Development
- **TSLint** - Linter TypeScript
- **Nodemon** - Auto-reload em desenvolvimento
- **ts-node** - Executar TypeScript diretamente

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18.x ou 20.x
- npm ou yarn

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/fc-clean-architecture.git

# Entre na pasta
cd fc-clean-architecture

# Instale as dependências
npm install
```

### Executar Testes

```bash
npm test
```

### Executar Servidor de Desenvolvimento

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## 📡 API REST

### Endpoints de Produtos

#### Criar Produto
```http
POST /product
Content-Type: application/json

{
  "name": "Product Name",
  "price": 100
}
```

#### Listar Produtos
```http
GET /product
```

### Endpoints de Clientes

#### Criar Cliente
```http
POST /customer
Content-Type: application/json

{
  "name": "John Doe",
  "address": {
    "street": "Street Name",
    "number": 123,
    "zip": "12345-678",
    "city": "City Name"
  }
}
```

#### Listar Clientes
```http
GET /customer
```

## 🔄 CI/CD

O projeto utiliza **GitHub Actions** para execução automática de testes.

**Workflow:**
- ✅ Executa em push para branch `main`
- ✅ Executa em Pull Requests
- ✅ Testa em Node.js 18.x e 20.x
- ✅ Gera relatório de cobertura
- ✅ Envia cobertura para Codecov

Ver configuração em: [.github/workflows/test.yml](.github/workflows/test.yml)

## 📚 Conceitos Aplicados

- ✅ **Clean Architecture** - Separação de camadas e inversão de dependências
- ✅ **Domain-Driven Design (DDD)** - Modelagem orientada ao domínio
- ✅ **SOLID Principles** - Princípios de design orientado a objetos
- ✅ **Test-Driven Development (TDD)** - Desenvolvimento guiado por testes
- ✅ **Design Patterns** - Factory, Repository, Notification, Observer
- ✅ **Dependency Injection** - Inversão de controle
- ✅ **Entity** - Objetos com identidade
- ✅ **Value Object** - Objetos sem identidade
- ✅ **Aggregate** - Agrupamento de entidades
- ✅ **Domain Events** - Eventos de domínio

## 📝 Licença

Este projeto é para fins educacionais.

---

Desenvolvido com ❤️ seguindo os princípios da Clean Architecture

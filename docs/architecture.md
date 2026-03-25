# Architecture Guide

## 1. Purpose

This document defines the architectural contract for this repository.

It ensures that:
- code remains structurally consistent
- AI-generated code follows the same constraints as human-written code
- responsibilities stay separated across layers

This document is not optional.
All implementation must follow it.

---

## 2. Tech Stack

<!-- 프로젝트에 맞게 채워주세요 -->

- Framework: React + TypeScript
- Server State: TanStack Query (React Query)
- Client State: Zustand
- HTTP: ky
- Styling: Tailwind CSS v4
- Build: Vite

---

## 3. Project Structure

This project is a single web application.

    src/
      presentation/
        pages/
        components/
        hooks/
      domain/
        entities/
        useCases/
        repositories/
      data/
        api/
        dto/
        repositories/
      app/

---

## 4. Architecture Style

This project follows layered architecture.

    Presentation → Domain ← Data

---

## 5. Dependency Rules

### Allowed

- Presentation → Domain
- Data → Domain

### Forbidden

- Domain → Presentation
- Domain → Data
- Presentation → Data

---

## 6. Layer Responsibilities

### 6.1 Presentation

Responsible for:
- pages
- components
- hooks
- UI state
- user interaction
- mapping domain models to UI models

Must not:
- call API directly
- use DTO directly
- contain business logic

---

### 6.2 Domain

Responsible for:
- business models
- use cases
- repository interfaces
- business rules

Must:
- be pure TypeScript
- be framework-agnostic

Must not:
- depend on React
- depend on API logic
- depend on browser APIs

---

### 6.3 Data

Responsible for:
- API communication
- DTO definitions
- mapping DTO → Domain
- repository implementations

Must:
- implement Domain contracts
- normalize external data

---

### 6.4 App

Responsible for:
- application entry point
- wiring all layers together (DI, routing, providers)
- global configuration

May import from any layer.
This is the only layer with no import restriction.

---


## 7. Model Separation

Never mix model types.

- DTO → Data layer
- Domain Model → Domain layer
- UI Model → Presentation layer

---

## 8. UseCase Rules

UseCase = business action

### Must

- be reusable
- depend on repository interface
- not contain UI logic

### Examples

- getUsers
- createOrder
- updateProfile

### Anti-pattern

- usePageData
- formatTableRows

---

## 9. API Communication

Flow:

    UI → UseCase → Repository → API

Response:

    API → DTO → Domain → UI Model

---

## 10. Environment Configuration

No hardcoding.

Example:

`const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;`

---

## 11. State Management

### Server State
- API data
- caching

### Client State
- UI state

Do not mix business logic into UI state.

---

## 12. Naming Rules

- Page (목록): 도메인 복수형 — `Users.tsx`, `Orders.tsx`
- Page (상세): 도메인 단수형 — `User.tsx`, `Order.tsx`
- Component: PascalCase — `UserCard.tsx`
- Hook: useXxx — `useUsers.ts`
- UseCase: verbNoun — `getUsers.ts`, `createOrder.ts`
- Entity: 도메인 단수형 — `User.ts`, `Order.ts`
- DTO: XxxDto — `UserDto.ts`
- Repository interface: XxxRepository — `UserRepository.ts`
- Repository impl: XxxRepositoryImpl — `UserRepositoryImpl.ts`

Avoid:
- 접미사: `List`, `Detail`, `Search`, `View`, `Info`
- 모호한 이름: `Helper`, `Common`, `Misc`, `Utils`

---

## 13. Code Rules

### Must

- named export only
- explicit typing
- single responsibility

### Must Not

- any
- API in UI
- UI logic in Domain

---

## 14. Validation Rules

All code must pass:
- lint
- type check

---

## 15. ESLint Enforcement

All architectural rules are enforced automatically via `eslint.config.js` (ESLint v9 flat config).

| Layer        | Forbidden imports                        |
|--------------|------------------------------------------|
| Presentation | Data                                     |
| Domain       | Presentation, Data, framework libs       |
| Data         | Presentation                             |
| App          | _(no restriction — composition root)_   |

Rules run on every commit via lint-staged.
If lint fails, the commit is blocked.

This is the primary mechanism for maintaining idempotency of the architecture.

---

## 16. AI Generation Contract

AI must:

1. identify layer
2. place file correctly
3. respect dependency rules
4. avoid shortcuts

If conflict:
→ fix code, not rules
# Agent Execution Guide

## 1. Role

You are a coding agent working in a structured web application.

Context documents, in order of priority:

1. `architecture.md` — structural rules (always applies)
2. CPS document — feature context (applies when provided)

---

## 2. Pipeline

작업이 주어지면 이 순서로 진행한다:

1. **CPS 읽기** → 무엇을, 왜 만드는지 파악
2. **architecture.md 적용** → 레이어, 모델, 파일 경로 결정
3. **코드 생성** → 네이밍·구조 규칙 준수
4. **Final Check** → 규칙 위반 여부 확인

---

## 3. CPS → 코드 변환 기준

| CPS 항목 | 생성할 코드 |
|----------|-------------|
| Solution의 기능 | UseCase (Domain) |
| 도메인 개념/규칙 | Entity, Repository interface (Domain) |
| API / 데이터 | DTO, RepositoryImpl, API call (Data) |
| UI 상호작용 | Page, Component, Hook (Presentation) |

CPS가 없으면 요청에서 위 항목을 직접 도출한다.

---

## 4. 파일 위치 결정

코드를 작성하기 전에 경로를 먼저 확정한다:

```
src/presentation/pages/         → 페이지 컴포넌트 (PascalCase.tsx)
src/presentation/components/    → 재사용 UI 컴포넌트
src/presentation/hooks/         → 커스텀 훅 (useXxx.ts)
src/domain/entities/            → 비즈니스 모델
src/domain/useCases/            → 비즈니스 액션 (verbNoun.ts)
src/domain/repositories/        → Repository 인터페이스
src/data/api/                   → API 호출
src/data/dto/                   → API 응답 타입 (XxxDto.ts)
src/data/repositories/          → Repository 구현체 (XxxImpl.ts)
```

---

## 5. Editing Code

- minimal changes
- no unnecessary refactor

---

## 6. Output Rules

Must:

- correct folder
- correct layer
- typed
- named export

Must not:

- introduce shortcuts
- create vague utils

---

## 7. Final Check

완료 전 반드시 확인:

- [ ] 레이어 배치가 올바른가
- [ ] import 방향이 규칙을 위반하지 않는가
- [ ] lint 통과 가능한가
- [ ] 타입 오류가 없는가

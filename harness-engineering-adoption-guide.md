# 하네스 엔지니어링 도입 실행 가이드

> **대상:** AX 첫 도입, 15명+ 팀, Prettier 외 린터/컨벤션 미비
>
> **전략:** 작게 증명하고 → 신뢰를 쌓고 → 전체로 확산한다
>
> 이 가이드는 "AI를 써서 일하는 방식"에 팀이 아직 확신이 없는 상황을 전제합니다.
> 한 번에 전체를 바꾸는 것이 아니라, 4주 단위 파일럿으로 눈에 보이는 성과를 먼저 만들어
> 조직의 신뢰를 확보하는 것이 핵심입니다.

---

## Phase 0: 파일럿 준비 (1주)

전체 프로젝트에 바로 적용하지 않습니다.
15명+ 팀에서 갑자기 "오늘부터 AI로 일합니다"는 혼란만 줍니다.
대신 **2~3명의 파일럿 스쿼드**를 구성하여 작은 스코프에서 먼저 증명합니다.

### Step 0-1: 파일럿 스코프 선정

팀에서 가장 반복적이고, 실패해도 리스크가 낮은 작업을 고릅니다.

**좋은 파일럿 후보:**

| 후보 | 이유 |
|---|---|
| 신규 어드민 페이지 1개 | 기존 코드에 영향 없음, CRUD 중심이라 결과 비교 쉬움 |
| 기존 페이지의 리디자인 | Before/After 비교가 명확함 |
| 내부 도구 (배포 대시보드 등) | 고객 영향 없이 실험 가능 |

**나쁜 파일럿 후보:**
- 결제/인증 등 크리티컬 도메인
- 이미 복잡하게 얽힌 레거시 리팩토링
- 릴리즈 일정이 빠듯한 기능

### Step 0-2: 파일럿 스쿼드 구성

```
파일럿 스쿼드 (2~3명)
├── 리드: AI 도구에 관심 있는 시니어 1명
├── 멤버: 새로운 시도에 적극적인 엔지니어 1~2명
└── 옵저버: 테크 리드 또는 팀장 (결과만 관찰, 개입 최소화)
```

옵저버의 역할이 중요합니다. 파일럿의 과정과 결과를 객관적으로 관찰하고,
나중에 팀 전체에 "이건 해볼 만하다"라고 말해줄 수 있는 사람이어야 합니다.

### Step 0-3: 성공 기준 미리 정의

파일럿이 끝났을 때 "성공했다"고 말할 수 있는 기준을 미리 합의합니다.

```markdown
## 파일럿 성공 기준

### 정량 지표
- 동일 스코프 대비 개발 소요 시간 30% 이상 단축
- AI 생성 코드의 린트 통과율 90% 이상
- 생성된 코드의 리뷰 지적 사항 수가 기존과 동등 이하

### 정성 지표
- 파일럿 참여자 전원이 "다음 프로젝트에도 이 방식을 쓰겠다"에 동의
- 옵저버가 "팀 전체 도입을 검토할 가치가 있다"에 동의
```

---

## Phase 1: 기반 하네스 구축 (1~2주)

파일럿 스코프가 정해졌으면, 코드를 짜기 전에 "하네스"를 먼저 깝니다.
이 단계의 목표는 **AI가 생성하는 코드의 방향을 시스템적으로 잡아주는 것**입니다.

### Step 1-1: ARCHITECTURE.md 작성

프로젝트 루트에 이 파일을 만듭니다. AI에게 컨텍스트로 줄 핵심 문서입니다.

```markdown
# Architecture Guide

## 기술 스택
- React 18 + TypeScript 5.x
- 상태 관리: Tanstack Query (서버) + Zustand (클라이언트)
- 스타일: Tailwind CSS
- 테스트: Vitest + Testing Library

## 아키텍처: Layered Architecture
Presentation → Domain → Data

### 레이어별 역할

**Presentation (UI)**
- React 컴포넌트, 페이지, 커스텀 훅
- Domain 레이어만 import 가능
- API를 직접 호출하지 않는다

**Domain (비즈니스 로직)**
- Entity, UseCase, Repository 인터페이스
- 어떤 레이어도 import하지 않는다 (순수 TypeScript)
- 외부 라이브러리 의존 금지 (React, axios 등)

**Data (외부 통신)**
- API 호출, DTO 정의, Repository 구현체
- Domain의 인터페이스를 implements 한다

### 의존성 방향 (위반 시 린트 에러)
✅ Presentation → Domain
✅ Data → Domain
❌ Domain → Presentation
❌ Domain → Data
❌ Presentation → Data (직접 접근 금지)

## 네이밍 규칙

### 파일명
| 종류 | 규칙 | 예시 |
|---|---|---|
| 페이지 (목록) | 도메인 복수형 | `Products.tsx` |
| 페이지 (상세) | 도메인 단수형 | `Product.tsx` |
| 컴포넌트 | PascalCase, 역할 명시 | `ProductCard.tsx` |
| 커스텀 훅 | use + 도메인 | `useProducts.ts` |
| UseCase | 동사 + 도메인 | `getProducts.ts` |
| Entity | 도메인 단수형 | `Product.ts` |
| DTO | 도메인 + DTO | `ProductDTO.ts` |
| Repository (I/F) | 도메인 + Repository | `ProductRepository.ts` |
| Repository (구현) | 도메인 + RepositoryImpl | `ProductRepositoryImpl.ts` |

### 금지어 (파일명에 사용 불가)
- `List`, `Detail`, `View`, `Search`, `Page`, `Screen`
- `Helper`, `Util`, `Common`, `Shared`, `Misc`

### 코드 스타일
- default export 사용 금지 → named export만 사용
- 불필요한 useMemo / useCallback 금지
- 인라인 타입 금지 → Props는 별도 type 정의
- magic number 금지 → 상수로 추출
- 3depth 이상 조건부 렌더링 금지 → 컴포넌트 분리
```

### Step 1-2: 폴더 구조 생성

ARCHITECTURE.md에 맞는 폴더를 먼저 만들어 놓습니다.
"빈 폴더"라도 구조가 잡혀 있으면 AI가 올바른 위치에 파일을 생성합니다.

```
src/
├── presentation/
│   ├── pages/
│   │   └── .gitkeep
│   ├── components/
│   │   └── .gitkeep
│   └── hooks/
│       └── .gitkeep
│
├── domain/
│   ├── entities/
│   │   └── .gitkeep
│   ├── useCases/
│   │   └── .gitkeep
│   └── repositories/
│       └── .gitkeep
│
├── data/
│   ├── dto/
│   │   └── .gitkeep
│   ├── repositories/
│   │   └── .gitkeep
│   └── api/
│       └── .gitkeep
│
└── shared/
    ├── constants/
    ├── types/
    └── utils/
```

### Step 1-3: ESLint + Husky 세팅

Prettier만 있는 상태에서 최소한의 린터 하네스를 추가합니다.
한 번에 모든 룰을 넣지 않습니다. 파일럿 기간에는 아래 3가지만 집중합니다.

**설치:**

```bash
npm install -D eslint @typescript-eslint/eslint-plugin \
  eslint-plugin-import eslint-plugin-check-file \
  husky lint-staged
```

**ESLint 설정 (.eslintrc.cjs):**

```javascript
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import', 'check-file'],
  rules: {
    // ── 규칙 1: 레이어 의존성 방향 강제 ──
    'no-restricted-imports': ['error', {
      patterns: [
        {
          group: ['@/data/*', '../data/*', '../../data/*'],
          message: '❌ Presentation에서 Data를 직접 import할 수 없습니다. Domain을 통해 접근하세요.',
        },
        {
          group: ['@/presentation/*', '../presentation/*', '../../presentation/*'],
          importNames: ['default'],
          message: '❌ Domain에서 Presentation을 import할 수 없습니다.',
        },
      ],
    }],

    // ── 규칙 2: import 순서 강제 ──
    'import/order': ['error', {
      groups: [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index',
      ],
      'newlines-between': 'always',
      alphabetize: { order: 'asc', caseInsensitive: true },
    }],

    // ── 규칙 3: 파일명 컨벤션 강제 ──
    'check-file/filename-naming-convention': ['error', {
      'src/presentation/**/*.tsx': 'PASCAL_CASE',
      'src/domain/**/*.ts': 'CAMEL_CASE',
      'src/data/**/*.ts': 'CAMEL_CASE',
    }, { ignoreMiddleExtensions: true }],

    // ── 규칙 4: default export 금지 ──
    'no-restricted-syntax': ['error', {
      selector: 'ExportDefaultDeclaration',
      message: '❌ default export 금지. named export를 사용하세요.',
    }],
  },
  settings: {
    'import/resolver': {
      typescript: { alwaysTryTypes: true },
    },
  },
};
```

**Husky + lint-staged 설정:**

```bash
npx husky init
```

```json
// package.json에 추가
{
  "lint-staged": {
    "src/**/*.{ts,tsx}": [
      "eslint --fix --max-warnings=0",
      "prettier --write"
    ]
  }
}
```

```bash
# .husky/pre-commit
npx lint-staged
```

이제 AI가 코드를 생성하고 커밋을 시도하면, 린터가 자동으로 실행됩니다.
레이어를 잘못 참조하거나, 파일명이 규칙에 맞지 않으면 커밋이 차단됩니다.
AI는 에러 메시지를 보고 스스로 수정합니다.

---

## Phase 2: 파일럿 실행 — CPS 기반 개발 (2~3주)

하네스가 깔렸으면, 이제 실제 기능을 만듭니다.
영상에서 강조한 CPS 프레임워크를 실전에 적용하는 단계입니다.

### Step 2-1: CPS 문서 작성

파일럿 스코프에 대한 CPS를 먼저 작성합니다.
이 문서가 AI에게 줄 "비즈니스 컨텍스트"가 됩니다.

**예시: 어드민 상품 관리 페이지**

```markdown
# CPS: 어드민 상품 관리

## Context (맥락)
- 현재 상품 등록/수정은 스프레드시트로 관리 중
- 운영팀 4명이 하루 평균 50건의 상품을 등록/수정
- 실수로 인한 잘못된 가격 입력이 월 평균 12건 발생
- 상품 이미지 리사이즈를 위해 별도 툴을 사용 중

## Problem (문제)
- 스프레드시트 기반 관리로 히스토리 추적 불가
- 상품 데이터 검증 로직 부재로 잘못된 데이터 유입
- 이미지 처리 프로세스가 분리되어 있어 생산성 저하
- 여러 명이 동시에 수정할 때 데이터 충돌 발생

## Solution (솔루션)
- 어드민 웹 애플리케이션에 상품 관리 CRUD 구축
- 가격, 카테고리, 필수 필드 등 실시간 데이터 검증
- 이미지 업로드 시 자동 리사이즈 + 미리보기
- 수정 이력(audit log) 자동 기록

## 스코프 (파일럿 범위)
- 상품 목록 조회 (필터링, 검색, 페이지네이션)
- 상품 등록/수정 폼
- 이미지 업로드
- 수정 이력 조회

## 도메인 모델
- Product: 상품의 핵심 엔티티
- Category: 상품 카테고리
- ProductImage: 상품 이미지
- AuditLog: 수정 이력
```

### Step 2-2: 도메인 모델부터 코드로 전환

CPS에서 정의한 도메인 모델을 코드로 먼저 잡습니다.
이 코드가 AI에게 줄 "도메인 컨텍스트"입니다.

**Entity (domain/entities/Product.ts):**

```typescript
export type ProductStatus = 'draft' | 'active' | 'inactive' | 'deleted';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  status: ProductStatus;
  images: ProductImage[];
  createdAt: Date;
  updatedAt: Date;
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string;
  order: number;
};
```

**Repository 인터페이스 (domain/repositories/ProductRepository.ts):**

```typescript
import type { Product, ProductStatus } from '../entities/Product';

export type ProductFilter = {
  keyword?: string;
  categoryId?: string;
  status?: ProductStatus;
  page: number;
  size: number;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  size: number;
  hasNext: boolean;
};

export type ProductRepository = {
  getProducts: (filter: ProductFilter) => Promise<PaginatedResult<Product>>;
  getProduct: (id: string) => Promise<Product>;
  createProduct: (input: CreateProductInput) => Promise<Product>;
  updateProduct: (id: string, input: UpdateProductInput) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
};

export type CreateProductInput = {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  images: File[];
};

export type UpdateProductInput = Partial<CreateProductInput>;
```

**UseCase (domain/useCases/getProducts.ts):**

```typescript
import type { ProductFilter, ProductRepository, PaginatedResult } from '../repositories/ProductRepository';
import type { Product } from '../entities/Product';

export const getProducts = (
  repository: ProductRepository,
) => {
  return (filter: ProductFilter): Promise<PaginatedResult<Product>> => {
    return repository.getProducts(filter);
  };
};
```

### Step 2-3: AI에게 컨텍스트를 주고 코드 생성

이제 AI에게 다음을 함께 전달합니다:

1. **ARCHITECTURE.md** — 구조/네이밍 규칙
2. **CPS 문서** — 비즈니스 맥락
3. **도메인 코드** — Entity, Repository 인터페이스, UseCase
4. **요청할 작업** — 구체적인 지시

**AI에게 주는 프롬프트 예시:**

```
아래 컨텍스트를 읽고 상품 목록 페이지를 구현해줘.

[ARCHITECTURE.md 내용 붙여넣기]
[CPS 문서 내용 붙여넣기]
[도메인 코드 붙여넣기]

구현할 것:
- src/presentation/pages/Products.tsx (상품 목록 페이지)
- src/presentation/components/ProductCard.tsx
- src/presentation/hooks/useProducts.ts
- src/data/dto/ProductDTO.ts
- src/data/repositories/ProductRepositoryImpl.ts
- src/data/api/productApi.ts

규칙:
- ARCHITECTURE.md의 네이밍/구조 규칙을 반드시 따를 것
- Domain 레이어의 Entity와 Repository 인터페이스를 그대로 사용할 것
- DTO → Entity 변환은 Data 레이어에서 처리할 것
- Presentation에서 DTO를 직접 사용하지 말 것
```

### Step 2-4: 린터로 결과물 검증

AI가 생성한 코드를 커밋하기 전에 린터가 자동 실행됩니다.

**린터가 잡아주는 것들:**

```
❌ src/presentation/pages/Products.tsx
   3:1  error  ❌ Presentation에서 Data를 직접 import할 수 없습니다.
               Domain을 통해 접근하세요.    no-restricted-imports

❌ src/presentation/pages/productList.tsx
   error  ❌ 파일명이 PASCAL_CASE가 아닙니다.    check-file/filename-naming-convention

❌ src/domain/useCases/getProducts.ts
   1:1  error  ❌ default export 금지. named export를 사용하세요.
               no-restricted-syntax
```

AI는 이 에러를 보고 자동으로 수정합니다. 이것이 하네스의 핵심입니다.
"부탁"이 아니라 "강제"로 코드 품질을 잡는 것.

### Step 2-5: 코드 리뷰 시 체크리스트

파일럿 기간 동안 코드 리뷰 시 아래를 확인합니다.

```markdown
## AI 생성 코드 리뷰 체크리스트

### 구조
- [ ] 레이어 의존성 방향이 올바른가? (Presentation → Domain ← Data)
- [ ] 파일이 올바른 디렉토리에 위치하는가?
- [ ] 네이밍 규칙을 따르는가?

### 타입
- [ ] Entity 타입이 Domain에 정의되어 있는가?
- [ ] DTO → Entity 변환이 Data 레이어에서 이루어지는가?
- [ ] any 타입을 사용하지 않았는가?

### 코드 품질
- [ ] 불필요한 useMemo / useCallback이 없는가?
- [ ] 컴포넌트 크기가 200줄 이내인가?
- [ ] magic number가 상수로 추출되었는가?

### 비즈니스
- [ ] CPS 문서의 요구사항을 충족하는가?
- [ ] 엣지 케이스가 처리되어 있는가?
```

---

## Phase 3: 결과 측정 및 팀 공유 (1주)

파일럿이 끝나면 결과를 측정하고 팀 전체에 공유합니다.
이 단계가 "15명의 팀원이 이 방식을 신뢰하게 만드는" 핵심입니다.

### Step 3-1: 파일럿 회고 문서 작성

```markdown
# 하네스 엔지니어링 파일럿 회고

## 개요
- 기간: 2026.04.01 ~ 2026.04.28 (4주)
- 스코프: 어드민 상품 관리 페이지 (CRUD + 이미지 업로드 + 이력 조회)
- 참여: 김OO(리드), 박OO, 이OO

## 정량 결과

| 지표 | 기존 방식 (추정) | 파일럿 | 변화 |
|---|---|---|---|
| 개발 소요 시간 | 3주 | 1.5주 | -50% |
| 린트 통과율 (AI 초회 생성) | - | 78% | 신규 |
| 린트 통과율 (AI 자동 수정 후) | - | 97% | 신규 |
| 코드 리뷰 지적 사항 | 평균 8건/PR | 평균 3건/PR | -62% |
| 구조 관련 리뷰 코멘트 | 평균 4건/PR | 평균 0.5건/PR | -87% |

## 정성 결과
- "AI가 생성한 코드가 우리 구조에 맞게 나온다는 게 신기했다"
- "린터가 잡아주니까 리뷰에서 구조 얘기를 안 해도 됐다"
- "CPS 문서 덕분에 왜 이 기능을 만드는지 맥락이 명확했다"

## 개선점
- 복잡한 비즈니스 로직은 AI 생성 후 수동 검토 필요
- 기존 코드와의 통합 테스트가 더 필요했음

## 결론
팀 전체 도입을 진행하되, 기존 코드는 점진적 마이그레이션 권장
```

### Step 3-2: 팀 전체 공유 세션

30분 이내의 짧은 세션으로 진행합니다. 핵심만 전달합니다.

**세션 구성:**

```
[5분] Before/After 데모
      - 같은 스코프를 기존 방식 vs 하네스 방식으로 비교
      - 코드 구조, 개발 속도, 리뷰 부담 차이를 보여줌

[10분] 라이브 시연
       - AI에게 ARCHITECTURE.md + CPS + 도메인 코드를 주고
       - 새 페이지를 실시간으로 생성하는 과정을 보여줌
       - 린터가 잡아주는 모습까지 시연

[10분] 린터 에러 → 자동 수정 시연
       - 의도적으로 잘못된 코드를 생성하게 하고
       - 커밋 시 린터가 차단하는 것을 보여줌
       - AI가 에러를 읽고 자동 수정하는 과정까지

[5분] Q&A
```

---

## Phase 4: 팀 전체 확산 (2~4주)

파일럿이 성공하고 팀의 동의를 얻었다면, 점진적으로 확산합니다.

### Step 4-1: 확산 전략 — 한 번에 바꾸지 않는다

```
Week 1-2: 신규 코드에만 적용
           - 새로 만드는 페이지/기능은 하네스 구조를 따른다
           - 기존 코드는 건드리지 않는다

Week 3-4: 점진적 마이그레이션 시작
           - 기존 코드 중 수정이 필요한 부분부터 새 구조로 전환
           - "수정할 때 같이 옮긴다" 원칙 (Strangler Fig Pattern)

Month 2+: 디자인 시스템 + 코드 생성기 구축
           - 자주 만드는 패턴을 템플릿화
           - plop 등으로 보일러플레이트 자동 생성
```

### Step 4-2: 팀 컨벤션 문서 확정

파일럿에서 검증된 규칙을 팀 공식 컨벤션으로 확정합니다.

```markdown
# Team Convention (팀 전체 합의)

## 이 문서는 팀 전체가 합의한 개발 규칙입니다.
## 변경 시 팀 회의를 통해 합의 후 PR로 반영합니다.

### 반드시 지킬 것 (린터로 강제됨)
1. Layered Architecture 의존성 방향
2. 파일명 네이밍 컨벤션
3. named export만 사용
4. import 순서

### 강력히 권장하는 것 (코드 리뷰에서 확인)
1. 컴포넌트 200줄 이내
2. Props 별도 타입 정의
3. DTO → Entity 변환은 Data 레이어에서

### 팀 내 자율 (개인 선호)
1. CSS-in-JS vs Tailwind (프로젝트별 결정)
2. 테스트 커버리지 목표 (도메인별 논의)
```

### Step 4-3: 온보딩 프로세스 구축

새로운 팀원이 들어왔을 때 빠르게 적응할 수 있도록 합니다.

```markdown
# 신규 팀원 온보딩 가이드

## Day 1: 읽기
1. ARCHITECTURE.md 읽기 (15분)
2. Team Convention 읽기 (10분)
3. 파일럿 스코프의 코드 구조 둘러보기 (30분)

## Day 2: 경험하기
1. 간단한 페이지 1개를 AI로 생성해보기
2. 의도적으로 린터 에러를 발생시켜보기
3. 에러 메시지 읽고 수정해보기

## Day 3: 실전
1. 실제 티켓을 하나 잡고
2. CPS → 도메인 모델 → 코드 생성 → 린터 검증
3. 전체 플로우를 한 번 경험
```

---

## 전체 타임라인 요약

```
[Week 1]     Phase 0: 파일럿 준비
             - 스코프 선정, 스쿼드 구성, 성공 기준 정의

[Week 2-3]   Phase 1: 기반 하네스 구축
             - ARCHITECTURE.md, 폴더 구조, ESLint + Husky

[Week 3-5]   Phase 2: 파일럿 실행
             - CPS 작성, 도메인 모델 정의, AI 코드 생성, 린터 검증

[Week 6]     Phase 3: 결과 측정 & 팀 공유
             - 회고 문서, 팀 전체 데모 세션

[Week 7-10]  Phase 4: 팀 전체 확산
             - 신규 코드 적용 → 점진적 마이그레이션 → 컨벤션 확정
```

---

## 부록: "신뢰가 없는 팀"을 설득하는 팁

15명+ 조직에서 AX를 처음 도입할 때 가장 큰 장벽은 기술이 아니라 신뢰입니다.

**"AI 코드는 믿을 수 없다"에 대한 대응:**
린터와 테스트가 자동으로 검증합니다. AI가 만든 코드든 사람이 만든 코드든
같은 품질 게이트를 통과해야 커밋됩니다. 신뢰의 대상은 AI가 아니라 시스템입니다.

**"우리 프로젝트는 특수해서 AI가 못 한다"에 대한 대응:**
맞습니다. 그래서 ARCHITECTURE.md와 CPS 문서를 먼저 작성합니다.
우리 프로젝트의 특수성을 AI에게 가르친 다음에 코드를 생성합니다.

**"한 번에 다 바꿔야 하는 거 아니야?"에 대한 대응:**
아닙니다. 파일럿은 2~3명이 4주간 진행합니다.
기존 코드에 영향을 주지 않습니다.
결과를 보고 확산 여부를 결정합니다.

**"시간이 더 걸리는 거 아니야?"에 대한 대응:**
하네스 구축에 1~2주 투자합니다. 이후 모든 AI 코드 생성이 일관되게 나옵니다.
한 번 투자하면 프로젝트 전체 기간 동안 효과가 누적됩니다.


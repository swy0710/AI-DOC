# 하네스 엔지니어링 실전 가이드

> **"어떤 AI 모델을 쓰더라도 같은 결과물이 나오게 하는 시스템을 설계하라"**

---

## Part 1. 용어 & 개념 사전

이 영상에서 등장하는 핵심 용어들을 먼저 정리합니다. 이미 아는 개념도 있겠지만, 이 맥락에서의 의미를 명확히 해두는 것이 중요합니다.

### 핵심 용어

**하네스 엔지니어링 (Harness Engineering)**
AI 모델이 생성하는 결과물의 방향을 "강제(harness)"하는 기법의 총칭입니다. 프롬프트 엔지니어링이 "잘 부탁하기"라면, 하네스 엔지니어링은 "시스템적으로 선택지를 좁혀서 원하는 결과만 나오게 만들기"입니다. 린터, 디자인 시스템, 아키텍처 규칙, 평가 체계 등을 조합하여 AI의 자유도를 의도적으로 제한합니다.

**멱등성 (Idempotency)**
원래는 "같은 연산을 여러 번 수행해도 결과가 동일한 성질"을 뜻하는 수학/CS 용어입니다. 이 맥락에서는 "같은 요구사항을 Claude에 넣든 Gemini에 넣든 Codex에 넣든, 같은 구조의 결과물이 나오는 상태"를 의미합니다. 하네스 엔지니어링의 궁극적 목표입니다.

**FDE (Forward Deployed Engineer)**
고객사에 직접 파견되어 요구사항을 정의하고, 제로투원(Zero-to-One)을 함께 수행하는 엔지니어입니다. 팔란티어(Palantir)에서 유래된 역할로, 컨설팅 + 엔지니어링을 동시에 수행합니다. 단순히 코드만 짜는 것이 아니라 문제 정의 → 설계 → 구현 → 평가까지 전 과정을 리드합니다.

**AX (AI Transformation)**
DX(Digital Transformation)의 AI 버전입니다. 조직의 업무 프로세스에 AI를 도입하여 근본적으로 변화시키는 것을 의미합니다.

**CPS 프레임워크 (Context-Problem-Solution)**
생각을 정리하는 기획 프레임워크입니다. 솔루션을 바로 논의하기 전에, 모두가 깔고 있는 맥락(Context)을 먼저 명확히 하고, 그 위에서 문제(Problem)를 정의한 뒤, 솔루션(Solution)을 도출합니다. 매 미팅마다 CPS 문서가 업데이트되며, 프로젝트의 살아있는 기록이 됩니다.

**PRD (Product Requirements Document)**
제품 요구사항 문서입니다. CPS에서 정리된 내용을 기반으로 구체적인 기능 명세, 도메인 모델, UI/UX 요구사항 등을 정의합니다.

**DDD (Domain-Driven Design)**
도메인 주도 설계입니다. 비즈니스 도메인의 개념과 규칙을 코드 구조에 직접 반영하는 설계 방법론입니다. 예를 들어 배달 플랫폼이라면 `Restaurant`, `Order`, `Rider`, `Delivery` 같은 도메인 모델이 곧 코드의 핵심 구조가 됩니다.

**POC (Proof of Concept)**
개념 검증입니다. 아이디어가 실제로 작동하는지 최소한의 구현으로 증명하는 단계입니다. 영상에서는 "미팅 끝나고 바로 결과물을 보여주는" 빠른 POC를 강조합니다.

**바이브 코딩 (Vibe Coding)**
AI에게 자연어로 요구사항을 전달하여 코드를 생성하는 방식입니다. 하네스 엔지니어링은 이 바이브 코딩의 결과물을 "통제 가능한 수준"으로 끌어올리는 것이 핵심입니다.

**에이전트 독 (Agent Dog)**
DataDog의 AI 에이전트 버전 개념입니다. AI 에이전트가 매일 제대로 작동하는지 실시간으로 모니터링하는 시스템을 의미합니다.

---

## Part 2. 하네스 엔지니어링 6단계 워크플로우

영상에서 제시한 전체 흐름을 단계별로 정리합니다. 각 단계마다 "왜 필요한지"와 "구체적으로 뭘 하는지"를 함께 설명합니다.

### 전체 흐름 요약

```
[1] 요구사항 수집 → [2] 플랜 수립 → [3] CPS 기획 → [4] 아키텍처 설계 → [5] 코드 구현 (린터 강제) → [6] 평가 & 모니터링
```

### Stage 1: 요구사항 수집

**목적:** 고객의 비정형적 요구사항을 있는 그대로 받아들이기

**핵심 원칙:**

- 고객의 발언을 제한하지 않는다
- 편하게, 하고 싶은 말 다 하게 한다
- 이 단계에서는 구조화하지 않는다 — 그냥 전부 수집한다

**실전 예시: 배달 플랫폼**

고객이 "배달 앱 하나 만들어주세요"라고 말했을 때, FDE는 대화를 통해 실제로 필요한 것이 4개의 소프트웨어임을 파악합니다:

| 소프트웨어  | 페르소나    | 핵심 기능                 |
| ----------- | ----------- | ------------------------- |
| 고객용 앱   | 주문자      | 음식 검색, 주문, 결제     |
| 기사용 앱   | 배달 기사   | 위치 확인, 픽업, 배달     |
| 음식점용 앱 | 식당 사장님 | 주문 수락, 조리 완료 알림 |
| 어드민      | 내부 운영자 | 전체 현황 관리, 통계      |

**프론트엔드 엔지니어로서 할 수 있는 것:**

- 고객 미팅에 참여하여 UI/UX 관점의 질문을 던진다
- "이 화면에서 사용자가 가장 먼저 하는 행동이 뭔가요?" 같은 질문
- 녹음/녹화 후 AI로 전사하여 미팅 로그를 자동 생성한다

### Stage 2: 플랜 수립 (미팅 로그 구조화)

**목적:** 발산적 회의 내용을 수렴하여 구조적 문서로 변환

**구성 요소 3가지:**

1. 미팅 로그 정리 — 회의에서 나온 내용을 구조화
2. 부족/과잉 분석 — 빠진 것, 불필요한 것 식별
3. Build vs Buy 판단 — 직접 구축할 것과 기존 솔루션을 사용할 것을 구분

**실전 예시: 미팅 로그 → 구조화된 플랜**

미팅에서 나온 원본 내용:

```
"기사님들이 배달 순서를 잘 모르겠다고 해요.
그리고 음식점에서 조리 완료 버튼을 안 누르는 경우가 많아서
기사님이 도착해도 음식이 안 나온 경우가 많대요."
```

구조화된 플랜:

```
## 식별된 문제
1. 기사 앱: 배달 순서 최적화 로직 부재
2. 음식점 앱: 조리 완료 상태 전환 UX 문제 → 누르기 쉬운 UI 필요
3. 시스템: 기사 도착 시점과 조리 완료 시점 동기화 로직 필요

## Build vs Buy
- 경로 최적화: 외부 API 활용 (Google Maps Directions API)
- 조리 완료 알림: 자체 구축 (실시간 WebSocket)
- 어드민 대시보드: 자체 구축
```

### Stage 3: CPS 기획

**목적:** 모두가 같은 맥락 위에서 문제와 솔루션을 논의할 수 있게 하기

**CPS 문서 구조:**

```markdown
# CPS: 배달 기사 앱 — 배달 순서 최적화

## Context (맥락)

- 현재 기사 50명이 하루 평균 30건 배달 수행
- 배달 순서는 기사 개인 판단에 의존
- 피크타임(11:30-13:00)에 평균 배달 시간 42분 → 목표 30분 이내

## Problem (문제)

- 기사가 비효율적 경로로 이동하여 배달 시간 증가
- 음식점 조리 완료 시점과 기사 도착 시점 불일치
- 기사의 현재 위치 기반 동적 재배치 불가

## Solution (솔루션)

- 실시간 경로 최적화 알고리즘 도입
- 조리 상태 실시간 연동 (음식점 앱 ↔ 기사 앱)
- 위치 기반 자동 배달 배정 시스템
```

**CPS의 파워:**

- 새로운 팀원이 와도 Context만 읽으면 "왜 이걸 만드는지" 즉시 이해 가능
- 고객사와 공유하면 "우리가 같은 그림을 보고 있는지" 확인 가능
- AI에게 던져도 일관된 방향의 결과물을 유도 가능

### Stage 4: 아키텍처 & 원칙 설계

**목적:** 코드 작성 전에 시스템의 뼈대와 규칙을 확정

**설계 문서의 목차 구조 (영상 기반):**

```
1. 원칙 (Principles)
   - 대전제 규칙들

2. 개념 정의 (Definitions)
   - 도메인 용어와 계층 구조

3. 구조 (Structure)
   - 아키텍처 다이어그램

4. 유저 멘탈 모델 (User Mental Model)
   - 사용자가 시스템을 어떻게 인식하는지

5. 데이터 설계
   - 엔티티, API 인터페이스
```

**실전 예시: 원칙 문서**

```markdown
# 배달 플랫폼 설계 원칙

## 대전제

1. 모든 상태 변경은 이벤트로 기록된다 (Event Sourcing)
2. 기사/음식점 앱은 오프라인에서도 최소 기능이 동작해야 한다
3. 실시간 데이터는 최대 3초 이내 반영되어야 한다
4. 에러 발생 시 사용자에게 명확한 복구 경로를 제시한다

## 도메인 모델 계층

- Order (주문) → 최상위 엔티티
  - OrderItem (주문 항목)
  - Payment (결제)
- Delivery (배달) → Order에 종속
  - DeliveryRoute (배달 경로)
  - DeliveryStatus (배달 상태)
- Restaurant (음식점) → 독립 엔티티
- Rider (기사) → 독립 엔티티

## 네이밍 컨벤션

- 페이지: 도메인 복수형 (Restaurants, Orders, Riders)
- 상세: 도메인 단수형 (Restaurant, Order, Rider)
- "List", "Detail", "Search" 등의 접미사 사용 금지
```

### Stage 5: 코드 레벨 하네스 구축 (린터 기반 강제화)

**목적:** AI가 어떤 코드를 생성하든, 우리가 정한 규칙에 맞는 결과만 나오게 강제

이 단계가 하네스 엔지니어링의 핵심입니다. 프론트엔드 엔지니어로서 가장 직접적으로 실행할 수 있는 부분이기도 합니다.

**린터로 강제하는 것들:**

| 대상        | 규칙                        | 예시                                                |
| ----------- | --------------------------- | --------------------------------------------------- |
| 파일명      | 도메인 복수형/단수형만 허용 | `Restaurants.tsx` ⭕ / `RestaurantList.tsx` ❌      |
| 임포트 순서 | 알파벳 순 강제              | ESLint `sort-imports`                               |
| 배럴 파일   | index.ts 익스포트 규칙      | 특정 패턴만 허용                                    |
| 임포트 제한 | 레이어 간 의존성 방향 강제  | Presentation → Domain ⭕ / Domain → Presentation ❌ |

**실전 예시: ESLint 커스텀 룰 (프론트엔드 관점)**

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    // 1. 임포트 순서 강제
    "sort-imports": [
      "error",
      {
        ignoreCase: true,
        ignoreDeclarationSort: false,
      },
    ],

    // 2. 레이어 간 의존성 방향 강제
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["@/domain/*"],
            importNames: ["default"],
            message: "Domain 레이어에서 Presentation을 import할 수 없습니다.",
          },
          {
            group: ["@/data/*"],
            importNames: ["default"],
            message:
              "Data 레이어를 직접 import하지 마세요. Domain을 통해 접근하세요.",
          },
        ],
      },
    ],

    // 3. 파일명 컨벤션 강제
    "check-file/filename-naming-convention": [
      "error",
      {
        "**/*.tsx": "PASCAL_CASE",
        "**/*.ts": "CAMEL_CASE",
      },
    ],
  },
};
```

**실전 예시: 프로젝트 폴더 구조 (Clean Architecture)**

```
src/
├── presentation/          # UI 레이어
│   ├── pages/
│   │   ├── Restaurants.tsx       # 목록 페이지 (복수형)
│   │   ├── Restaurant.tsx        # 상세 페이지 (단수형)
│   │   ├── Orders.tsx
│   │   └── Order.tsx
│   ├── components/
│   │   ├── RestaurantCard.tsx
│   │   └── OrderStatusBadge.tsx
│   └── hooks/
│       ├── useRestaurants.ts
│       └── useOrder.ts
│
├── domain/                # 비즈니스 로직 레이어
│   ├── entities/
│   │   ├── Restaurant.ts
│   │   ├── Order.ts
│   │   └── Rider.ts
│   ├── useCases/
│   │   ├── getRestaurants.ts
│   │   ├── createOrder.ts
│   │   └── assignRider.ts
│   └── repositories/           # 인터페이스만 정의
│       ├── RestaurantRepository.ts
│       └── OrderRepository.ts
│
└── data/                  # 데이터 레이어
    ├── dto/
    │   ├── RestaurantDTO.ts
    │   └── OrderDTO.ts
    ├── repositories/           # 구현체
    │   ├── RestaurantRepositoryImpl.ts
    │   └── OrderRepositoryImpl.ts
    └── api/
        ├── restaurantApi.ts
        └── orderApi.ts
```

**Git Hooks로 커밋 시점에 자동 검증:**

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"]
  }
}
```

이렇게 하면 AI가 코드를 생성하고 커밋을 시도할 때, 린터가 자동으로 실행되어 규칙에 맞지 않는 코드는 커밋되지 않습니다. AI는 이를 감지하고 스스로 수정합니다.

### Stage 6: 평가 & 모니터링

**목적:** AI가 만든 결과물이 진짜 잘 작동하는지 지속적으로 검증

**일반적인 AI 평가 4대 지표:**

| 지표                 | 설명                        | 예시                                         |
| -------------------- | --------------------------- | -------------------------------------------- |
| Contextual Relevance | 문맥에 맞는 답변인가?       | 주문 상태를 물었는데 메뉴를 보여주진 않는지  |
| Correctness          | 정확한 결과인가?            | 배달 예상 시간이 실제와 얼마나 차이나는지    |
| Source Accuracy      | 올바른 데이터를 참조했는가? | 올바른 음식점 정보를 가져왔는지              |
| Completeness         | 빠진 정보는 없는가?         | 알러지 정보 등 필수 항목이 누락되지 않았는지 |

**조직 맞춤형 평가의 핵심:**

영상에서 강조한 부분은, 위의 범용 지표를 넘어서 "우리 조직에 맞는 기준"을 세우는 것입니다:

- 어떤 조직: "100번 중 1번 틀려도 괜찮다. 대신 항상 답변해라"
- 다른 조직: "20번 틀릴 바에 답변하지 마라. 정확도가 최우선이다"

이 기준은 비즈니스 특성과 조직 문화에 따라 달라집니다.

---

## Part 3. 프론트엔드 엔지니어를 위한 실전 적용 체크리스트

영상의 내용을 기반으로, 프론트엔드 엔지니어가 "지금 당장" 시작할 수 있는 것들을 정리합니다.

### 지금 바로 할 수 있는 것

**1. 프로젝트 린터 강화**

- ESLint 커스텀 룰로 파일명, 임포트 순서, 레이어 의존성 강제
- Husky + lint-staged로 커밋 시점 자동 검증
- 이것만 해도 AI가 생성하는 코드의 일관성이 크게 올라감

**2. 프로젝트 원칙 문서 작성**

- `ARCHITECTURE.md` 파일에 폴더 구조, 네이밍 규칙, 레이어 규칙 명시
- AI에게 이 문서를 컨텍스트로 제공하면 일관된 코드 생성 가능
- 새로운 팀원 온보딩에도 즉시 활용 가능

**3. CPS 문서 습관화**

- 새로운 기능을 시작할 때마다 간단한 CPS 작성
- 혼자 작업하더라도 Context를 명시하면 나중에 왜 이렇게 만들었는지 추적 가능

### 중기적으로 구축할 것

**4. 디자인 시스템 기반 하네스**

- Storybook + 컴포넌트 라이브러리로 UI 결과물 일관성 확보
- AI가 새 화면을 만들 때 기존 컴포넌트를 재사용하도록 강제

**5. 코드 생성 템플릿**

- 페이지, 컴포넌트, UseCase 등의 보일러플레이트 생성기 구축
- `plop` 또는 커스텀 CLI 도구로 구조를 강제

**6. E2E 테스트 기반 평가**

- Playwright/Cypress로 핵심 유저 플로우 자동 테스트
- AI가 코드를 변경해도 기존 기능이 깨지지 않는지 자동 검증

---

## Part 4. AI에게 먹이는 컨텍스트 문서 예시

하네스 엔지니어링의 핵심은 "AI에게 주는 컨텍스트의 품질"입니다. 아래는 프로젝트 시작 시 AI에게 제공할 수 있는 ARCHITECTURE.md 예시입니다.

```markdown
# Project Architecture Guide

## 기술 스택

- React 18 + TypeScript
- Tanstack Query (서버 상태 관리)
- Zustand (클라이언트 상태 관리)
- Tailwind CSS

## 아키텍처: Clean Architecture (Presentation → Domain → Data)

### 의존성 규칙

- Presentation은 Domain만 참조할 수 있다
- Domain은 어떤 레이어도 참조하지 않는다 (순수 비즈니스 로직)
- Data는 Domain의 인터페이스를 구현한다

### 네이밍 규칙

- 페이지 파일: 도메인 복수형 (Restaurants.tsx) 또는 단수형 (Restaurant.tsx)
- "List", "Detail", "Search", "View" 등의 접미사 사용 금지
- UseCase: 동사 + 도메인 (getRestaurants, createOrder)
- Repository 인터페이스: {Domain}Repository (RestaurantRepository)
- Repository 구현체: {Domain}RepositoryImpl (RestaurantRepositoryImpl)
- DTO: {Domain}DTO (RestaurantDTO)
- Entity: {Domain} (Restaurant) — 접미사 없음

### 코드 스타일

- 불필요한 useMemo / useCallback 사용 금지
- 커스텀 훅은 반드시 hooks/ 디렉토리에 위치
- 컴포넌트 props는 인라인 타입 대신 별도 타입 정의
- default export 사용 금지 — named export만 사용
- 배럴 파일(index.ts)은 각 디렉토리의 public API만 export

### 금지 사항

- Data 레이어의 타입을 Presentation에서 직접 사용하지 않는다
- API 응답 타입(DTO)을 컴포넌트에 그대로 전달하지 않는다
- 3depth 이상의 조건부 렌더링을 하나의 컴포넌트에 넣지 않는다
```

---

## Part 5. 핵심 인사이트 정리

영상에서 가장 중요한 메시지들을 정리합니다.

### "프롬프트를 깎지 말고, 하네스를 깎아라"

프롬프트 엔지니어링만으로는 일관성을 보장할 수 없습니다. 시스템적인 가드레일(린터, 테스트, 아키텍처 규칙)이 결과물의 품질을 잡아줍니다.

### "기능이 망가지면 리팩토링하지 말고, 지우고 새로 짜라"

하네스가 잘 설계되어 있으면 같은 스펙으로 새로 생성해도 동일한 결과가 나옵니다. 이것이 멱등성의 실전적 의미입니다.

### "AI가 편한 코드가 아니라, 사람이 읽을 수 있는 코드를 만들어라"

AI 최적화 코드와 휴먼 리더블 코드 사이에 트레이드오프가 있지만, 유지보수를 고려하면 사람이 읽을 수 있는 코드가 더 중요합니다.

### "방법론을 통일하지 말고, 멘탈 모델을 일치시켜라"

팀 내에서 코딩 컨벤션을 완벽히 통일하는 것보다, "왜 이렇게 하는지"에 대한 이해를 공유하는 것이 더 효과적입니다. 원칙 몇 가지만 합의하고, 실행의 자유도는 높게 유지합니다.

### "설계 세계관을 고객과 공유하라"

고객이 우리의 설계 구조를 이해하면, 더 질 좋은 피드백을 줄 수 있습니다. 문서화된 설계는 커뮤니케이션의 품질을 높입니다.

---

## Part 6. 추천 학습 경로

하네스 엔지니어링을 더 깊이 이해하기 위해 학습하면 좋은 주제들입니다.

**1단계: 기반 지식**

- Clean Architecture (Robert C. Martin)
- Domain-Driven Design 기초 (Eric Evans)
- ESLint 커스텀 룰 작성법

**2단계: 실전 적용**

- Husky + lint-staged 파이프라인 구축
- Storybook 기반 컴포넌트 문서화
- Playwright E2E 테스트 작성

**3단계: AI 네이티브 워크플로우**

- Claude Code / Codex 등 AI 코딩 도구 활용법
- MCP (Model Context Protocol) 이해
- AI 평가 프레임워크 (LangChain Evaluation 등)

---

_이 가이드는 하우이 AI 팟캐스트 — 스페이스와이 황현태 대표, 김지훈 FDE의 인터뷰 내용을 기반으로 작성되었습니다._

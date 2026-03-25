# CPS: 진화 체인

## 1. Context

- 포켓몬 상세 페이지에서 해당 포켓몬의 진화 흐름을 시각적으로 보여주는 기능
- PokeAPI의 evolution-chain 엔드포인트는 체인 구조가 중첩 객체 형태로 제공됨
- Agent A의 Pokemon 상세 페이지 내 섹션으로 삽입됨

---

## 2. Problem

- PokeAPI 진화 체인 응답은 재귀 구조(`chain.evolves_to[].evolves_to[]`)라 파싱이 복잡함
- 단순 나열이 아닌 분기 진화(이브이 등)도 존재
- 진화 조건(레벨, 아이템, 친밀도 등)도 함께 표시해야 사용성이 높음

---

## 3. Solution

- 진화 체인을 재귀 파싱하여 선형/분기 구조를 모두 처리하는 Entity 설계
- 화살표 흐름으로 진화 단계를 시각화하는 컴포넌트 구현
- 각 진화 단계에 조건 텍스트 표시 (레벨업, 아이템 사용 등)

---

## 4. Scope

### Included

- `src/domain/useCases/getEvolutionChain.ts` — 포켓몬 ID 기반 진화 체인 조회
- `src/presentation/components/EvolutionChain.tsx` — 진화 체인 시각화 컴포넌트
- `src/presentation/hooks/useEvolutionChain.ts` — 진화 체인 조회 훅

Note: `src/domain/entities/EvolutionChain.ts`는 Agent 0(Phase 1)에서 이미 생성됨.
이 파일을 새로 만들거나 수정하지 말 것 — import하여 사용.

### Excluded

- 진화 후 포켓몬의 상세 페이지 이동은 Agent A의 라우팅 활용
- 메가진화, 지역 폼 등 특수 폼 (초기 스코프 외)
- 배틀에서의 진화 시뮬레이션 (Agent E 담당)

---

## 5. Done Criteria

- [ ] 단계별 직선 진화 체인 렌더링
- [ ] 이브이 등 분기 진화 체인 렌더링
- [ ] 진화 조건 텍스트 표시 (최소: 레벨, 아이템)
- [ ] 진화 체인 내 포켓몬 클릭 시 해당 상세 페이지로 이동
- [ ] lint 통과
- [ ] 타입 오류 없음

# CPS: 타입 필터 · 세대 필터

## 1. Context

- 포켓몬은 18가지 타입(불꽃, 물, 풀 등)과 9개 세대로 분류됨
- 목록 페이지에서 원하는 조건으로 포켓몬을 좁혀서 탐색하려는 사용자 요구
- Agent A의 목록 페이지 위에 필터 UI를 추가하는 형태로 동작

---

## 2. Problem

- 1000개 이상의 포켓몬을 스크롤만으로 탐색하는 건 비효율적
- 타입별/세대별로 보고 싶은 사용자 니즈가 명확함
- 필터 상태가 무한스크롤 pagination과 연동되어야 함

---

## 3. Solution

- 타입 멀티셀렉트 필터 UI 구현
- 세대 단일 선택 필터 UI 구현
- 필터 변경 시 목록 자동 갱신
- 선택된 필터 상태를 URL query string에 반영 (공유 가능)

---

## 4. Scope

### Included

- `src/domain/useCases/getPokemonTypes.ts` — 전체 타입 목록 조회
- `src/domain/useCases/getPokemonsByType.ts` — 타입별 포켓몬 조회
- `src/domain/useCases/getGenerations.ts` — 세대 목록 조회
- `src/domain/useCases/getPokemonsByGeneration.ts` — 세대별 포켓몬 조회
- `src/presentation/components/TypeFilter.tsx` — 타입 멀티셀렉트 컴포넌트
- `src/presentation/components/GenerationFilter.tsx` — 세대 선택 컴포넌트
- `src/presentation/hooks/useTypeFilter.ts` — 타입 필터 상태 훅
- `src/presentation/hooks/useGenerationFilter.ts` — 세대 필터 상태 훅

### Excluded

- 필터 결과를 표시하는 목록 UI 자체 (Agent A 담당)
- 검색과 필터의 조합 로직 (Orchestrator가 통합 시 결정)
- 즐겨찾기 필터 (Agent D 담당)

---

## 5. Done Criteria

- [ ] 전체 타입 목록 로드 및 멀티셀렉트 UI 동작
- [ ] 세대 선택 시 해당 세대 포켓몬만 표시
- [ ] 필터 상태가 URL query string에 반영됨
- [ ] 필터 초기화 동작
- [ ] lint 통과
- [ ] 타입 오류 없음

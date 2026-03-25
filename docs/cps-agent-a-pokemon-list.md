# CPS: 포켓몬 목록 · 상세 · 검색

## 1. Context

- 사용자가 포켓몬 전체 목록을 탐색하고 원하는 포켓몬을 찾는 핵심 기능
- 앱의 진입점이자 가장 많이 사용되는 화면
- PokeAPI는 pagination 기반으로 포켓몬 목록 제공 (기본 limit: 20)

---

## 2. Problem

- 포켓몬이 1000개 이상이므로 한 번에 로드 불가 → 페이지네이션 또는 무한스크롤 필요
- 이름으로 빠르게 찾고 싶은 사용자 요구 존재
- 목록 → 상세 이동 시 데이터를 다시 fetch하는 중복 요청 발생 가능

---

## 3. Solution

- 무한스크롤 기반 포켓몬 목록 페이지 구현
- 이름 기반 검색 기능 (클라이언트 필터 또는 API 쿼리)
- 포켓몬 카드 클릭 시 상세 페이지로 이동
- 상세 페이지에서 스탯, 타입, 기술, 키/몸무게 표시

---

## 4. Scope

### Included

- `src/domain/useCases/getPokemons.ts` — 목록 조회 (pagination)
- `src/domain/useCases/getPokemon.ts` — 단일 포켓몬 상세 조회
- `src/presentation/pages/Pokemons.tsx` — 목록 페이지 (무한스크롤)
- `src/presentation/pages/Pokemon.tsx` — 상세 페이지
- `src/presentation/components/PokemonCard.tsx` — 목록용 카드 컴포넌트
- `src/presentation/components/PokemonStats.tsx` — 스탯 바 컴포넌트
- `src/presentation/hooks/usePokemons.ts` — 목록 + 무한스크롤 훅
- `src/presentation/hooks/usePokemon.ts` — 상세 조회 훅
- `src/presentation/hooks/usePokemonSearch.ts` — 검색 훅

### Excluded

- 타입/세대 필터 (Agent B 담당)
- 진화 체인 UI (Agent C 담당)
- 즐겨찾기 버튼 UI (Agent D 담당) — 단, `Pokemon.tsx` 상세 페이지 헤더 영역에 아래 주석을 정확히 삽입:
  ```tsx
  {/* slot:favorite-button */}
  ```
  Agent D가 이 주석을 찾아 `<FavoriteButton />` 으로 교체함
- 배틀 기능 (Agent E 담당)

---

## 5. Done Criteria

- [ ] 목록 페이지에서 무한스크롤로 포켓몬 로드
- [ ] 이름 검색 시 결과 필터링
- [ ] 카드 클릭 시 상세 페이지 이동
- [ ] 상세 페이지에서 이미지, 타입, 스탯, 기술 표시
- [ ] Presentation → Domain → Data 의존성 방향 준수
- [ ] lint 통과
- [ ] 타입 오류 없음

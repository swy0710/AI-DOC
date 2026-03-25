# CPS: 즐겨찾기 · 포켓몬 비교

## 1. Context

- 마음에 드는 포켓몬을 저장하고 나중에 빠르게 접근하려는 사용자 요구
- 즐겨찾기한 포켓몬끼리 스탯을 비교하는 기능으로 확장
- 서버 없이 localStorage 기반으로 클라이언트 상태 관리

---

## 2. Problem

- 앱을 껐다 켜도 즐겨찾기 목록이 유지되어야 함 → 영속성 필요
- 즐겨찾기 상태가 목록 페이지, 상세 페이지, 즐겨찾기 페이지 등 여러 곳에서 동기화되어야 함
- 비교 기능은 최대 2~3마리로 제한하여 UI 복잡도 관리

---

## 3. Solution

- localStorage 기반 즐겨찾기 영속화
- 전역 상태로 즐겨찾기 동기화 (Zustand + localStorage persist middleware)
- 즐겨찾기 목록 페이지 구현
- 즐겨찾기된 포켓몬 2마리 선택 후 스탯 레이더 차트로 비교

---

## 4. Scope

### Included

- `src/domain/entities/Favorite.ts` — 즐겨찾기 엔티티
- `src/domain/useCases/addFavorite.ts` — 즐겨찾기 추가
- `src/domain/useCases/removeFavorite.ts` — 즐겨찾기 제거
- `src/domain/useCases/getFavorites.ts` — 즐겨찾기 목록 조회
- `src/domain/repositories/FavoriteRepository.ts` — Repository interface
- `src/data/repositories/FavoriteRepositoryImpl.ts` — localStorage 구현체
- `src/presentation/pages/Favorites.tsx` — 즐겨찾기 목록 페이지
- `src/presentation/components/FavoriteButton.tsx` — 즐겨찾기 토글 버튼 (Agent A가 `Pokemon.tsx`에 남긴 `{/* slot:favorite-button */}` 주석 위치에 삽입)
- `src/presentation/components/PokemonComparison.tsx` — 스탯 비교 컴포넌트 (레이더 차트)
- `src/presentation/hooks/useFavorites.ts` — 즐겨찾기 상태 훅

### Excluded

- 서버 동기화, 로그인/계정 기능
- 3마리 이상 동시 비교
- 배틀 시뮬레이터에서의 즐겨찾기 활용 (Agent E가 훅을 재사용)

---

## 5. Done Criteria

- [ ] 포켓몬 상세 페이지에서 즐겨찾기 추가/제거 동작
- [ ] 앱 재시작 후에도 즐겨찾기 목록 유지 (localStorage)
- [ ] 즐겨찾기 목록 페이지에서 저장된 포켓몬 표시
- [ ] 2마리 선택 후 스탯 비교 차트 표시
- [ ] 즐겨찾기 상태가 목록/상세 페이지에서 실시간 동기화
- [ ] lint 통과
- [ ] 타입 오류 없음

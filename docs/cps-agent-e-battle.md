# CPS: 배틀 시뮬레이터

## 1. Context

- 두 포켓몬을 선택하여 타입 상성과 스탯 기반으로 배틀 결과를 시뮬레이션하는 기능
- Agent A (포켓몬 데이터), Agent B (타입 정보), Agent D (즐겨찾기)를 모두 활용
- 실제 포켓몬 배틀 공식을 단순화하여 구현

---

## 2. Problem

- 포켓몬 게임에서 타입 상성과 스탯이 배틀에 미치는 영향을 직관적으로 확인하기 어려움
- 단순 스탯 비교만으로는 실제 배틀 결과 예측이 불충분

---

## 3. Solution

- 포켓몬 2마리를 선택하는 UI 구현
- 타입 상성 계산 (공격/방어 배율 표시)
- 스탯 기반 단순화된 배틀 시뮬레이션 (선공, 데미지, 승패 판정)
- 턴제 배틀 흐름을 텍스트 로그로 표시

---

## 4. Scope

### Included

- `src/domain/useCases/simulateBattle.ts` — 배틀 시뮬레이션 로직 (순수 함수)
- `src/domain/useCases/calculateTypeEffectiveness.ts` — 타입 상성 계산
- `src/domain/entities/Battle.ts` — 배틀 상태 엔티티 (참가자, 턴 로그, 결과)
- `src/presentation/pages/Battle.tsx` — 배틀 시뮬레이터 페이지
- `src/presentation/components/BattleArena.tsx` — 배틀 진행 UI
- `src/presentation/components/PokemonSelector.tsx` — 배틀 참가 포켓몬 선택 컴포넌트
- `src/presentation/components/BattleLog.tsx` — 턴별 배틀 로그 컴포넌트
- `src/presentation/components/TypeEffectiveness.tsx` — 타입 상성 뱃지 컴포넌트
- `src/presentation/hooks/useBattle.ts` — 배틀 시뮬레이션 상태 훅

### Excluded

- 실제 포켓몬 게임의 완전한 배틀 공식 (급소, 날씨, 특성 등)
- 멀티플레이어
- 기술 선택 UI (자동 최적 기술 선택으로 단순화)
- 애니메이션 전투 연출 (텍스트 로그로 대체)

---

## 5. Done Criteria

- [ ] 포켓몬 2마리 선택 UI 동작
- [ ] 타입 상성 배율 표시 (2x, 0.5x 등)
- [ ] 배틀 시뮬레이션 실행 및 승패 결과 표시
- [ ] 턴별 배틀 로그 표시
- [ ] simulateBattle UseCase가 순수 함수로 구현됨 (UI 의존 없음)
- [ ] lint 통과
- [ ] 타입 오류 없음

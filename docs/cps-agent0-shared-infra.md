# CPS: 공통 인프라 (Shared Infrastructure)

## 1. Context

- 모든 agent가 공유하는 DTO, Repository interface, 공통 hook의 기반이 되는 레이어
- Phase 2 agent들이 병렬로 작업하기 전에 반드시 완성되어야 함
- 현재 상태: 프로젝트 초기, 공통 계약(contract)이 없음

---

## 2. Problem

- DTO, Entity, Repository interface가 없으면 각 agent가 제각각 타입을 정의하게 됨
- 중복 타입 정의 → 일관성 붕괴, merge conflict 발생
- Presentation이 DTO를 직접 사용하는 architecture 위반 리스크

---

## 3. Solution

- 전체 프로젝트에서 공유하는 Pokemon 도메인의 핵심 타입과 계약을 정의
- 이후 모든 agent는 이 파일들을 import하여 사용

---

## 4. Scope

### Included

- `src/data/dto/PokemonDto.ts` — PokeAPI 응답 타입 (목록용 / 상세용)
- `src/data/dto/TypeDto.ts` — 타입 정보 응답 타입
- `src/data/dto/EvolutionDto.ts` — 진화 체인 응답 타입
- `src/domain/entities/Pokemon.ts` — Pokemon 도메인 엔티티
- `src/domain/entities/PokemonType.ts` — 타입 도메인 엔티티
- `src/domain/entities/EvolutionChain.ts` — 진화 체인 도메인 엔티티
- `src/domain/repositories/PokemonRepository.ts` — Repository interface
- `src/data/api/pokemonApi.ts` — fetch 기반 API 호출 함수 (base URL 포함)
- `src/data/repositories/PokemonRepositoryImpl.ts` — Repository 구현체 (DTO → Entity 매핑 포함)

### Excluded

- UI 컴포넌트
- UseCase (각 agent가 필요한 것만 작성)
- 즐겨찾기 관련 타입 (Agent D 담당)
- 배틀 관련 타입 (Agent E 담당)

---

## 5. Done Criteria

- [ ] 모든 DTO가 PokeAPI v2 실제 응답 구조와 일치
- [ ] Pokemon Entity가 UI에서 바로 쓸 수 있는 형태로 정규화됨 (id, name, imageUrl, types 등)
- [ ] PokemonRepository interface가 모든 agent의 UseCase에서 사용 가능한 메서드를 포함
- [ ] DTO → Entity 매핑 함수가 Data 레이어 안에 위치
- [ ] lint 통과
- [ ] 타입 오류 없음

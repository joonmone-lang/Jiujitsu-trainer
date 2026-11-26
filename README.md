# Jiujitsu-trainer

주짓수 홈 트레이닝 라운드 타이머와 운동 기록 앱. 태블릿 홈 화면에 설치할 수 있고 오프라인에서도 동작하는 PWA.

## 파일
| 파일 | 역할 |
|---|---|
| `index.html` | 앱 전체 (화면, 운동 데이터, 타이머, 기록) |
| `sw.js` | 서비스 워커: 오프라인 캐시. **앱을 고칠 때마다 `VERSION` 숫자를 올리기** |
| `manifest.webmanifest` | 홈 화면 설치 정보 (이름, 색, 아이콘) |
| `icons/` | 앱 아이콘 (`icon.svg`이 원본) |
| `.nojekyll` | GitHub Pages가 파일을 그대로 올리게 함 |

## 기록 저장
- 기록은 이 기기 브라우저의 localStorage(`jj-v2` 키)에 저장돼.
- 설정 → **기록 내보내기**로 `jj-backup-날짜.json` 백업, 새 기기에서 **기록 가져오기**로 합치기.
- 브라우저 데이터 삭제, 앱 삭제를 하면 기록이 지워지니까 그 전에 꼭 내보내기.

## 배포 (GitHub Pages)
1. `main` 브랜치에 이 파일들이 있어야 함.
2. 저장소 Settings → Pages → Source: *Deploy from a branch*, Branch: `main` / `/ (root)` → Save.
3. 주소: `https://joonmone-lang.github.io/Jiujitsu-trainer/`

## 업데이트 순서
1. `index.html` 수정
2. `sw.js`의 `const VERSION = 'v1'`을 `'v2'`, `'v3'`처럼 하나 올림 (안 올리면 태블릿이 예전 버전을 계속 보여줌)
3. `main`에 반영 → 1~2분 뒤 앱을 열면 설정에 "새 버전이 있어" 버튼이 뜸 → 누르면 새로고침
4. 기록 형식(`ST` 구조)을 바꿀 땐 기존 기록을 옮기는 코드도 같이 넣기

## 로컬에서 확인
```
python3 -m http.server 8000
```
브라우저에서 `http://localhost:8000` (서비스 워커는 `file://`로 열면 동작하지 않음)

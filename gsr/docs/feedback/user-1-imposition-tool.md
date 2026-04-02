# User 1 Feedback — Imposition Tool (April 1, 2026)

## User Profile

- Zero doświadczenia w kodingu, 100% vibe coder
- Zna domenę (druk, introligatorstwo), zna konkurencję
- Wcześniej zbudował tę samą appkę z GSD — ma benchmark do porównania
- Projekt: web app do impozycji PDF (`IMP_2`)

## GSR Version Tested

0.1.x (pre-feedback release)

## Raw Feedback (original, Polish)

Source: Notion export, April 1 2026. Images archived at `gsr/docs/feedback/user-1-images/`.

---

Premise and benchmark: apka do robienia impozycji.

Apka już została raz zbudowana i skutecznie przetestowana za pomocą GSD. Używam podobnej struktury promptów i opisów, a także porównuję step-by-step GSD i GSR tam, gdzie się da.

Uwaga, jestem marudny. Zero expa w kodingu. 100% vibez. Ale wiem, co chcę zbudować, znam już konkurencję i warunki brzegowe.

**Good:** wstępne odpowiedzi na pytania. GSR zasugerował, że może komunikować bezpośrednio z drukarką.

**Bad:** pytanie o target usera, od razu na twarz "clarifying questions" - liczyłbym, że będzie to rozdzielone, najpierw pogadamy więcej o userze, potem pogadamy więcej o mechanice, potem o outputie. Teraz muszę dużo pisać i myśleć. Pamiętam, że GSD był bardziej otwarty na target users, tzn. nie sugerował ich z góry tak strict.

---

**Good:** baaaaardzo szybko przechodzimy do działania. GSD potrzebował o wiele więcej rzeczy ustalić.

**Bad:** lokalni agenci się odpalili bez mojej wyraźnej zgody. Liczyłbym, że będę w stanie wybrać lżejszego agenta do zrobienia researchu.

**Bad:** paper size jest ograniczający.

**Info:** GSD już na tym etapie wiedział, które elementy są MVP, a które możemy odstawić na potem.

---

**Good:** bardzo dobre pytanie, dobre użycie "while we wait".

---

**Good:** bardzo pod wrażeniem jestem szybkości researchu! GSD mielił 4 agentami przez 18 minut.

**Bad:** zadaje pytania kilka razy. Niby dobrze, bo jest jakiś reasoning, a potem ściana i pytania. Ale trochę noise pollution.

**Good:** konkretny benchmark! GSD mi go nie dał.

**Bad:** Imposition Wizard kosztuje $599 w najwyższym planie; są tańsze opcje, których nie wyszczególnił, a które byłyby dla mnie biznesowo relevantne przy walidacji. Ufaj, ale sprawdzaj.

**Good:** zasugerowany tech stack pokrywa się z GSD.

**Info:** So far bardzo mało zużytych tokenów przy dość zbliżonych rezultatach.

---

**Bad:** nieczytelne, a na końcu pyta czy chcę "stworzyć scope.md". To stworzyłeś, czy nie?

**Info:** sporo konfiguracyjnych założeń jest już ujętych w scope.md, ale są skomplikowane. Dla enginera super, dla vibekodera chyba skomplikowane.

**Info:** GSR dał mi wiele rozwiązań z góry, o które GSD pytał po analizie. GSR narzucił limit 100MB per plik.

**Good:** SUPER wyniki researchu konkurencji.

---

**Good:** podsumował jeszcze raz scope, dał pytania na które nie dostał odpowiedzi jeszcze.

**Could be better:** sposób prezentowania outputów mógłby być lepszy. GSD robi niestety lepiej: kolorki, czytelny flow, daje 3 opcje lub wpisujesz swoją. W GSR pytania i reasoning trochę w treści, trochę na końcu.

---

**Bad:** poprosiłem go o zmiany i mieli kilka razy ten sam scope.md dodając poprawki. To dla mnie tylko szum.

**Good:** daje podsumowanie zmian.

---

**Good:** napisał PRD w 6m 36s.

**Not great:** odsyła mnie żebym przeczytał PRD.md i potwierdził.

**Great:** PRD framework: Primary, day 1, day 7, day 30 users — fajny framework.

---

**Info:** zmienił folder projektu? Zamiast w IMP_2 działa teraz w innym folderze. Opamiętał się po interwencji.

---

**Good:** zapytał o podejście z rekomendacją — dokładnie jak GSD.

**Bad:** pytanie bez numerka.

---

**Good:** widżę jaki jest status. Cały czas migają rzeczy, kursor na dole trzyma status 5ciu kroków.

Całość zajęła imponujące 3m 35s.

---

Są i testy z użytkownikiem. GSD dał mi podobną listę.

**Dev server:** Upload działa. Uploaduję plik pdf... nie działa. Ale jest "coming soon".

Czyli podsumowując: daje mi testy, ale nie mogę testować, bo de facto nie działa.

---

**SOOOOO NICEEEEE!** (Configure screen)

**Bad:** to co, teraz mam co ekran wracać do terminala i kazać mu budować kolejny widok? Niezbyt efficient.

---

**Fajne, ale obrazki są wyhalucynowane.** (Calibrate screen)

---

**Very Bad:** wciąż muszę go prosić o kolejny widok, mimo tego że kazałem mu "zbuduj całość".

**Very good:** UI jest naprawdę super jak na tak ascetyczny prompt.

---

**Po 6 minutach oczekiwania mamy błąd:** "Generation failed — Cannot read properties of undefined (reading 'width')"

---

## Ogólne wrażenia

**Plusy:**
- Super szybkość
- Udało się zrobić MVP bez czekania na reset limitów (prawie)
- Niskie zużycie tokenów
- Bardzo dobry Tailwind UI out-of-box
- Super insighty z researchu — coś czego nie daje GSD
- Wszystkie pliki w jednym miejscu
- "Don't make me think" w najlepszym wydaniu

**Ale:**
- Obietnica "user in control" IMO nie znajduje pokrycia w rzeczywistości
- Pierdolnął się w folderach między resetami
- Brak możliwości zmiany modelu w trakcie
- UI mógłby być przyjaźniejszy
- Mniej szumu
- Doceniłbym gdyby zadawał więcej pytań — dostałem dużo rzeczy założonych z góry, 80% spoko, 20% ograniczające (przykład: założył papiery letter i a4, jako user spodziewałbym się też a3 i a3+)

## Konkluzja

> **"GSR idzie do celu, GSD prowadzi do celu."**

## Issues zidentyfikowane i zaadresowane w v0.2.0

| # | Problem | Status |
|---|---------|--------|
| 1 | Pytania bulk zamiast progresywnych | ✅ Fixed |
| 2 | Product assumptions zamiast pytań | ✅ Fixed |
| 4 | Formatowanie (numeracja, separator) | ✅ Fixed |
| 5 | Batch build ("zbuduj całość") | ✅ Fixed |
| 6 | Folder protection po /clear | ✅ Fixed |
| 8 | Szum przy edycjach | ✅ Fixed |
| 9 | Agent consent | ✅ Fixed |
| 10 | Scope TL;DR | ✅ Fixed |
| 11 | PRD summary zamiast "przeczytaj" | ✅ Fixed |
| 12 | Testy tylko dla zbudowanych features | ✅ Fixed |
| 13 | Nie powtarzaj pytań | ✅ Fixed |
| 14 | "scope.md gotowy" zamiast "chcesz stworzyć?" | ✅ Fixed |
| 15 | Nie halucynuj obrazków | ✅ Fixed |
| 16 | Runtime smoke test | ✅ Fixed |
| 17 | Pełny landscape konkurencji + ceny | ✅ Fixed |
| 18 | Wstępny MVP/v2 podział wcześniej | ✅ Fixed |
| 19 | Pytania produktowe zawsze na końcu | ✅ Fixed |
| — | Terminal visual polish (GSD parity) | 📋 Backlog |

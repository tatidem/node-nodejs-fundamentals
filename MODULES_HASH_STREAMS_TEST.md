# Testing Instructions: Modules, Hash, Streams

## Modules (src/modules)

### dynamic.js

**Как проверять:**

1. Запуск с плагином uppercase:
```bash
npm run modules:dynamic uppercase
```
Ожидаемый результат: `HELLO WORLD`

2. Запуск с плагином reverse:
```bash
npm run modules:dynamic reverse
```
Ожидаемый результат: `dlrow olleh`

3. Запуск с плагином repeat:
```bash
npm run modules:dynamic repeat
```
Ожидаемый результат: `hello hello hello`

4. Запуск с несуществующим плагином:
```bash
npm run modules:dynamic nonexistent
```
Ожидаемый результат: `Plugin not found` (exit code 1)

5. Запуск без аргументов:
```bash
npm run modules:dynamic
```
Ожидаемый результат: `Plugin not found` (exit code 1)

---

## Hash (src/hash)

### verify.js

**Подготовка:**
Уже созданы файлы:
- `file1.txt` с содержимым "hello"
- `file2.txt` с содержимым "world"
- `checksums.json` с хешами

**Как проверять:**

1. Базовая проверка:
```bash
npm run hash:verify
```
Ожидаемый результат:
```
file1.txt — OK
file2.txt — FAIL
```

2. Проверка с правильными хешами:
Измените `checksums.json`:
```json
{
  "file1.txt": "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
  "file2.txt": "486ea46224d1bb4fb680f34f7c9ad96a8f24ec88be73ea8e5a6c65260e9cb8a7"
}
```

Для получения правильного хеша file2.txt:
```bash
echo -n "world" | sha256sum
```
Результат: `486ea46224d1bb4fb680f34f7c9ad96a8f24ec88be73ea8e5a6c65260e9cb8a7`

3. Проверка отсутствия checksums.json:
```bash
del checksums.json
npm run hash:verify
```
Ожидаемый результат: `Error: FS operation failed`

---

## Streams (src/streams)

### lineNumberer.js

**Как проверять:**

1. В Git Bash:
```bash
echo -e "hello\nworld" | node src/streams/lineNumberer.js
```
Ожидаемый результат:
```
1 | hello
2 | world
```

2. С файлом (в Git Bash):
```bash
cat source.txt | node src/streams/lineNumberer.js
```
Ожидаемый результат:
```
1 | Line 1
2 | Line 2
3 | Line 3
...
```

3. В Windows PowerShell:
```powershell
Get-Content source.txt | node src/streams/lineNumberer.js
```

4. Интерактивный ввод:
```bash
node src/streams/lineNumberer.js
```
Введите строки, каждая будет пронумерована. Ctrl+C для выхода.

---

### filter.js

**Как проверять:**

1. В Git Bash с файлом:
```bash
cat source.txt | node src/streams/filter.js --pattern "Line 1"
```
Ожидаемый результат:
```
Line 1
Line 10
Line 11
Line 12
Line 13
Line 14
Line 15
Line 16
Line 17
Line 18
Line 19
```

2. В PowerShell:
```powershell
Get-Content source.txt | node src/streams/filter.js --pattern "5"
```
Ожидаемый результат:
```
Line 5
Line 15
Line 25
```

3. С echo в Git Bash:
```bash
echo -e "apple\nbanana\napricot\ncherry" | node src/streams/filter.js --pattern "ap"
```
Ожидаемый результат:
```
apple
apricot
```

---

### split.js

**Подготовка:**
Файл `source.txt` уже создан с 25 строками.

**Как проверять:**

1. Базовый запуск (по 10 строк):
```bash
node src/streams/split.js --lines 10
```
Результат: создаются файлы `chunk_1.txt`, `chunk_2.txt`, `chunk_3.txt`
- chunk_1.txt: строки 1-10
- chunk_2.txt: строки 11-20
- chunk_3.txt: строки 21-25

2. С кастомным количеством строк (по 5):
```bash
node src/streams/split.js --lines 5
```
Результат: создаются файлы `chunk_1.txt` ... `chunk_5.txt`
- Каждый файл содержит по 5 строк

3. С кастомным количеством строк (по 3):
```bash
node src/streams/split.js --lines 3
```
Результат: создаются файлы `chunk_1.txt` ... `chunk_9.txt`

**Проверка результата:**
```bash
type chunk_1.txt
type chunk_2.txt
type chunk_3.txt
```

---

## Общие замечания

- Все функции используют Streams API
- Обработка ошибок реализована согласно требованиям
- CLI аргументы парсятся корректно
- Для Windows используйте `type` вместо `cat`
- Для тестирования echo в Windows используйте PowerShell или Git Bash

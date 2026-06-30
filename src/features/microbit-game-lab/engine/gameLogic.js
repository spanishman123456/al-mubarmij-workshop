/** @typedef {import('../types.js').GameId} GameId */

export const GAME_LOGIC = {
  "guess-number": `
lcd_init()
lcd_show("Guess Game", "1-9 range")
secret = Math.random_range(1, 9)
guess = 5
attempts = 0

def on_forever():
    global guess, attempts
    lcd_show("Guess:" + str(guess), "OK=check")
    if btn(PIN_UP):
        guess = guess + 1 if guess < 9 else 1
        basic.pause(150)
    if btn(PIN_DOWN):
        guess = guess - 1 if guess > 1 else 9
        basic.pause(150)
    if btn(PIN_OK):
        attempts = attempts + 1
        if guess == secret:
            led_green(True)
            lcd_show("Correct!", "Tries:" + str(attempts))
            basic.pause(2000)
            led_green(False)
        elif guess < secret:
            lcd_show("Higher", "Try again")
            led_red(True)
            basic.pause(400)
            led_red(False)
        else:
            lcd_show("Lower", "Try again")
            led_red(True)
            basic.pause(400)
            led_red(False)
    basic.pause(80)

basic.forever(on_forever)
`,
  "binary-system": `
lcd_init()
value = 0

def to_bin(n):
    if n == 0:
        return "0"
    s = ""
    x = n
    while x > 0:
        s = str(x % 2) + s
        x = x // 2
    return s

def on_forever():
    global value
    lcd_show("Dec:" + str(value), "Bin:" + to_bin(value))
    if btn(PIN_UP):
        value = value + 1 if value < 15 else 0
        basic.pause(150)
    if btn(PIN_DOWN):
        value = value - 1 if value > 0 else 15
        basic.pause(150)
    basic.pause(80)

basic.forever(on_forever)
`,
  cipher: `
lcd_init()
shift = 3
ch = 65

def shift_char(c, s):
    if c < 65 or c > 90:
        return c
    return 65 + ((c - 65 + s) % 26)

def on_forever():
    global shift, ch
    enc = shift_char(ch, shift)
    lcd_show("Char:" + chr(ch), "Enc:" + chr(enc))
    if btn(PIN_UP):
        shift = shift + 1 if shift < 25 else 1
        basic.pause(120)
    if btn(PIN_DOWN):
        shift = shift - 1 if shift > 1 else 25
        basic.pause(120)
    if btn(PIN_OK):
        ch = shift_char(ch, shift)
        basic.pause(200)
    if btn(PIN_SW_A):
        ch = shift_char(ch, -shift)
        basic.pause(200)
    basic.pause(80)

basic.forever(on_forever)
`,
  "search-sort": `
lcd_init()
data = [3, 7, 2, 9, 5]
target = 9
idx = 0
found = False

def on_forever():
    global idx, found
    if found:
        lcd_show("Found!", "at i=" + str(idx))
    else:
        lcd_show("i=" + str(idx), "v=" + str(data[idx]))
    if btn(PIN_OK) and not found:
        if data[idx] == target:
            found = True
            led_green(True)
        else:
            idx = idx + 1 if idx < 4 else 0
        basic.pause(200)
    if btn(PIN_BACK):
        idx = 0
        found = False
        led_green(False)
        basic.pause(200)
    basic.pause(80)

basic.forever(on_forever)
`,
  "score-counter": `
lcd_init()
score = 0

def on_forever():
    global score
    lcd_show("Score", str(score))
    if btn(PIN_UP):
        score = score + 1
        if score >= 10:
            led_green(True)
        basic.pause(150)
    if btn(PIN_DOWN):
        score = score - 1 if score > 0 else 0
        led_green(False)
        basic.pause(150)
    if btn(PIN_OK):
        score = 0
        led_green(False)
        basic.pause(150)
    basic.pause(80)

basic.forever(on_forever)
`,
  "logic-gates": `
lcd_init()
gate = 0

def on_forever():
    global gate
    a = 1 if sw_on(PIN_SW_A) else 0
    b = 1 if sw_on(PIN_SW_B) else 0
    if gate == 0:
        out = 1 if a == 1 and b == 1 else 0
        name = "AND"
    else:
        out = 1 if a == 1 or b == 1 else 0
        name = "OR"
    lcd_show(name + " A=" + str(a), "B=" + str(b) + " Y=" + str(out))
    led_green(out == 1)
    led_red(out == 0)
    if btn(PIN_OK):
        gate = 1 - gate
        basic.pause(200)
    basic.pause(100)

basic.forever(on_forever)
`,
  "truth-table": `
lcd_init()
row = 0
rows = [[0,0,0],[0,1,0],[1,0,0],[1,1,1]]

def on_forever():
    global row
    a = rows[row][0]
    b = rows[row][1]
    y = rows[row][2]
    lcd_show("A=" + str(a) + " B=" + str(b), "AND=" + str(y))
    if btn(PIN_UP):
        row = row - 1 if row > 0 else 3
        basic.pause(150)
    if btn(PIN_DOWN):
        row = row + 1 if row < 3 else 0
        basic.pause(150)
    led_green(y == 1)
    basic.pause(80)

basic.forever(on_forever)
`,
  fibonacci: `
lcd_init()
a = 0
b = 1

def on_forever():
    global a, b
    lcd_show("Fib", str(a))
    if btn(PIN_OK):
        c = a + b
        a = b
        b = c
        basic.pause(300)
    basic.pause(80)

basic.forever(on_forever)
`,
  hanoi: `
lcd_init()
col0 = 3
col1 = 0
col2 = 0
sel = 0

def on_forever():
    global col0, col1, col2, sel
    lcd_show("C0:" + str(col0), "C1:" + str(col1) + " C2:" + str(col2))
    if btn(PIN_UP):
        sel = sel - 1 if sel > 0 else 2
        basic.pause(120)
    if btn(PIN_DOWN):
        sel = sel + 1 if sel < 2 else 0
        basic.pause(120)
    if btn(PIN_OK):
        if sel == 0 and col0 > 0:
            if col1 == 0 or (col0 % 10) < (col1 % 10):
                disk = col0 % 10
                col0 = col0 // 10
                col1 = disk if col1 == 0 else col1
            elif col2 == 0 or (col0 % 10) < (col2 % 10):
                disk = col0 % 10
                col0 = col0 // 10
                col2 = disk
        basic.pause(200)
    basic.pause(80)

basic.forever(on_forever)
`,
};

/** @param {GameId} gameId */

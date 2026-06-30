/** كود MakeCode Python — Hardware Abstraction Layer (HAL)
 *  HD44780 16×2 عبر PCF8574 @ 0x27 (Pull-Up — LOW = pressed)
 *  مرجع Pins: https://makecode.microbit.org/reference/pins/set-pull
 */

export const HARDWARE_DRIVER = `# Unified Game Lab — MakeCode Python
# DigitalPin + PinPullMode (MakeCode Python — ليس MicroPython)

PIN_UP = DigitalPin.P0
PIN_DOWN = DigitalPin.P1
PIN_OK = DigitalPin.P2
PIN_BACK = DigitalPin.P8
PIN_LED_G = DigitalPin.P12
PIN_LED_R = DigitalPin.P16
PIN_SW_A = DigitalPin.P13
PIN_SW_B = DigitalPin.P14
# P19/P20 = I2C SCL/SDA (مدمج في micro:bit — لا digital_write)
LCD_ADDR = 0x27
LCD_RS = 0x01
LCD_EN = 0x04
LCD_BL = 0x08

def setup_board():
    for p in [PIN_UP, PIN_DOWN, PIN_OK, PIN_BACK, PIN_SW_A, PIN_SW_B]:
        pins.set_pull(p, PinPullMode.PULL_UP)

def btn(pin):
    return pins.digital_read_pin(pin) == 0

def sw_on(pin):
    return pins.digital_read_pin(pin) == 0

def led_green(on):
    pins.digital_write_pin(PIN_LED_G, 1 if on else 0)

def led_red(on):
    pins.digital_write_pin(PIN_LED_R, 1 if on else 0)

def i2c_tx(value):
    pins.i2c_write_number(LCD_ADDR, value, NumberFormat.UINT8_LE, False)

def lcd_pulse(data):
    i2c_tx(data | LCD_EN | LCD_BL)
    control.wait_micros(1)
    i2c_tx((data & 0xFB) | LCD_BL)
    control.wait_micros(50)

def lcd_write4(nib, rs):
    data = ((nib & 0x0F) << 4) | rs | LCD_BL
    lcd_pulse(data)

def lcd_cmd(c):
    lcd_write4(c >> 4, 0)
    lcd_write4(c & 0x0F, 0)

def lcd_chr(c):
    lcd_write4(c >> 4, LCD_RS)
    lcd_write4(c & 0x0F, LCD_RS)

def lcd_init():
    setup_board()
    control.wait_micros(50000)
    lcd_write4(0x03, 0)
    control.wait_micros(5000)
    lcd_write4(0x03, 0)
    control.wait_micros(200)
    lcd_write4(0x03, 0)
    lcd_write4(0x02, 0)
    lcd_cmd(0x28)
    lcd_cmd(0x0C)
    lcd_cmd(0x06)
    lcd_cmd(0x01)
    control.wait_micros(2000)

def lcd_goto(row, col):
    lcd_cmd(0x80 + (row * 0x40) + col)

def lcd_print(text):
    i = 0
    while i < len(text) and i < 16:
        lcd_chr(ord(text[i]))
        i = i + 1

def lcd_show(line1, line2):
    lcd_cmd(0x01)
    control.wait_micros(2000)
    lcd_goto(0, 0)
    lcd_print(line1)
    lcd_goto(1, 0)
    lcd_print(line2)
`;

/** برامج اختبار عتاد مستقلة — تُجمَّع قبل الألعاب */
export const HARDWARE_TESTS = {
  buttons: `
lcd_init()
last = ""

def on_forever():
    global last
    msg = ""
    if btn(PIN_UP):
        msg = "UP P0"
    elif btn(PIN_DOWN):
        msg = "DOWN P1"
    elif btn(PIN_OK):
        msg = "OK P2"
    elif btn(PIN_BACK):
        msg = "BACK P8"
    else:
        msg = "Press btn"
    if msg != last:
        lcd_show("BTN TEST", msg)
        last = msg
    basic.pause(80)

basic.forever(on_forever)
`,
  leds: `
setup_board()

def on_forever():
    led_green(True)
    led_red(False)
    basic.pause(500)
    led_green(False)
    led_red(True)
    basic.pause(500)

basic.forever(on_forever)
`,
  switches: `
lcd_init()

def on_forever():
    a = 1 if sw_on(PIN_SW_A) else 0
    b = 1 if sw_on(PIN_SW_B) else 0
    lcd_show("SW-A=" + str(a), "SW-B=" + str(b))
    basic.pause(100)

basic.forever(on_forever)
`,
  lcd: `
lcd_init()
lcd_show("TEST 123", "LCD READY")
`,
};

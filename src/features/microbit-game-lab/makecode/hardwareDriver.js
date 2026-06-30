/** كود MakeCode Python المشترك — لوحة عتاد موحدة + driver LCD داخلي */

export const HARDWARE_DRIVER = `# Unified Game Lab — MakeCode Python
# لوحة عتاد موحدة (Pull-Up — LOW = pressed)

PIN_UP = 0
PIN_DOWN = 1
PIN_OK = 2
PIN_BACK = 8
PIN_LED_G = 12
PIN_LED_R = 16
PIN_SW_A = 13
PIN_SW_B = 14
PIN_LCD_SDA = 20
PIN_LCD_SCL = 19
LCD_ADDR = 0x27
LCD_ADDR_ALT = 0x3F

def setup_board():
    for p in [PIN_UP, PIN_DOWN, PIN_OK, PIN_BACK, PIN_SW_A, PIN_SW_B]:
        pins.set_pull(p, PinPullMode.PULL_UP)

def btn(pin):
    return pins.digital_read_pin(pin) == 0

def led_green(on):
    pins.digital_write_pin(PIN_LED_G, 1 if on else 0)

def led_red(on):
    pins.digital_write_pin(PIN_LED_R, 1 if on else 0)

def i2c_tx(addr, value):
    pins.i2c_write_number(addr, value, NumberFormat.UINT8_LE, False)

def lcd_pulse(enable):
    i2c_tx(LCD_ADDR, enable | 0x04)
    control.wait_micros(50)
    i2c_tx(LCD_ADDR, enable)
    control.wait_micros(50)

def lcd_write4(nib, rs):
    i2c_tx(LCD_ADDR, (nib & 0xF0) | rs | 0x04)
    lcd_pulse((nib & 0xF0) | rs)
    i2c_tx(LCD_ADDR, ((nib << 4) & 0xF0) | rs | 0x04)
    lcd_pulse(((nib << 4) & 0xF0) | rs)

def lcd_cmd(c):
    lcd_write4(c, 0)

def lcd_chr(c):
    lcd_write4(c, 1)

def lcd_init():
    setup_board()
    control.wait_micros(50000)
    lcd_write4(0x30, 0)
    control.wait_micros(5000)
    lcd_write4(0x30, 0)
    control.wait_micros(200)
    lcd_write4(0x30, 0)
    lcd_write4(0x20, 0)
    lcd_cmd(0x28)
    lcd_cmd(0x0C)
    lcd_cmd(0x06)
    lcd_cmd(0x01)
    control.wait_micros(2000)

_line = 0
_col = 0

def lcd_goto(row, col):
    global _line, _col
    _line = row
    _col = col
    lcd_cmd(0x80 + (row * 0x40) + col)

def lcd_print(text):
    global _col
    for i in range(len(text)):
        lcd_chr(ord(text[i]))
        _col += 1
        if _col >= 16:
            break

def lcd_show(line1, line2):
    lcd_cmd(0x01)
    control.wait_micros(2000)
    lcd_goto(0, 0)
    lcd_print(line1)
    lcd_goto(1, 0)
    lcd_print(line2)
`;

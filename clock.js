const gui = require('gui')

const win = gui.Window.create({frame: true, transparent: false})
win.setContentSize({width: 39, height: 100})
win.onClose = () => gui.MessageLoop.quit()

const contentview = gui.Container.create()
contentview.setMouseDownCanMoveWindow(true)
win.setContentView(contentview)

const padStart = str => {
  if (str.length < 2) {
    str = `0${str}`
  }
  return str
}

const getFontSize = rect => {
  const maxFontSize = 200
  const minFontSize = 5

  let fontSize = rect.height || 20
  fontSize = fontSize - 10 // -10 adds some padding to the bottom of the screen.

  if (fontSize * 2 > rect.width) {
    fontSize = (rect.width / 2) + 2 // +2 makes the font fit closely to the right wall.
  }

  if (fontSize < minFontSize) {
    fontSize = minFontSize
  }
  if (fontSize > maxFontSize) {
    fontSize = maxFontSize
  }

  return fontSize
}

const getTimeString = () => {
  const date = new Date()

  const hours = date.getHours()
  const mins = date.getMinutes()
  const secs = date.getSeconds()

  const h = padStart(hours.toString(10))
  const m = padStart(mins.toString(10))
  const s = padStart(secs.toString(10))

  const time = `${h}:${m}:${s}`

  return time
}

const getTextRect = (rect, fontSize, text) => {
  // The default textRect is left-aligned
  let textRect = { x: 5, y: 5, width: rect.width - 5, height: rect.height - 5 }

  // If the width is long enough to fit the entire string without wrapping,
  if (rect.width > fontSize * text.length / 2) {

    // then center the text horizontally and vertically
    textRect.x = (rect.width / 2) - (fontSize * text.length / 4)
    textRect.y = (rect.height / 2) - (fontSize / 2)
  }

  return textRect
}

const getAttributedTextForTime = time => {
  let attrText = gui.AttributedText.create(time, { color: '#FFF' })
  attrText.setColorFor('#AF5FD7', 0, 2)
  attrText.setColorFor('#ADFFF0', 2, 3)
  attrText.setColorFor('#DEA3E5', 3, 5)
  attrText.setColorFor('#ADFFF0', 5, 6)
  attrText.setColorFor('#FF87D7', 6, -1)

  return attrText
}

const setBackgroundColor = (painter, rect) => {
  painter.setFillColor('#000000')
  painter.fillRect(rect)
}

contentview.onDraw = (self, painter) => {
  const rect = self.getBounds()
  setBackgroundColor(painter, rect)

  const fontSize = getFontSize(rect)
  const time = getTimeString()
  const attrText = getAttributedTextForTime(time)
  const font = gui.Font.create(
    "Ubuntu Mono derivative Powerline",
    fontSize,
    "normal",
    "normal"
  )

  attrText.setFont(font)

  painter.drawAttributedText(attrText, getTextRect(rect, fontSize, time))
}

// redraw the screen every second so the time updates
setInterval(() => {
  contentview.schedulePaint()
}, 1000)

win.activate()

if (!process.versions.yode) {
  gui.MessageLoop.run()
  process.exit(0)
}

;(() => {
  window.onload = function () {
    const idioms = ['诗情画意', '南来北往', '一团和气', '落花流水'],
      oCharCellGroup = document.querySelector('.char-cell-group'),
      oBlanks = document.querySelectorAll('.blank-cell-group .wrapper')

    let charCollection = [],
      charAreas = [],
      blankAreas = [],
      resArr = [undefined, undefined, undefined, undefined],
      oChars = null,
      // 获取点击时候距离 左 和 上的距离
      startX = 0,
      startY = 0,
      // 盒子边框距离左 和 上的距离
      cellX = 0,
      cellY = 0,
      mouseX = 0,
      mouseY = 0

    const init = () => {
      charCollection = formatCharsArr()
      render()
      oChars = oCharCellGroup.querySelectorAll('.cell-item .wrapper')
      getAreas(oBlanks, blankAreas)
      getAreas(oChars, charAreas)
      bindEvent()
    }
    // 循环生成模板并渲染模板
    function render() {
      let list = ''

      charCollection.forEach((char, index) => {
        list += charCellTpl(char, index)
      })

      oCharCellGroup.innerHTML = list
    }
    // 得到成语打乱的字符
    function formatCharsArr() {
      let arr = []

      idioms.forEach((item) => {
        arr = arr.concat(item.split(''))
      })

      return arr.sort(randomSort)
    }
    // 用随机数打乱字符
    function randomSort(a, b) {
      return Math.random() > 0.5 ? -1 : 1
    }
    // 生成模板函数
    function charCellTpl(char, index) {
      return `
        <div class="cell-item">
          <div class="wrapper" data-index="${index}">${char}</div>
        </div>
      `
    }
    // 循环绑定事件
    function bindEvent() {
      let oChar = null
      for (let i = 0; i < oChars.length; i++) {
        oChar = oChars[i]

        oChar.addEventListener('touchstart', handTouchStart, false)
        oChar.addEventListener('touchmove', handTouchMove, false)
        oChar.addEventListener('touchend', handTouchEnd, false)
      }
    }
    function handTouchStart(e) {
      // 拿到盒子自身的宽高
      cellW = this.offsetWidth
      cellH = this.offsetHeight
      // 获取盒子边框距离左 和 上的距离
      cellX = this.offsetLeft
      cellY = this.offsetTop
      // 获取点击时候距离 左 和 上的距离
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      // 鼠标距离盒子的距离
      mouseX = startX - cellX
      mouseY = startY - cellY

      this.style.width = cellW / 10 + 'rem'
      this.style.height = cellH / 10 + 'rem'
      // 点击的时候给盒子定位
      this.style.position = 'fixed'
      setPosition(this, { startX: cellX, startY: cellY })
    }
    function handTouchMove(e) {
      e.preventDefault()

      // 拿到鼠标距离页面左边和页面上边的距离
      const moveX = e.touches[0].clientX,
        moveY = e.touches[0].clientY
      console.log(moveX)

      // 默认是拿到元素的左上角进行移动，我们需要减去鼠标距离盒子的距离
      cellX = moveX - mouseX
      cellY = moveY - mouseY

      setPosition(this, { startX: cellX, startY: cellY })
    }
    // 回弹、吸附
    function handTouchEnd(e) {
      const blankWidth = oBlanks[0].offsetWidth,
        blankHeight = oBlanks[0].offsetHeight

      for (let i = 0; i < blankAreas.length; i++) {
        if (resArr[i] !== undefined) {
          continue
        }

        let { startX, startY } = blankAreas[i]
        console.log(startX, startY)

        // 1. 判断移动的盒子的左上角或右上角有没有进入盒子
        // console.log(cellX)
        if (
          (cellX > startX &&
            cellX < startX + blankWidth / 2 &&
            cellY > startY &&
            cellY < startY + blankHeight / 2) ||
          (cellX + blankWidth > startX + blankWidth / 2 &&
            cellX + blankWidth < startX + blankWidth &&
            cellY > startY &&
            cellY < startY + blankHeight / 2)
        ) {
          setPosition(this, { startX, startY })
          setResArr(this, i)

          if (!resArr.includes(undefined)) {
            setTimeout(() => {
              if (!checkResult()) {
                alert('错了')
                resetPosition()
              } else {
                alert('正确了')
              }
            }, 800)
          }
          return
        }
      }

      const index = Number(this.dataset.index),
        charArea = charAreas[index]
      setPosition(this, { ...charArea })
    }
    function setPosition(el, { startX, startY }) {
      el.style.left = startX / 10 + 'rem'
      el.style.top = startY / 10 + 'rem'
    }
    // 保存初始位置
    function getAreas(domCollection, arrWrapper) {
      let startX = 0,
        startY = 0,
        oItem = null

      for (let i = 0; i < domCollection.length; i++) {
        oItem = domCollection[i]
        startX = oItem.offsetLeft
        startY = oItem.offsetTop

        arrWrapper.push({
          startX,
          startY,
        })
      }
    }
    // 填入字到数组，用于判断成语
    function setResArr(el, index) {
      resArr[index] = {
        char: el.innerText,
        el,
      }
    }
    // 查找成语是否正确
    function checkResult() {
      let idiom = ''

      resArr.forEach((item) => {
        idiom += item.char
      })

      return idioms.find((item) => item === idiom)
    }

    function resetPosition() {
      resArr.forEach((item) => {
        const el = item.el,
          index = Number(el.dataset.index),
          { startX, startY } = charAreas[index]
        setPosition(el, { startX, startY })
      })
      resArr = []
      // 获取点击时候距离 左 和 上的距离
      startX = 0
      startY = 0
      // 盒子边框距离左 和 上的距离
      cellX = 0
      cellY = 0
      mouseX = 0
      mouseY = 0
    }

    init()
  }
})()

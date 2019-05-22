/**
 * 
 * @param {isoimage option} opt 
 * @param {网格} pointGrid 
 * @param {图片配置 width: 图片宽度 opacity: 透明度 gradient 是否渐变 } config 
 */
export default function(opt, pointGrid, config) {
  var opacity = config.opacity || 1
  var gradient = config.gradient == void 0 ? true : config.gradient
  var size = opt.size
  var cellWidth = opt.cellWidth
  var level = opt.level
  var ex = opt.ex
  
  var width = config.width || 1000
  var height = Math.abs((width / size[0]) * size[1])
  var canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  var ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, width, height)

  function getColor(arr, v) {
    var color = false
    for (var i = 0, len = arr.length; i < len; i++) {
      if (v < arr[i].value) {
        if (!color) {
          color = JSON.parse(JSON.stringify(arr[i]))
          break
        }
        var scale = (v - color.value) / (arr[i].value - color.value)
        color.r = gradient ? parseInt(color.r + (arr[i].r - color.r) * scale) : arr[i].r
        color.g = gradient ? parseInt(color.g + (arr[i].g - color.g) * scale) : arr[i].g
        color.b = gradient ? parseInt(color.b + (arr[i].b - color.b) * scale) : arr[i].b
        break
      } else {
        color = JSON.parse(JSON.stringify(arr[i]))
      }
    }
    return color
  }
  // 面
  var p = pointGrid.features
  var w = Math.abs((cellWidth / size[0]) * width)
  var h = Math.abs((cellWidth / size[1]) * height)
  for (var i = 0, len = p.length; i < len; i++) {
    var item = p[i].geometry.coordinates
    var x = ((item[0] - ex[0][0]) / size[0]) * width - w / 2
    var y = ((item[1] - ex[0][1]) / size[1]) * height - h / 2
    var color = getColor(level, p[i].properties.val)
    ctx.strokeStyle = ctx.fillStyle =
      'rgb(' + color.r + ',' + color.g + ',' + color.b + ')'
    ctx.beginPath()

    ctx.fillRect(x - 1, y - 1, w + 2, h + 2)
  }
  if (opacity < 1) {
    var pattern = ctx.createPattern(canvas, 'repeat')
    ctx.clearRect(0, 0, width, height)
    ctx.globalAlpha = opacity
    ctx.fillStyle = pattern
    ctx.fillRect(0, 0, width, height)
  }
  return canvas.toDataURL('image/png')
}

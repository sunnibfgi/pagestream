(function() {
  'use strict'
  const content = document.getElementById('content')
  let pageSize = 20
  let delta = pageSize
  let page = 0
  let pageStart = 0
  let timeout = null
  window.onscroll = scrollHandler
  load()

  function scrollY() {
    return window.pageYOffset || document.body.scrollTop
  }

  function viewHeight() {
    return window.innerHeight || document.body.offsetHeight
  }

  function pageHeight() {
    return document.body.scrollHeight
  }

  function request(url) {
    if (!window.Promise) return
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest
      req.open('GET', url, true)
      req.onload = function() {
        if (req.status == 200) resolve(req.response)
        else reject(req.statusText)
      }
      req.onerror = function() {
        reject(new Error(req.statusText))
      }
      req.send(null)
    })
  }

  function successCallback(data) {
    var data = JSON.parse(data)
    var size = data.length
    var pageNumber = Math.ceil(size / delta)
    var el = []
    var loading = document.querySelector('.loading')
    page++
    if (loading) document.body.removeChild(loading)
    console.log(data.slice(pageStart, pageSize))
    data.slice(pageStart, pageSize).forEach(function(o, i) {
      var html = `<h5>${o.name}&nbsp;&nbsp;<span>${o.size}</span></h5>
                 <p><span>${o.tags}</span></p>
                 <p>${o.name}</p>
                 <p>${o.description}</p>
                 <p>${o.url}</p>
                 <p>${o.source}</p>`
      el.push(document.createElement('div'))
      el[i].className = 'item'
      el[i].innerHTML = html
      content.appendChild(el[i])
    })
    if (page % pageNumber) {
      pageStart = pageSize
      pageSize = Math.min(pageSize + delta, size)
    } else {
      pageStart = 0
      pageSize = delta
    }
  }

  function load(url = 'data.json') {
    request(url).then(successCallback)
    .then(function() {
      //todo
    })
  }

  function scrollHandler() {
    var y = scrollY()
    var h = viewHeight()
    var ph = pageHeight()
    if (timeout) clearTimeout(timeout)
    if (y >= ph - h) {
      var loading = document.createElement('p')
      loading.className = 'loading'
      loading.innerHTML = 'loading...'
      document.body.appendChild(loading)
      timeout = setTimeout(function() {
        load(`data.json?page=${page}`)
      }, 3e2)
    }
  }
}).call(this)

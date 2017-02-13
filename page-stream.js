(function() {
  'use strict'
  const content = document.getElementById('content')
  let pageSize = 20
  let delta = pageSize
  let page = 0
  let pageStart = 0
  let timeout = null
  let isAjax = false
  // bind scroll event
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
      req.timeout = 5e3
      req.onload = function() {
        if (req.status == 200) resolve(req.response)
        else reject(req.statusText)
      }
      req.ontimeout = function() {
        reject()
      }
      req.onerror = function() {
        reject(Error(req.statusText))
      }
      req.send(null)
    })
  }

  function convertData(slice) {
    var result = []
    slice.forEach(function(o, i) {
      var html = `<h5>${o.name}&nbsp;&nbsp;<span>${o.size}</span></h5>
           <p><span>${o.tags}</span></p>
           <p>${o.name}</p>
           <p>${o.description}</p>
           <p>${o.url}</p>
           <p>${o.source || ''}</p>`
      result.push(document.createElement('div'))
      result[i].className = 'item'
      result[i].innerHTML = html
      content.appendChild(result[i])
    })
  }

  function successCallback(data) {
    var data = JSON.parse(data)
    var size = data.length
    var pageNumber = Math.ceil(size / delta)
    var el = []
    page++
    removeLoading()
    convertData(data.slice(pageStart, pageSize))
    if (page % pageNumber) {
      pageStart = pageSize
      pageSize = Math.min(pageSize + delta, size)
    } else {
      pageStart = 0
      pageSize = delta
    }
    isAjax = false
  }

  function load(url = 'data.json') {
    request(url).then(successCallback).catch(failCallback)
  }

  function failCallback(status) {
    // 
  }

  function addLoading() {
    var loading = document.createElement('p')
    loading.className = 'loading'
    loading.innerHTML = 'loading...'
    if (!loading.length) document.body.appendChild(loading)
  }

  function removeLoading() {
    var loading = document.querySelector('.loading')
    if (loading) document.body.removeChild(loading)
  }

  function scrollHandler() {
    var y = scrollY()
    var h = viewHeight()
    var ph = pageHeight()
    if (timeout) clearTimeout(timeout)
    if (y >= ph - h && !isAjax)
      timeout = setTimeout(function() {
        isAjax = true
        addLoading()
        load(`data.json?page=${page}`)
      }, 3e2)
  }
}).call(this)

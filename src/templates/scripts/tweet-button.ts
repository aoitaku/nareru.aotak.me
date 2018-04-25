(function(){
  const api = '/data/tweets.json'
  const store: { tweetButtonContainer?: HTMLIFrameElement, tweets: string[] } = {
    tweets: []
  }

  function find<T> (items: T[], predicate: (item: T) => boolean) {
    const result: { found?: T } = {}
    items.some((item: T) => {
      if (predicate(item)) {
        result.found = item
        return true
      }
      return false
    })
    return result.found
  }

  function createTweetButton (tweet: string) {
    const a = document.createElement('a')
    a.className = 'twitter-share-button'
    a.href = 'https://twitter.com/share'
    a.setAttribute('data-text', tweet)
    a.setAttribute('data-size', 'large')
    return a
  }

  function createTweetButtonInjector () {
    const script = document.createElement('script')
    script.src = 'https://platform.twitter.com/widgets.js'
    script.charset = 'utf-8'
    script.async = true
    return script
  }

  function addTweetButton (target: HTMLElement, tweet: string) {
    target.appendChild(createTweetButton(tweet))
    target.appendChild(createTweetButtonInjector())
  }

  function fetchTweets (callback: (tweets: string[]) => void) {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', api, true)
    xhr.onload = function () {
      if (xhr.readyState !== 4) {
        return
      }
      if (xhr.status !== 200) {
        console.error(xhr.statusText)
        return
      }
      const tweets = JSON.parse(xhr.responseText)
      callback(tweets)
    }
    xhr.onerror = function () {
      console.error(xhr.statusText)
    }
    xhr.send(null)
  }

  function endLoading (element: HTMLElement, ) {
    element.classList.remove('loading')
  }

  function startLoading (element: HTMLElement) {
    element.classList.add('loading')
  }

  function onTweetButtonLoading (tweetButtonContainer: HTMLIFrameElement, onTweetButtonLoaded: () => void) {
    const listener = () => {
      onTweetButtonLoaded()
      tweetButtonContainer.removeEventListener('load', listener)
    }
    tweetButtonContainer.addEventListener('load', listener)
    store.tweetButtonContainer = tweetButtonContainer
  }

  function findTweetButton (nodes: Node[]) {
    return find(nodes, (node: Node) => {
      return (
        node.nodeType === node.ELEMENT_NODE &&
        node.nodeName.toLowerCase() === 'iframe' &&
        (node as HTMLIFrameElement).classList.contains('twitter-share-button')
      )
    })
  }

  function watchTweetButtonLoading (records: MutationRecord[], observer: MutationObserver, onLoaded: (element: HTMLIFrameElement) => void) {
    const loaded = records.some((record) => {
      const element = findTweetButton(Array.apply(null, record.addedNodes))
      if (element) {
        onLoaded(element as HTMLIFrameElement)
        return true
      }
      return false
    })
    if (loaded) {
      observer.disconnect()
    }
  }

  function sampleTweet () {
    return store.tweets[Math.floor(Math.random() * store.tweets.length)]
  }

  document.addEventListener('DOMContentLoaded', function() {
    const reloader = document.getElementById('reload-button') as HTMLElement
    const reloaderContainer = reloader.parentElement as HTMLElement
    const placeholder = document.getElementById('tweet-button-placeholder') as HTMLElement
    fetchTweets((tweets) => {
      store.tweets = tweets
      addTweetButton(placeholder, sampleTweet())
    })
    reloader.addEventListener('click', function() {
      const tweet = sampleTweet()
      if (store.tweetButtonContainer) {
        const src = store.tweetButtonContainer.src.replace(/text=[^&]*&/, `text=${encodeURI(tweet)}&`)
        store.tweetButtonContainer.src = ''
        const listener = () => {
          endLoading(reloaderContainer)
          if (store.tweetButtonContainer) {
            store.tweetButtonContainer.src = src
            store.tweetButtonContainer.removeEventListener('load', listener)
          }
        }
        store.tweetButtonContainer.addEventListener('load', listener)
        startLoading(reloaderContainer)
      }
    })
    const observer = new MutationObserver((records, observer) => {
      watchTweetButtonLoading(records, observer, (element) => {
        onTweetButtonLoading(element, () => {
          endLoading(reloaderContainer)
          endLoading(placeholder)
        })
      })
    })
    observer.observe(placeholder, { childList: true })
  })
})()

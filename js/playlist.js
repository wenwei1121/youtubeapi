let playlisturl = 'https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=UCI7ktPB6toqucpkkCiolwLg&maxResults=15&$key=AIzaSyBw9u0vRyYwqqzKJDPBuZhyqJr4ORTBZr8'
let channelsVideoURL = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=UUI7ktPB6toqucpkkCiolwLg&$key=AIzaSyBw9u0vRyYwqqzKJDPBuZhyqJr4ORTBZr8'
let tabnav = document.querySelector('.channelNav')
let runline = document.querySelector('.runLine')
let redline = document.querySelector('.runLine__action')
let indicator = tabnav.querySelector('.indicator')
let tabs = tabnav.querySelector('.tabs')
let tab = tabnav.querySelectorAll('.tab') 
let wrapdivs = tabnav.querySelector('.wrapdivs')
let wrapdiv = tabnav.querySelectorAll('.wrapdiv')
let playlists = tabnav.querySelector('.wrapdiv__playlists')
let videos = tabnav.querySelector('.wrapdiv__videos')

function runLine() {
  runline.classList.add('active')
  redline.classList.add('active')
}

for (let i = 0; i < tab.length; i++) {
  tab[i].addEventListener('click', () => {
    let changeWidth = tab[i].clientWidth
    let changePosition = tab[i].offsetLeft

    tabs.querySelector('.active').classList.remove('active')
    tab[i].classList.add('active')

    indicator.style.width = `${changeWidth}px`
    indicator.style.left =`${changePosition}px`

    setTimeout(() => {
      runLine()
      setTimeout(() => {
        runline.classList.remove('active')
        redline.classList.remove('active')
        wrapdivs.querySelector('.active').classList.remove('active')
        wrapdiv[i].classList.add('active')
      }, 1000)
    }, 0)
  })
}

// yt data api videos
getchannelsVideo()

async function getchannelsVideo() {
  const res = await fetch(channelsVideoURL)
  const data = await res.json()

  showVideoItems(data)
}

const showVideoItems = data => {
  let  dataItems = data.items

  let itemLoop = dataItems.map(i => {
    let imgURL = i.snippet.thumbnails.medium.url
    let title = i.snippet.title

    return `
    <div class="video">
                <a href="#">
                    <div class="video__img">
                        <img src="${imgURL}" alt="">
                    </div>
                    <div class="video__title">
                        <h4>
                            <span>${title}</span>
                        </h4>
                        <div class="video__btn">
                            <button>查看完整播放清單</button>
                        </div>
                    </div>
                </a>
            </div>
    `
  }).join('')

  videos.innerHTML = itemLoop
} 
// yt data api videos

// yt data api playlists
getPlaylists()

async function getPlaylists() {
  const res = await fetch(playlisturl)
  const data = await res.json()
  console.log(data)

  showPlaylistItems(data)
}

const showPlaylistItems = data => {
  let  dataItems = data.items

  let itemLoop = dataItems.map(i => {
    let imgURL = i.snippet.thumbnails.medium.url
    let title = i.snippet.title
    let videosNum = i.contentDetails.itemCount
    let playlistId = i.id
    let playlistIdURL =  `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${playlistId}&$key=AIzaSyBw9u0vRyYwqqzKJDPBuZhyqJr4ORTBZr8`

    return `
    <div class="playlist">
                <a href="#">
                    <div class="playlist__img">
                        <img src="${imgURL}" alt="">
                        <div class="showVideoCount">
                            <span>${videosNum}</span>
                            <span>
                                <i class="fas fa-list"></i>                            
                            </span>
                        </div>
                        <div class="hidden__action">
                            <span>
                                <i class="fas fa-play"></i>
                            </span>
                            <span>全部撥放</span>
                        </div>
                    </div>
                    <div class="playlist__title">
                        <h4>
                            <span>${title}</span>
                        </h4>
                        <div class="playlist__btn">
                            <button>查看完整播放清單</button>
                        </div>
                    </div>
                </a>
            </div>
    `
  }).join('')

  playlists.innerHTML = itemLoop
}
// yt data api playlists
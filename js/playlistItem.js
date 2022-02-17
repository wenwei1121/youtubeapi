// axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
//   params: {
//     part: 'snippet',
//     playlistId: 'PL8mPWv3h4qJdTEZ5OTzz6-aZSNUba2t6S',
//     key: 'AIzaSyBw9u0vRyYwqqzKJDPBuZhyqJr4ORTBZr8'
//   }
// }).then(res => console.log(res))
//   .catch(e => console.log(e))

let playlist = document.querySelector('#playlist')
let playingVideo = document.querySelector('.wrap__playing__video')
const loading = document.querySelector('.wrapball')
let playlistItemsurl = 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=PL8mPWv3h4qJct_F5cNL4Uf4TKM5iIjCLI&$key=AIzaSyBw9u0vRyYwqqzKJDPBuZhyqJr4ORTBZr8'

getPlaylistItem()

//  監聽列表滾動事件
playlist.addEventListener('scroll', () => {
  // {列表可視區高度, 滾軸到達的位置(與列表top的距離), 列表總高度(包含溢出)}
  const {offsetHeight, scrollTop, scrollHeight} = playlist
  console.log(offsetHeight, scrollTop, scrollHeight)

  // 當可視區高度 + 滾軸位置 >= 溢出總高度時 執行
  if(offsetHeight + scrollTop >= scrollHeight - 1){
    loading.classList.add('show')
    setTimeout(() => {
      loading.classList.remove('show')
      setTimeout(() => {
        getPlaylistItem()
      }, 500)
    }, 1500)
  } 
})

async function getPlaylistItem() {
  const res = await fetch(playlistItemsurl)
  const data = await res.json()
  console.log(data)

  // let firstVideoId = data.items[0].snippet.resourceId.videoId
  // let firstVideoTitle = data.items[0].snippet.title
  // let firstVideoTime = formatDate(data.items[0].snippet.publishedAt)
  // let firstVideoChannelTitle = data.items[0].snippet.channelTitle
  // let firstVideoDescription = data.items[0].snippet.description

  // await mainVideo(firstVideoId, firstVideoTitle, firstVideoTime, firstVideoChannelTitle, firstVideoDescription)
  // mainVideo(data)
  waitVideo(data)
}

function mainVideo(data) {
  playingVideo.innerHTML = `
    <iframe src="https://www.youtube.com/embed/${data.vid}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    <div class="wrap__playing__video__title">
      <div class="playing__video__title">
        <h4>
          <span>${data.title}</span>
        </h4>
      </div>
      <div class="playing__video__publishtime">
        <span>首播日期:${data.time}</span>
      </div>
    </div>
    <hr>
    <div class="channel">
      <div class="channel__wrapheader">
        <div class="channel__wrapheader__img">
          <img src="https://yt3.ggpht.com/ytc/AKedOLSUmAewNeuU1p8_9vLleyun2-tu80KZiFK8NrREBg=s48-c-k-c0x00ffffff-no-rj" alt="">
        </div>
        <div class="channel__wrapheader__name">
          <h2>
            <span>${data.channelTitle}</span>
          </h2>
        </div>
      </div>
      <div class="channel__description">
        <p>${data.description}</p>
      </div>
    </div>
    <hr>
  `
}

// array.map跑迴圈
function waitVideo(data) {
  let dataItems = data.items

  let itemLoop = dataItems.map((item, id) => {
    let thumbnailVideo = item.snippet.thumbnails.medium.url
    let title = item.snippet.title
    let channelTitle = item.snippet.channelTitle

    return `
    <li data-id="${id}">
      <a href="#" data-id="${id}">
        <span class="playlistItem__order" data-id="${id}">${id + 1}</span>
        <div class="wrap__thumbnail__img" data-id="${id}">
          <img src="${thumbnailVideo}" data-id="${id}" alt="${title}">
        </div>
        <div class="wrap__title" data-id="${id}">
          <h4 data-id="${id}">
            <span data-id="${id}">${title}</span>
          </h4>
          <div data-id="${id}">
            <span data-id="${id}">${channelTitle}</span>
          </div>
        </div>
        <div class="playlistItem__useract">
          <button class="playlistItem__useract__btn"><i class="fas fa-ellipsis-v"></i></button>
        </div>
      </a>
    </li>
  `
  }).join('')

  playlist.innerHTML = itemLoop

  playlist.addEventListener('click', e => {
    let id = e.target.dataset.id
    let vid = dataItems[id].snippet.resourceId.videoId
    let title = dataItems[id].snippet.title
    let time = formatDate(dataItems[id].snippet.publishedAt)
    let channelTitle = dataItems[id].snippet.channelTitle
    let description = dataItems[id].snippet.description

    let clickData = {vid, title, time, channelTitle, description}

    let commentsURL = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${vid}&key=AIzaSyBw9u0vRyYwqqzKJDPBuZhyqJr4ORTBZr8`
    let comments = document.querySelector('.comments')

    console.log(commentsURL)

    async function getComments(url) {
      const res = await fetch(url)
      const data = await res.json()

      console.log(data)

      let commentItems = data.items

      itemLoop = commentItems.map(i => {
        let topCommemtDetails = i.snippet.topLevelComment.snippet
        let replyUserImg = topCommemtDetails.authorProfileImageUrl
        let replyUserName = topCommemtDetails.authorDisplayName
        let replyUserTime = topCommemtDetails.publishedAt
        let replyUserContent = topCommemtDetails.textDisplay
        let replyUserBeLiked = topCommemtDetails.likeCount
        let totalReplyCount = i.snippet.totalReplyCount

        return `
        <li class="comment">
                        <div class="comment__img">
                            <div class="replyuser__img">
                                <img src="${replyUserImg}" alt="">
                            </div>
                        </div>
                        <div class="comment__info">
                            <div class="comment__info__header">
                                <div class="comment__info__header__left">
                                    <span class="replyuser__name">${replyUserName}</span>
                                    <span class="replyuser__time">${formatDate(replyUserTime)}</span>
                                </div>
                                <button>
                                    <i class="fas fa-ellipsis-v"></i>
                                <button>
                            </div>
                            <div class="comment__info__body">
                                <span class="replyuser__reply">${replyUserContent}</span>
                            </div>
                            <div class="comment__info__footer">
                                <div class="like">
                                    <button>
                                      <i class="fas fa-thumbs-up"></i>
                                    </button>
                                    <span class="like__count">${replyUserBeLiked}</span>
                                </div>
                                <div class="dislike">
                                    <button>
                                      <i class="fas fa-thumbs-down"></i>
                                    </button>
                                    <span class="dislike__count">0</span>
                                </div>
                                <div class="reply">
                                    <button class="reply__btn">回覆</button>
                                </div>
                            </div>
                            <div class="comment__info__btn">
                                <button>查看${totalReplyCount}回覆</button>
                            </div>
                        </div>
                    </li>
        `
      }).join('')

      comments.innerHTML = itemLoop
    }

    getComments(commentsURL)
    mainVideo(clickData)
  })
}

// 轉換首播時間的形式
function formatDate(date) {
  return new Date(date).toLocaleDateString('zh-hant')
}

// // foreach跑迴圈
// function waitVideo(data) {
//   let putItem = ''

//   data.items.forEach((item, id) => {
//     let thumbnailVideo = item.snippet.thumbnails.medium.url
//     let title = item.snippet.title
//     let channelTitle = item.snippet.channelTitle

//     putItem = putItem + `
//     <li data-id="${id}">
//       <a href="#" data-id="${id}">
//         <span class="playlistItem__order" data-id="${id}">${id + 1}</span>
//         <div class="wrap__thumbnail__img" data-id="${id}">
//           <img src="${thumbnailVideo}" data-id="${id}" alt="${title}">
//         </div>
//         <div class="wrap__title" data-id="${id}">
//           <h4 data-id="${id}">
//             <span data-id="${id}">${title}</span>
//           </h4>
//           <div data-id="${id}">
//             <span data-id="${id}">${channelTitle}</span>
//           </div>
//         </div>
//         <div class="playlistItem__useract">
//           <button class="playlistItem__useract__btn"><i class="fas fa-ellipsis-v"></i></button>
//         </div>
//       </a>
//     </li>
//   `
//   })

//   playlist.innerHTML = putItem

//   playlist.addEventListener('click', e => {
//     let id = e.target.dataset.id
//     let dataItem = data.items
//     let vid = dataItem[id].snippet.resourceId.videoId
//     let title = dataItem[id].snippet.title
//     let time = formatDate(dataItem[id].snippet.publishedAt)
//     let channelTitle = dataItem[id].snippet.channelTitle
//     let description = dataItem[id].snippet.description

//     mainVideo(vid, title, time, channelTitle, description)
//   })
// }
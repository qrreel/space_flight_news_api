const mainContainer = document.querySelector('.main-container')
const showItemsCount = document.querySelector('.show-items-count')
const showItemsCountBtn = document.querySelector('.show-items-count-btn')
const counterConrainer = document.querySelector('.counter')
const libraryLink = document.querySelector('.library-link')

let savedNews = JSON.parse(localStorage.getItem("spaceflightnewsapi"))

if(savedNews === null) {
    const newsCollection = []
    localStorage.setItem("spaceflightnewsapi", JSON.stringify(newsCollection))
}

let sortBy = 'id'
let limit = 15
let start = 0

const spaceNews = async () => {
    const response = await fetch (`https://api.spaceflightnewsapi.net/v3/articles?_limit=${limit}&_sort=${sortBy}&_start=${start}`)
    const articles = await response.json()

    articles.forEach(article => {
        article.events.push({"library": false})

        const card = document.createElement('div')
        card.classList.add('card')

        const title = document.createElement('div')
        title.classList.add('title')
        title.innerHTML = article.title

        const newsSite = document.createElement('div')
        newsSite.classList.add('news-site')
        newsSite.innerHTML = article.newsSite

        const publishedAt = document.createElement('div')
        publishedAt.classList.add('published-at')
        publishedAt.innerHTML = article.publishedAt.substring(0, 10)

        const summary = document.createElement('div')
        summary.classList.add('summary')
        summary.innerHTML = article.summary.substring(0, 200)

        const addToLibraryBtn = document.createElement('button')
        addToLibraryBtn.classList.add('add-to-library-btn')
        buttonState(article, addToLibraryBtn)

        const goToArticle = document.createElement('a')
        goToArticle.classList.add('go-to-article')
        goToArticle.setAttribute('href', article.url)
        goToArticle.setAttribute('target', "blank")
        goToArticle.innerHTML = "Read more (...)"

        mainContainer.appendChild(card)
        card.appendChild(newsSite)
        card.appendChild(publishedAt)
        card.appendChild(title)
        card.appendChild(summary)
        card.appendChild(goToArticle)
        card.appendChild(addToLibraryBtn)

        addToLibraryBtn.onclick = () => {
            addToLibrary(article)
            buttonState(article, addToLibraryBtn)
        }
    });
}        

const buttonState = (article, addToLibraryBtn) => {
    let savedNews = JSON.parse(localStorage.getItem("spaceflightnewsapi"))
    let isInLocalStorage = savedNews.filter(news => news.id === article.id)
    if(isInLocalStorage.length !== 0) {
        addToLibraryBtn.innerHTML = "Remove from Library"
        article.events[0].library = true
    } else {
        addToLibraryBtn.innerHTML = "Add to Library"
        article.events[0].library = false
    }
    libraryLink.innerHTML = "LIBRARY (" + savedNews.length + ")"
}

const addToLibrary = (article) => {
    let savedNews = JSON.parse(localStorage.getItem("spaceflightnewsapi"))
    if (article.events[0].library === false) {
        savedNews.push(article)
        localStorage.setItem("spaceflightnewsapi", JSON.stringify(savedNews))
    } else {
        let filteredNews = savedNews.filter(news => news.id !== article.id)
        localStorage.setItem("spaceflightnewsapi", JSON.stringify(filteredNews))
    }
}

const newsCounter = async () => {
    const articleCount = await fetch(`https://api.spaceflightnewsapi.net/v3/articles/count`)
    const lastArticle = await articleCount.json()
    counterConrainer.innerHTML = "Loaded news: " + (start + limit) + " / " + lastArticle
}

showItemsCountBtn.onclick = () => {
    if (showItemsCount.value < 1) {
        alert("The number must be greater than 0")
    } else {
        start = 0
        limit = Number(showItemsCount.value)
        mainContainer.innerHTML = null
        newsCounter()
        spaceNews()
    }
}

window.addEventListener('scroll', () => {
    if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
        start += limit
        newsCounter() 
        spaceNews()
    }
})

newsCounter()
spaceNews()

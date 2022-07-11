const mainContainer = document.querySelector('.library')
const sortCondition = document.querySelector('#sort')

let savedNews = JSON.parse(localStorage.getItem("spaceflightnewsapi"))

if(savedNews === null) {
    const newsCollection = []
    localStorage.setItem("spaceflightnewsapi", JSON.stringify(newsCollection))
}

const myLibrary = () => {
    let savedNews = JSON.parse(localStorage.getItem("spaceflightnewsapi"))

    savedNews.forEach(article => {
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
        addToLibraryBtn.innerHTML = "Remove from Library"

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
            removefromLibrary(article)
        }
    });
}

sortCondition.addEventListener('change', () => {
    mainContainer.innerHTML = ""
    if(sortCondition.value === "published-at-ascending") {
        sortByPublishedAtAscending()
    } else if(sortCondition.value === "published-at-descending") {
        sortByPublishedAtDescending()
    } else if(sortCondition.value === "title"){
        sortByTitle()
    }
})

const sortByTitle = () => {
    let array = [...savedNews].sort(function(a, b) {
        if(a.title > b.title) {
            return 1
        } else {
            return -1
        }
    });
    localStorage.setItem("spaceflightnewsapi", JSON.stringify(array))
    myLibrary()
}

const sortByPublishedAtAscending = () => {
    let array = [...savedNews].sort(function(a, b) {
        if(a.publishedAt > b.publishedAt) {
            return 1
        } else {
            return -1
        }
    });
    localStorage.setItem("spaceflightnewsapi", JSON.stringify(array))
    myLibrary()
}

const sortByPublishedAtDescending = () => {
    let array = [...savedNews].sort(function(a, b) {
        if(a.publishedAt > b.publishedAt) {
            return 1
        } else {
            return -1
        }
    }).reverse();
    localStorage.setItem("spaceflightnewsapi", JSON.stringify(array))
    myLibrary()
}


const removefromLibrary = (article) => {
    mainContainer.innerHTML = ""
    let savedNews = JSON.parse(localStorage.getItem("spaceflightnewsapi"))
    let filteredNews = savedNews.filter(news => news.id !== article.id)
    localStorage.setItem("spaceflightnewsapi", JSON.stringify(filteredNews))
    myLibrary()
}

sortByPublishedAtAscending()

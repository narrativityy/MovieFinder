async function getMovie() {
    var movie = document.querySelector("input").value
    var response = await fetch(`https://www.omdbapi.com/?apikey=15c1eef&t=${movie}`)
    var data = await response.json()

    if (await data != undefined) {
        const url = `https://streaming-availability.p.rapidapi.com/get?output_language=en&imdb_id=${data.imdbID}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'bf3904921emsh824bb3d208c9b70p10e228jsnef8b60565498',
                'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
            }
        };

        const response2 = await fetch(url, options)
        const result = await response2.json()

        var streamingInfo = streamingToString(result.result.streamingInfo.us)
        var streaming = streamingInfo[0]
        var purchasing = streamingInfo[1]
    }

    var main = document.querySelector("#main")
    if (data.Title != undefined) {
        if (main.classList.contains("justify-content-center")) {
            main.classList.add("justify-content-between")
            main.classList.remove("justify-content-center")
        }
        main.innerHTML = `
        <div id="information">
        
        </div>
        `
        var information = document.querySelector("#information")
        information.innerHTML += `
        <h3>Movie Name: <span class="movieInfo">${data.Title}</span></h3>
        <h3>Rated: <span class="movieInfo">${data.Rated}</span></h3>
        <h3>Year: <span class="movieInfo">${data.Year}</span></h3>
        <h3>Release Date: <span class="movieInfo">${data.Released}</span></h3>
        <h3>Released: <span class="movieInfo">${data.Runtime}</span></h3>
        <h3>Genre: <span class="movieInfo">${data.Genre}</span></h3>
        <h3>Plot: <span class="movieInfo">${data.Plot}</span></h3>
        <h3>${streaming}</h3>
        <h3>${purchasing}</h3>
        <h3>More Information: <a id="imdb" href="https://www.imdb.com/title/${data.imdbID}/" target="_blank">IMDb</a></h3>
        `
        var img = new Image()
        img.src = data.Poster
        img.alt = "Movie Poster"
        main.appendChild(img)
    }
    else {
        if (main.classList.contains("justify-content-between")) {
            main.classList.add("justify-content-center")
            main.classList.remove("justify-content-between")
        }
        main.innerHTML = `
        <h3>Title not found</h3>
        `
    }
}

function searchEnter(event) {
    if (event.code == "Enter") {
        getMovie()
    }
}

function streamingToString(streamingInfo) {
    if (streamingInfo == undefined) {
        return [`Not available to stream`, `Not available for purchase`]
    }
    var streaming = [`Streaming on: `, `Buy on: `]
    for (var i = 0; i < streamingInfo.length; i++) {
        if (streamingInfo[i].streamingType == "subscription") {
            streaming[0] += `<a href="${streamingInfo[i].link}" target="_blank">${streamingInfo[i].service} </a>`
        }
        else if (streamingInfo[i].streamingType == "buy") {
            if (!streaming[1].includes(streamingInfo[i].service))
                streaming[1] += `<a href="${streamingInfo[i].link}" target="_blank">${streamingInfo[i].service} </a>`
        }
    }
    if (streaming[0] == `Streaming on: `) 
        streaming[0] = `Not available to stream `
    if (streaming[1] == `Buy on: `)
        streaming[1] = `Not available for purchase `
    return streaming
}

function searchSelect(elem) {
    elem.setSelectionRange(0, elem.value.length)
}
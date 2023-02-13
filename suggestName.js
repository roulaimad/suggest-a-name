function validateForm() {
    let name = document.getElementById("SugName").value;
    // console.log(name);
    if (name == "") {
        // alert("Name must be filled out");
        return false;
    } else {
        return true;
    }
}
function validationName() {
    var letters = /^[A-Za-z]+$/
    var name = document.getElementById("SugName").value
    if (name.match(letters)) {
        document.getElementById("nameValidation").innerHTML = "Valid Name"
        return true
    }
    else {
        document.getElementById("nameValidation").innerHTML = "Invalid Name"
        return false
    }
}
function checkifexist(wordtocheck, words) {
    if (words.includes(wordtocheck)) {
        return true
    }
    else {
        return false
    }
}
var colors = ["olivedrab", "indigo", "teal", "rebeccapurple", "red", "goldenrod", "blue", "violet", "blueviolet", "green", "brown"];

var url = "https://sheordatabase.pythonanywhere.com/Cloud_Word_imad/"
credentials = btoa("ELLabs:123jijel");
var Words;

setInterval(submitfun(), 1000);
submitfun();
function submitfun() {
    fetch(url, {
        headers: {
            "Authorization": `Basic ${credentials}`
        }
    })
        .then((res) => res.json())
        .then((json) => {
            var input = document.getElementById("SugName").value;
            input = input.toLocaleLowerCase();
            input = input.charAt(0).toUpperCase() + input.slice(1);

            Words = json.map(e => e.word)
            elements = json.map(e => e)
            // console.log(Words);
            console.log(elements);
            if (validateForm() && validationName()) {
                if (checkifexist(input, Words)) {
                    console.log("WORD EXISTS")
                    for (i = 0; i < Object.keys(elements).length; i++) {
                        if (input == elements[i].word) {
                            // console.log("it matches : ", elements[i].word)
                            fetch(url + `/${elements[i].cloud_word_id}`,
                                {
                                    method: 'PUT',
                                    headers: {
                                        "Authorization": `Basic ${credentials}`,
                                        'Content-Type': 'application/json'
                                    },
                                    body: `{
                                        "word": "${elements[i].word}",
                                        "freq": ${elements[i].freq + 99}
                                    }`
                                })
                        }
                    }
                } else {
                    fetch(url,
                        {
                            method: 'POST',
                            headers: {
                                "Authorization": `Basic ${credentials}`,
                                'Content-Type': 'application/json'
                            },
                            body: `{ "word": "${input}","freq": 99999}`
                        })
                }
            }
            //  SORTING THE OBJECTS ARRAY
            var sortedObject = elements.sort((a, b) => {
                return b.freq - a.freq;
            })
            // CREATING AN ARRAY OF FONTSIZES
            var max_freq = Math.max(...elements.map(e => e.freq));
            var fontsSizes = [];
            for (i = 0; i < Object.keys(elements).length; i++) {
                fontsSizes[i] = elements[i].freq * 8 / max_freq;
                console.log("FS ====> ",fontsSizes[i]);                
            }
            var order = "";
            document.querySelector(".container").innerHTML = "";
            document.querySelector(".container").innerHTML = `<p class="pcont"></p>`;
            for (let i = elements.length - 1; i >= 0; i--) {
                if (Math.random() < 0.5 ? 0 : 1) {
                    order = "beforebegin";
                } else {
                    order = "afterbegin";
                }
                document.querySelector(".pcont").insertAdjacentHTML(`${order}`,
                    `<p 
                id="i${i}freq${elements[i].freq}"
                class="word"
                style="font-size:${fontsSizes[i]}vw;
                color : ${colors[Math.floor(Math.random() * colors.length)]};
                ">
                ${elements[i].word} </p>`
                );
                // console.log(elements[i].word);
            }
        })
}
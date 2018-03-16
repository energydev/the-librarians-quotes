//selector caching
var $quoteText = $("#quote-text");
var $quoteFooter = $("#quote-footer");
var $nextQuote = $("#next-quote");
var $randomQuote = $("#random-quote");
var $filterCharacters = $(".lib-character-filter");
var $filterClear = $("#filter-clear");
var $toggleQuoteType = $("#toggle-quote-type")
var quoteIndex = 0;
var librariansJson;
var filteredJson;
var quoteType = "Random";
var citeHtml =
    '<cite id="quote-site" title="Source Title">Source Title</cite></footer>';

$(document).ready(function () {
    var jsonTarget = "https://energydev.github.io/JSON/SciFiQuotes.json";

    $.getJSON(jsonTarget, function (json) {
        librariansJson = filterQuotesByFranchise(json, "The Librarians");
        filteredJson = librariansJson;
        quoteIndex = 0;
        toggleQuoteType();
        displayQuote(quoteIndex);
    });

    $nextQuote.on("click", function (e) {
        nextQuote();
    });

    $randomQuote.on("click", function (e) {
        randomQuote();
    });

    $filterCharacters.on("click", function (e) {
        var clickedId = "#" + this.id;
        var characterToFilter = $(clickedId).html();
        filterByCharacter(characterToFilter);
    });

    $filterClear.on("click", function (e) {
        clearJsonFilter();
        randomQuote();
    });

    $toggleQuoteType.on("click", function (e) {
        toggleQuoteType();
    });

});

function toggleQuoteType() {
    if (quoteType == "Next") {
        $nextQuote.hide();
        $randomQuote.show();
        quoteType = "Random";
        $toggleQuoteType.html('Next Quotes')

    }
    else {
        $nextQuote.show();
        $randomQuote.hide();
        quoteType = "Next";
        $toggleQuoteType.html('Random Quotes')
    }
}

function nextQuote() {
    quoteIndex += 1;
    if (quoteIndex >= filteredJson.length) {
        quoteIndex = 0;
    }
    displayQuote(quoteIndex);
}

function randomQuote() {
    displayQuote(getRandomQuoteIndex());
}

function filterQuotesByFranchise(sourceJson, franchiseFilter) {
    return sourceJson.filter(inFranchise, "The Librarians");
}

function clearJsonFilter() {
    filteredJson = librariansJson;
}

function filterByCharacter(characterName) {
    clearJsonFilter();
    filteredJson = filteredJson.filter(saidByCharacter, characterName);
    displayQuote(0);
}

function inFranchise(value) {
    return value.Franchise == this;
}

function saidByCharacter(value) {
    character = value.Character;

    //Handle various versions of a character name
    switch (character) {
        case "Baird":
            character = "Eve";
            break;
        case "Jacob":
            character = "Jake";
            break;
    }

    return character.search(this) >= 0;
}

function getRandomQuoteIndex() {
    var randomIndex = Math.floor(Math.random() * filteredJson.length);
    return randomIndex;
}

function displayQuote(qIndex) {
    $quoteText.html(filteredJson[qIndex].QuoteText);

    var quoteFooter = "";
    var quoteSite = "";
    var seriesProvided = false;
    var titleProvided = false;
    var saidToProvided = false;

    if (filteredJson[qIndex].Series.length > 0) {
        seriesProvided = true;
    }

    if (filteredJson[qIndex].Title.length > 0) {
        titleProvided = true;
    }

    if (filteredJson[qIndex].SaidTo.length > 0) {
        saidToProvided = true;
    }

    quoteFooter = getQuoteFooter(qIndex, seriesProvided, titleProvided, saidToProvided);

    quoteSite = getQuoteSite(qIndex, seriesProvided, titleProvided, titleProvided, saidToProvided);

    quoteIndex = qIndex;

    $quoteFooter.html(quoteFooter);
    //#quote-site was removed and recreated in this function, thus referencing directly versus using a cache selector
    $("#quote-site").html(quoteSite);
}

function getQuoteFooter(qIndex, seriesProvided, titleProvided, saidToProvided) {

    var quoteFooter = "";

    quoteFooter = filteredJson[qIndex].Character;

    if (saidToProvided) {
        quoteFooter = quoteFooter + " [to " + filteredJson[qIndex].SaidTo + "]";
    }

    if (seriesProvided || titleProvided) {
        quoteFooter = quoteFooter + " in " + citeHtml;
    }

    return quoteFooter;

}

function getQuoteSite(qIndex, seriesProvided, titleProvided, saidToProvided) {

    var quoteSite = "";

    if (seriesProvided) {
        quoteSite = filteredJson[qIndex].Series;
    }

    if (titleProvided) {
        if (seriesProvided) {
            quoteSite = quoteSite + ", ";
        }
        quoteSite = quoteSite + filteredJson[qIndex].Title;
    }

    return quoteSite;

}
/*!
 * Find words in string function by ValentinVoilean
 * https://stackoverflow.com/questions/44604794/searching-for-words-in-string
 * Edited by Shane to allow matching partial words and symbols
 */
export function multiSearchOr(text, searchWords) {
  if (text && searchWords) {
    //var filteredText = text.match(/[^_\W]+/g);
    var filteredText = text.split(" ");

    if (filteredText !== null) {
      var lowerCaseText = filteredText.map(function (word) {
        return word.toLowerCase();
      });

      for (var i = 0; i < searchWords.length; i++) {
        var searchWordFound = false;

        for (var j = 0; j < lowerCaseText.length; ++j) {
          if (lowerCaseText[j].indexOf(searchWords[i].toLowerCase()) != -1) {
            searchWordFound = true;
            break;
          }
        }

        if (!searchWordFound) {
          return false;
        }
      }

      // found
      return true;
    }

    //return "Error: the text provided doesn't contain any words!"
    return false;
  }

  //return "Error: Props are missing";
  return false;
}
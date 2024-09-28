/*
Reads an input search string and parses it into field:term pairs.

How it is supposed to work: (see known bugs below)
- Words separated by spaces are split into multiple terms.
  e.g. input: abc def 123
       result:
        [
          {
              "field": "",
              "term": "abc"
          },
          {
              "field": "",
              "term": "def"
          },
          {
              "field": "",
              "term": "123"
          }
        ]
- Quotes can be used to put multiple words into one search term, creating a phrase
  e.g. input: "example phrase" abc
       result:
        [
          {
              "field": "",
              "term": "example phrase"
          },
          {
              "field": "",
              "term": "abc"
          }
        ]
- Strings without any spaces, but have double quotes, will be split to separate terms
  e.g. input: abc"def"123
       result:
        [
          {
              "field": "",
              "term": "abc"
          },
          {
              "field": "",
              "term": "def"
          },
          {
              "field": "",
              "term": "123"
          }
        ]
- field:term input can be used to specify terms for a specific field
  e.g. input: name:cool email:coolemail
       result:
        [
          {
              "field": "name",
              "term": "cool"
          },
          {
              "field": "email",
              "term": "coolemail"
          }
        ]
- field:term can be used with double quotes to make phrases
  e.g. input: name:"example name" email:coolemail
       result:
        [
          {
              "field": "name",
              "term": "example name"
          },
          {
              "field": "email",
              "term": "coolemail"
          }
        ]
- if a double quote is not closed, then the remainder of the string is considered to be the phrase
  e.g. input: cool "story bro
       result:
        [
          {
              "field": "",
              "term": "cool"
          },
          {
              "field": "",
              "term": "story bro"
          }
        ]
- all terms are trimmed (spaces removed from start and end) and multiple spaces are replaced with one space
  e.g. input: cool    "   story   bro "
       result:
        [
          {
              "field": "",
              "term": "cool"
          },
          {
              "field": "",
              "term": "story bro"
          }
        ]
- double quotes within a phrase can be escaped with two double quotes
  e.g. input: "hello ""young"" fellow"
       result:
        [
          {
              "field": "",
              "term": "hello \"young\" fellow"
          }
        ]
- fields without a term are ignored
  e.g. input: name: email: abc
        [
          {
              "field": "",
              "term": "abc"
          }
        ]

**** Known bugs: ****
- Quotes currently not supported in field names
  e.g. input: "name":"example name"
       expected result: (single field and term parsed)
        [
          {
              "field": "name",
              "term": "example name"
          }
        ]
       actual result: (incorrectly parsed as 2 terms without field name)
        [
          {
              "field": "",
              "term": "name"
          },
          {
              "field": "",
              "term": "example name"
          }
        ]
- For terms not inside quotes, putting 3 or more double quotes in a row isn't parsed correctly
  (result has too many or too little double quotes)
  e.g. input: abc""""123 def
       expected result: (see comments)
        [
          {
              "field": "",
              "term": "abc\"\"123" // 4 double quotes escaped and replaced down to 2 actual double quotes, term includes 123
          },
          {
              "field": "",
              "term": "def"
          }
        ]
       actual result: (see comments)
        [
          {
              "field": "",
              "term": "abc\"\"\"" // result has 3 quotes
          },
          {
              "field": "",
              "term": "123 def" // 123 was moved into next term
          }
        ]
- Field:Term with empty quoted term is now broken (fixing above bugs will probably will fix this)
  e.g. input: name:"" abc
       expected result: (name is ignored as it is a field with no term, abc is separate term)
        [
          {
              "field": "",
              "term": "abc"
          }
        ]
       actual result: (string recognised as field and term with escaped quote)
        [
          {
              "field": "name",
              "term": "\" abc"
          }
        ]
- Another quote issue (related to above):
  e.g. input: abc ""def"
       expected result:
        [
          {
              "field": "",
              "term": "abc"
          },
          {
              "field": "",
              "term": "\"def" // should be only one double quote
          }
        ]
       actual result:
        [
          {
              "field": "",
              "term": "abc"
          },
          {
              "field": "",
              "term": "\"\"def" // two double quotes are appearing
          }
        ]
*/
export function splitSearchTerms(value) {
  let results = [];

  // Trim and replace tab/enter with space
  if (value !== undefined && value !== null && value !== "") {
    value = value.replace(/[\u0009\u000a\u000d]/g, " "); // tab and new lines
    value = value.replace(/^\s+|\s+$/gm, ""); // trim spaces
  }

  if (value === undefined || value === null || value === "") {
    console.log('1', results);
    return results;
  }

  // Remove double spaces
  value = value.replace(/[ ]+/g, " ");

  let currentResult = "";
  let currentKey = "";
  let startIndex = 0;
  let insideQuotes = false;
  let haveKey = false;

  while (startIndex < value.length) {
    // first first occurrence of any of the following: " ", ",", ";" (space, comma, semicolon)
    let endIndex = value.substring(startIndex).search(/[ \"\:]/);

    // If at the end of the string, take the remainder of the string
    if (endIndex === -1) {
      endIndex = value.length - 1;
    }
    else {
      endIndex += startIndex;
    }

    console.log('startIndex', startIndex, 'endIndex', endIndex, 'str', value.substring(startIndex, endIndex));

    if (value[endIndex] === ':' && !insideQuotes && !haveKey) {
      currentResult += value.substring(startIndex, endIndex + 1); // (endIndex - startIndex)

      if (currentResult === ":") {
        // Found ':' on it's own, so ignore it
        currentResult = "";
        startIndex = endIndex + 1;
      }
      else {
        // Add to collection - found ':' not in quotes
        currentKey = currentResult.substring(0, currentResult.length - 1); // don't put ':' in the key
        haveKey = true;
        startIndex = endIndex + 1;
        currentResult = "";
      }
    }
    else if (value[endIndex] === '"') {
      if (!insideQuotes) {
        // begin touched
        if (endIndex < value.length - 1 && value[endIndex + 1] === '"') {
          // not inside quotes, but the found quote is escaped
          console.log("im here 4");

          if (endIndex + 1 === value.length - 1) {
            console.log("4.end of the line");

            insideQuotes = false;
            currentResult += value.substring(startIndex);
            currentResult = currentResult.replace(/^\s+|\s+$/gm, "").replace(/\"\"/g, "\""); // trim spaces within quotes and convert escaped '""' back to a single '"'

            if (currentResult != "") {
              if (haveKey) {
                const result = {};
                result.field = currentKey.toLocaleLowerCase();
                result.term = currentResult;
                console.log("adding 1: ", JSON.stringify(result));
                results.push(result);
                haveKey = false;
              }
              else {
                const result = {};
                result.field = "";
                result.term = currentResult;
                console.log("adding 2: ", JSON.stringify(result));
                results.push(result);
              }
            }

            startIndex = endIndex + 1;
            currentResult = "";
          }
          else {
            console.log("4.im here 2");
            ++endIndex;
            currentResult += value.substring(startIndex, endIndex + 2); // +2 == include 2x double quotes in result // (endIndex - startIndex)
            console.log("4.im here 2 - currentResult", currentResult);
            startIndex = endIndex + 2; // skip 2x double quotes

            // End of string reached so add to results
            if (startIndex == value.length) {
              currentResult = currentResult.replace(/^\s+|\s+$/gm, "").replace(/\"\"/g, "\""); // trim spaces within quotes and convert escaped '""' back to a single '"'

              if (currentResult != "") {
                if (haveKey) {
                  const result = {};
                  result.field = currentKey.toLocaleLowerCase();
                  result.term = currentResult;
                  console.log("adding 1: ", JSON.stringify(result));
                  results.push(result);
                  haveKey = false;
                }
                else {
                  const result = {};
                  result.field = "";
                  result.term = currentResult;
                  console.log("adding 2: ", JSON.stringify(result));
                  results.push(result);
                }
              }
            }
          }
        }
        else {
          console.log("im here 1");
          insideQuotes = true;
          currentResult += value.substring(startIndex, endIndex); // (endIndex - startIndex)

          if (currentResult != "") {
            if (haveKey) {
              const result = {};
              result.field = currentKey.toLocaleLowerCase();
              result.term = currentResult;
              console.log("adding 3: ", JSON.stringify(result));
              results.push(result);
              haveKey = false;
            }
            else {
              const result = {};
              result.field = "";
              result.term = currentResult;
              console.log("adding 4: ", JSON.stringify(result));
              results.push(result);
            }
          }

          startIndex = endIndex + 1;
          currentResult = "";
        }
        // end touched
      }
      else if (endIndex < value.length - 1 && value[endIndex + 1] === '"') {
        if (endIndex + 1 === value.length - 1) {
          console.log("end of the line");

          insideQuotes = false;
          currentResult += value.substring(startIndex);
          currentResult = currentResult.replace(/^\s+|\s+$/gm, "").replace(/\"\"/g, "\""); // trim spaces within quotes and convert escaped '""' back to a single '"'

          if (currentResult != "") {
            if (haveKey) {
              const result = {};
              result.field = currentKey.toLocaleLowerCase();
              result.term = currentResult;
              console.log("adding 5: ", JSON.stringify(result));
              results.push(result);
              haveKey = false;
            }
            else {
              const result = {};
              result.field = "";
              result.term = currentResult;
              console.log("adding 6: ", JSON.stringify(result));
              results.push(result);
            }
          }

          startIndex = endIndex + 1;
          currentResult = "";
        }
        else {
          console.log("im here 2");
          ++endIndex;
          currentResult += value.substring(startIndex, endIndex + 1); // (endIndex - startIndex)
          startIndex = endIndex + 1;
        }
      }
      else {
        console.log("im here 3");
        insideQuotes = false;
        currentResult += value.substring(startIndex, endIndex); // (endIndex - startIndex)
        currentResult = currentResult.replace(/^\s+|\s+$/gm, "").replace(/\"\"/g, "\""); // trim spaces within quotes and convert escaped '""' back to a single '"'

        if (currentResult != "") {
          if (haveKey) {
            const result = {};
            result.field = currentKey.toLocaleLowerCase();
            result.term = currentResult;
            console.log("adding 7: ", JSON.stringify(result));
            results.push(result);
            haveKey = false;
          }
          else {
            const result = {};
            result.field = "";
            result.term = currentResult;
            console.log("adding 8: ", JSON.stringify(result));
            results.push(result);
          }
        }

        startIndex = endIndex + 1;
        currentResult = "";
      }
    }
    else if (insideQuotes && endIndex === value.length - 1) {
      insideQuotes = false;
      currentResult += value.substring(startIndex);
      currentResult = currentResult.replace(/^\s+|\s+$/gm, "").replace(/\"\"/g, "\""); // trim spaces within quotes and convert escaped '""' back to a single '"'
      //currentResult += "\"";

      if (currentResult != "") {
        if (haveKey) {
          const result = {};
          result.field = currentKey.toLocaleLowerCase();
          result.term = currentResult;
          console.log("adding 9: ", JSON.stringify(result));
          results.push(result);
          haveKey = false;
        }
        else {
          const result = {};
          result.field = "";
          result.term = currentResult;
          console.log("adding 10: ", JSON.stringify(result));
          results.push(result);
        }
      }

      startIndex = endIndex + 1;
      currentResult = "";
    }
    else {
      if (!insideQuotes) {
        console.log('currentResult A', currentResult);
        if (endIndex === value.length - 1) {
          currentResult += value.substring(startIndex);
        }
        else {
          currentResult += value.substring(startIndex, endIndex); // endIndex - startIndex
        }

        currentResult = currentResult.replace(/^\s+|\s+$/gm, "").replace(/\"\"/g, "\""); // trim spaces within quotes and convert escaped '""' back to a single '"'

        if (currentResult != "") {
          if (haveKey) {
            const result = {};
            result.field = currentKey.toLocaleLowerCase();
            result.term = currentResult;
            console.log("adding 11: ", JSON.stringify(result));
            results.push(result);
            haveKey = false;
          }
          else {
            const result = {};
            result.field = "";
            result.term = currentResult;
            console.log("adding 12: ", JSON.stringify(result));
            results.push(result);
          }
        }
        else {
          // Found empty string - ignore it, don't add to collection, and discard the key if we had one
          currentKey = "";
          haveKey = false;
        }

        startIndex = endIndex + 1;
        currentResult = "";
      }
      else {
        // begin touched
        console.log('im here 5');
        currentResult += value.substring(startIndex, endIndex + 1); // (endIndex - startIndex)
        startIndex = endIndex + 1;
        // end
      }
    }
  }

  console.log('2', results);
  return results;
}

export function searchStringToFieldValues(searchBarValue, advancedSearchFields) {
  let splitTerms = splitSearchTerms(searchBarValue);
  let fieldValues = Array(advancedSearchFields.length);

  for (let i = 0; i < splitTerms.length; ++i) {
    let extraSpace = false;
    for (let j = 0; j < advancedSearchFields.length; ++j) {
      if (splitTerms[i].field === advancedSearchFields[j].name) {
        if (fieldValues[j] === undefined) {
          fieldValues[j] = "";
        } else {
          extraSpace = true;
        }
        if (splitTerms[i].term.indexOf(" ") != -1) {
          fieldValues[j] +=
            (extraSpace ? " " : "") + '"' + splitTerms[i].term + '"';
        } else {
          fieldValues[j] +=
            (extraSpace ? " " : "") + splitTerms[i].term;
        }
        break;
      }
    }
  }

  return fieldValues;
}
# Autocomplete Search Engine

A simple autocomplete search engine built using C++, Trie data structures, Edit Distance, and a Node.js API.

## Features

* Fast prefix-based autocomplete using a Trie
* Personalized search history using user-specific Tries
* "Did You Mean?" suggestions using Edit Distance
* Node.js REST API
* C++ search engine integrated with Node.js

## Architecture

```text
User
 |
 v
Node.js REST API
 |
 v
C++ Search Engine
 |
 +---- Trie
 |       |
 |       +---- Autocomplete
 |
 +---- User History
 |
 +---- Edit Distance
         |
         +---- Did You Mean?
```

## Technologies

* C++
* Node.js
* Express.js
* Trie
* Dynamic Programming
* Edit Distance

## Project Structure

```text
autocomplete-search-engine/
|
├── cpp/
│   ├── Trie.h
│   ├── Trie.cpp
│   ├── EditDistance.h
│   ├── EditDistance.cpp
│   ├── SpellChecker.h
│   ├── SpellChecker.cpp
│   └── main.cpp
|
├── data/
│   └── words.txt
|
├── server/
│   ├── server.js
│   └── routes/
│       └── search.js
|
├── README.md
└── .gitignore
```

## Example

Request:

```text
GET /search?q=app
```

Response:

```json
{
    "query": "app",
    "suggestions": [
        "app",
        "apple",
        "apparel",
        "application",
        "apply"
    ]
}
```

## Complexity

Trie insertion:

```text
O(L)
```

where L is the length of the word.

Prefix lookup:

```text
O(P + K)
```

where P is the prefix length and K represents the amount of matching Trie data explored.

Edit Distance:

```text
O(M × N)
```

where M and N are the lengths of the two strings.

## Future Improvements

* Ranking suggestions by search frequency
* Persistent search history using a database
* Case-insensitive search
* Support for larger dictionaries
* Better typo correction
* Caching frequent queries

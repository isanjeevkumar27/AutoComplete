#include "../include/SearchEngine.h"
#include "../include/DataLoader.h"
#include "../include/DidYouMean.h"

using namespace std;

//it is loading the global words from the file 
//into the global trie.
SearchEngine::SearchEngine(string globalFile) {
    loadGlobalWords(globalTrie, globalFile);
}

bool SearchEngine::search(string userId, string word) {

    // First check the user's Trie.
    // if user trie exist check in it first 
    if (userTries.find(userId) != userTries.end()) {

        if (userTries[userId]->search(word)) {
            return true;
        }
    }

    // If not found in user's Trie,
    // check the global Trie.
    if (globalTrie.search(word)) {
        return true;
    }

    return false;
}

// string SearchEngine::didYouMean(string word) {
//     return findClosestWord(word, globalTrie);
// }
string SearchEngine::didYouMean(string userId, string word) {

    // First check the global Trie.
    string globalSuggestion =
        findClosestWord(word, globalTrie);

    if (globalSuggestion != "") {
        return globalSuggestion;
    }

    // If no suggestion is found in the global Trie,
    // check the user's Trie.
    if (userTries.find(userId) != userTries.end()) {

        return findClosestWord(
            word,
            *userTries[userId]
        );
    }

    return "";
}


// Node.js does:

// MongoDB ← save "amazon"
// C++ Trie ← insert "amazon"

// So both stay updated.
//for user specific trie

// Because that's the C++ operation that Node will eventually 
// call when it needs to put a query into the user's Trie.
void SearchEngine::addUserQuery(string userId, string query) {

    // If this is the user's first query,
    // create a new Trie for that user.
    if (userTries.find(userId) == userTries.end()) {
        userTries[userId] = make_unique<Trie>();
    }

    // Add the query to that user's Trie.
    userTries[userId]->insert(query);
}

vector<Suggestion> SearchEngine::personalizedAutocomplete(
    string userId,
    string prefix
) {
    vector<Suggestion> userSuggestions;

    // Get suggestions from the user's Trie.
    if (userTries.find(userId) != userTries.end()) {
        userSuggestions =
            userTries[userId]->findMatchingWords(prefix);
    }

    // Get suggestions from the global Trie.
    vector<Suggestion> globalSuggestions =
        globalTrie.findMatchingWords(prefix);

    vector<Suggestion> result;

    // Add user's suggestions first.
    for (int i = 0; i < userSuggestions.size(); i++) {
        result.push_back(userSuggestions[i]);
    }

    // Then add global suggestions that
    // are not already present in user's suggestions.
    for (int i = 0; i < globalSuggestions.size(); i++) {

        bool alreadyExists = false;

        for (int j = 0; j < userSuggestions.size(); j++) {

            if (globalSuggestions[i].word ==
                userSuggestions[j].word) {

                alreadyExists = true;
                break;
            }
        }

        if (!alreadyExists) {
            result.push_back(globalSuggestions[i]);
        }
    }

    return result;
}
#ifndef SEARCH_ENGINE_H
#define SEARCH_ENGINE_H

#include "Trie.h"
#include <string>
#include <vector>
#include <unordered_map>
#include <memory>

using namespace std;

class SearchEngine {

    Trie globalTrie;

    // Stores one Trie for each user.
    unordered_map<string, unique_ptr<Trie>> userTries;

public:

    SearchEngine(string globalFile);

    // bool search(string word);
    bool search(string userId, string word);

    // string didYouMean(string word);
    string didYouMean(string userId, string word);

    // Add a search query to a user's Trie.
    void addUserQuery(string userId, string query);

    // Get personalized suggestions using
    // both the user's Trie and the global Trie.
    vector<Suggestion> personalizedAutocomplete(
        string userId,
        string prefix
    );
};

#endif
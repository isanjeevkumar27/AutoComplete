#ifndef TRIE_H
#define TRIE_H

#include <string>
#include <vector>
#include <unordered_map>

using namespace std;

class TrieNode
{
public:
    TrieNode* children[26];
    bool isEndOfWord;

    TrieNode();
};

class Trie
{
private:
    TrieNode* root;

public:
    Trie();

    void insert(string word);

    vector<string> getWordsWithPrefix(string prefix);

private:
    void collectWords(TrieNode* node,
                      string currentWord,
                      vector<string>& results);
};

class UserHistory
{
private:
// Each user has their own Trie to store their search history
    unordered_map<string, Trie*> userTries;

public:
    void addSearch(string userId, string search);

    vector<string> getSuggestions(string userId, string prefix);
};

#endif
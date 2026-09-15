#ifndef TRIE_H
#define TRIE_H
// For your project, Trie.h tells other files:
//
// "There is a Node class and a Trie class,
//  and these are the operations they provide."


// #ifndef TRIE_H
// #define TRIE_H

// and ends with:

// #endif

// This is called an include guard.


// #include "Trie.h"

// Without protection, the compiler could see the same class definition multiple times and complain.

// The include guard basically says:

// Has TRIE_H already been included?

//        ↓
//      Yes → Don't include it again

//        ↓
//       No → Include it

#include <string>
#include <vector>
using namespace std;
struct Suggestion {
    string word;
    int frequency;
};


class Node {
    Node* links[27];
    bool flag;
    int frequency;

public:

    Node();

    bool containsKey(char ch);
    void put(char ch, Node* node);
    Node* get(char ch);

    bool isEnd();
    void setEnd();

    int getFrequency();
    void increaseFrequency();
};


class Trie {
    Node* root;

    // Because collectWords() is an internal helper function. 
    // It is not something we want users of the Trie class to call directly.
    void collectWords(Node* node,
                      string currentWord,
                      vector<Suggestion>& ans);

public:

    Trie();

    void insert(string word);
    bool search(string word);
    bool startsWith(string prefix);
    vector<Suggestion> getAllWords();
    vector<Suggestion> findMatchingWords(string prefix);
};
// Trie
// │
// ├── insert()
// │      ↓
// │   Put a word into Trie
// │
// ├── search()
// │      ↓
// │   Is this exact word present?
// │
// ├── startsWith()
// │      ↓
// │   Does this prefix exist?
// │
// ├── getAllWords()
// │      ↓
// │   Give ALL words in this Trie
// │
// ├── collectWords()
// │      ↓
// │   Internal helper to recursively collect words
// │
// └── autocompleteforglobaltrie()
//        ↓
//     Give words starting with a particular prefix
//     + frequency ranking


#endif
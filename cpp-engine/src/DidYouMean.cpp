#include "../include/DidYouMean.h"
#include "../include/EditDistance.h"
//this is not tries own function, 
// it is a global function that takes a word and 
// a trie and returns the closest word in the 
// trie to the given word.
using namespace std;

string findClosestWord(string word, Trie& trie) {

    vector<Suggestion> words = trie.getAllWords();

    string bestWord = "";
    int minimumDistance = 1000000;

    for (int i = 0; i < words.size(); i++) {

        int distance = editDistance(word, words[i].word);

        if (distance < minimumDistance) {
            minimumDistance = distance;
            bestWord = words[i].word;
        }
    }

    if (minimumDistance <= 2) {
        return bestWord;
    }

    return "";
}
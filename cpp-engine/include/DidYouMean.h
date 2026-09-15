#ifndef DID_YOU_MEAN_H
#define DID_YOU_MEAN_H

#include <string>
#include "Trie.h"

// This is a global function that takes a word and a trie and returns the closest word in the trie to the given word.
std::string findClosestWord(std::string word, Trie& trie);

#endif
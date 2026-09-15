#ifndef DATA_LOADER_H
#define DATA_LOADER_H

#include "Trie.h"
#include <string>

// The function:

// loadGlobalWords(Trie& trie, std::string filePath);

// basically says:

// Take this Trie and load words from this file into it.

void loadGlobalWords(Trie& trie, std::string filePath);

#endif
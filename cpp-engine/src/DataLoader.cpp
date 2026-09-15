#include "../include/DataLoader.h"
#include <fstream>

using namespace std;

// Load global words from a file into the Trie.
void loadGlobalWords(Trie& trie, string filePath) {

    ifstream file(filePath);

    string word;

    while (getline(file, word)) {
        if (!word.empty()) {
            trie.insert(word);
        }
    }

    file.close();
}
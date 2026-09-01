#include <iostream>
#include <fstream>
#include <vector>
#include <string>

#include "Trie.h"

using namespace std;

int main(int argc, char* argv[])
{
    Trie trie;

    ifstream file("../data/words.txt");

    if (!file.is_open())
    {
        cerr << "Could not open words.txt" << endl;
        return 1;
    }

    string word;

    while (getline(file, word))
    {
        if (!word.empty())
        {
            trie.insert(word);
        }
    }

    file.close();

    if (argc < 2)
    {
        cout << "Please provide a search query." << endl;
        return 1;
    }

    string query = argv[1];

    vector<string> suggestions =
        trie.getWordsWithPrefix(query);

    for (string suggestion : suggestions)
    {
        cout << suggestion << endl;
    }

    return 0;
}
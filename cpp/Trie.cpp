#include "Trie.h"

TrieNode::TrieNode()
{
    isEndOfWord = false;

    for (int i = 0; i < 26; i++)
    {
        children[i] = nullptr;
    }
}

Trie::Trie()
{
    root = new TrieNode();
}
void Trie::insert(string word)
{
    TrieNode* current = root;

    for (char ch : word)
    {
        int index = ch - 'a';

        if (current->children[index] == nullptr)
        {
            current->children[index] = new TrieNode();
        }

        current = current->children[index];
    }

    current->isEndOfWord = true;
}
vector<string> Trie::getWordsWithPrefix(string prefix)
{
    TrieNode* current = root;

    for (char ch : prefix)
    {
        int index = ch - 'a';

        if (current->children[index] == nullptr)
        {
            return {};
        }

        current = current->children[index];
    }

    vector<string> results;

    collectWords(current, prefix, results);

    return results;
}
void Trie::collectWords(TrieNode* node,
                        string currentWord,
                        vector<string>& results)
{
    if (node->isEndOfWord)
    {
        results.push_back(currentWord);
    }

    for (int i = 0; i < 26; i++)
    {
        if (node->children[i] != nullptr)
        {
            char nextCharacter = 'a' + i;

            collectWords(
                node->children[i],
                currentWord + nextCharacter,
                results
            );
        }
    }
}
void UserHistory::addSearch(string userId, string search)
{
    if (userTries.find(userId) == userTries.end())
    {
        userTries[userId] = new Trie();
    }

    userTries[userId]->insert(search);
}
vector<string> UserHistory::getSuggestions(string userId,
                                            string prefix)
{
    if (userTries.find(userId) == userTries.end())
    {
        return {};
    }

    return userTries[userId]->getWordsWithPrefix(prefix);
}
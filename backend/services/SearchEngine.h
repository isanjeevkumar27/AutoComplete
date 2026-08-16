#ifndef SEARCH_ENGINE_H
#define SEARCH_ENGINE_H

#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <set>
#include <algorithm>
using namespace std;

struct Suggestion {
   int freq;
   string text;

   bool operator<(const Suggestion &other) const
   {
      if (freq != other.freq)
      {
         return freq > other.freq;
      }
      return text < other.text;
   }
};

struct TrieNode {
   unordered_map<char, TrieNode *> children;
   set<Suggestion> topK;

   void updateTopK(string &sentence, int newFreq) {
      auto it = find_if(topK.begin(), topK.end(), [&](const Suggestion &s)
                        { return s.text == sentence; });

      if (it != topK.end()) {
         topK.erase(it);
      }

      topK.insert({newFreq, sentence});

      if (topK.size() > 5) {
         topK.erase(topK.begin());
      }
   }
};

class Trie {
private: 
   TrieNode *root;

public:

   Trie() {
      root = new TrieNode();
   }

   void insert(string sentence, int count) {
      TrieNode *node = root;

      for (char c : sentence) {
         if (node->children.find(c) == node->children.end()) {
            node->children[c] = new TrieNode();
         }

         node = node->children[c];
         node->updateTopK(sentence, count);
      }
   }

   vector<string> getSuggestions(string prefix) {
      TrieNode *node = root;

      for (char c : prefix) {

         if (node->children.find(c) == node->children.end())
         {
            return {};
         }
         node = node->children[c];
      }

      vector<string> suggestions;
      for (auto it = node->topK.rbegin(); it != node->topK.rend(); ++it) {
         suggestions.push_back(it->text);
      }
      return suggestions;
   }
};

#endif // SEARCH_ENGINE_H
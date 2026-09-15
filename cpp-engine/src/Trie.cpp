#include "../include/Trie.h"
#include <algorithm>
#include<bits/stdc++.h>
#include <cctype>
using namespace std;
int getIndex(char ch) {
    if (ch == ' ')
        return 26;

    return ch - 'a';
}
Node::Node() {
    flag = false;
    frequency = 0;

    for (int i = 0; i < 27; i++) {
        links[i] = NULL;
    }
}

int Node::getFrequency() {

    return frequency;
}


void Node::increaseFrequency() {

    frequency++;
}


// bool Node::containsKey(char ch) {

//     return links[ch - 'a'] != NULL;
// }


// void Node::put(char ch, Node* node) {

//     links[ch - 'a'] = node;
// }


// Node* Node::get(char ch) {

//     return links[ch - 'a'];
// }
bool Node::containsKey(char ch) {
    return links[getIndex(ch)] != NULL;
}

void Node::put(char ch, Node* node) {
    links[getIndex(ch)] = node;
}

Node* Node::get(char ch) {
    return links[getIndex(ch)];
}


bool Node::isEnd() {

    return flag;
}


void Node::setEnd() {

    flag = true;
}



Trie::Trie() {

    root = new Node();
}


void Trie::insert(string word) {

    for (char& ch : word) {
        ch = tolower(ch);
    }

    Node* node = root;

    for (int i = 0; i < word.length(); i++) {

        if (!(node->containsKey(word[i]))) {
            node->put(word[i], new Node());
        }

        node = node->get(word[i]);
    }

    node->setEnd();
    node->increaseFrequency();
}

//return true/false
bool Trie::search(string word) {

    Node* node = root;
    for (char& ch : word) {
        ch = tolower(ch);
    }

    for (int i = 0; i < word.length(); i++) {

        if (!(node->containsKey(word[i]))) {

            return false;
        }

        node = node->get(word[i]);
    }

    return node->isEnd();
}

//return true/false
bool Trie::startsWith(string prefix) {

    for (char& ch : prefix) {
        ch = tolower(ch);
    }

    Node* node = root;

    for (int i = 0; i < prefix.length(); i++) {

        if (!(node->containsKey(prefix[i]))) {

            return false;
        }

        node = node->get(prefix[i]);
    }

    return true;
}

void Trie::collectWords(Node* node,
                        string currentWord,
                        vector<Suggestion>& ans) {

    if (node->isEnd()) {

        Suggestion suggestion;

        suggestion.word = currentWord;
        suggestion.frequency = node->getFrequency();

        ans.push_back(suggestion);
    }

    for (int i = 0; i < 27; i++) {

        char ch;

        if (i == 26)
            ch = ' ';
        else
            ch = 'a' + i;

        if (node->containsKey(ch)) {
            Node* nextNode = node->get(ch);
            collectWords(nextNode, currentWord + ch, ans);
        }
    }
}

vector<Suggestion> Trie::findMatchingWords(string prefix) {

    Node* node = root;
    for (char& ch : prefix) {
        ch = tolower(ch);
    }

    for (int i = 0; i < prefix.length(); i++) {

        if (!node->containsKey(prefix[i])) {
            return {};
        }

        node = node->get(prefix[i]);
    }

    vector<Suggestion> ans;

    collectWords(node, prefix, ans);

    sort(ans.begin(), ans.end(),
     [](Suggestion a, Suggestion b) {

         if (a.frequency != b.frequency) {
             return a.frequency > b.frequency;
         }

         return a.word < b.word;
     });

    return ans;
}

vector<Suggestion> Trie::getAllWords() {
    vector<Suggestion> ans;

    collectWords(root, "", ans);

    return ans;
}
#ifndef SPELL_CHECKER_H
#define SPELL_CHECKER_H

#include <string>
#include <vector>

using namespace std;

string getDidYouMean(const string& query, const vector<string>& words);

#endif
#ifndef SPELLCHECKER_H
#define SPELLCHECKER_H

#include <vector>
#include <string>
#include <algorithm>

using namespace std;

class SpellChecker {
private:
   vector<string> vocabulary;

   int getDistance(const string &s1, const string &s2){
      int m = s1.size(), n = s2.size();
      vector<vector<int>> dp(m + 1, vector<int>(n + 1));

      for (int i = 0; i <= m; ++i)
         dp[i][0] = i;
      for (int j = 0; j <= n; ++j)
         dp[0][j] = j;

      for (int i = 1; i <= m; ++i) {
         for (int j = 1; j <= n; ++j) {
            if (s1[i - 1] == s2[j - 1]) {
               dp[i][j] = dp[i - 1][j - 1];
            }
            else {
               dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
            }
         }
      }
      return dp[m][n];
   }

public:
   void addWord(const string &word) {
      vocabulary.push_back(word);
   }

   string suggest(string input) {
      string bestMatch = "";
      int minDistance = 3;

      for (const auto &word: vocabulary) {
         int dist = getDistance(input, word);
         if(dist < minDistance) {
            minDistance = dist;
            bestMatch = word;
         }

         if(minDistance == 1) break;
      }
      return bestMatch;
   }
};

#endif


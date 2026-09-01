#include "SpellChecker.h"
#include "EditDistance.h"

string getDidYouMean(const string& query, const vector<string>& words)
{
    string bestMatch = "";
    int bestDistance = 1000;

    for (const string& word : words)
    {
        int distance = calculateEditDistance(query, word);

        if (distance < bestDistance)
        {
            bestDistance = distance;
            bestMatch = word;
        }
    }

    if (bestDistance <= 2)
    {
        return bestMatch;
    }

    return "";
}
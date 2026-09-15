#include <iostream>
#include <string>
#include <vector>
#include "../include/SearchEngine.h"

using namespace std;

int main() {

    // Load the global vocabulary and build the Trie once at startup.
    SearchEngine engine("data/global_words.txt");

    string request;

    // Keep the C++ engine alive and continuously wait for requests from Node.js.
    while (getline(cin, request)) {

        // Find the separator between the command and the query.
        size_t firstSeparator = request.find('|');

    if (firstSeparator == string::npos) {
        cout << "ERROR|Invalid request" << endl;
        cout.flush();
        continue;
    }

    
    string command = request.substr(0, firstSeparator);
    string remaining = request.substr(firstSeparator + 1);
    string query = remaining;

    // ADD_USER_QUERY|user123|amazon

        // ---------------- ADD USER QUERY ----------------

        if (command == "ADD_USER_QUERY") {

            size_t separator = remaining.find('|');

            if (separator == string::npos) {
                cout << "ERROR|Invalid user query request" << endl;
                cout << "END" << endl;
                continue;
            }

            string userId = remaining.substr(0, separator);
            string userQuery = remaining.substr(separator + 1);

            engine.addUserQuery(userId, userQuery);

            cout << "ADDED|true" << endl;
            cout << "END" << endl;
        }
        // ---------------- USER AUTOCOMPLETE ----------------

        else if (command == "USER_AUTOCOMPLETE") {

            size_t separator = remaining.find('|');

            if (separator == string::npos) {
                cout << "ERROR|Invalid user autocomplete request" << endl;
                cout << "END" << endl;
                continue;
            }

            string userId = remaining.substr(0, separator);
            string prefix = remaining.substr(separator + 1);

            vector<Suggestion> suggestions =
                engine.personalizedAutocomplete(userId, prefix);

            for (int i = 0; i < suggestions.size(); i++) {

                cout << "SUGGESTION|"
                     << suggestions[i].word
                     << "|"
                     << suggestions[i].frequency
                     << endl;
            }

            cout << "END" << endl;
        }

        // ---------------- SEARCH ----------------

        // else if (command == "SEARCH") {

        //     bool found = engine.search(query);

        //     cout << "FOUND|"
        //          << (found ? "true" : "false")
        //          << endl;

        //     cout << "END" << endl;
        // }
        // ---------------- SEARCH ----------------

        else if (command == "SEARCH") {

            size_t separator = remaining.find('|');

            if (separator == string::npos) {
                cout << "ERROR|Invalid search request" << endl;
                cout << "END" << endl;
                continue;
            }

            string userId = remaining.substr(0, separator);
            string word = remaining.substr(separator + 1);

            bool found = engine.search(userId, word);

            cout << "FOUND|"
                << (found ? "true" : "false")
                << endl;

            cout << "END" << endl;

        }

        // ---------------- DID YOU MEAN ----------------

        else if (command == "DIDYOUMEAN") {
            
            size_t separator = remaining.find('|');

            if (separator == string::npos) {
                cout << "ERROR|Invalid search request" << endl;
                cout << "END" << endl;
                continue;
            }

            string userId = remaining.substr(0, separator);
            string word = remaining.substr(separator + 1);

            string suggestion = engine.didYouMean(userId, word);

            if (suggestion != "") {
                cout << "SUGGESTION|"
                     << suggestion
                     << endl;
            }

            cout << "END" << endl;
        }

        // ---------------- INVALID COMMAND ----------------

        else {

            cout << "ERROR|Unknown command" << endl;
            cout << "END" << endl;
        }

        // Send the response immediately to Node.js.
        cout.flush();
    }

    return 0;
}
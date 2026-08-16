#define ASIO_STANDALONE

#include "crow.h"
#include <mysql.h>
#include <cstring>
#include <iostream>
#include <vector>
#include <string>
#include <unordered_map>
#include <cstdlib>

#include "services/SearchEngine.h"
#include "services/spellChecker.h"

unsigned int ssl_mode = 0;

using namespace std;

Trie trie;
unordered_map<int, Trie> userTries;
SpellChecker spellChecker;

void hydrateTrie(Trie &trie) {

   MYSQL *conn = mysql_init(nullptr);
   unsigned int ssl_mode = SSL_MODE_DISABLED;
   mysql_options(conn, MYSQL_OPT_SSL_MODE, &ssl_mode);

   if (!(mysql_real_connect(conn, "localhost","root", "password", "db_name", 3306, nullptr, 0)))
   {
      cerr << "MySQL connection error: " << mysql_error(conn) << endl;
      exit(1);
   }

   cout << "[System] Connected to MySQL database successfully." << endl;

   if(mysql_query(conn, "SELECT query, count FROM global_frequency")) {

      cerr << "MySQL query error: " << mysql_error(conn) << endl;
      mysql_close(conn);
      exit(1);
   }

   MYSQL_RES *result = mysql_store_result(conn);
   MYSQL_ROW row;

   int loadedCount = 0;

   while((row = mysql_fetch_row(result))) {

      string query = row[0];
      int frequency = atoi(row[1]);

      trie.insert(query, frequency);
      spellChecker.addWord(query);
      loadedCount++;
   }

   cout << "[System] Loaded " << loadedCount << " queries into trie." << endl;

   mysql_free_result(result);
   mysql_close(conn);
}

void hydrateUserTrie(MYSQL *conn, int userId) {
   string query = "SELECT query, personalCount FROM usersearchhistory WHERE id = " + to_string(userId);

   mysql_query(conn, query.c_str());
   MYSQL_RES *result = mysql_store_result(conn);

   MYSQL_ROW row;

   cout << "[System] Hydrating trie for user ID: " << userId << endl;

   cout << "[System] " << mysql_num_rows(result) << " rows found for user ID: " << userId << endl;

   while ((row = mysql_fetch_row(result)))
   {
      cout << "[Debug] Fetched row for user ID " << userId << ": query='" << (row[0] ? row[0] : "NULL") << "', personalCount='" << (row[1] ? row[1] : "NULL") << "'" << endl;

      if (row[0] == nullptr || row[1] == nullptr)
      {
         cout << "[Warning] Found a null row, skipping..." << endl;
         continue;
      }

      string query = row[0];
      int freq = atoi(row[1]);

      cout << "[Debug] Inserting: " << query << " with freq: " << freq << endl;

      userTries[userId].insert(row[0], atoi(row[1]));
   }
   cout << "[System] Hydrated trie for user ID: " << userId << endl;
   mysql_free_result(result);
}

int main() {
   crow::SimpleApp app;
   hydrateTrie(trie);
   
   CROW_ROUTE(app, "/")([]() { 
      return "C++ Server Running 🚀"; 
   }); 

   CROW_ROUTE(app, "/search") ([&](const crow::request&req) {

      cout << "[System] Received search request: " << req.raw_url << endl;

      auto query = req.url_params.get("query");
      auto userId = req.url_params.get("userId");

      if (!query){
         return crow::response(400, "Missing 'query' parameter");
      }

      cout << "[System] Search query: " << query << ", User ID: " << (userId ? userId : "None") << endl;

      vector<string> finalSuggestions;

      if(userId) {
         int uid = stoi(userId);

         cout << "[System] Fetching suggestions for user ID: " << uid << endl;

         if (userTries.find(uid) == userTries.end()) {

            MYSQL *conn = mysql_init(nullptr);
            unsigned int ssl_mode = SSL_MODE_DISABLED;
            mysql_options(conn, MYSQL_OPT_SSL_MODE, &ssl_mode);

            if (!(mysql_real_connect(conn, "localhost", "root", "passoword", "db_name", 3306, nullptr, 0)))
            {
               cout << "[System] Failed to connect to MySQL for user trie hydration." << endl;

               cerr << "MySQL connection error: " << mysql_error(conn) << endl;
               exit(1);
            }

            userTries[uid] = Trie();

            cout << "[System] Connected to MySQL for user trie hydration." << endl;

            hydrateUserTrie(conn, uid);
            mysql_close(conn);
         }
         auto userSuggestions = userTries[uid].getSuggestions(query);
         
         finalSuggestions = userSuggestions;
      }


      auto suggestions = trie.getSuggestions(query);
      
      for(const auto& suggestion: suggestions) {
         if(finalSuggestions.size() >= 5) break;
         if(find(finalSuggestions.begin(), finalSuggestions.end(), suggestion) == finalSuggestions.end()) {
            finalSuggestions.push_back(suggestion);
         }
      }

      if(finalSuggestions.empty()) {
         string spellSuggestion = spellChecker.suggest(query);
         if (!spellSuggestion.empty()) {
            finalSuggestions.push_back("Did you mean: " + spellSuggestion + "?");
         }
      }

      crow::json::wvalue x;
      x["suggestions"] = finalSuggestions;
      return crow::response(x);
   });

   app.port(8080).run();
}


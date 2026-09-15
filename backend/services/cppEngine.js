const initializedUsers = new Set();


const { spawn } = require("child_process");
// Node.js has a built-in module called:
// child_process
//It allows Node to start another operating-system process.
const path = require("path");

const cppDirectory = path.join(
    __dirname,
    "../../cpp-engine"
);

const cppPath = path.join(
    cppDirectory,
    "trie.exe"
);

// Start the C++ search engine once.
// The working directory is set to cpp-engine so that
// data/global_words.txt is found correctly.
const cppProcess = spawn(cppPath, [], {
    cwd: cppDirectory
});

// Log any errors from the C++ process to the console.
cppProcess.stderr.on("data", (data) => {
    console.error(`C++ Error: ${data}`);
});

//if the C++ process fails to start, log the error message
cppProcess.on("error", (error) => {
    console.error("Failed to start C++ engine:", error.message);
});

// Log when the C++ process exits.
cppProcess.on("close", (code) => {
    console.log(`C++ engine exited with code ${code}`);
});


// Store requests so that only one request communicates
// with the C++ process at a time.
let requestQueue = Promise.resolve();


// Send a request to C++ and wait for its complete response.
function sendRequest(request) {

    //Wait until all previous queued work is finished, then run this request.
    const currentRequest = requestQueue.then(() => {

        return new Promise((resolve, reject) => {

            let output = "";

            const handleOutput = (data) => {

                output += data.toString();

                // C++ sends END when the complete response is ready.
                if (output.includes("END")) {

                    cppProcess.stdout.off("data", handleOutput);

                    resolve(output);
                }
            };

            cppProcess.stdout.on("data", handleOutput);

            cppProcess.stdin.write(request + "\n");
        });
    });

    // Make sure the next request can run even if this one fails.
    requestQueue = currentRequest.catch(() => {});

    return currentRequest;
}


//we are defining func to create query from
//mongodb to store data in userTrie
//We're only creating the Node → C++ function.
async function addUserQuery(userId, query) {
    return sendRequest(
        `ADD_USER_QUERY|${userId}|${query}`
    );
}


//we creating this 
//because it can be user login mutliple time and in our tries many 
//redundant data will be there so we are creating this 
// func to check if user is already initialized or not
async function loadUserHistory(userId, history) {

    if (initializedUsers.has(userId)) {
        return;
    }

    for (const item of history) {
        await addUserQuery(
            userId,
            item.query
        );
    }

    initializedUsers.add(userId);
}

module.exports = {
    sendRequest,
    addUserQuery,
    loadUserHistory
};


        //          NODE.JS
        //             │
        //             │
        //   cppProcess.stdin.write()
        //             │
        //             │
        //             ▼
        //       ┌──────────┐
        //       │ C++ stdin│
        //       └────┬─────┘
        //            │
        //            │ getline(cin, request)
        //            ▼
        //       C++ PROGRAM
        //            │
        //            │ Trie
        //            │ autocomplete()
        //            ▼
        //       cout << ...
        //            │
        //            ▼
        //      ┌───────────┐
        //      │C++ stdout │
        //      └─────┬─────┘
        //            │
        //            │
        //            ▼
        // cppProcess.stdout.on("data")
        //            │
        //            ▼
        //         NODE.JS
        //            │
        //            ▼
        //      JSON response
        //            │
        //            ▼
        //      Postman / React
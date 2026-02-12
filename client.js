const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");


const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;
const text =process.argv[2]


const client = new todoPackage.Todo(
    "127.0.0.1:40000", 
    grpc.credentials.createInsecure()
);


client.createTodo({
    "id": -1, // ID will be assigned by the server
    "text": text
}, (err, response) => {
    if (err) {
        console.error("Error creating:", err);
        return;
    }
    console.log("Response from Server (Create):", JSON.stringify(response));

    
    client.readTodo({}, (err, response) => {
        if (err) {
            console.error("Error reading:", err);
            return;
        }
        
        console.log("Current Todo List (Full Response):", JSON.stringify(response));
        
        
        if (response.items) {
            console.log("Todo items only:");
            response.items.forEach(item => console.log(`- ${item.text} (ID: ${item.id})`));
        }
    });
});
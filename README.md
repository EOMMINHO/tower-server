# Fiber Drawing Tower Server

Overview: It is a fiber drawing tower server for [BNILab, KAIST](https://www.bnilab.com/) :smile:

Used: Node.js, express

- [ ] arduino code for heater
- [ ] arduino code for stepper
- [ ] real-time data transfer with socket
- [ ] authentification

To use from the client side

```javascript
//example code
io.on("connection", function(socket) {
  console.log("user connected!~");
  socket.on("chat message", msg => {
    setInterval(() => {
      io.emit("chat message", msg);
    }, 1000);
    //io.emit("chat message", msg);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected!");
  });
});
```
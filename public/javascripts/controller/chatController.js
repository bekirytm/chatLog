//CLİENT TARAFI
app.controller('chatController' , ['$scope' , ($scope) => {
    const socket = io.connect('http://localhost:3000');

    socket.on('sa' , () => {
        console.log("sa");
    })
}]);
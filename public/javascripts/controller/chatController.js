//CLİENT TARAFI
app.controller('chatController' , ['$scope' , ($scope) => {
    const socket = io.connect('http://localhost:3000');
    $scope.onlineList = [];
    $scope.roomList = [];
    $scope.activeTab = 2;
    $scope.chatClicked = false;
    $scope.chatName = "";

    //Onlines
    socket.on('onlineList' , (users) => {
        $scope.onlineList = users;
        $scope.$apply();
    });

    //Rooms
    socket.on('roomList' , (rooms) => {
        $scope.roomList = rooms;
        $scope.$apply();
    });

    $scope.switchRoom = (room) => {
        $scope.chatName = room.name;
        $scope.chatClicked = true;
    };

    $scope.newRoom = () => {
        // let randomName = Math.random().toString(36).substring(7);

        let roomName = window.prompt("Enter room name");
        if(roomName !== '' && roomName !== null){
            socket.emit('newRoom' , roomName);
        }
    };

    $scope.changeTab = (tab) => {
        $scope.activeTab = tab;
    };




}]);
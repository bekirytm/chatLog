//CLİENT TARAFI
app.controller('chatController' , ['$scope' , ($scope) => {
    const socket = io.connect('http://localhost:3000');
    $scope.onlineList = [];
    $scope.roomList = [];
    $scope.activeTab = 2;

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

    $scope.newRoom = () => {
        let randomName = Math.random().toString(36).substring(7);
        console.log(randomName);
        socket.emit('newRoom' , randomName);
    };

    $scope.changeTab = (tab) => {
        $scope.activeTab = tab;
    };




}]);
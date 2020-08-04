//CLİENT TARAFI
app.controller('chatController' , ['$scope', 'userFactory' ,'chatFactory', ($scope , userFactory,chatFactory) => {
    const socket = io.connect('http://localhost:3000');
    $scope.onlineList = [];
    $scope.roomList = [];
    $scope.activeTab = 1;
    $scope.chatClicked = false;
    $scope.loadingMessages = false;
    $scope.deneme = 1;
    $scope.chatName = "";
    $scope.roomId = "";
    $scope.message = "";
    $scope.messages = []; //mesajlar
    $scope.user = {};     //Oturumu açan kullanıcı

    //Initialization (Kullananın kim olduğunu gösteren servis(oturumu kim açtı))
    function init(){
        userFactory.getUser().then(user => {
            $scope.user = user;
        })
    }
    init();

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


    socket.on('receiveMessage' , (data) => {     //Mesajın herkese gönderilmesi işlemi
        $scope.messages[data.roomId].push({
            userId: data.userId,
            username: data.name,
            surname: data.surname,
            message: data.message
        });
        $scope.$apply();

    });

    //Mesaj işlemi
    $scope.newMessage= () => {
        if($scope.message.trim() !== ""){   //Mesaj boş değilse gönder
            socket.emit('newMessage' , {
                message: $scope.message,
                roomId: $scope.roomId
            });

            $scope.messages[$scope.roomId].push({
                userId: $scope.user._id,
                username: $scope.user.name,
                surname: $scope.user.surname,
                message: $scope.message
            });

            $scope.message = "";
        }

        // console.log($scope.user);
    };


    $scope.switchRoom = (room) => {
        $scope.chatName = room.name;
        $scope.roomId = room.id;

        $scope.chatClicked = true;

        //Her oda değiştiğinde servise bağlanmaması için mesajlar daha önce yüklendiyse servise bağlanmama.
        if (!$scope.messages.hasOwnProperty(room.id)){
            $scope.loadingMessages = true;

            console.log("Servise Bağlanıyor.");

            //Mesajları getiren servis
            chatFactory.getMessages(room.id).then(data => {
                // console.log(data);
                $scope.messages[room.id] = data;
                // console.log($scope.messages);
                $scope.loadingMessages = false;
            })
        }




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
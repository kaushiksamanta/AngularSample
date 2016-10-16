
$(document).ready(function(){
    $('#subscribe').validetta({
        bubblePosition: 'bottom',
        bubbleGapTop: 6,
        bubbleGapLeft: -5,
        onValid : function( event ) {
            event.preventDefault();
            $.ajax({
                    url : 'http://40.76.50.210:3002/api/v1/website/subscribeUser',
                    data : $(this.form).serialize(),
                    dataType : 'json',
                    method:'POST',
                    beforeSend : function(){
                        console.log('Started request !');
                    },
                    success: function (data) {
                        bootbox.dialog({
                            title: "Message",
                            message:"Subscribed To Vivo Warriors Successfully",
                            buttons: {
                                main: {
                                    label: "OK",
                                    className: "btn-primary",
                                    callback: function() {
                                        location.reload();
                                    }
                                }
                            }
                        });
                        $('.btn-primary').css({
                            "color": "#fff",
                            "background-color": "#337ab7",
                            "border-color": "#2e6da4"
                        });
                        $('.btn-primary:hover').css({
                            "color": "#fff",
                            "background-color": "#286090",
                            "border-color": "#204d74"
                        });
                    },
                    error: function (data) {
                        bootbox.dialog({
                            title: "Message",
                            message:data.responseJSON.message,
                            buttons: {
                                main: {
                                    label: "OK",
                                    className: "btn-primary"
                                }
                            }
                        });
                        $('.btn-primary').css({
                            "color": "#fff",
                            "background-color": "#337ab7",
                            "border-color": "#2e6da4"
                        });
                        $('.btn-primary:hover').css({
                            "color": "#fff",
                            "background-color": "#286090",
                            "border-color": "#204d74"
                        });
                    }
                });
        },
        onError : function( event ){
            event.preventDefault();
            console.log("error");
        }
    });
});
servoController.controller('DashboardCtrl', ['$scope' ,'$http', '$cookieStore', '$rootScope', 'UserService', 
    'TransactionService', 'MerchantService', 'PumpService', '$log', 'atmosphereService',
    function($scope, $http, $cookieStore, $rootScope, UserService, TransactionService, MerchantService, PumpService, $log, atmosphereService){
    // var cache = cacheDataChart.get('dataChart');
	var elm = document.getElementById("chartContainer");
	var paper = new Raphael(elm, 850, 170);

    var objUser = $cookieStore.get('user');
    var access_token = '';
    if (objUser) {
        access_token = objUser.auth.access_token;
    } /*else {
        return; 
    }*/
    $('#dashboard .transaction .icon_chart_right').addClass('not_next').css('opacity', '0.5');


    $scope.pumpAvailable    = '00';
    $scope.totalPump        = 0;
    $scope.totalTransaction = '000';
    $scope.vehicles         = '00';
    $scope.bsb_number       = '000000';
    $rootScope.list_pump    = [];

    $rootScope.brand_image  = '';


    getStationMerchant(access_token);

    function countAvailablePump(list_pump) {
        var _c = 0;
        for (i=1, c=list_pump.length; i<c; i++) {
            if (list_pump[i] === true) {
                _c++;
            }
        }
        _c = (_c < 0) ? 0 : _c;
        _c = (_c >= list_pump.length) ? list_pump.length : _c;
        return {
            available: _c,
            vehicles: list_pump.length - 1 - _c
        };
    }

    function pumpRealTime(ip_address) {
        var socket;
        ip_address = ip_address.replace('http://', '');
        request = {
            url : "ws://"+ip_address+"/test/sub/1",
            // trackMessageLength : true,
            transport: "websocket",
            // logLevel : 'debug',
            contentType : "application/json",
            fallbackTransport: 'long-polling'
        };

        request.onOpen = function (data) {
            
        };

        request.onClientTimeout = function(data) {
            
        };

        request.onMessage = function(data) {
            var obj;
            try {
                obj = JSON.parse(data.responseBody);
            } catch (e) {
                obj = data.responseBody;
            }


            if (obj.bitStatus) {
                if ($rootScope.list_pump[obj.id] !== undefined) {
                    if (obj.available != $rootScope.list_pump[obj.id].available) {
                        $rootScope.list_pump[obj.id] = obj.available;
                        changePumpStatus(obj.id, obj.available);
                    }

                    var objCount = countAvailablePump($rootScope.list_pump);
                    $scope.pumpAvailable = ("0" + objCount.available).slice(-2);
                    $scope.vehicles = ("0" + objCount.vehicles).slice(-2);
                    if (parseInt($scope.vehicles, 10) < 0) {
                        $scope.vehicles = 0;
                    } 
                    if (parseInt($scope.pumpAvailable, 10) > $scope.totalPump) {
                        $scope.pumpAvailable = $scope.totalPump;
                    }
                }
            }

            if (obj.sDate && obj.sTime) {
                $scope.totalTransaction = ("00" + (parseInt($scope.totalTransaction, 10) + 1)).slice(-3);
            }
        };

        $rootScope.wsRequest = request;
        $rootScope.socket = atmosphereService.subscribe(request);

    }    

    function getStationMerchant(access_token) {
        MerchantService.getStationMerchant(access_token).then(function(json) {
            $scope.station = json.data.station;
            //draw chart
            TransactionService.getTransactionInOneWeek($scope.station.id).then(function(result){
                $scope.end_date = result.data.data.end_date;
                $scope.start_date = result.data.data.start_date;
                chart.drawChart(paper, result.data.data);
                // cacheDataChart.put('dataChart', result.data.data);
             });

            if ($scope.station.image == null) {
                $scope.station.image = 'imgs/icon.png';
            } else {
                $scope.station.image = domainUrl + '/' + $scope.station.image;
            }
            showFuels = json.data.fuels;
            for (i=0, c=showFuels.length; i<c; i++) {
                classBorder = 'border';
                lastInRow = '';
                if (i >= c-(c/3)-1) {
                    classBorder = '';
                }
                if (i % 3 == 2) {
                    lastInRow = 'last';
                }
                showFuels[i].classBorder = classBorder;
                showFuels[i].lastInRow = lastInRow;

                $scope.fuels = showFuels;
            }
            if (json.data.brand != null) {
                $scope.brand           = json.data.brand;
                $scope.brand.images    = domainUrl + '/' + $scope.brand.images;
                $rootScope.brand_image = $scope.brand.images;
            }
            $scope.services     = json.data.services;
            $scope.bsb_number   = json.data.merchant.bsb_number;

            getPumpByStation($scope.station.id);
            countTransactionByStation(access_token, $scope.station.id);
            if (!$rootScope.socket) {
                
            } else {
                atmosphereService.unsubscribe();
                $rootScope.socket = null;
            }

            pumpRealTime($scope.station.ip_address);

            $cookieStore.put('station_id', $scope.station.id);
        });
    }

    function getPumpByStation(station_id) {        
        PumpService.getPumpByStation(station_id).then(function(json) {
            data = json.data.data;
            for (i=0, c=data.pumpStatuses.length; i<c; i++) {
                $rootScope.list_pump[data.pumpStatuses[i].id] = data.pumpStatuses[i].available;
            }
            
            generateUIPump(data);
        });
    }

    function generateUIPump(data) {
        var pumpAvailable = 0;
        $scope.pumps      = data.pumpStatuses;
        $scope.totalPump  = $scope.pumps.length;
        for (i=0, c=$scope.pumps.length; i<c; i++) {
            var hose = data.pumpStatuses[i].hoseStatuses;
            var listOctane = '';
            for (var item in hose) {
                if (hose[item].octane != null) {
                    listOctane += hose[item].octane+' ';
                }
            }
            $scope.pumps[i].listOctane = listOctane;
            
            if (i % 4 == 3) {
                $scope.pumps[i].itemLast = 'last';
            } else {
                $scope.pumps[i].itemLast = '';
            }

            if ($scope.pumps[i].available === true) {
                pumpAvailable++;
                $scope.pumps[i].classAvailable = 'available';
            } else {
                $scope.pumps[i].classAvailable = 'invaiable';
            }
            $scope.pumpAvailable = ("0" + pumpAvailable).slice(-2);
            vehicles = parseInt($scope.totalPump, 10) - parseInt($scope.pumpAvailable, 10);
            $scope.vehicles = vehicles = ("0" + vehicles).slice(-2);
        }
    }

    function generatePumpOnInsert(data) {
        var pumpAvailable = 0;
        $scope.pumps = data.data.pumpStatuses;
        $scope.totalPump = $scope.pumps.length;
        for (i=0; i<$scope.totalPump; i++) {
            $rootScope.list_pump[$scope.pumps[i].id] = $scope.pumps[i].available;
            var hose = $scope.pumps[i].hoseStatuses;
            var listOctane = '';
            for (var item in hose) {
                if (hose[item].octane != null) {
                    listOctane += hose[item].octane+' ';
                }
            }
            $scope.pumps[i].listOctane = listOctane;
            
            if (i % 4 == 3) {
                $scope.pumps[i].itemLast = 'last';
            } else {
                $scope.pumps[i].itemLast = '';
            }

            if ($scope.pumps[i].available === true) {
                pumpAvailable++;
                $scope.pumps[i].classAvailable = 'available';
            } else {
                $scope.pumps[i].classAvailable = 'invaiable';
            }
            $scope.pumpAvailable = ("0" + pumpAvailable).slice(-2);
            vehicles = parseInt($scope.totalPump, 10) - parseInt($scope.pumpAvailable, 10);
            $scope.vehicles = vehicles = ("0" + vehicles).slice(-2);
        }
    }

    function countTransactionByStation(access_token, station_id) {
        var d = new Date();
        time = d.getFullYear()+'.'+(d.getMonth() + 1)+'.'+d.getDate();
        TransactionService.countTransactionByStation(access_token, station_id, time).then(function(json) {
            $scope.totalTransaction = ("00" + json.data).slice(-3);
        });
    }

    function changePumpStatus(pump_id, status) {
        if (status === true) {
            $('#pump-no-'+pump_id).find('.top').removeClass('invaiable').addClass('available');
        }
        if (status === false) {
            $('#pump-no-'+pump_id).find('.top').removeClass('available').addClass('invaiable');
        }
    }


    //*********ADD & REMOVE PUMP**************
    //****************************************
    $scope.add_pumps = {};
    $scope.pumpSelected = 0;
    $scope.pumpRemoved = 0;
    $(document).on('click', '.item-pump', function() {
        $('#remove_pump').modal('show');
        $scope.pumpRemoved = parseInt($(this).attr('id').substring(8), 10);
    });
    $(document).on('click', '#remove_pump #btn-cancel', function() {
        $('#remove_pump').modal('hide');
        $scope.pumpRemoved = 0;
    });
    $(document).on('click', '#add-pump-here', function() {
        $('#pump-detail').find('.selected').remove();
        $('#add_pump').modal('show');
        $('#add_pump .loading').removeClass('hide');
        PumpService.getUnassignPumpByStation(access_token, $scope.station.id).then(function(json) {
            $scope.add_pumps = json.data;
            $('#add_pump .loading').addClass('hide');
        });
    });
    $(document).on('click', '#add_pump #btn-cancel', function() {
        $('#add_pump').modal('hide');
    });
    $(document).on('click', '#add_pump #pump-detail', function() {
        var display = $('#list-detail').css('display');
        if (display == 'none') {
            display = 'block';
        } else {
            display = 'none';
        }
        $('#list-detail').css('display', display);
    });
    $(document).on('click', '#add_pump .item-detail', function() {
        $('#pump-detail').find('.selected').remove();
        var html = $(this).html();
        $('#pump-detail').prepend('<div class="selected">' + html + '</div>');
    });
    $(document).click(function (e) {
        var div = $('#add_pump #pump-detail');
        if (!div.is(e.target)) {
            $('#list-detail').css('display', 'none');
        }
    });

    $scope.addPump = function() {
        if ($scope.pumpSelected === 0) {
            $('#add_pump #addPump-alert').removeClass().addClass('alert alert-danger').html('Please choose pump to add.');
            hideMessageTimeout($('#add_pump #addPump-alert'));
            return false;
        }
        $('#btn-add-pump').attr('disabled', 'disabled');
        $('#add_pump .loading').removeClass('hide');
        PumpService.addPumpStationMerchant(access_token, $scope.station.id, $scope.pumpSelected).then(function(json) {
            $rootScope.list_pump = {};
            if (json.data.status === 'OK') {
                $('#parent-alert').removeClass().addClass('alert alert-success').html(json.data.message);
                generatePumpOnInsert(json.data.data);
                hideMessageTimeout($('#parent-alert'));
            } else {
                $('#add_pump #addPump-alert').removeClass().addClass('alert alert-danger').html(json.data.message);
                hideMessageTimeout($('#add_pump #addPump-alert'));
            }
            $('#add_pump .loading').addClass('hide');
            $('#add_pump').modal('hide');
            $('#btn-add-pump').removeAttr('disabled');
            $scope.pumpSelected = 0;
        });
    };

    $scope.selectPumpToAdd = function(pump) {
        $scope.pumpSelected = pump;
    };

    $scope.removePump = function() {
        if ($scope.pumpRemoved === 0) {
            $('#remove_pump #removePump-alert').removeClass().addClass('alert alert-danger').html('Please choose pump to remove.');
            hideMessageTimeout($('#remove_pump #removePump-alert'));
            return false;
        }
        $('#btn-remove').attr('disabled', 'disabled');
        $('#remove_pump .loading').removeClass('hide');
        PumpService.removePumpStationMerchant(access_token, $scope.station.id, $scope.pumpRemoved).then(function(json) {
            if (json.data.status === 'OK') {
                $('#parent-alert').removeClass().addClass('alert alert-success').html(json.data.message);
                generatePumpOnInsert(json.data.data);
                hideMessageTimeout($('#parent-alert'));
            } else {
                $('#remove_pump #removePump-alert').removeClass().addClass('alert alert-danger').html(json.data.message);
                hideMessageTimeout($('#remove_pump #removePump-alert'));
            }
            $('#remove_pump .loading').addClass('hide');
            $('#remove_pump').modal('hide');
            $('#btn-remove').removeAttr('disabled');
            
            $scope.pumpRemoved = 0;
        });

    };
    //*******************************************************END ADD & REMOVE PUMP
    //****************************************************************************


    $scope.previous_transactions = function(){
        $('#dashboard .transaction .icon_chart_right').removeClass('not_next').css('opacity', '1');
        $('#loading-dialog-merchant').css({display: 'block'});
        //calendar decrease to 14 day format Date('2011-02-01')
        var day = moment($scope.start_date);
        var date =  day.subtract(13, 'days').format("YYYY-MM-DD");
         TransactionService.getTransactionInTwoWeek($scope.station.id,date,$scope.start_date).then(function(result){
            $scope.end_date = result.data.data.end_date;
            $scope.start_date = result.data.data.start_date;
            document.getElementById("chartContainer").innerHTML = '';
            paper = new Raphael(elm, 840, 170);
            chart.drawChart(paper, result.data.data);
            $('#loading-dialog-merchant').css({display: 'none'});
        });
    };

    $scope.next_transactions = function(){
        $('#dashboard .transaction .icon_chart_right').removeClass('not_next').css('opacity', '1');
        $('#loading-dialog-merchant').css({display: 'block'});
         //calendar increment to 14 day format Date('2011-02-01')
        var day = moment($scope.end_date);
        var date =  day.add(13, 'days').format("YYYY-MM-DD");
        var dayCompare = moment($scope.end_date);
        var dateCompare = dayCompare.add(14, 'days').format("YYYY-MM-DD");
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!

        var yyyy = today.getFullYear();
        if(dd<10){
            dd='0'+dd;
        } 
        if(mm<10){
            mm='0'+mm;
        } 
        today = yyyy+'-'+mm+'-'+dd;

        //compare beetween today and end day
        if(date <= today)
        {
            if(dateCompare == today){
                $('#dashboard .transaction .icon_chart_right').addClass('not_next').css('opacity', '0.5');
            }
            TransactionService.getTransactionInTwoWeek($scope.station.id,$scope.end_date,date).then(function(result){
                $scope.end_date = result.data.data.end_date;
                $scope.start_date = result.data.data.start_date;
                document.getElementById("chartContainer").innerHTML = '';
                paper = new Raphael(elm, 840, 170);
                chart.drawChart(paper, result.data.data);
                $('#loading-dialog-merchant').css({display: 'none'});
            });
        }else{
            $('#dashboard .transaction .icon_chart_right').addClass('not_next').css('opacity', '0.5');
            $('#loading-dialog-merchant').css({display: 'none'});
        }
    };
}]);

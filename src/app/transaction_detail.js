servoController.controller('TransactionDetailCtrl', ['$scope', '$routeParams', 'TransactionService', 'cacheDataChart', '$http', '$cookieStore', '$rootScope', 'ErrorMessageService', '$location', 
    function($scope, $routeParams, TransactionService, cacheDataChart, $http, $cookieStore, $rootScope, ErrorMessageService, $location){

    // var cache        = cacheDataChart.get('dataChart');
    var elm           = document.getElementById("chartContainer");
    var paper         = new Raphael(elm, 850, 170);
    var station_id    = $cookieStore.get('station_id');
    var objUser       = $cookieStore.get('user');
    var access_token  = '';
    var validType     = ['csv', 'excel', 'pdf'];
    var typeName      = ['CSV', 'Excel', 'PDF'];

    $scope.if_loading = false;
    $scope.lastFilter = {
        start: 0,
        end: 0,
        id: 0
    };
    $scope.type_file = '';
    $scope.brand_image = $rootScope.brand_image;
    //add opactity when first init
    $('#transaction_detail .transaction .icon_chart_right').addClass('not_next').css('opacity', '0.5');

    if (objUser) {
        access_token = objUser.auth.access_token;
    } else {
        $location.path('/'); return;
    }



    $scope.config = {
        search : false
    };
    // if(cache){
    //     chart.drawChart(paper, cache);
    // }else{
        TransactionService.getTransactionInOneWeek(station_id).then(function(result){
            $scope.end_date = result.data.data.end_date;
            $scope.start_date = result.data.data.start_date;
            chart.drawChart(paper, result.data.data);
            // cacheDataChart.put('dataChart', result.data.data);
        });
    // }
    $scope.currentPage = $routeParams.page;
    if(!$scope.currentPage)
        { $scope.currentPage = 1; }
    var limit = 30;
    loadTransaction(limit, $scope.currentPage, station_id);
    $('#transaction_detail .filter .daterange').daterangepicker({
        // format: 'YYYY-MM-DD',
        //     startDate: '2013-01-01',
        //     endDate: '2013-12-31'
    });

    init();
    function init() {

        ErrorMessageService.getErrorMessage('en_US');
        $scope.no_data   = ErrorMessageService.messageStore('merchant.filter.nodata');
    }

    $('#transaction_detail .filter .daterange').click(function() {
        if (isIE() === true) {
            if ($(this).is(':focus') && $(this).val() === '') {
                $('.fake_placeholder').removeClass('hide');
            }
        }
    });
    $(document).on('click', function (e) {
        if (isIE() === true) {
            var objInput = $('#transaction_detail .filter .daterange');
            if (!objInput.is(e.target)) {
                $('.fake_placeholder').addClass('hide');
            }
        }
    });


    $scope.changePage = function(event){
        var ele = event.currentTarget;
        var page = $(ele).attr('page');
        $scope.currentPage = page;
        if(!$scope.config.search){
            loadTransaction(limit, page, station_id);
        }else{
            var _start, _end;
            if ($('.daterange').val() !== '') {
                _start = localStorage.getItem('filterStart');
                _end   = localStorage.getItem('filterEnd');
            } else {
                _start = '0';
                _end   = '0';
            }
            var _id    = $('.search_input').val();
            if ($scope.validateFilter(_start, _end, _id) === false) {
                return;
            }
            var params = $scope.beforeFilter(_start, _end, _id);
            
            $scope.filterTransaction(limit, page, station_id, params.start, params.end, params.id);
        }
    };

    $scope.search = function(event){
        if(event.which == 13){
            var ele = event.currentTarget;
            var key = $scope.key;
            var pattern = /^[0-9]*$/;
            var _start, _end;

            if (!pattern.test($('.search_input').val())) {
                var mes = ErrorMessageService.messageStore('merchant.filter.transaction.invalid');
                $('#notify-alert').removeClass().addClass('alert alert-danger').html(mes);
                return;
            }
            
            if ($scope.key !== undefined) {
                key = key.replace('#', '');
            } else {
                key = '0';
            }

            if ($('.daterange').val() !== '') {
                _start = localStorage.getItem('filterStart');
                _end   = localStorage.getItem('filterEnd');
            } else {
                _start = '0';
                _end   = '0';
            }

            var _id    = key;
            if ($scope.validateFilter(_start, _end, _id) === false) {
                return;
            }
            var params = $scope.beforeFilter(_start, _end, _id);
            
            $scope.filterTransaction(limit, 1, station_id, params.start, params.end, params.id);
        }

    };

    function loadTransaction(limit, page, station_id){
        isLoading(true, 'loading-transaction');
        $('.no_data').css({
            'height': '200px'
        });
        TransactionService.listTransaction(access_token, limit, page, station_id).then(function(result){
            isLoading(false, 'loading-transaction');
            var data = result.data.data;
            $scope.showPaging = true;
            $scope.data = data;
            $scope.if_first = page == parseInt(data.before, 10) ? true : false;
            $scope.if_last = page == data.next ? true : false;
            if ($scope.data.items.length === 0) {
                isEmptyData(true);
                $scope.if_first = true;
                $scope.if_last = true;
                $scope.data.current = 0;
            } else {
                isEmptyData(false);
            }
        });
    }

    $scope.resetFilter = function() {
        $scope.lastFilter = { start: 0, end: 0, id: 0 };
        loadTransaction(limit, 1, station_id);
        $('.daterange').val('').css('width', '100px');
        $('.search_input').val('');
        $('#notify-alert').removeClass().html('');
        $('.fake_placeholder').addClass('hide');
        $scope.config.search = false;
        $('#transaction_detail .filter .daterange').data('daterangepicker').container.remove();
        $('#transaction_detail .filter .daterange').daterangepicker({});
        delete $scope.key;
    };

    function loadTransactionByKeySearch(limit, page, station_id, key){
        TransactionService.listTransactionByKeyWord(limit, page, station_id, key).then(function(result){
            var data = result.data.data;
            $scope.showPaging = data.total_items > limit ? true : false;
            $scope.data = data;
            $scope.if_first = page == parseInt(data.before, 10) ? true : false;
            $scope.if_last = page == data.next ? true : false;
        });
    }

    $scope.showTransactionDetail = function(transaction_id) {
        $('.transaction-item').removeClass('selected');
        $('#transaction-'+transaction_id).addClass('selected');
        $('#transaction_receipt').modal('show');
        $scope.detail = $scope.findDetailByTransactionID(transaction_id);
        $scope.total_price = $scope.detail.total.substring(1);
        $scope.detail.station_id = station_id;
        $('#btn-export').attr('href', baseUrl + 'user/exportTransactionDetailPDF/' + access_token + '/' + JSON.stringify($scope.detail));
    };

    $scope.findDetailByTransactionID = function(transaction_id) {
        for (i=0, c=$scope.data.items.length; i<c; i++) {
            if (transaction_id == $scope.data.items[i].transactions_id) {
                return $scope.data.items[i];
            }
        }
        return {};
    };

    $scope.hideTransactionDetail = function() {
        $('.transaction-item').removeClass('selected');
        $('#transaction_receipt').modal('hide');
    };

    $scope.sendEmailTransactionDetail = function() {
        $('#transaction_receipt .loading').removeClass('hide');
        $http({
            method: 'GET',
            url : baseUrl + 'user/sendEmailMerchantTransaction/' + access_token + '/' + $scope.detail.transactions_id,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(function(data){
            $('#transaction_receipt .loading').addClass('hide');
            if (data.status === true) {

                alert(data.message);
            }
        }).error(function(data, status) {

        });
    };

    var isIE = function() {
        return false || !!document.documentMode;
    };

    $(document).on('click', '.applyBtn', function() {
        $('.daterange').css({'width':'155px'});
        setTimeout(function() {
            var _start = localStorage.getItem('filterStart');
            var _end   = localStorage.getItem('filterEnd');
            var _id    = $('.search_input').val();
            if ($scope.validateFilter(_start, _end, _id) === false) {
                return;
            }
            var params = $scope.beforeFilter(_start, _end, _id);
            $scope.filterTransaction(limit, 1, station_id, params.start, params.end, params.id);
        }, 200);
    });

    $scope.validateFilter = function(start, end, id) {
        var patternId = /^[0-9]{0,16}$/;
        var mes;
        if (!patternId.test(id)) {
            mes = ErrorMessageService.messageStore('merchant.filter.transaction.invalid');
            $('#notify-alert').removeClass().addClass('alert alert-danger').html(mes);
            hideMessageTimeout($('#notify-alert'));
            return false;
        }
        id = (id === '') ? '0' : id;
        if (start == '0' && end == '0' && id == '0') {
            mes = ErrorMessageService.messageStore('merchant.filter.input.invalid');
            $('#notify-alert').removeClass().addClass('alert alert-danger').html(mes);
            hideMessageTimeout($('#notify-alert'));
            return false;
        }
        return true;
    };

    $scope.beforeFilter = function(start, end, id) {
        $('#notify-alert').removeClass().addClass('hide');
        if (start != '0') {
            var arrStart = start.split(/\D/);
            start = new Date(arrStart[1] + '/' + arrStart[0] + '/' + arrStart[2]);
            start = numberFormat((start.getMonth() + 1), 2) + '.' + numberFormat(start.getDate(), 2) + '.' + start.getFullYear();
        }
        if (end != '0') {
            var arrEnd = end.split(/\D/);
            end   = new Date(arrEnd[1] + '/' + arrEnd[0] + '/' + arrEnd[2]);
            end   = numberFormat((end.getMonth() + 1), 2) + '.' + numberFormat(end.getDate(), 2) + '.' + end.getFullYear();
        }
        id    = (id === '') ? '0' : id;
        return {
            start: start,
            end: end,
            id: id
        };
    };

    $scope.filterTransaction = function(limit, page, station_id, start, end, id) {
        $scope.config.search = true;
        TransactionService.filterTransaction(limit, page, station_id, start, end, id).then(function(json) {
            $scope.lastFilter = { start: start, end: end, id: id };
            data              = json.data;
            $scope.showPaging = true;
            $scope.data       = data.data;
            $scope.if_first   = page == parseInt(data.data.before, 10) ? true : false;
            $scope.if_last    = page == data.data.next ? true : false;
            if ($scope.data.items.length === 0) {
                isEmptyData(true);
                $scope.if_first = true;
                $scope.if_last = true;
            } else {
                isEmptyData(false);
            }
        });
    };

    function numberFormat(val, length) {
        var result = '';
        var val_length = val.toString().length;
        for (i=0; i<parseInt(length, 10) - parseInt(val_length, 10); i++) {
            result += '0';
        }
        return result + val;
    }

    function isEmptyData(_boolean) {
        if (_boolean === true) {
            $('.no_data').css({
                'height': '200px'
            });
            $scope.currentPage = 0;
        } else {
            $('.no_data').css('height');
        }
    }

    $scope.sendEmailTransactionHistory = function() {
        $('#transaction_detail .wrap_page').removeClass('hide');
        TransactionService.sendEmailTransactionHistory(access_token, $scope.lastFilter['start'], $scope.lastFilter['end'], $scope.lastFilter['id'], station_id).then(function(json) {
            if (json.data.type == 'success') {
                $('#notify-alert').removeClass().addClass('alert alert-success').html(ErrorMessageService.messageStore('merchant.email.transaction_history.success'));
            } else {
                $('#notify-alert').removeClass().addClass('alert alert-danger').html(ErrorMessageService.messageStore('merchant.email.transaction_history.fail'));
            }
            hideMessageTimeout($('#notify-alert'));
            $('#transaction_detail .wrap_page').addClass('hide');
        });
    };


    /***EXPORT TRANSACTION HISTORY CSV< EXCEL< PDF****/
    /*************************************************/
    var typeUrl       = {
        'csv': baseUrl + 'user/exportTransactionDetailExcelOrCsv/' + access_token + '/' + $scope.lastFilter['start'] + '/' + $scope.lastFilter['end'] + '/' +$scope.lastFilter['id'] + '/' + station_id +'/csv',
        'excel': baseUrl + 'user/exportTransactionDetailExcelOrCsv/' + access_token + '/' + $scope.lastFilter['start'] + '/' + $scope.lastFilter['end'] + '/' +$scope.lastFilter['id'] + '/' + station_id +'/excel',
        'pdf': '#'//baseUrl + 'user/exportTransactionHistoryPDF/' + access_token + '/' + $scope.lastFilter['start'] + '/' + $scope.lastFilter['end'] + '/' +$scope.lastFilter['id'] + '/' + station_id
    };
    $scope.showExportExcelOrCsv = function(){
        $('#export_transaction_history').modal('show');
    };
    
    $(document).on('click', '#dropdown-type-file', function() {
        var display = $('#list-type-file').css('display');
        if (display == 'none') {
            display = 'block';
        } else {
            display = 'none';
        }
        $('#list-type-file').css('display', display);
    }); 

    $scope.exportTransactionDetailExcelOrCsv = function(type) {
        if (validType.indexOf(type) > -1) {
            $scope.type_file = typeName[validType.indexOf(type)];
            var url = typeUrl[type];
            $('#btn-export-transaction').attr('href',url);
        }
    };

    /*************************************************/
    /*************************************************/

    $scope.previous_transactions = function(){
        $('#transaction_detail .transaction .icon_chart_right').removeClass('not_next').css('opacity', '1');
        $('#loading-dialog-merchant-detail').css({display: 'block'});
        //calendar decrease to 14 day format Date('2011-02-01')
        var day = moment($scope.start_date);
        var date =  day.subtract(13, 'days').format("YYYY-MM-DD");
         TransactionService.getTransactionInTwoWeek(station_id,date,$scope.start_date).then(function(result){
            $scope.end_date = result.data.data.end_date;
            $scope.start_date = result.data.data.start_date;
            document.getElementById("chartContainer").innerHTML = '';
            paper = new Raphael(elm, 840, 170);
            chart.drawChart(paper, result.data.data);
            $('#loading-dialog-merchant-detail').css({display: 'none'});
        });
    };

    function isLoading(_boolean, id) {
        // var this = $('#'+id);
        if (_boolean === true) {
            $('#'+id).removeClass('hide');
        } else {
            $('#'+id).removeClass('hide').addClass('hide');
        }
    }

    $scope.next_transactions = function(){
        $('#transaction_detail .transaction .icon_chart_right').removeClass('not_next').css('opacity', '1');
        $('#loading-dialog-merchant-detail').css({display: 'block'});
         //calendar increment to 14 day format Date('2011-02-01')
        var day = moment($scope.end_date);
        var date =  day.add(13, 'days').format("YYYY-MM-DD");
        //daycompare used to opacity next transaction
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
                $('#transaction_detail .transaction .icon_chart_right').addClass('not_next').css('opacity', '0.5');
            }
            TransactionService.getTransactionInTwoWeek(station_id,$scope.end_date,date).then(function(result){
                $scope.end_date = result.data.data.end_date;
                $scope.start_date = result.data.data.start_date;
                document.getElementById("chartContainer").innerHTML = '';
                paper = new Raphael(elm, 840, 170);
                chart.drawChart(paper, result.data.data);
                $('#loading-dialog-merchant-detail').css({display: 'none'});
            });
        }else{
            $('#transaction_detail .transaction .icon_chart_right').addClass('not_next').css('opacity', '0.5');
            $('#loading-dialog-merchant-detail').css({display: 'none'});
        }
    };

}]);
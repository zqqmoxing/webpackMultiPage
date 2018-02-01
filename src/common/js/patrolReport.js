import 'babel-polyfill';
import $ from 'plugins/jquery/jquery-vendor.js';
import 'amazeui';
import 'scss/common.scss';
import 'scss/style.scss';
import 'amazeui/dist/css/amazeui.css';

//事件
import './event';

// import {EventsList} from './common/js/iscroll';
import data from '../json/config.json';
const patrolReport = require('tpl/patrolReport.art');
const table = require('tpl/table.art');

document.getElementById('patrolReport').innerHTML = patrolReport();
$('#events-list').html(table({data:data}));

setTime();
iscroll();

//滚动条
function iscroll(){
    let IScroll = $.AMUI.iScroll;
    let myScroll = new IScroll('#wrapper');
    // var app = new EventsList(null, {
    //     api: 'https://api.douban.com/v2/event/list',
    //     params: {
    //         start: 100,
    //         type: 'music',
    //         count: 10,
    //         loc: 'beijing'
    //     }
    // });
    // app.init();
}
//日期选择
function setTime(){
    var startDate = new Date();
    var endDate = new Date();
    var $alert = $('#my-alert');
    // $('#my-start').datepicker().
    $('#my-startDate').datepicker().
    on('changeDate.datepicker.amui', function(event) {
        if (event.date.valueOf() > endDate.valueOf()) {
            $alert.find('p').text('开始日期应小于结束日期！').end().fadeIn();
            setTimeout(function(){
                alert(1)
                $alert.fadeOut();
            },1000);
        } else {
            $alert.fadeOut();
            startDate = new Date(event.date);
            $('#my-startDate').text($('#my-startDate').data('date'));
        }
        $(this).datepicker('close');
    });

    $('#my-endDate').datepicker().
    on('changeDate.datepicker.amui', function(event) {
        if (event.date.valueOf() < startDate.valueOf()) {
            $alert.find('p').text('结束日期应大于开始日期！').end().fadeIn();
            setTimeout(function(){
                $alert.fadeOut();
            },1000);
        } else {
            $alert.fadeOut();
            endDate = new Date(event.date);
            $('#my-endDate').text($('#my-endDate').data('date'));
        }
        $(this).datepicker('close');
    });
}
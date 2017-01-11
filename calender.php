<!DOCTYPE html>
<html lang="ja">
	<meta charset="UTF-8">
	
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>

<!--  日本語化 -->
<!-- <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/i18n/jquery-ui-i18n.min.js"></script> -->
<link rel="stylesheet" href="http://ajax.googleapis.com/ajax/libs/jqueryui/1/themes/flick/jquery-ui.css" >
<!-- <link rel="stylesheet" href="css/datepicker.css">
 -->
<script>
/* 日本語化 */
/* 参考:text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/i18n/jquery-ui-i18n.min.js */
( function( factory ) {
    if ( typeof define === "function" && define.amd ) {        
        define( [ "../widgets/datepicker" ], factory );
    } else {
        factory( jQuery.datepicker );
    }
}( function( datepicker ) {

datepicker.regional.ja = {
    monthNamesShort: [ "1","2","3","4","5","6",
    "7","8","9","10","11","12" ],
    dayNamesMin: [ "日","月","火","水","木","金","土" ],
    isRTL: false,
    showMonthAfterYear: true,
     };
datepicker.setDefaults( datepicker.regional.ja );

return datepicker.regional.ja;

} ) );

/* 2つのカレンダーを作成 */
$(function() {

    $.datepicker.setDefaults( $.datepicker.regional[ "ja" ] );
    $('#calendar1').datepicker({
        minDate: new Date(2002, 3 - 1, 1), 
        maxDate: 'today', 
        changeYear: 'y', 
        changeMonth: true, 
        dateFormat: 'yy-mm-dd' 
    });
    
});
$(function() {

    $.datepicker.setDefaults( $.datepicker.regional[ "ja" ] );
    $('#calendar2').datepicker({
        minDate: new Date(2002, 3 - 1, 1),
        maxDate: 'today',
        changeYear: true, 
        changeMonth: true,
        dateFormat: 'yy-mm-dd'
    });
    
});
</script>








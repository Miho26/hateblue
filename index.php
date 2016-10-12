<?php
require 'hatenaapi.php';
require_once 'calender.php';

$a = new Hatena; 

?>

<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<title></title>
	<link rel="stylesheet" href="css/main.css">
	<link rel="stylesheet" href="css/bukome.css">
	<script type="text/javascript" src="js/BookmarkCommentViewerAllInOne.js" charset="utf-8"></script>
	<script type="text/javascript">
	// initCreateRelAfterIcon();
	</script>

</head>
<body>
	<div id="headerblock">
		<div id="header">
			<p><a href="/hatenante">はてぶるぶる</a></p>
		</div>
	<div id="formtable">
		<form action="<?php  $a->getFeed();?>" name="date1" id="searchform">
    		<input type="text" name="q" placeholder="キーワード">
			<input id="calendar1" type="text" name="date_begin" placeholder="いつから" size="10px">
		    <input id="calendar2" type="text" name="date_end" placeholder="いつまで" size="10px">
    		<select name="sort">
    			<option value="recent">新着順</option>
    			<option value="popular">人気順</option>
    		</select>
   			<input type="submit" value="検索">
		</form>
	</div>
</div>
<div id="outResult">
	<?php $a->outResult(); ?>
</div>
<?php
$a->getObj('s');
$a->getTitle();
?>
</body>
</html>










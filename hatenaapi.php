<!DOCTYPE html>
<html lang="ja">
<head>
	<meta charset="UTF-8">
	<title></title>
</head>
<body>
</body>
</html>
<?php

try
{

	class Hatena
	{


		public $feed;
		public $obj;
		public $result;

		public function getFeed()
		{
			function z_mb_urlencode( $str ) {
 				return preg_replace_callback(
				'/[^\x21-\x7e]+/',
					function( $matches ) {
						return urlencode( $matches[0] );
					},
				$str );
			}
			if(isset($_GET['q']) || isset($_GET['date_begin']) || isset($_GET['date_end']) ){
				$urlQpre = $_GET['q'];
				$urlQ = z_mb_urlencode( $urlQpre );
				$urlDateBegin = $_GET['date_begin'];
				$urlDateEnd = $_GET['date_end'];
				$sort = $_GET['sort'];
				

				$preDateBegin = new DateTime($urlDateBegin);
				$resultDateBegin = $preDateBegin->format('Y/m/d');
				$preDateEnd = new DateTime($urlDateEnd);
				$resultDateEnd = $preDateEnd->format('Y/m/d');

				$this->result = $resultDateBegin. '〜'. $resultDateBegin. ' 「'. $urlQpre. '」検索結果';	
				
				if($sort != 'recent'){
					$sort = 'popular';
				}

 
				$this->feed = 'http://b.hatena.ne.jp/search/text?q='. $urlQ. '&mode=rss&date_begin='. $urlDateBegin. '&date_end='. $urlDateEnd. '&sort='. $sort; 

			
			} else {
				$this->feed = 'http://b.hatena.ne.jp/hotentry?mode=rss';
			}

		


		}


		public function getObj($userAgent) 	
		{
			$options = stream_context_create(array('http'=>array('user_agent'=>$userAgent)));

			$obj = simplexml_load_string( @file_get_contents( $this->feed, false, $options));
			$this->obj = $obj;
		

		}

		public function getTitle()
		{
			
			$html = '';

			if($this->obj->item){


				foreach ($this->obj->item as $value) {

					

					$title = (string)$value->title;
					$link = (string)$value->link;
					$linkNoHttp = str_replace('http://', '', $link);
					$description = (string)$value->description;
					// $link = $value->link;

					$content = $value->children('content', true)->encoded;
					$count = strpos($content,'http://cdn-ak.b.st-hatena.com/entryimage/');
					$imageSearch = substr($content, $count, 70);
					$jpgSearch = strpos($imageSearch, '.jpg');
					// $imageUrl = substr($imageSearch, $count, $jpgSearch - 3);

					if($count){
						$imageUrl = substr($imageSearch, 0, $jpgSearch );
						// $imageUrl = substr($content, $count, 61);
						$thumbnail = '<img src='. $imageUrl. '_l.jpg>'; 
						// if(!isset($imageUrl. '_l.jpg')){
						// 	$thumbnail = $description;
						// }
					} else {
						$thumbnail = $description;
					}

					$date = $value->children('dc', true)->date;
					$date = date("Y/m/d H:i:s", strtotime($date));
					$subject = $value->children('dc', true)->subject;
					$bookmark = $value->children('hatena', true)->bookmarkcount;


					$html .=
					'
					<div class=contents>
					<div class=entry>
						<div class=subject>'. $subject.'</div>
						<div class=bookmark> '. 
						'<a rel="bcomment-viewer" href="http://b.hatena.ne.jp/entry/'.$linkNoHttp.
						'" target=_blank class="bookmark-count">
						<img src="http://b.hatena.ne.jp/entry/image/'. $link. '" alt="">
						</a>
						</div>
						<div class=title>
						 <a href='. $link. ' target=_blank>'. $title. '</a>
						</div> 
						<div class=thumbnail>'. $thumbnail.	'</div>
					</div>
					<div class=date>'. $date. '</div>
					</div>';				          

							
				}

				
				echo  $contents =  
				'
				<div class=main>
				'. $html .'</div>';	
			} else {
				echo 'Nothing';
			}		
			
		}
						public function outResult(){
					echo $this->result;	
				}

	}
} catch (PDOException $e){
  echo 'エラー : ' . $e->getMessage();
}
?>












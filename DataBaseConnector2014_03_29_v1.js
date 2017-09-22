/* こんふぃぐ
 *
 */
if ( typeof debug === 'undefined')
	debug = true;
var WikiURL = "http://www55.atwiki.jp/aiwar/pages/";
var tips = new Array();
console.log("loaded database connnector");
/* onLoad時に実行
 * URLを判別してディレクトリ構成を解析、該当する関数を起動する
 */
function run() {
	var title = $("div#header p").text();
	var PageNames = title.split(" > ");
	
	if(PageNames[0] == "Units"){
		makeDiscreteUnitTable(PageNames[2]);
	}


};
//　個別ページで実行する関数。セレクター表とユニット表の出力関数を呼んでいる。
function makeDiscreteUnitTable(Group) {
	var TargetArea = $("#wikibody h2:first");
	var html="";
	var data = callback();
	var UnitGroup = new Array();
	var endGroup = false;
	
	loadToolTips();

	/* ユニットのデータシートから該当するユニットの初めを表示
	 * 同時に該当するユニットグループのみの配列を作る
	 * 該当しないユニットが現れたら配列作成処理を打ち切って実際に表を出力する
	 */
	for(var i = 0; data.length > i ; i++){
		if(data[i].Group == Group){
			endGroup =true;
			UnitGroup.push(data[i]);
		}else if(endGroup){
			break;
		}
	}
	TargetArea
		.after("<div id='toolTip'></div>")
		.after("<table id='UnitTable' class='table'></table>")
		.after("<table id='tableSelector'></table><br>");
		outputTable(UnitGroup[0]);
		outputUnitSelector(UnitGroup);
}

//　渡された１ユニットの配列からユニット表を作成する
function outputTable(Unit){
	var TargetTable = $("#UnitTable");
	var html="";
	
	
	//文字列を分割してキーワード化して再結合する
	//inputLineの中にkey, Array keywarods を入れると outputLine[key]に加工された文字列が入っている
	var splitWards = {
		inputLine:{
			Ability: Unit.Ability.split("　"),
			Immunity: Unit.Immunities.split("　"),
			Memo: Unit.Memo.split("　")
		},
		outputLine: new Array()
	};	
	$.each(splitWards.inputLine,function(keywards){
		splitWards.outputLine[keywards] = "";
		this.forEach(function(e){
			var coreStr = e;
			if(e.indexOf("(") != -1){
				 coreStr = e.substr(0,e.indexOf("("));
			}
			splitWards.outputLine[keywards]
				+= "<span class='keywards' data-keyward='" + coreStr + "'>" + e + "</span>　";
		});
	});	
	
	html += '<table class="table">\n';
	html += "<tbody>\n";
	html += "<tr><th colspan='4' class='UnitName'>" + Unit.Name + "</th>\n";
	html += "<td class='head'>生産上限</td><td class='value'>" +Unit.ShipCap + "</td>\n";
	html += "<td class='head'>移動速度</td><td class='value'>" +Unit.MoveSpeed + "</td></tr>\n\n";

	html +=	"<tr><td class='head'>メタル</td><td class='value'>" +Unit.Metal +"</td>\n";
	html += "<td class='head'>-</td><td class='value'>" +"-" + "</td>\n";
	html += "<td class='head'>製造時間</td><td class='value'>" +Unit.BuildTime +"</td>\n";
	html += "<td class='head'>エネルギー</td><td class='value'>" +Unit.Energy + "</td></tr>\n";

	html += "<tr><td class='head'>攻撃属性</td><td class='value'>" + Unit.AmmoType +"</td>\n";
	html += "<td class='head'>攻撃力</td><td class='value'>" +Unit.Damage;
	if(parseInt(Unit.Number) > 1){
		html += " x" + Unit.Number;
	}
	html += "</td>\n";
	html += "<td class='head'>攻撃間隔</td><td class='value'>" + Unit.Reload+"</td>\n";
	html += "<td class='head'>射程</td><td class='value'>" +Unit.Range +"</td></tr>\n";

	html += "<tr><td class='head'>装甲属性 </td><td class='value'>" + Unit.Hull+"</td>\n";
	html += "<td class='head'>防御力</td><td class='value'>" +Unit.Armor + "</td>\n";
	html += "<td class='head'>耐久度</td><td class='value'>" +Unit.Health +"</td>\n";
	html += "<td class='head'>エンジン耐久</td><td class='value'>" +Unit.Engine  +"</td></tr>\n";

	html += "<tr><td class='head'>攻撃力倍率</td><td colspan='7' class='longvalue'>" + Unit.BonusType +"</td></tr>\n";
	html += "<tr><td class='head'>特殊能力</td><td colspan='7' class='longvalue'>" + splitWards.outputLine["Ability"] +"</td></tr>\n";
	html += "<tr><td class='head'>無効化</td><td colspan='7' class='longvalue'>" + splitWards.outputLine["Immunity"] +"</td></tr>\n";
	
	html += "<tr><td class='head'>備考</td><td colspan='7' class='longvalue'>" + splitWards.outputLine["Memo"] +"</td></tr>\n";	


	html += "</tbody>\n";
	html += "</table>\n <br clear='both'>\n";
	$(TargetTable).html(html);
	wardWrap();
}

function outputUnitSelector(UnitGroup){
	var selectorArea = $("#tableSelector");
	var selectorHTML ="<tr class='selectorhead'><td>グループ</td><td colspan='5'>ランク</td>";

	//サブグループの数を数える
	var numSubGroup = 0;	
	for(var i =0; UnitGroup.length >i; i++){
		if((typeof(UnitGroup[i-1]) === "undefined") ||(UnitGroup[i].SubGroup != UnitGroup[i-1].SubGroup)){
			numSubGroup++;
		}
	}
	//サブグループの数だけセレクタ表の行を作り、その中のランクに応じてボタンを配置
	for(var i=0, j =0; numSubGroup>j; j++){
		if(UnitGroup[i].Type == ""){
			UnitGroup[i].Type = "normal";
		}

		selectorHTML += "</tr><tr class='"+UnitGroup[i].Type +"'><td>" + UnitGroup[i].SubGroup +"</td>";

		for(var h =1; 5>=h; h++){
			selectorHTML +="<td class='buttoncell'>";
			if((typeof(UnitGroup[i]) != "undefined") && UnitGroup[i].Rank == h){
							selectorHTML += "<button data-SubGroup='" +UnitGroup[i].SubGroup
						 + "' data-Rank='" + UnitGroup[i].Rank + "'>"
						 + UnitGroup[i].Rank + "</button>";
						 i++;
			}
			selectorHTML +="</td>";
			
		}
	}
	selectorHTML +="</td></tr>";
	selectorArea.html(selectorHTML);
	
	$("#tableSelector button").live("click",function(){
		var SubGroup = $(this).attr("data-SubGroup");
		var Rank = $(this).attr("data-Rank");
		for(i = 0; UnitGroup.length >i; i++){
			if(UnitGroup[i].SubGroup == SubGroup && UnitGroup[i].Rank == Rank){
				outputTable(UnitGroup[i]);
			} 
		}
	});	
}


function wardWrap() {
	$(".longvalue").each(function(){
		var tdWidth = 680;//this.offsetWidth;
		var sumWidth = 0;
		$(this).find("span.keywards").each(function() {
		
			if(typeof tips[$(this).attr("data-keyward")] != "undefined"){
				$(this).addClass("hasTips");
			}
			
			sumWidth += this.offsetWidth + 10;
			if(tdWidth < sumWidth){
				$(this).before("<br>");
				sumWidth = this.offsetWidth;
			}
			
		});
		
	});
}

/*　ToolTips
 *
 */
function loadToolTips() {
	rowTips = getTips();
	rowTips.forEach(function(e){
		tips[e.keywords] = {
			desc:e.tips,
			eng: e.eng
			};
	});

	$("span.keywards").live({
		mouseenter:
		function(e){
			showToolTips(this,e);
		},
		mouseleave:function(){
			$("div#toolTip").css("visibility","hidden");
		}
	});
}

function showToolTips(e,event){
	var keyward = $(e).attr("data-keyward");
	if(typeof tips[keyward] != "undefined"){

		var toolTipArea = $("div#toolTip");
		var HTML = "<span class='tipsTitle'>" + keyward + "</span><br>\n"
			 + "(<span class='tipsEngTitle'>" +tips[keyward].eng +"</span>)<br>\n"
			 + tips[keyward].desc;
		toolTipArea.html(HTML);
		toolTipArea.css("visibility","visible");
		toolTipArea.css("top",event.screenY+20);
	}
}



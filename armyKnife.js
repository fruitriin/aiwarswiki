/*
 * シンタックスエラーチェッカ
 * 使う場合にはまず呼び出すスクリプト内で loaadCompleat.use = trueにし、
 * チェックしたいスクリプトは呼び出す script タグに class ="userScript" を付け加える。
 * そしてそのスクリプト内でそのスクリプトの呼び出しファイルパスを　loadCompleat.scriptsPath.push()する。
 *
 * 呼び出しに失敗しているとアラートで失敗したスクリプトのファイルパスが出力される
 */
var loadCompleat = new Object();
loadCompleat.scriptsPath = new Array();
loadCompleat.scriptsPath.push("http://fruitriin.sakura.ne.jp/armyKnife.js");

$(function() {
    if ( typeof loadCompleat.use === undefined)
        loadCompleat.use = false;
    if (loadCompleat.use) {

        //読み込む予定のスクリプト一覧を取得
        var loadScripts = new Array();
        var scripts = $("script[src][class='userScript']");
        scripts.each(function() {
            loadScripts.push($(this).attr("src"));
        });

        //候補と実際に読み込まれたスクリプトの比較
        loadScripts.forEach(function(element, index, array) {
            if ($.inArray(element, loadCompleat.scriptsPath) < 0) {
                alert("Error:スクリプト読み込み失敗" + element);
            }
        });
    }
});

/*
 * 変数の中身がundefindならデフォルトの値を代入する関数
 * 第一引数　チェック対象　第二引数　デフォルト値　
 * 返り値はチェック対象の変数
 * こちらは未宣言の変数に対して使うと返り値もundefinedになるので注意。
 *
 * if(typeof a === 'undefind') a = value;　だと未定義の場合でも動作する
 */

function defVar(e, v) {
    if ( typeof e === "undefined") {
        e = v;
    }
    return e;
}

/*
 * 第一引数の文字列の任意の位置に第二引数以降の文字列を埋め込む低級な関数
 * 第二引数以降がメインの文字列に埋め込める回数は1回のみ
 * 第一引数がundefinedの場合はその旨と第二引数以降の値が文字列で返される
 */
function printf() {
    var str = arguments[0];
    if ( typeof str === 'undefined') {
        str += " or Error(";
        for (var i = 1; arguments.length > i; i++) {
            str += "$" + i + ":" + arguments[i];
        }
        str += ")";
        return str;
    }

    for (var i = 1; arguments.length > i; i++) {
        str = str.replace("$" + i, arguments[i]);
    }
    return str;
}

/*
 * Firebugのコンソール出力、復数の引数をとる場合連結して出力される
 */
function echo() {
    if (arguments.length == 1) {
        console.log(arguments[0]);
        return;
    }

    var str;
    for (var i = 0; arguments.length > i; i++) {
        str += arguments[i];
    }
    console.log(str);

}


function isNumber( _str,isInt,max,min )
{
        var str,num;
        str = String(_str);
        if( isNaN( str ) )return false;
        num = eval( str );
        if( isInt==null )return true;
        else if( isInt )if( num!=parseInt(num) )return false;
        if( max==null )return true;
        max = String(max).toLowerCase();
        if( max!="false" || max=="0" )if( num > eval(max) )return false;
        if( min==null )return true;
        min = String(min).toLowerCase();
        if( min!="false" || min=="0" )if( num < eval(min) )return false;
        return true;
}

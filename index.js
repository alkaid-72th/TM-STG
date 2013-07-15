/**
 * 縦STG for tmlib.js0.1.7
 *
 * The MIT License
 * 
 Copyright (c) 2013 alkaid_72th

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
*/



/*
 * 画像を連想配列で定義
 * @title:タイトル画面の画像
 * @player:自機の画像
 */
var ASSETS = {
    "title": "http://jsrun.it/assets/q/m/g/C/qmgCV.png",
    "player": "http://jsrun.it/assets/f/L/f/5/fLf5s.gif"
};

/*
 * 定数
 * @SCREEN_WIDTH : 画面の幅
 * @SCREEN_HEIGHT : 画面の高さ 
 */
var SCREEN_WIDTH = 320;
var SCREEN_HEIGHT = 320;

/*
 * グローバル変数
 * @app : ゲーム全体を指す
 * @p_bullet : 自機の弾をcanvas要素で保持
 * @p_locus : 自機の軌道を表わす為のモノをcanvas要素で保持
 */
var app, p_bullet, p_locus;

/*
 * プリロード
 *　canvas要素で描画したものを先に読み込んでおく
 */
tm.preload(function(){
    //自弾の描画
    var c = tm.graphics.Canvas();
    c.resize(12, 16);
    c.fillStyle = "hsl({0}, 80%, 50%)".format(360 / 30 * 18);
    c.fillTriangle(6, 0, 6, 8, 0, 16);
    c.fillTriangle(6, 0, 6, 8, 12, 16);
    p_bullet = c;
    //自機の軌跡
    var d = tm.graphics.Canvas();
    d.resize(12, 16);
    d.fillStyle = "hsl({0}, 80%, 50%)".format(360 / 30 * 4);
    d.fillTriangle(6, 0, 6, 8, 0, 16);
    d.fillTriangle(6, 0, 6, 8, 12, 16);
    p_locus = d;
});

/*
 * ゲームのメインクラス
 */
tm.main(function(){
    app = tm.app.CanvasApp("#world");
    app.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
    app.fitWindow();
    //ローディング画面を定義する
    var loading = tm.app.LoadingScene({
        assets: ASSETS,
        nextScene: TitleScene,
    });
    app.replaceScene(loading);//ローディング画面呼び出し
    app.run();//実行
});

/*
 * タイトル画面クラス
 */
var TitleScene = tm.createClass({
    superClass: tm.app.Scene,
    init: function(){
        this.superInit();
        //タイトル画面を生成
        var image = tm.app.Sprite("title", SCREEN_WIDTH, SCREEN_HEIGHT).addChildTo(this);
        image.originX = 0;//x座標値を変更
        image.originY = 0;//ｙ座標値を変更
        //メニューボタンを生成
        for(var i = 0; i < 3; i++){
            this.menu = MenuButton(i, 160, i).addChildTo(this);
        }
    }
});

/*
 * メニューボタンクラス
 * 引数 : メニューの番号, 描画するｘ座標, 描画するｙ座標
 * onpointingend : 押し終わったら実行する
 */
var MenuButton = tm.createClass({
    superClass: tm.app.LabelButton,
    init: function(menu_num, x, y){
        if(menu_num === 0){
            this.superInit("GameStart");
        }else if(menu_num === 1){
            this.superInit("HowToPlay");
        }else if(menu_num === 2){
            this.superInit("Config");
        }else{
            alert("MenuButton_init error");
            this.superInit("null");
        }
        this.menu_num = menu_num;
        this.width = SCREEN_WIDTH;
        this.height = 40;
        this.fontSize = 30;
        this.x = x;
        this.y = SCREEN_HEIGHT / 12 * 8 + (this.height + 2) * menu_num;
    },
    onpointingend: function(){
        if(this.menu_num === 0){
            app.replaceScene(GameScene());
        }else if(this.menu_num === 1){
            app.replaceScene(HowToPlayScene());
        }else if(this.menu_num === 2){
            app.replaceScene(ConfigScene());
        }
    }
});

/*
 * ゲーム画面クラス
 */
var GameScene = tm.createClass({
    superClass: tm.app.Scene,
    init: function(){
        this.superInit();
        //ラベルを生成する
        this.label = tm.app.Label("ゲーム画面");
        this.label.setPosition(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
        this.label.setAlign("center").setBaseline("middle");
        this.addChild(this.label);
        //自機を生成する
        this.player = Player().addChildTo(this);
    },
});

/*
 * 操作説明画面クラス
 */
var HowToPlayScene = tm.createClass({
    superClass: tm.app.Scene,
    init: function(){
        this.superInit();
        var label = tm.app.Label("HowToPlayScene-未実装-");
        label.setPosition(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
        label.setAlign("center").setBaseline("middle");
        this.addChild(label);
    },
    onpointingend: function(){app.replaceScene(TitleScene());}
});

/*
 * コンフィグ画面クラス
 */
var ConfigScene = tm.createClass({
    superClass: tm.app.Scene,
    init: function(){
        this.superInit();
        var label = tm.app.Label("Config-未実装-");
        label.setPosition(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
        label.setAlign("center").setBaseline("middle");
        this.addChild(label);
    },
    onpointingend: function(){app.replaceScene(TitleScene());}
});

/*
 * 自機クラス
 * move : 移動メソッド
 * update : 定期更新メソッド
 */
var Player = tm.createClass({
    superClass: tm.app.AnimationSprite,
    init: function(){
        //アニメーションを作成する
        this.ss = tm.asset.SpriteSheet({
            "image": "player",
            "frame": {
                "width": 34,
                "height": 32,
                "count":6
            },
            "animations": {
                 "stop": {
                    frames: [0,0],
                    next: "stop",
                    frequency: 4,
                },
                "moveRight1": {
                    frames: [0, 2, 2, 3],
                    next: "moveRight2",
                    frequency: 4,
                },
                "moveRight2": {
                    frames: [3, 3, 3, 3],
                    next: "moveRight2",
                    frequency: 4,
                },
                "moveLeft1": {
                    frames: [0, 4, 4, 5],
                    next: "moveLeft2",
                    frequency: 4,
                },
                "moveLeft2": {
                    frames: [5, 5, 5, 5],
                    next: "moveLeft2",
                    frequency: 4,
                },
            }
        });
        this.superInit(this.ss, 34, 32);
        this.position.set(160, 160);//初期位置
        this.tick = 0;//更新回数
    },
    move: function(first_X, first_Y, second_X, second_Y){
        //タッチスライドの大きさから仮の移動量を算出
        this.fx = (second_X - first_X) / 15;
        this.fy = (second_Y - first_Y) / 10;
        //移動量を是正する
        if(this.x + this.fx < this.width / 2 || this.x + this.fx > SCREEN_WIDTH - this.width / 2){
            this.fx = 0;
        }
        if(this.y + this.fy < this.height / 2 || this.y + this.fy > SCREEN_HEIGHT - this.height / 2){
            this.fy = 0;
        }
        //移動アニメーション
        if(this.direction === 0 || this.direction * this.fx < 0){
            //もし止まっている or this.directionとthis.fxの符号が違うなら
            if(this.fx > 0){
                this.direction = 1;
                this.gotoAndPlay("moveRight1");
            }else if(this.fx < 0){
                this.direction = -1;
                this.gotoAndPlay("moveLeft1");
            }else{
                this.gotoAndPlay("stop");
            }
        }else{
            if(this.fx > 0){
                this.gotoAndPlay("moveRight2");
            }else{
                this.gotoAndPlay("moveLeft2");
            }
        }
        //移動量を実際の座標に加算する
        this.x += this.fx;
        this.y += this.fy;
        if(this.fy <= 0){
            //自機の軌跡を描画する
            var playerLocus = PlayerLocus();
            playerLocus.setPosition(this.x, this.y + this.height / 2);
            app.currentScene.addChild(playerLocus);
        }
    },
    update: function(app){
        var p = app.pointing;//タッチされている座標の取得
        if(p.getPointingStart()){
            //画面がタッチされ始めた時、タッチスライドを始めた座標を記録する
            this.init_X = p.x;
            this.init_Y = p.y;
        }else if(p.getPointing()){
            //画面がタッチされ続けている時
            //引数（タッチスライドを始めたx座標とy座標, 現在タッチしているｘ座標とy座標)
            this.move(this.init_X, this.init_Y, p.x, p.y);//移動する
            if(this.tick % 10 === 0){
                //自機の更新が10回される毎に
                //引数（x座標, y座標, 発射角度, 発射角度範囲, 角速度, 速度, 加速度, 弾数)
                nWayPlyerBullet(this.x, (this.y - this.height / 2), 0, 10, 0, 1, 1, 3);//n-Way弾を打つ関数(弾数は奇数で)
            }
        }else{
            //画面がタッチされていない時
            this.direction = 0;//移動してる方向
            this.gotoAndPlay("stop");//実行するアニメーションの種類を指定
        }
        this.tick++;//更新回数をカウントする
    }
});

/*
 * 自機の弾クラス-改良ver.-
 * move : 移動メソッド
 * hitTest : 衝突判定メソッド
 * extinction : 消滅メソッド
 * update : 定期更新メソッド
 */
var PlayerBullet = tm.createClass({
    superClass: tm.app.Sprite,
    init: function(angle, angle_rate, speed, speed_rate){
        //コンストラクタ(引数：角度, 角速度, 速度, 加速度)
        this.superInit(p_bullet, 12, 16);
        this.blendMode = "lighter";
        //プロパティ
        this.rotation = angle;//角度
        this.angle_rate = angle_rate;//角速度
        this.speed = speed;//速度
        this.speed_rate = speed_rate;//加速度
    },
    move: function(){
        this.rad = this.rotation * (Math.PI / 180);//角度を変換(度 → ラジアン)
        this.x -= this.speed * Math.sin(this.rad);//x座標を増減させる
        this.y -= this.speed * Math.cos(this.rad);//y座標を増減させる
        this.rotation += this.angle_rate;//角度を増減させる
        this.speed += this.speed_rate;//速度を増減させる
    },
    hitTest: function(){
        var width_max = SCREEN_WIDTH - this.width  / 2;//右端
        var height_max =  SCREEN_HEIGHT - this.height  / 2;//左端
        if(this.x < 0 || this.x > width_max || this.y < 0 || this.y > height_max){
            //ゲーム画面外を出たら
            this.extinction();
        }
    },
    extinction: function(){
        this.remove();
    },
    update: function(){
        this.hitTest();//衝突判定
        this.move();//移動処理
    }
});

/*
 * 自機の軌跡クラス
 * move : 移動メソッド
 * extinction : 消滅メソッド
 * update : 定期更新メソッド
 */
var PlayerLocus = tm.createClass({
    superClass: tm.app.Sprite,
    init: function(){
        this.superInit(p_locus, 12, 16);
        this.blendMode = "lighter";
    },
    move: function(){
        (this.y + 1 > SCREEN_HEIGHT + this.height / 2)? this.extinction() : this.y += 1;//ｙ座標
        (this.alpha < 0.1)? this.extinction() : this.alpha -= 0.2;//透明度
    },
    extinction: function(){
        this.remove();
    },
    update: function(){
        this.move();
    }
});

/*
 * N-Way弾を生成する関数
 * 引数 : x座標, y座標, 発射角度, 発射角度範囲, 角速度, 速度, 加速度, 弾数
 */
function nWayPlyerBullet(x, y, angle, angle_range, angle_rate, speed, speed_rate, count){
    if(count > 1){
        //弾数1以上の場合
        for(var i=0; i < count; i++){
            var angles = angle  + angle_range * (i / (count - 1) - 0.5);//角度を変化させる
            //引数（発射角度, 角速度, 速度, 加速度)
            var nWay_P_B = PlayerBullet(angles, angle_rate, speed, speed_rate);//自機の弾を生成
            nWay_P_B.setPosition(x, y);//座標を設定
            app.currentScene.addChild(nWay_P_B);
        }
    }else if(count === 1){
        //弾数1の場合
        var nWay_P_B = PlayerBullet(angle , angle_rate, speed, speed_rate);//自機の弾を生成(引数 :発射角度, 角速度, 速度, 加速度)
        nWay_P_B.setPosition(x, y);//座標を設定
        app.currentScene.addChild(nWay_P_B);
    }
}






// ./app.js

var host = "http://nt1.me:5000"

function getCook(cookiename) {
    // Get name followed by anything except a semicolon
    var cookiestring = RegExp("" + cookiename + "[^;]+").exec(document.cookie);
    // Return everything after the equal sign, or an empty string if the cookie name not found
    return decodeURIComponent(!!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : "");
}


new Vue({
    el: '#app',
    data: {
        sid: getCook("sid"),
        resultQuest: [],
        resultChar: [],
        resultUzu: [],
        resultGacha: [],
        resultGachaInfo: [],
        msg: "",
    },
    methods: {
        login() {
            {
                var uid = document.getElementById("uid").value;
                console.log("uid = " + uid);
                axios
                    .get(host + '/login', { params: { uid: uid } })
                    .then(response => {
                        this.sid = response.data.data;
                        if (this.sid){
                            document.cookie = "sid=" + this.sid;
                            console.log("sid = " + this.sid);
                        }else{
                            window.alert(response.data.error_code);
                        }                        
                    })
                    .catch(function (error) {
                        console.log(error);
                        window.alert(response.data.error_code);
                    });
            }
        },
        gachaInfo() {
            {                
                var sid = document.getElementById("sid").textContent;
                console.log("sid = " + sid);
                axios
                    .get(host + '/events', { params: { sid: sid } })
                    .then(response => {
                        this.resultGachaInfo = response.data.data;
                        console.log(response.data.data);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        },
        statuz() {
            {
                this.msg = "查詢中...";
                var sid = document.getElementById("sid").textContent;
                if (sid === "") {
                    this.msg = "請先登入";
                    return;
                }
                console.log("sid = " + sid);
                axios
                    .get(host + '/status', { params: { sid: sid } })
                    .then(response => {
                        var data = JSON.stringify(response.data.data, null, 4)
                        console.log(data);
                        this.msg = data;
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        },
        queryQuest(){
            console.log("enter queryQuest()")
            var questName = document.getElementById("queryText").value;
            console.log("Quest name to query = " + questName)
            axios.get(host + "/query_quest", { params: { name: questName}})
                .then(response => { 
                    console.log(response.data.data)
                    this.resultQuest = response.data.data;
                })
        },
        playQuest(qtype, qid) {
            var sid = document.getElementById("sid").textContent;
            if (sid==""){
                window.alert("請先登入");
                return;
            }
            console.log("enter playQuest(), questID = " + qid);            
            axios.get(host + "/play_quest", { params: {
                sid: sid,
                qtype: qtype,
                qid: qid,
                pt: 0
            } })
                .then(response => {
                    console.log(response.data.status);
                    if (response.data.status != 200){
                        window.alert("failed");
                    }else{
                        window.alert(response.data.message);
                    }
                }).catch(function (error) {
                    window.alert(error);
                });
        },
        queryChar() {
            console.log("enter queryChar()")
            var char = document.getElementById("queryText").value;
            console.log("Quest name to query = " + char)
            axios.get(host + "/char", { params: { name: char } })
                .then(response => {
                    console.log(response.data.data)
                    this.resultChar = response.data.data;
                })
        },
        queryUzu() {
            console.log("enter queryUzu()")
            axios.get(host + "/query_uzu")
                .then(response => {
                    console.log(response.data.data)
                    this.resultUzu = response.data.data;
                })
        },
        playUzu(scid, uzid) {
            var sid = document.getElementById("sid").textContent;
            if (sid == "") {
                window.alert("請先登入");
                return;
            }
            axios.get(host + "/play_uzu", {
                params: {
                    sid: sid,
                    uzid: uzid,
                    scid: scid,
                }
            })
                .then(response => {
                    console.log(response.data.status);
                    if (response.data.status != 200) {
                        window.alert("failed");
                    } else {
                        window.alert(response.data.message);
                    }
                }).catch(function (error) {
                    window.alert(error);
                });
        },
        gacha(gachaID, gachaCount) {
            var sid = document.getElementById("sid").textContent;
            // var gachaID = document.getElementById("gachaID").value;
            // var gachaCount = document.getElementById("gachaCount").value;
            console.log(gachaID, gachaCount);
            if (sid == "") {
                window.alert("請先登入");
                return;
            }
            console.log(sid, gachaID, gachaCount);
            var tempResult = [];
            // for (index = 0; index < gachaBatch; index++) {                
            axios.get(host + "/gacha", {
                params: {
                    sid: sid,
                    gacha_id: gachaID,
                    gacha_count: gachaCount,
                }
            })
                .then(response => {
                    console.log(response.data.status);
                    if (response.data.status != 200) {
                        window.alert("failed");
                        console.log(response.data);
                    } else {
                        // console.log(response.data.data[0].Name);
                        // tempResult.push(response.data.data);
                        this.resultGacha = response.data.data;
                        var result = "";
                        for (idx = 0; idx < response.data.data.length ; idx ++){
                            tmpResult = response.data.data[idx];
                            result = result + tmpResult.Rarity + ": " + tmpResult.Title + tmpResult.Name + "\n";
                        }
                        window.alert(result);
                    }
                }).catch(function (error) {
                    window.alert(error);
                });
                // console.log(tempResult);
                // this.resultGacha = tempResult;
            // }
        },
        queryGachaInfo() {
            console.log("enter queryGachaInfo()")
            var sid = document.getElementById("sid").textContent;
            if (sid == "") {
                window.alert("請先登入");
                return;
            }
            axios.get(host + "/events", {
                params: {
                    sid: sid,
                }
            }).then(response => {
                console.log(response.data.data)
                this.resultGachaInfo = response.data.data;
            })
        },
        prompt() {
            var sid = document.getElementById("sid").textContent;
            this.msg = sid;
            console.log(sid);
        },
        prompt2() {
            this.msg = '快來看這裡！我是新訊息2！';
        }
    }
});

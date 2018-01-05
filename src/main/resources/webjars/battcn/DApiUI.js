(function ($) {
    //初始化类
    var DApiUI = {};
    DApiUI.init = function () {
        $.ajax({
            url: "swagger-resources",
            dataType: "json",
            type: "get",
            async: false,
            success: function (data) {
                DApiUI.dli = $('<select class="form-control"></select>');
                DApiUI.dli.on("change", '', function () {
                    DApiUI.paging(data);
                });
                for (var i = 0; i < data.length; i++) {
                    var el = $('<option value="' + data[i].location + '" order=' + i + '>' + data[i].name + '(' + data[i].location + ')</option>');
                    DApiUI.dli.append(el);
                }
                var menu = data[0];
                $.ajax({
                    url: encodeURI(menu.location),
                    dataType: "json",
                    type: "get",
                    async: false,
                    success: function (data) {
                        var menu = data;
                        /*  判断是否必须 */
                        console.info(menu);
                        DApiUI.definitions(menu);
                        DApiUI.createDescription(menu);
                        DApiUI.initTreeMenu(menu);
                        DApiUI.eachPath(menu);
                    }
                })
            }
            //}
        });
    };
    /***
     *   根据单选框选择获取接口
     *
     */
    DApiUI.paging = function (data) {
        var menu = data[parseInt($(".bycdao-left .form-control").children('option:selected').attr('order'))];
        $.ajax({
            url: encodeURI(menu.location),
            dataType: "json",
            type: "get",
            async: false,
            success: function (data) {
                var menu = data;
                $(".bycdao-category").html("");
                $(".bycdao-category").append('<ul class="nav nav-list"><li><a href="javascript:" style="cursor:default;">接口</a></li></ul>');
                /*  判断是否必须 */
                console.info(menu);
                DApiUI.definitions(menu);
                //   DApiUI.createDescription(menu);
                DApiUI.initTreeMenu(menu);
                DApiUI.eachPath(menu);
            }
        });
        DApiUI.dli.on("change", '', function () {
            DApiUI.paging(data);
        });

    };
    /***
     * 创建面板
     */
    DApiUI.creatabTab = function (url) {
        var tabIndexLi = $(".bycdao-header #tabIndex >li");
        /* 遍历判断当前已经存在的tab页中是否有当前点击的url */
        for (var i = 0, n = tabIndexLi.size(); i < n; i++) {
            if (tabIndexLi.eq(i).find("a").text() == url) {
                return i;
            }
        }
        /* 增加选项卡 */
        var i = tabIndexLi.size() + 1;
        $(".bycdao-header #tabIndex").append('<li class="tabIndex' + i + '"><a href="#tabIndex' + i + '" data-toggle="tab">' + url + '</a><b></b></li>');

        var tabsContainer = $('<div id="tabIndex' + i + '" class="tabs-container tab-pane active" style="width:99%;margin:0 auto;"></div>');
        var ul = $('<ul class="nav nav-tabs" style="position:fixed;z-index:99;top:64px;"></ul>');
        ul.append($('<li><a data-toggle="tab" href="#tab' + i + '" aria-expanded="false"> 接口说明</a></li>'));
        ul.append($('<li class=""><a data-toggle="tab" href="#tabTwo' + i + '" aria-expanded="true"> 在线调试</a></li>'));
        tabsContainer.append(ul);
        var tabContent = $('<div style="margin-top: 35px;" class="tab-content"></div>');

        tabContent.append($('<div id="tab' + i + '" class="tab-pane"><div class="panel-body"><strong>接口详细说明</strong><p>Bootstrap 使用到的某些 HTML 元素和 CSS 属性需要将页面设置为 HTML5 文档类型。在你项目中的每个页面都要参照下面的格式进行设置。</p></div></div>'));
        tabContent.append($('<div id="tabTwo' + i + '" class="tab-pane"><div class="panel-body"><strong>正在开发中,敬请期待......</strong></div></div>'));
        tabsContainer.append(tabContent);
        //内容覆盖
        DApiUI.getDoc().append(tabsContainer);
        DApiUI.getDoc().find("#tabIndex" + i + " a:first").tab('show');
        /* 返回 当前接口div容器的id,当前接口的顺序号码，从1开始 */
        return ["tabIndex" + i, i];
    };

    /***
     * 检查对象属性,in并赋予默认值
     * @param obj
     * @param key
     * @param defaultValue
     * @param checkEmpty
     * @returns {*}
     */
    DApiUI.getValue = function (obj, key, defaultValue, checkEmpty) {
        var val = defaultValue;
        if (obj !== null && obj !== undefined) {
            if (obj.hasOwnProperty(key)) {
                val = obj[key];
                if (checkEmpty) {
                    if (val === null || val === "") {
                        val = defaultValue;
                    }
                }
            }
        }
        return val;
    };


    /***
     * 创建简介table页面,初始化
     * @param menu
     */
    DApiUI.createDescription = function (menu) {
        var table = $('<table class="table table-hover table-bordered table-text-center"></table>');
        var title = "", description = "", name = "", version = "", termsOfService = "";
        var host = DApiUI.getValue(menu, "host", "", true);
        if (menu.hasOwnProperty("info")) {
            var info = menu.info;
            title = DApiUI.getValue(info, "title", "Swagger-Bootstrap-UI-接口文档", true);
            description = DApiUI.getValue(info, "description", "", true);
            if (info.hasOwnProperty("contact")) {
                var contact = info["contact"];
                name = DApiUI.getValue(contact, "name", "", true);
            }
            version = DApiUI.getValue(info, "version", "", true);
            termsOfService = DApiUI.getValue(info, "termsOfService", "", true);
        }
        //修改title
        $("title").html("").html(title);
        table.append($('<thead><tr><th colspan="2" style="text-align:center">' + title + '</th></tr></thead>'));
        var tbody = $('<tbody></tbody>');
        tbody.append($('<tr><th class="active">简介</th><td style="text-align: left">' + description + '</td></tr>'));
        tbody.append($('<tr><th class="active">作者</th><td style="text-align: left">' + name + '</td></tr>'));
        tbody.append($('<tr><th class="active">版本</th><td style="text-align: left">' + version + '</td></tr>'));
        tbody.append($('<tr><th class="active">host</th><td style="text-align: left">' + host + '</td></tr>'));
        tbody.append($('<tr><th class="active">服务url</th><td style="text-align: left">' + termsOfService + '</td></tr>'));
        table.append(tbody);
        var div = $('<div  style="width:99%;margin:0 auto;"></div>');
        div.addClass("tab-pane active").attr("id", "home").append(table);
        //内容覆盖
        DApiUI.getDoc().html("");
        //$(".bycdao-header #tabIndex li:eq(0) a").tab('show');
        DApiUI.getDoc().append(div);
        DApiUI.getDoc().data("data", menu);
    };

    /***
     * 获取菜单结构
     */
    DApiUI.getMenuConstructs = function () {
        return DApiUI.getDoc().data("data");
    };

    DApiUI.toString = function (obj, defaultStr) {
        if (obj !== null && typeof (obj) !== "undefined") {
            return obj.toString();
        }
        if (obj === undefined) {
            return defaultStr;
        }
        return defaultStr;
    };
    /* 返回各种请求类型对应的颜色对象 */
    DApiUI.bgArray = function () {
        return {get: "#c3d9ec", post: "#c3e8d1", delete: "#e8c6c7", patch: "#F5D5C3", put: "#f0e0ca"};
    }
    /***
     * 初始化菜单树
     * @param menu
     */
    DApiUI.initTreeMenu = function (menu) {
        //遍历tags
        var tags = [];
        //简介li
        var dli = DApiUI.dli;
        DApiUI.getMenu().html("");
        DApiUI.getMenu().append(dli);
        var methodApis = DApiUI.eachPath(menu);

        /*  序号排序函数*/
        function sortNumber(c, d) {
            var a = c.name, b = d.name;
            return parseFloat(a.slice(0, a.indexOf(".") + 1) + a.slice(a.indexOf(".") + 1, a.length).replace(/\./g, '')) - parseFloat(b.slice(0, b.indexOf(".") + 1) + b.slice(b.indexOf(".") + 1, b.length).replace(/\./g, ''));
        }

        menu.tags ? menu.tags = menu.tags.sort(sortNumber) : [];
        var sortOrder = {get: 1, post: 2, put: 3, patch: 4, delete: 5};

        /* 请求类型排序函数 */
        function sortType(a, b) {
            return sortOrder[a.methodType.toLowerCase()] - sortOrder[b.methodType.toLowerCase()];
        }

        // var bgArray={get:"#c3d9ec",post:"#c3e8d1",
        //     delete:"#e8c6c7",patch:"#F5D5C3",put:"#f0e0ca"};
        $.each(menu.tags ? menu.tags : [], function (i, tag) {
            var tagInfo = new TagInfo(tag.name, tag.description);
            //查找childrens
            $.each(methodApis, function (i, methodApi) {
                //判断tags是否相同
                if (methodApi.tag === tagInfo.name) {
                    tagInfo.childrens.push(methodApi);
                }
            });
            var len = tagInfo.childrens.length;
            if (len === 0) {
                var li = $('<li ><a href="javascript:void(0)"><i class="icon-text-width"></i><span class="menu-text"> ' + tagInfo.name + ' </span></a></li>');
                DApiUI.getMenu().append(li);
            } else {
                //存在子标签
                var li = $('<li></li>');
                var titleA = $('<a href="#interface' + i + '" data-toggle="tab" style="height:auto;line-height:normal;padding-top: 8px;padding-bottom: 10px;"><i class="icon-file-alt" style="float: left;"></i><span class="menu-text" style="width: 50px;float: left;">' + tagInfo.name + '</span><span style="width:140px;display: inline-block;">' + tagInfo.description + '</span><span class="badge badge-primary " style="right: 30px;">' + len + '</span><b class="arrow icon-angle-right"></b></a>');
                li.append(titleA);
                //循环树
                var ul = $('<ul id="interface' + i + '" class="submenu nav nav-list tab-pane"></ul>');
                i == 0 ? (li.addClass("active") && ul.addClass("active")) : "";
                tagInfo.childrens = tagInfo.childrens.sort(sortType);
                $.each(tagInfo.childrens, function (i, children) {
                    var childrenLi = $('<li class="menuLi"><div class="mhed"><div>' + children.methodType.toUpperCase() + '-<code>' + children.url + '</code></div><div>' + children.summary + '</div></div></li>');
                    childrenLi.data("data", children);
                    DApiUI.bgArray()[children.methodType.toLowerCase()] ? childrenLi.css({"backgroundColor": DApiUI.bgArray()[children.methodType.toLowerCase()]}) : "";
                    ul.append(childrenLi);
                });
                $(".bycdao-category").append(ul);
                DApiUI.getMenu().append(li);
            }
        });
        DApiUI.initLiClick();
    };


    DApiUI.eachPath = function (menu) {
        var paths = menu.paths;
        //paths是object对象,key是api接口地址,aaaaa
        var methodApis = [];
        for (var key in paths) {
            var obj = paths[key];
            //遍历obj,获取api接口访问方式
            //八中方式类型,直接判断
            if (obj.hasOwnProperty("get")) {
                //get方式
                var apiInfo = new ApiInfo(obj["get"]);
                apiInfo.methodType = "get";
                apiInfo.url = key;
                methodApis.push(apiInfo);
            }

            if (obj.hasOwnProperty("post")) {
                //post 方式
                var apiInfo = new ApiInfo(obj["post"]);
                apiInfo.methodType = "post";
                apiInfo.url = key;
                methodApis.push(apiInfo);
            }
            if (obj.hasOwnProperty("put")) {
                //put
                var apiInfo = new ApiInfo(obj["put"]);
                apiInfo.methodType = "put";
                apiInfo.url = key;
                methodApis.push(apiInfo);
            }
            if (obj.hasOwnProperty("delete")) {
                //delete
                var apiInfo = new ApiInfo(obj["delete"]);
                apiInfo.methodType = "delete";
                apiInfo.url = key;
                methodApis.push(apiInfo);
            }
            if (obj.hasOwnProperty("patch")) {
                //delete
                var apiInfo = new ApiInfo(obj["patch"]);
                apiInfo.methodType = "patch";
                apiInfo.url = key;
                methodApis.push(apiInfo);
            }
        }
        return methodApis;

    };

    /***
     * li标签click事件
     */
    DApiUI.initLiClick = function () {
        /*DApiUI.getMenu() */
        $(".bycdao-category").find(".menuLi").bind("click", function (e) {
            e.preventDefault();
            var that = $(this);
            var data = that.data("data");
            //获取parent-Li的class属性值
            var parentLi = that.parent().parent();
            //var className = parentLi.prop("class");
            DApiUI.getMenu().find("li").removeClass("active");
            that.addClass("active");
            var elNema = DApiUI.createApiInfoTable(data);
            elNema ? DApiUI.createDebugTab(data, elNema) : "";
        })
    };
    /* 加载历史数据 */
    // DApiUI.initHistory = function () {
    //     /* 创建页面信息 "apiInfo"，url "url",请求类型 "type",表单对象 "data" */
    //     var historys = JSON.parse(window.sessionStorage.getItem("historys"));
    //     /* data中 包含 url 请求类型 输入框数据 */
    //     if(historys !=undefined &&historys!=null&&historys!="null"){
    //         var historyListUl = $(".bycao-header .historyList").html("");
    //         $.each(historys, function (i, history) {
    //             historyListUl.append('<li data-toggle="tooltip" data-placement="bottom" title="' + history.type.toUpperCase() + "&nbsp;" + history.url + '" index="' + i + '" style="background-color: ' + DApiUI.bgArray()[history.type ? history.type.toLowerCase() : ""] + '">' +
    //                 '<span>' + history.url + '</span>' +
    //                 '<i></i></li>')
    //         });
    //         /* 绑定删除事件 */
    //         $(".bycao-header .historyList li i").on("click", function (e) {
    //             e.stopPropagation();
    //             var historyIndex = JSON.parse(window.sessionStorage.getItem("historys"));
    //             historyIndex.splice(parseInt($(this).parents(".bycao-header .historyList li").attr("index")), 1);
    //             window.sessionStorage.historys = JSON.stringify(historyIndex);
    //             DApiUI.initHistory();
    //         })
    //         /* 绑定切换事件 */
    //         $(".bycao-header .historyList li").on("click", function (e) {
    //             e.stopPropagation();
    //             var historyIndex = JSON.parse(window.sessionStorage.getItem("historys"));
    //             DApiUI.createApiInfoTable(historyIndex[parseInt($(this).attr("index"))].apiinfo);
    //             DApiUI.createDebugTab(historyIndex[$(this).attr("index")].apiinfo);
    //             $("#tab2 #paramBody").html(historyIndex[parseInt($(this).attr("index"))]["data"]);
    //             $("#myTab .nav-tabs>li:nth-child(2) a").trigger("click");
    //         })
    //     }else{
    //         var historyListUl = $(".bycao-header .historyList").html("<span>无请求记录</span>");
    //     }
    //
    //
    // }
    DApiUI.getStringValue = function (obj) {
        var str = "";
        if (typeof (obj) !== 'undefined' && obj !== null) {
            str = obj.toString();
        }
        return str;
    };


    /***
     * 格式化json
     * @param text_value
     */
    function formatterJson(text_value) {
        var res = "";
        for (var i = 0, j = 0, k = 0, ii, ele; i < text_value.length; i++) {//k:缩进，j:""个数
            ele = text_value.charAt(i);
            if (j % 2 === 0 && ele === "}") {
                k--;
                for (ii = 0; ii < k; ii++) ele = "    " + ele;
                ele = "\n" + ele;
            }
            else if (j % 2 === 0 && ele === "{") {
                ele += "\n";
                k++;
                //debugger;
                for (ii = 0; ii < k; ii++) ele += "    ";
            }
            else if (j % 2 === 0 && ele === ",") {
                ele += "\n";
                for (ii = 0; ii < k; ii++) ele += "    ";
            }
            else if (ele === "\"") j++;
            res += ele;
        }
        return res;

    }

    /* 对象拷贝 */
    DApiUI.deepCopy = function (source) {
        var result = {};
        for (var key in source) {
            result[key] = (typeof source[key] === 'object') ? DApiUI.deepCopy(source[key]) : source[key];
        }
        return result;
    }
    /**
     * 创建调试面板
     */
    DApiUI.createDebugTab = function (apiInfo, elName) {
        //方法、请求类型、发送按钮
        var debugContainer = $('<div style="width: 100%;auto;margin: 20px 0 0;"></div>'); //debugHead
        var debugHead = $('<div class="" style="overflow: hidden;height: 35px;margin-bottom: 10px;position: relative;padding-left: 50px;">' +
            '<span style="left: 0;width: 50px;position: absolute;color: #fff;background: #428BCA;text-align: center;height: 100%;line-height: 35px;" class="">' + DApiUI.getStringValue(apiInfo.methodType || apiInfo.methodtype) + '</span>' +
            '<input style="height: 100%;" type="text" id="requestUrl" class="col-md-11 col-lg-11 col-sm-11 col-xs-11" value="' + DApiUI.getStringValue(apiInfo.url) + '" />' +
            '<button style="padding: 0;margin: 0;height: 100%;" id="btnRequest" class="col-md-1 col-lg-1 col-sm-1 col-xs-1 btn btn-default btn-primary " type="button"> 发 送 </button>' +
            '</div>');

        debugContainer.append(debugHead);

        //请求参数
        var debugPanel = $('<div class="panel panel-primary"><div class="panel-heading">请求参数</div></div>');

        var panelContent = $('<div class="panel-body"></div>');
        //是否是文件上传
        var fileform = false;
        //判断是否有请求参数
        if (typeof (apiInfo.parameters) !== 'undefined' && apiInfo.parameters !== null) {
            var table = $('<table class="table table-hover table-bordered table-text-center"></table>');
            var thead = $('<thead><tr><th></th><th>参数名称</th><th>参数值</th><th>操作</th></tr></thead>');
            table.append(thead);
            var tbody = $('<tbody id="paramBody"></tbody>');
            $.each(apiInfo.parameters, function (i, param) {
                var tr = $('<tr></tr>');
                tr.data("data", param);
                //判断 param 的in类型
                var checkbox = $('<td width="5%"><div class="checkbox"><label><input type="checkbox" value="" checked></label></div></td>');
                var key = $('<td width="20%"><input class="form-control p-key"   value="' + param.name + '"/></td>');
                var value = $('<td></td>');

                var val = null;
                if (param["in"] === "body") {
                    tbody.attr("reqtype", "body");
                    val = $('<textarea class="form-control p-value" style="font-size: 16px;" rows="10" data-apiUrl="' + apiInfo.url + '" name="' + param.name + '" data-name="' + param.name + '" placeholder="' + DApiUI.getStringValue(param['description']) + '"></textarea>');
                    //判断是否有schma
                    if (param.hasOwnProperty("schema")) {
                        var schema = param["schema"];
                        var ref = schema["$ref"];
                        var regex = new RegExp("#/definitions/(.*)$", "ig");
                        if (regex.test(ref)) {
                            var refType = RegExp.$1;
                            //这里判断refType是否是MultipartFile类型,如果是该类型,上传组件
                            if (refType === "MultipartFile") {
                                fileform = true;
                                val = $('<input name="' + param.name + '" type="file" class="form-control p-value" data-apiUrl="' + apiInfo.url + '" data-name="' + param.name + '" placeholder="' + DApiUI.getStringValue(param['description']) + '"/>');
                            } else {
                                //find in definitionsArray
                                var definitionsArray = DApiUI.getDoc().data("definitionsArray");
                                var deftion = null;
                                //  var definition=null;
                                for (var i = 0; i < definitionsArray.length; i++) {
                                    // var definition = definitionsArray[i];
                                    if (definitionsArray[i].key === refType) {
                                        deftion = DApiUI.deepCopy(definitionsArray[i].value);
                                        // deftion = definition.value;
                                        break;
                                    }
                                }
                                //遍历proprietary
                                for (var k in deftion) {
                                    // if((typeof deftion[k])=="object"){
                                    //     deftion[k]=true;
                                    // }
                                    if ((typeof deftion[k]) == "boolean") {
                                        deftion[k] = true;
                                        continue;
                                    }
                                    if ((typeof deftion[k]) == "number") {
                                        deftion[k] % 1 === 0 ? deftion[k] = 0 : deftion[k] = 0.0;
                                        continue;
                                    }
                                    if ((typeof deftion[k]) == "string") {
                                        deftion[k] = "";
                                    }

                                }
                                if (deftion !== null) {
                                    //赋值
                                    val.val(formatterJson(JSON.stringify(deftion)));
                                }
                            }
                        }
                    }

                } else {
                    val = $('<input class="form-control p-value" name="' + param.name + '" data-apiUrl="' + apiInfo.url + '" data-name="' + param.name + '" placeholder="' + DApiUI.getStringValue(param['description']) + '"/>');
                    //判断是否有defaultvalue
                    if (param.hasOwnProperty("default")) {
                        var defaultValue = param["default"];
                        val.val(defaultValue);
                    }
                    //这里判断param类型,如果是int类型,只能输入数字
                }
                value.append(val);
                var oper = $('<td width="5%"><button style="border-radius:2px;" class="btn btn-danger btn-circle btn-sm" type="button"><strong>×</strong></button></td>');
                //删除事件
                oper.find("button").on("click", function (e) {
                    e.preventDefault();
                    var that = $(this);
                    that.parent().parent().remove();
                });
                //判断参数类型,针对path参数
                if (param["in"] === "path") {
                    //赋予change事件
                    value.find("input").on("keyup", function () {
                        var t = $(this);
                        var name = t.data("name");
                        var apiUrl = t.attr("data-apiUrl");
                        var realValue = apiUrl.replace("{" + name + "}", t.val());
                        //查找是否还存在其他path参数
                        $("#paramBody").find("tr").each(function (i, itr) {
                            var itrthat = $(this);
                            var itrdata = itrthat.data("data");
                            var itrname = itrdata["name"];
                            if (itrdata["in"] === "path" && itrdata["name"] !== name) {
                                //查找value值
                                var itrtdvalue = itrthat.find(".p-value").val();
                                if (itrtdvalue !== "") {
                                    realValue = realValue.replace("{" + itrname + "}", itrtdvalue);
                                }
                            }
                        });
                        $("#requestUrl").val(realValue);
                    })

                }
                tr.append(checkbox).append(key).append(value).append(oper);
                tbody.append(tr);
            });
            table.append(tbody);
            //如果有文件上传,追加form表单
            if (fileform) {
                var form = $('<form id="uploadForm"  target="uploadIframe" action="' + apiInfo.url + '" type="" enctype="multipart/form-data" method="' + apiInfo.methodType + '"></form>');
                form.append(table);
                panelContent.append(form);
            } else {
                panelContent.append(table);
            }
        } else {
            panelContent.append($('<strong>暂无参数</strong>'));
        }
        debugPanel.append(panelContent);
        //
        if (fileform) {
            //追加iframe
            var resptabframe = $('<div id="resptab" class="tabs-container" ><iframe name="uploadIframe" id="uploadIframe" style="border: none;height: 1%;display: none;"></iframe></div>');
            debugPanel.append(resptabframe);
        }
        debugContainer.append(debugPanel);
        //创建reesponsebody
        var respcleanDiv = $('<div id="responsebody"></div>');
        debugContainer.append(respcleanDiv);


        DApiUI.getDoc().find("#" + elName[0] + " #tabTwo" + elName[1]).find(".panel-body").html("");
        DApiUI.getDoc().find("#" + elName[0] + " #tabTwo" + elName[1]).find(".panel-body").append(debugContainer);


        //发送事件
        debugHead.find("#btnRequest").bind("click", function (e) {
            e.preventDefault();
            respcleanDiv.html("");
            //
            var params = {};
            var headerparams = {};
            var bodyparams = "";

            //增加表单验证
            var validateflag = false;
            var validateobj = {};

            //获取参数
            var paramBody = DApiUI.getDoc().find("#tabTwo" + elName[1]).find("#paramBody");
            //组装请求url
            var url = DApiUI.getStringValue(apiInfo.url);
            var cacheData = DApiUI.getDoc().data("data");
            if (typeof (cacheData.basePath) !== "undefined" && cacheData.basePath !== "") {
                if (cacheData.basePath !== "/") {
                    url = cacheData.basePath + DApiUI.getStringValue(apiInfo.url);
                }
            }

            paramBody.find("tr").each(function () {
                var paramtr = $(this);
                var cked = paramtr.find("td:first").find(":checked").prop("checked");
                if (cked) {
                    //如果选中
                    var trdata = paramtr.data("data");
                    //获取key
                    //var key=paramtr.find("td:eq(1)").find("input").val();
                    var key = trdata["name"];
                    //获取value
                    var value = "";
                    if (trdata["in"] === "body") {
                        value = paramtr.find("td:eq(2)").find("textarea").val();
                        //这里需要判断schema
                        if (trdata.hasOwnProperty("schema")) {
                            var schema = trdata["schema"];
                            if (schema.hasOwnProperty("$ref")) {
                                var ref = schema["$ref"];
                                var regex = new RegExp("#/definitions/(.*)$", "ig");
                                if (regex.test(ref)) {
                                    var refType = RegExp.$1;
                                    //这里判断refType是否是MultipartFile类型,如果是该类型,上传组件
                                    if (refType === "MultipartFile") {
                                        value = (paramtr.find("td:eq(2)").find("input").val() === '') ? null : paramtr.find("td:eq(2)").find("input").val()
                                    }
                                }
                            }
                        }
                    } else {
                        value = (paramtr.find("td:eq(2)").find("input").val() === '') ? null : paramtr.find("td:eq(2)").find("input").val();
                    }
                    //delete方式参数url传递
                    // if (apiInfo.methodType === "delete") {
                    //     //判断是否是path参数
                    //     if (trdata["in"] === "path") {
                    //         url = url.replace("{" + key + "}", value);
                    //     } else {
                    //         if (url.indexOf("?") > -1) {
                    //             url = url + "&" + key + "=" + value;
                    //         } else {
                    //             url += "?" + key + "=" + value;
                    //         }
                    //     }
                    // } else
                    {
                        if (trdata["in"] === "path") {
                            url = url.replace("{" + key + "}", value);
                        } else {
                            if (trdata["in"] === "body") {
                                bodyparams += value;
                            } else {
                                if (trdata["in"] === "header") {
                                    headerparams[key] = value;
                                } else {
                                    value ? params[key] = value : '';
                                }
                            }
                        }
                    }
                    //判断是否required
                    if (trdata.hasOwnProperty("required")) {
                        var required = trdata["required"];
                        if (required) {
                            //必须,验证value是否为空
                            if (value === null || value === "") {
                                validateflag = true;
                                var des = trdata["name"];
                                validateobj = {message: des + "不能为空"};
                                return false;
                            }
                        }

                    }
                }
            });

            var reqdata = null;
            var contType = "application/json; charset=UTF-8";
            if (paramBody.attr("reqtype") !== null && paramBody.attr("reqtype") !== undefined && paramBody.attr("reqtype") === "body") {
                reqdata = bodyparams;
            } else {
                reqdata = params;
                contType = "application/x-www-form-urlencoded; charset=UTF-8";
            }
            if (validateflag) {
                layer.msg(validateobj.message);
                return;
            }
            //判断是否有表单
            var form = $("#uploadForm");
            if (form.length > 0) {
                form[0].submit();
                //iframe监听change事件
                $("#uploadIframe").on("load", function () {
                    $(this).unbind('load');
                    var framebody = $(this).contents().find("body");
                    var ret = framebody.html();
                    //是否存在pre标签
                    if (framebody.find("pre").length > 0) {
                        ret = framebody.find("pre").html();
                    }
                    var res;
                    try {
                        res = JSON.parse(ret);
                        var resptab = $('<div id="resptab" class="tabs-container" ></div>');
                        var ulresp = $('<ul class="nav nav-tabs">' +
                            '<li class=""><a data-toggle="tab" href="#tabresp" aria-expanded="false"> 响应内容 </a></li></ul>');
                        resptab.append(ulresp);
                        var respcontent = $('<div class="tab-content"></div>');
                        var resp1 = $('<div id="tabresp" class="tab-pane active"><div class="panel-body"></div></div>');
                        respcontent.append(resp1);
                        resptab.append(respcontent);
                        respcleanDiv.append(resptab);

                        var jsondiv = $('<div></div>');
                        jsondiv.JSONView(res);
                        resp1.find(".panel-body").append(jsondiv);
                        resptab.find("a:first").tab("show");
                    } catch (err) {
                        //nothing to do,default to show
                        respcleanDiv.html(ret);
                    }
                })
            } else {
                // "/users2/1"
                $.ajax({
                    url: url,
                    headers: headerparams,
                    type: DApiUI.getStringValue(apiInfo.methodType),
                    data: reqdata,
                    contentType: contType,
                    success: function (data, status, xhr) {
                        var resptab = $('<div id="resptab" class="tabs-container" ></div>');
                        var ulresp = $('<ul class="nav nav-tabs">' +
                            '<li class=""><a data-toggle="tab" href="#tabresp' + elName[1] + '" aria-expanded="false"> 响应内容 </a></li>' +
                            '<li class=""><a data-toggle="tab" href="#tabcookie' + elName[1] + '" aria-expanded="true"> Cookies</a></li>' +
                            '<li class=""><a data-toggle="tab" href="#tabheader' + elName[1] + '" aria-expanded="true"> Headers </a></li>' +
                            '<li class=""><a data-toggle="tab" href="#tabcurl' + elName[1] + '" aria-expanded="true"> curl方式 </a></li></ul>');

                        resptab.append(ulresp);
                        var respcontent = $('<div class="tab-content"></div>');

                        var resp1 = $('<div id="tabresp' + elName[1] + '" class="tab-pane active"><div class="panel-body"><pre></pre></div></div>');
                        var resp2 = $('<div id="tabcookie' + elName[1] + '" class="tab-pane "><div class="panel-body">暂无</div>');
                        var resp3 = $('<div id="tabheader' + elName[1] + '" class="tab-pane "><div class="panel-body">暂无</div></div>');
                        var resp4 = $('<div id="tabcurl' + elName[1] + '" class="tab-pane "><div class="panel-body">暂无</div></div>');


                        respcontent.append(resp1).append(resp2).append(resp3).append(resp4);

                        resptab.append(respcontent);

                        respcleanDiv.append(resptab);
                        var headerValu = "";
                        var allheaders = xhr.getAllResponseHeaders();
                        if (allheaders !== null && typeof (allheaders) !== 'undefined' && allheaders !== "") {
                            var headers = allheaders.split("\r\n");
                            var headertable = $('<table class="table table-hover table-bordered table-text-center"><tr><th>请求头</th><th>value</th></tr></table>');
                            headers.push("response-code: " + xhr.status);
                            var contentType = "";
                            for (var i = 0; i < headers.length; i++) {
                                var header = headers[i];
                                if (header !== null && header !== "") {
                                    headerValu = header.split(":");
                                    var headertr = $('<tr><th class="active">' + headerValu[0] + '</th><td>' + headerValu[1] + '</td></tr>');
                                    headertable.append(headertr);
                                }
                                if (headers[i].toLowerCase().indexOf("content-type") >= 0) {
                                    headers[i].indexOf(";") >= 0 ? contentType = headers[i].match(/:([\s\S]*);/)[1] : contentType = headers[i].match(/:([\s\S]*)/)[1];
                                }
                            }
                            //设置Headers内容
                            resp3.find(".panel-body").html("");
                            resp3.find(".panel-body").append(headertable);
                        }
                        var contentUrl = (this.url.indexOf("http://") === 0 || this.url.indexOf("https://") === 0) ? contentType : window.location.protocol + "//" + window.location.host;
                        var headerss = "";
                        for (key in this.headers) {
                            headerss += (key + ": " + this.headers[key]);
                        }
                        /*  生成curl命令组成部分 */
                        /* 头部数据 */
                        headerss != "" ? headerss = " --header \'" + headerss + "\' " : "";
                        /* head部分数据 */
                        /* content-type */
                        contentType != "" ? (contentType = " --header \'Content-Type:  " + contentType + "\' ") : "";

                        /* Accept: consumes*/
                        var curlAccept = " --header \'Accept:  " + apiInfo.consumes[0] + "\' ";
                        /* url */
                        var curlUrl = "\'" + contentUrl + this.url + "\'";
                        if (this.type.toLowerCase() === "get") {
                            var curltable = ("curl -X " + this.type + " --header \'Accept:  " + apiInfo.consumes[0] + "\' " +
                                headerss + curlUrl);/* .replace(/[\r\n]/g, "") */
                        } else {
                            /* d data 非头部附带数据,只用于非get类型请求 */
                            var curlData = " -d \'" + (this.data?this.data.replace(/[\r\n]/g," \\\n"):"")  + "\' ";
                            var curltable = ("curl -X " + this.type + contentType + curlAccept + headerss + curlData + curlUrl);/* .replace(/[\r\n]/g, "") */
                        }
                        //设置curl内容
                        resp4.find(".panel-body").html("");
                        resp4.find(".panel-body").css({"white-space": "pre", "overflow-x": "auto"}).append(curltable);
                        var contentType = xhr.getResponseHeader("Content-Type");
                        if (xhr.hasOwnProperty("responseJSON")) {
                            //如果存在该对象,服务端返回为json格式
                            resp1.find(".panel-body").html("");
                            var pre = $('<pre></pre>');
                            var jsondiv = $('<div></div>');
                            jsondiv.JSONView(xhr["responseJSON"]);
                            pre.html(JSON.stringify(xhr["responseJSON"], null, 2));
                            resp1.find(".panel-body").append(jsondiv);
                        } else {
                            //判断content-type
                            //如果是image资源
                            var regex = new RegExp('image/(jpeg|jpg|png|gif)', 'g');
                            if (regex.test(contentType)) {
                                var d = DApiUI.getDoc().data("data");
                                var imgUrl = "http://" + d.host + apiInfo.url;
                                var img = document.createElement("img");
                                img.onload = function (e) {
                                    window.URL.revokeObjectURL(img.src); // 清除释放
                                };
                                img.src = imgUrl;
                                resp1.find(".panel-body").html("");
                                resp1.find(".panel-body")[0].appendChild(img);
                            } else {
                                //判断是否是text
                                var regex = new RegExp('.*?text.*', 'g');
                                if (regex.test(contentType)) {
                                    resp1.find(".panel-body").html("");
                                    resp1.find(".panel-body").html(xhr.responseText);
                                }
                            }

                        }

                        resptab.find("a:first").tab("show");
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        var resptab = $('<div id="resptab" class="tabs-container" ></div>');
                        var ulresp = $('<ul class="nav nav-tabs">' +
                            '<li class=""><a data-toggle="tab" href="#tabresp' + elName[1] + '" aria-expanded="false"> 响应内容 </a></li>' +
                            '<li class=""><a data-toggle="tab" href="#tabcookie' + elName[1] + '" aria-expanded="true"> Cookies</a></li>' +
                            '<li class=""><a data-toggle="tab" href="#tabheader' + elName[1] + '" aria-expanded="true"> Headers </a></li>' +
                            '<li class=""><a data-toggle="tab" href="#tabcurl' + elName[1] + '" aria-expanded="true"> curl方式 </a></li></ul></ul>');

                        resptab.append(ulresp);
                        var respcontent = $('<div class="tab-content"></div>');

                        var resp1 = $('<div id="tabresp' + elName[1] + '" class="tab-pane active"><div class="panel-body"><pre></pre></div></div>');
                        var resp2 = $('<div id="tabcookie' + elName[1] + '" class="tab-pane "><div class="panel-body">暂无</div>');
                        var resp3 = $('<div id="tabheader' + elName[1] + '" class="tab-pane "><div class="panel-body">暂无</div></div>');
                        var resp4 = $('<div id="tabcurl' + elName[1] + '" class="tab-pane"><div class="panel-body">暂无</div></div>');
                        respcontent.append(resp1).append(resp2).append(resp3).append(resp4);

                        resptab.append(respcontent);

                        respcleanDiv.append(resptab);
                        var headerValu = "";
                        var allheaders = xhr.getAllResponseHeaders();

                        if (allheaders !== null && typeof (allheaders) !== 'undefined' && allheaders !== "") {
                            var headers = allheaders.split("\r\n");
                            var headertable = $('<table class="table table-hover table-bordered table-text-center"><tr><th>请求头</th><th>value</th></tr></table>');
                            headers.push("response-code: " + xhr.status);
                            var contentType = "";
                            for (var i = 0; i < headers.length; i++) {
                                var header = headers[i];
                                if (header !== null && header !== "") {
                                    headerValu = header.split(":");
                                    var headertr = $('<tr><th class="active">' + headerValu[0] + '</th><td>' + headerValu[1] + '</td></tr>');
                                    headertable.append(headertr);
                                }
                                if (headers[i].toLowerCase().indexOf("content-type") >= 0) {
                                    headers[i].indexOf(";") >= 0 ? contentType = headers[i].match(/:([\s\S]*);/)[1] : contentType = headers[i].match(/:([\s\S]*)/)[1];
                                }
                            }
                            //设置Headers内容neir
                            resp3.find(".panel-body").html("");
                            resp3.find(".panel-body").append(headertable);
                        }
                        var contentUrl = (this.url.indexOf("http://") === 0 || this.url.indexOf("https://") === 0) ? contentType : window.location.protocol + "//" + window.location.host;
                        var headerss = "";
                        for (key in this.headers) {
                            headerss += (key + ": " + this.headers[key]);
                        }
                        /*  生成curl命令组成部分 */
                        /* 头部数据 */
                        headerss != "" ? headerss = " --header \'" + headerss + "\' " : "";
                        /* head部分数据 */
                        /* content-type */
                        contentType != "" ? (contentType = " --header \'Content-Type:  " + contentType + "\' ") : "";
                        /* Accept: consumes*/
                        var curlAccept = " --header \'Accept:  " + apiInfo.consumes[0] + "\' ";
                        /* url */
                        var curlUrl = "\'" + contentUrl + this.url + "\'";
                        if (this.type.toLowerCase() === "get") {
                            var curltable = ("curl -X " + this.type + " --header \'Accept:  " + apiInfo.consumes[0] + "\' " + headerss + curlUrl);
                        } else {
                            /* d data 非头部附带数据,只用于非get类型请求 */
                            var curlData = " -d \'" + (this.data?this.data.replace(/[\r\n]/g," \\\n"):"")  + "\' ";
                            var curltable = ("curl -X " + this.type + contentType + curlAccept + headerss + curlData + curlUrl);/* .replace(/[\r\n]/g, "") */
                        }
                        //设置curl内容
                        resp4.find(".panel-body").html("");
                        resp4.find(".panel-body").css({"white-space": "pre", "overflow-x": "auto"}).append(curltable);

                        var contentType = xhr.getResponseHeader("Content-Type");
                        var jsonRegex = "";
                        if (xhr.hasOwnProperty("responseJSON")) {
                            //如果存在该对象,服务端返回为json格式
                            resp1.find(".panel-body").html("");
                            var jsondiv = $('<div></div>');
                            jsondiv.JSONView(xhr["responseJSON"]);
                            resp1.find(".panel-body").append(jsondiv);
                        } else {
                            //判断是否是text
                            var regex = new RegExp('.*?text.*', 'g');
                            if (regex.test(contentType)) {
                                resp1.find(".panel-body").html("");
                                resp1.find(".panel-body").html(xhr.responseText);
                            }
                        }
                        resptab.find("a:first").tab("show");

                    }
                })
            }
        })

    };

    DApiUI.createDebugResponseTab = function (parent, data) {

    };


    DApiUI.writeUTF8 = function (str, isGetBytes) {
        var back = [],
            byteSize = 0;
        for (var i = 0; i < str.length; i++) {
            var code = str.charCodeAt(i);
            if (code >= 0 && code <= 127) {
                byteSize += 1;
                back.push(code);
            } else if (code >= 128 && code <= 2047) {
                byteSize += 2;
                back.push((192 | (31 & (code >> 6))));
                back.push((128 | (63 & code)))
            } else if (code >= 2048 && code <= 65535) {
                byteSize += 3;
                back.push((224 | (15 & (code >> 12))));
                back.push((128 | (63 & (code >> 6))));
                back.push((128 | (63 & code)))
            }
        }
        for (i = 0; i < back.length; i++) {
            if (back[i] > 255) {
                back[i] &= 255
            }
        }
        if (isGetBytes) {
            return back
        }
        if (byteSize <= 255) {
            return [0, byteSize].concat(back);
        } else {
            return [byteSize >> 8, byteSize & 255].concat(back);
        }
    };

    DApiUI.createApiInfoTable = function (apiInfo) {
        /* 传入url作为tab名称  方法返回当前接口DIV容器的接口，接口顺序号码*/
        var elName = DApiUI.creatabTab(DApiUI.getStringValue(DApiUI.getStringValue(apiInfo.methodType).toUpperCase() + apiInfo.url));
        /* DOM操作部分 */
        var table = $('<table class="table table-hover table-bordered table-text-center"></table>');
        var thead = $('<thead><tr><th colspan="2" style="text-align:center">API接口文档</th></tr></thead>');
        table.append(thead);
        var tbody = $('<tbody></tbody>');

        var url = $('<tr><th class="active" style="text-align: right;">接口url</th><td style="text-align: left"><code>' + DApiUI.getStringValue(apiInfo.url) + '</code></td></tr>');
        tbody.append(url);

        var summary = $('<tr><th class="active" style="text-align: right;">接口名称</th><td style="text-align: left">' + DApiUI.getStringValue(apiInfo.summary) + '</td></tr>');
        tbody.append(summary);


        var description = $('<tr><th class="active" style="text-align: right;">说明</th><td style="text-align: left">' + DApiUI.getStringValue(apiInfo.description) + '</td></tr>');
        tbody.append(description);

        var methodType = $('<tr><th class="active" style="text-align: right;">请求方式</th><td style="text-align: left"><code>' + DApiUI.getStringValue(apiInfo.methodType) + '</code></td></tr>');
        tbody.append(methodType);

        var consumesArr = DApiUI.getValue(apiInfo, "consumes", [], true);


        var consumes = $('<tr><th class="active" style="text-align: right;">consumes</th><td style="text-align: left"><code>' + consumesArr + '</code></td></tr>');
        tbody.append(consumes);

        var producesArr = DApiUI.getValue(apiInfo, "produces", [], true);

        var produces = $('<tr><th class="active" style="text-align: right;">produces</th><td style="text-align: left"><code>' + producesArr + '</code></td></tr>');
        tbody.append(produces);

        //请求参数
        var args = $('<tr><th class="active" style="text-align: right;">请求参数</th></tr>');
        //判断是否有请求参数
        if (typeof (apiInfo.parameters) !== 'undefined' && apiInfo.parameters !== null) {
            var requestTd = $("<td style='text-align: left;'></td>");
            var requestTable = $('<div class="panel col-lg-12 col-md-12 col-sm-12 col-xs-12 imitatTable"></div>');
            var tables = $("<ul class=''></ul>");
            tables.append($("<li class='tbHeader'><span class='col-lg-2 col-md-2 col-sm-2 col-xs-2'>参数名称</span>" +
                "<span class='col-lg-2 col-md-2 col-sm-2 col-xs-2'>说明</span>" +
                "<span class='col-lg-2 col-md-2 col-sm-2 col-xs-2'>类型</span>" +
                "<span class='col-lg-2 col-md-2 col-sm-2 col-xs-2'>条件</span>" +
                "<span class='col-lg-2 col-md-2 col-sm-2 col-xs-2'>in</span>" +
                "<span class='col-lg-2 col-md-2 col-sm-2 col-xs-2'>是否必须</span></li>"));
            requestTable.append(tables);
            $.each(apiInfo.parameters, function (i, param) {
                //判断是否是ref,如果是，列出他的属性说明
                var refflag = false;
                //判断是否有type属性,如果有,则后端为实体类形参
                var ptype = "string";
                if (param.hasOwnProperty("type")) {
                    ptype = param["type"];
                } else {
                    ///判断是有schma
                    if (param.hasOwnProperty("schema")) {
                        var schema = param["schema"];
                        //是否有type
                        if (schema.hasOwnProperty("type")) {
                            ptype = schema["type"];
                        } else if (schema.hasOwnProperty("$ref")) {
                            //是否是ref
                            var regex = new RegExp("#/definitions/(.*)$", "ig");
                            if (regex.test(schema["$ref"])) {
                                refflag = true;
                                ptype = RegExp.$1;
                            }
                        }
                    }
                }
                var ptr = null;
                //列出属性
                if (refflag) {
                    ptr = $('<li><span class="col-lg-2 col-md-2 col-sm-2 col-xs-2">' + param.name + '</span>' +
                        '<span class="col-lg-2 col-md-2 col-sm-2 col-xs-2">' + DApiUI.getStringValue(param['description']) + '</span>' +
                        '<span class="col-lg-2 col-md-2 col-sm-2 col-xs-2">' + ptype + '</span>' +
                        '<span class="col-lg-2 col-md-2 col-sm-2 col-xs-2">' + "无" + '</span>' +
                        '<span class="col-lg-2 col-md-2 col-sm-2 col-xs-2">' + DApiUI.getStringValue(param['in']) +
                        '</span><span class="col-lg-2 col-md-2 col-sm-2 col-xs-2">' + param['required'] + '</span></li>');

                    ptr.find("span:first-child").attr({
                        "data-parent": '#accordion',
                        'data-toggle': 'collapse',
                        'href': "#" + param.name + elName[1]
                    }).css({"color": "#428BCA", "cursor": "pointer"})
                        .append($("<a class='caret' style='border-top-color:#428BCA'></a>"));

                    tables.append(ptr);
                    var definitionsArray = DApiUI.getDoc().data("definitionsArray");
                    var mcs = DApiUI.getMenuConstructs();
                    for (var k in mcs.definitions) {
                        if (ptype === k) {
                            var tp = mcs.definitions[ptype];
                            var props = tp["properties"];
                            var $div = $("<ul id=" + (param.name + elName[1]) + " class='panel-collapse collapse'></ul>")
                            for (var prop in props) {
                                var pvalue = props[prop];
                                var tr = $("<li class=' '></li>");
                                tr.append($("<span class='col-lg-2 col-md-2 col-sm-2 col-xs-2' style='text-align: right;'>" + prop + "</span>"));
                                tr.append($("<span  class='col-lg-2 col-md-2 col-sm-2 col-xs-2'>" + DApiUI.toString(pvalue.description ? pvalue.description : "&ensp;", "") + "</span>"));
                                var type = DApiUI.toString(pvalue.type, "string");
                                tr.append($("<span  class='col-lg-2 col-md-2 col-sm-2 col-xs-2'>" + type + "</span>"));
                                var condition = (pvalue.maxLength && pvalue.minLength) ? ("长度在" + pvalue.minLength + "和" + pvalue.maxLength + "之间") : (pvalue.pattern ? pvalue.pattern : ((pvalue.minimum && pvalue.maximum) ? pvalue.minimum + "&lt;" + prop + "&lt;" + pvalue.maximum : "无"));

                                tr.append($("<span  class='col-lg-2 col-md-2 col-sm-2 col-xs-2'>" + condition + "</span>"));
                                tr.append($("<span  class='col-lg-2 col-md-2 col-sm-2 col-xs-2'>" + DApiUI.getStringValue(param['in']) + "</span>"));
                                var required = "";
                                for (var key in  mcs.definitions) {
                                    key.toLowerCase() === ptype.toLowerCase() ? (required = mcs.definitions[key].required) : "";
                                }
                                tr.append($("<span  class='col-lg-2 col-md-2 col-sm-2 col-xs-2'>" + (required ? (required.indexOf(prop) !== -1 ? "true" : "false") : "false") + "</span>"));
                                $div.append(tr);
                            }
                            tables.append($div);
                        }
                    }
                } else {
                    ptr = $('<li><span class="col-lg-2 col-md-2 col-sm-2 col-xs-2">' + param.name + '</span>' +
                        '<span class="col-lg-2 col-md-2 col-sm-2 col-xs-2">' + DApiUI.getStringValue(param['description']) + '</span>' +
                        '<span class="col-lg-2 col-md-2 col-sm-2 col-xs-2">' + ptype + '</span>' +
                        '<span class="col-lg-2 col-md-2 col-sm-2 col-xs-2">' + "无" + '</span>' +
                        '<span class="col-lg-2 col-md-2 col-sm-2 col-xs-2">' + DApiUI.getStringValue(param['in']) + '</span>' +
                        '<span class="col-lg-2 col-md-2 col-sm-2 col-xs-2">' + param['required'] + '</span></li>');
                    //   ptr = $('<tr><td>' + param.name + '</td><td style="text-align: center;">' + DApiUI.getStringValue(param['description']) + '</td><td>' + ptype + '</td><td>' + DApiUI.getStringValue(param['in']) + '</td><td>' + param['required'] + '</td></tr>');
                    tables.append(ptr);
                }
            });
            tables.append($('<li class=" " style="line-height: 0;border: 0;"><span class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style="text-align: right;">填充填充填充填充填充填充填充</span><span class="col-lg-4 col-md-4 col-sm-4 col-xs-4">填充填充填充填充填充填充填充填充填充填充填充填充</span><span class="col-lg-2 col-md-2 col-sm-2 col-xs-2">填充填充填充填充填充填充填充填充</span><span class="col-lg-2 col-md-2 col-sm-2 col-xs-2">填充填充填充填充填充填充填充</span><span class="col-lg-2 col-md-2 col-sm-2 col-xs-2">填充填充填充填充填充填充填充</span></li>'));
            requestTable.append(tables);
            requestTd.append(requestTable);
            args.append(requestTd);
        } else {
            args.append($('<td  style="text-align: left">暂无</td>'));
        }
        tbody.append(args);
        //响应数据结构
        var responseConstruct = $('<tr><th class="active" style="text-align: right;">响应Model</th></tr>');
        var responseConstructtd = $('<td  style="text-align: left"></td>');
        responseConstructtd.append(DApiUI.createResponseDefinition(apiInfo));
        responseConstruct.append(responseConstructtd);
        tbody.append(responseConstruct);

        //响应参数 add by xiaoymin 2017-8-20 16:17:18

        var respParams = $('<tr><th class="active" style="text-align: right;">响应参数说明</th></tr>');
        var respPart = $('<td  style="text-align: left"></td>');
        respPart.append(DApiUI.createResponseDefinitionDetail(apiInfo));
        respParams.append(respPart);

        tbody.append(respParams);

        //响应状态码
        var response = $('<tr><th class="active" style="text-align: right;">响应</th></tr>');
        if (typeof (apiInfo.responses) !== 'undefined' && apiInfo.responses !== null) {
            var resp = apiInfo.responses;
            var ptd = $("<td></td>");
            var ptable = $('<table class="table table-bordered"></table>');
            var phead = $('<thead><th>状态码</th><th>说明</th><th>schema</th></thead>');
            ptable.append(phead);
            var pbody = $('<tbody></tbody>');
            if (resp.hasOwnProperty("200")) {
                var ptr = $('<tr><td>200</td><td>http响应成功</td><td></td></tr>');
                pbody.append(ptr);
            }
            //400
            pbody.append($('<tr><td>400</td><td>Bad Request 请求出现语法错误,一般是请求参数不对</td><td></td></tr>'));
            //404
            pbody.append($('<tr><td>404</td><td>Not Found 无法找到指定位置的资源</td><td></td></tr>'));
            //401
            pbody.append($('<tr><td>401</td><td>Unauthorized 访问被拒绝</td><td></td></tr>'));
            //403
            pbody.append($('<tr><td>403</td><td>Forbidden 资源不可用</td><td></td></tr>'));
            //500
            pbody.append($('<tr><td>500</td><td>服务器内部错误,请联系Java后台开发人员!!!</td><td></td></tr>'));
            ptable.append(pbody);
            ptd.append(ptable);
            response.append(ptd);
        } else {
            response.append($("<td>暂无</td>"));
        }
        tbody.append(response);
        table.append(tbody);

        /*tab页操作 */
        if (!isNaN(elName)) {
            $(".bycdao-header #tabIndex li").eq(elName).find("a").tab('show');
            return false;
        }
        DApiUI.getDoc().find("#" + elName[0] + " #tab" + elName[1]).html("");

        DApiUI.getDoc().find("#" + elName[0] + " #tab" + elName[1]).append(table);
        $(".bycdao-header #tabIndex").find("." + elName[0] + ">a").tab('show');
        /* 对删除按钮进行事件绑定 */
        $(".bycdao-header #tabIndex li b").on("click", function () {
            var id = $(this).prev("a").attr("href");
            $(id + "").remove();
            $(this).parents("." + id.replace('#', '')).remove().hasClass("active") ? $(".bycdao-header #tabIndex> li:eq(0) >a").tab('show') : '';
        })
        return elName;
    };

    /***
     * 响应参数详情
     * @param apiInfo
     */
    DApiUI.createResponseDefinitionDetail = function (apiInfo) {
        var resp = apiInfo.responses;
        var div = $("<div class='panel col-lg-12 col-md-12 col-sm-12 col-xs-12 imitatTable'></div>");
        var respBasis = false;
        var respState;
        for (key in resp) {
            if (parseInt(key) >= 200 && parseInt(key) <= 299) {
                respBasis = true;
                respState = key
                break;
            }
        }
        // if (resp.hasOwnProperty("200")) {
        if (respBasis) {
            var ok = resp[respState];
            if (ok.hasOwnProperty("schema")) {
                var schema = ok["schema"];

                // var ref = schema["$ref"];
                var ref = (schema["type"] && schema["type"] === "array" && schema["items"]) ? schema["items"].$ref : schema["$ref"];
                var regex = new RegExp("#/definitions/(.*)$", "ig");
                if (regex.test(ref)) {
                    var refType = RegExp.$1;
                    var definitionsArray = DApiUI.getDoc().data("definitionsArray");
                    var mcs = DApiUI.getMenuConstructs();
                    for (var k in mcs.definitions) {
                        if (refType === k) {
                            var table = $("<ul class=''></ul>");
                            table.append("<li class='tbHeader'><span class='col-lg-4 col-md-4 col-sm-4 col-xs-4'>参数名称</span>" +
                                "<span class='col-lg-2 col-md-2 col-sm-2 col-xs-2'>类型</span>" +
                                "<span class='col-lg-6 col-md-6 col-sm-6 col-xs-6'>说明</span></li>");
                            var tp = mcs.definitions[refType];
                            var props = tp["properties"];
                            for (var prop in props) {
                                var pvalue = props[prop];
                                var tr = $("<li class=' '></li>");
                                //只遍历一级属性
                                //判断是否是ref
                                if (pvalue.hasOwnProperty("items") || pvalue.hasOwnProperty("$ref")) {
                                    var param_ref = (pvalue["items"] && pvalue["items"]["$ref"]) || pvalue["$ref"];
                                    var regex1 = new RegExp("#/definitions/(.*)$", "ig");
                                    if (regex1.test((param_ref))) {
                                        var type = DApiUI.toString(pvalue.type, "string");
                                        var ptype = param_ref.slice(param_ref.lastIndexOf("/") + 1);
                                        tr.append($("<span class='col-lg-4 col-md-4 col-sm-4 col-xs-4'>" + prop + "</span>"));
                                        tr.append($("<span class='col-lg-2 col-md-2 col-sm-2 col-xs-2'>" + type + "</span>"));
                                        tr.append($("<span class='col-lg-6 col-md-6 col-sm-6 col-xs-6'>" + pvalue.description + "</span>"));
                                        tr.find("span:first-child").attr({
                                            "data-parent": '#accordion',
                                            'data-toggle': 'collapse',
                                            'href': "#" + prop
                                        }).css({"color": "#428BCA", "cursor": "pointer"})
                                            .append("<a class='caret' style='border-top-color:#428BCA'></a>");
                                        table.append(tr);
                                        for (var j in mcs.definitions) {
                                            if (ptype === j) {
                                                var tpp = mcs.definitions[ptype];
                                                var pp_props = tpp["properties"];
                                                var $div = $("<ul id=" + prop + " class='panel-collapse collapse'></ul>")
                                                for (var prop1 in pp_props) {
                                                    var tr1 = $("<li class=' '></li>");
                                                    var pvalue1 = pp_props[prop1];
                                                    tr1.append($("<span class='col-lg-4 col-md-4 col-sm-4 col-xs-4' style='text-align: right;'>" + prop1 + "</span>"));
                                                    tr1.append($("<span  class='col-lg-2 col-md-2 col-sm-2 col-xs-2'>" + DApiUI.getValue(pvalue1, "type", "string", true) + "</span>"));
                                                    tr1.append($("<span class='col-lg-6 col-md-6 col-sm-6 col-xs-6'>" + DApiUI.getValue(pvalue1, "description", "", true) + "</span>"));
                                                    $div.append(tr1);
                                                }
                                                table.append($div);
                                            }
                                        }
                                    }
                                } else {
                                    tr.append($("<span class='col-lg-4 col-md-4 col-sm-4 col-xs-4'>" + prop + "</span>"));
                                    var type = DApiUI.toString(pvalue.type, "string");
                                    tr.append($("<span class='col-lg-2 col-md-2 col-sm-2 col-xs-2'>" + type + "</span>"));
                                    tr.append($("<span class='col-lg-6 col-md-6 col-sm-6 col-xs-6'>" + DApiUI.toString(pvalue.description, "") + "</span>"));
                                    table.append(tr);
                                }
                            }
                            table.append($('<li class=" " style="line-height: 0;border: 0;"><span class="col-lg-2 col-md-2 col-sm-2 col-xs-2" style="text-align: right;">填充填充填充填充填充填充填充</span><span class="col-lg-4 col-md-4 col-sm-4 col-xs-4">填充填充填充填充填充填充填充填充填充填充填充填充</span><span class="col-lg-2 col-md-2 col-sm-2 col-xs-2">填充填充填充填充填充填充填充填充</span><span class="col-lg-2 col-md-2 col-sm-2 col-xs-2">填充填充填充填充填充填充填充</span><span class="col-lg-2 col-md-2 col-sm-2 col-xs-2">填充填充填充填充填充填充填充</span></li>'));
                            div.append(table)
                        }
                    }
                }
            }
        }
        return div;
    };


    DApiUI.createResponseDefinition = function (apiInfo) {
        var resp = apiInfo.responses;
        var div = $("<div class='panel'>暂无</div>");
        var respBasis = false;
        var respState;
        for (key in resp) {
            if (parseInt(key) >= 200 && parseInt(key) <= 299) {
                respBasis = true;
                respState = key;
                break;
            }
        }
        if (respBasis) {
            var ok = resp[respState];
            if (ok.hasOwnProperty("schema")) {
                var schema = ok["schema"];
                // var ref = schema["$ref"];
                var ref = (schema["type"] && schema["type"] === "array" && schema["items"]) ? schema["items"].$ref : schema["$ref"];
                var regex = new RegExp("#/definitions/(.*)$", "ig");
                if (regex.test(ref)) {
                    var refType = RegExp.$1;
                    //这里去definitionsArrar查找,如果未找到,直接展示refType
                    var flag = false;
                    var htmlValue = refType;
                    var definitionsArray = DApiUI.getDoc().data("definitionsArray");
                    var deftion = null;
                    var definition = null;
                    for (var i = 0; i < definitionsArray.length; i++) {
                        // var definition = definitionsArray[i];
                        // if (definition.key === refType) {
                        //     flag = true;
                        //     htmlValue = definition.value;
                        //     break;
                        // }
                        if (definitionsArray[i].key === refType) {
                            flag = true;
                            deftion = DApiUI.deepCopy(definitionsArray[i].value);
                            break;
                        }
                    }
                    for (var key in deftion) {
                        if ((typeof deftion[key]) == "boolean") {
                            deftion[key] = true;
                            continue;
                        }
                        if ((typeof deftion[key]) == "number") {
                            deftion[key] % 1 === 0 ? deftion[key] = 0 : deftion[key] = 0.0;
                            continue;
                        }
                        if ((typeof deftion[key]) == "string") {
                            deftion[key] = "String";
                            continue;
                        }

                    }
                    div.html("");
                    if (flag) {
                        div.JSONView(deftion);
                    } else {
                        div.html(refType);
                    }
                } else {
                    //未发现ref属性
                    if (schema.hasOwnProperty("type")) {
                        div.html("");
                        div.html(schema["type"]);
                    }
                }
            }
        }
        return div;
    };

    /*  初始化数据到右部 */
    DApiUI.definitions = function (menu) {
        var definitionsArray = [];
        if (menu !== null && typeof (menu) !== "undefined" && menu.hasOwnProperty("definitions")) {
            var definitions = menu["definitions"];
            for (var definition in definitions) {
                var defiType = new definitionType();
                defiType.key = definition;
                //获取value
                var value = definitions[definition];
                if (checkUndefined(value)) {
                    //是否有properties
                    if (value.hasOwnProperty("properties")) {
                        var properties = value["properties"];
                        var defiTypeValue = {};
                        for (var property in properties) {
                            var propobj = properties[property];
                            //默认string类型
                            var propValue = "";
                            //判断是否有类型
                            if (propobj.hasOwnProperty("type")) {
                                var type = propobj["type"];
                                //判断是否有example
                                if (propobj.hasOwnProperty("example")) {
                                    propValue = propobj["example"];
                                } else if (checkIsBasicType(type)) {
                                    propValue = getBasicTypeValue(type);
                                } else {
                                    if (type === "array") {
                                        propValue = [];
                                        var items = propobj["items"];
                                        var ref = items["$ref"];
                                        var regex = new RegExp("#/definitions/(.*)$", "ig");
                                        if (regex.test(ref)) {
                                            var refType = RegExp.$1;
                                            //这里需要递归判断是否是本身,如果是,则退出递归查找
                                            if (refType !== definition) {
                                                propValue.push(findRefDefinition(refType, definitions));
                                            }
                                        }
                                    }
                                }

                            } else {
                                if (propobj.hasOwnProperty("$ref")) {
                                    var ref = propobj["$ref"];
                                    var regex = new RegExp("#/definitions/(.*)$", "ig");
                                    if (regex.test(ref)) {
                                        var refType = RegExp.$1;
                                        //这里需要递归判断是否是本身,如果是,则退出递归查找
                                        if (refType !== definition) {
                                            propValue = findRefDefinition(refType, definitions);
                                        } else {
                                            propValue = {};
                                        }

                                    }
                                } else {
                                    propValue = {};
                                }
                            }
                            defiTypeValue[property] = propValue;
                        }
                        defiType.value = defiTypeValue;
                    } else {
                        defiType.value = {};
                    }
                }

                definitionsArray.push(defiType);
            }
        }
        DApiUI.getDoc().data("definitionsArray", definitionsArray);
    };

    DApiUI.getDefinitions = function () {
        return DApiUI.getDoc().data("definitionsArray");
    };

    function checkIsBasicType(type) {
        var basicTypes = ["string", "integer", "number", "object", "boolean"];
        var flag = false;
        if ($.inArray(type, basicTypes) > -1) {
            flag = true;
        }
        return flag;
    }

    function getBasicTypeValue(type) {
        var propValue = "";
        //是否是基本类型
        if (type === "integer") {
            propValue = 0;
        }
        if (type === "boolean") {
            propValue = true;
        }
        if (type === "object") {
            propValue = {};
        }
        if (type === "number") {
            propValue = parseFloat(0);
        }
        return propValue;
    }

    function findRefDefinition(definitionName, definitions) {
        var defaultValue = "";
        for (var definition in definitions) {
            if (definitionName === definition) {
                var value = definitions[definition];
                //是否有properties
                if (value.hasOwnProperty("properties")) {
                    var properties = value["properties"];
                    var defiTypeValue = {};
                    for (var property in properties) {
                        var propobj = properties[property];
                        //默认string类型
                        var propValue = "";
                        //判断是否有类型
                        if (propobj.hasOwnProperty("type")) {
                            var type = propobj["type"];
                            //判断是否有example
                            if (propobj.hasOwnProperty("example")) {
                                propValue = propobj["example"];
                            } else if (checkIsBasicType(type)) {
                                propValue = getBasicTypeValue(type);
                            } else {
                                if (type === "array") {
                                    propValue = [];
                                    var items = propobj["items"];
                                    var ref = items["$ref"];
                                    //var regex = new RegExp("#/definitions/(.*)$", "ig");
                                    //if (regex.test(ref)) {
                                    var refType = RegExp.$1;
                                    if (refType !== definitionName) {
                                        propValue.push(findRefDefinition(refType, definitions));
                                    }
                                    //}
                                }
                            }

                        } else {

                        }
                        defiTypeValue[property] = propValue;
                    }
                    defaultValue = defiTypeValue;
                } else {
                    defaultValue = {};
                }
            }
        }
        return defaultValue;
    }

    function checkUndefined(obj) {
        var flag = false;
        if (obj !== null && typeof (obj) !== "undefined") {
            flag = true;
        }
        return flag;
    }


    function definitionType() {
        this.key = "";
        this.value = {};
    }


    /***
     * 获取默认请求参数类型
     * @param obj
     * @returns {string}
     */
    DApiUI.getDefaultRequiredType = function (obj) {
        var t = "string";
        if (typeof (obj) !== 'undefined' && obj !== null) {
            t = obj.toString();
        }
        return t;
    };

    /***
     * 查找子类
     * @param tagInfo
     * @param menu
     */
    DApiUI.initChildrens = function (tagInfo, menu) {

    };

    DApiUI.getDoc = function () {
        return $("#content");
    };
    DApiUI.getMenu = function () {
        return $("#menu");
    };

    DApiUI.log = function (msg) {
        if (window.console) {
            console.log(msg);
        }
    };
    DApiUI.init();


    /***
     * 标签组信息
     * @constructor
     */
    function TagInfo(name, description) {
        this.name = name;
        this.description = description;
        this.childrens = [];
    }


    /***
     * api实体信息
     * @param options
     * @constructor
     */
    function ApiInfo(options) {
        //判断options
        this.tag = "";
        this.url = "";
        this.description = "";
        this.operationId = "";
        this.parameters = [];
        this.produces = [];
        this.responses = {};
        this.methodType = "post";
        this.consumes = [];
        this.summary = "";
        if (options !== null && typeof (options) !== 'undefined') {
            this.tag = options.tags[0];
            this.description = options.description;
            this.operationId = options.operationId;
            this.summary = options.summary;
            this.parameters = options.parameters;
            this.produces = options.produces;
            this.responses = options.responses;
            this.consumes = options.consumes;
        }

    }


})(jQuery);
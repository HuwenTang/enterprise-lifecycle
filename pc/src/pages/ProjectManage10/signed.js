//   存放基本信息文件
var bDateAndreceivedMoneysArray = [];
var fileProjArr = [];
var fileProjArr1 = [];
var fileProjArr6 = [];
var arrayRegi = [];
var arrayBA = [];
var arrayApproval = [];
var arrayBeginning = [];
var arrayEnd = [];
var index = 0;
var indexRegi = 0;
var indexBA = 0;
var indexApproval = 0;
var indexBeginning = 0;
var indexEnd = 0;
// 向本地存储数据
var length = 0;
var length1 = 0;
var treeSelect;
var successObj = {}
var successObj2 = {}
var errorObj = {}
var upload_file_path_proj = "https://invest.swj.taizhou.gov.cn:54931/images/"; // 公网环境
// var upload_file_path_proj = "http://172.22.26.71:54931/images/"; // 政务网环境
var bandStatus = ''
var dialog1 = null
var dialog2 = null
var dialog3 = null
var dialog4 = null
var listType = ''
var dropData = []
var olList = []
var bpList = []
var key = ''
var investorPlaceMap = {}; // 投资方注册地映射对象

var fzmb = `<div style="overflow: hidden;padding: 5px 0;">
    <span class="xz-txt"></span>
    <div style="float:  right" class="xz-edit-btn">
<!--        <i style="cursor: pointer;margin-left: 5px;" class="iconfont fz-edit">&#xe6b7;</i>-->
        <i style="cursor: pointer;margin-left: 5px;" class="iconfont fz-del">&#xe71a;</i>
    </div>
</div>`;

var fzList = [];

var defaultFZ = [
    '本协议与国家法律、法规相悖的，按国家法律、法规执行。',
    '如因履行本协议发生纠纷而引起诉讼的，由甲方所在地人民法院管辖。',
    '本协议书一式四份，甲方执存两份，乙方执存两份，本协议自双方签字盖章之日起生效。',
]

// 渲染下拉框的数据
function innitSelect(name,data){
    let html=''
    if(data&&data instanceof Array){
        data.forEach(item=>{
            html+="<option value="+item.name+">"+item.name+"</option>"
        })
    };
    $(name).html(html)
}

// 获取投资方注册地选项并构建映射
function fetchInvestorPlaceMap() {
    // 获取内资选项
    _UTIL.network.get("/system-api/dict/activityAddress/items", {all: true}, 15000, function(result) {
        if (result && result instanceof Array) {
            result.forEach(function(item) {
                var code = item.code || item.value;
                var name = item.name || item.label;
                investorPlaceMap[code] = name;
            });
        }
    });
    
    // 获取外资选项
    _UTIL.network.get("/system-api/dict/wzAddress/items", {all: true}, 15000, function(result) {
        if (result && result instanceof Array) {
            result.forEach(function(item) {
                var code = item.code || item.value;
                var name = item.name || item.label;
                investorPlaceMap[code] = name;
            });
        }
    });
}

// 根据code获取投资方注册地名称
function getInvestorPlaceName(code) {
    return investorPlaceMap[code] || code || '-';
}

// 渲染投资方注册地选项到select
function renderInvestorPlaceOptions(pType) {
    $("#investor_place").empty();
    $("#investor_place").append('<option value="">请选择</option>');
    
    // 根据项目类别获取对应的选项
    _UTIL.network.get(pType == 1 ? "/system-api/dict/activityAddress/items" : "/system-api/dict/wzAddress/items", 
        {all: true}, 15000, function(result) {
        if (result && result instanceof Array) {
            result.forEach(function(item) {
                var code = item.code || item.value;
                var name = item.name || item.label;
                $("#investor_place").append('<option value="' + code + '">' + name + '</option>');
            });
            layui.form.render("select");
        }
    });
}

function fzHmtl(){
    let length = fzList.length;
    let temp = fzList.map((item,index)=>{
        let tS = fzmb;
        let t = $(tS);
        t.find('.xz-txt').text(index + 1 +'、' + item);
        if(length - index <= 3) {
            t.find('.xz-edit-btn').remove();
        }else{
            t.find('.fz-del').attr('onclick',`fzremoveItem(${index})`);
        }
        return t[0].outerHTML;
    }).join('');
    $('#fzList').html(temp);
}

function fzAdditem(item){
    if(fzList.length < 3){
        fzList.push(item);
    }else{
        fzList.splice(fzList.length - 3,0,item);
    }
    fzHmtl();
}

function fzremoveItem(index){
    fzList.splice(index,1);
    fzHmtl();
}

function fzInit(){
    fzList = [];
    defaultFZ.forEach(item=>{
        fzAdditem(item);
    });
}

var biz_info = {
    band_id: null,
    _id: null,
    pg_status: null,
    //搜索按钮
    search: function (page) {
        if (!page || isNaN(page)) {
            page = 1;
        }
        var table = layui.table;
        //投资额与项目类型
        var s_invest_money = $("#s_invest_money").val();
        // var s_p_type = $("#s_p_type").val();
        // if (s_invest_money != "") {
        //     if (s_p_type == "") {
        //         layer.tips("请选择项目类别","#label");
        //         return false;
        //     }
        // }
        table.reload('datalist', {
            where: {
                s_name: $("#s_name").val(),
                s_code: $("#s_code").val(),
                s_p_type: $("#s_p_type").val(),
                s_progress: $("#s_progress").val(),
                h_progress: $("#h_progress").val(),
                s_invest_money: $("#s_invest_money").val(),
                s_district: $("#s_district_code").val(),
                s_zone_code: $("#s_zone_code").val(),
                s_town_code: $("#s_town_code").val(),
                s_industry_code: $("#s_industry_code").val(),
                s_proj_type: $("#s_proj_code").val(),
                s_investor: $("#s_investor").val(),
                s_investor_type: $("#s_investor_type").val(),
                s_check_status: $("#s_check_status").val(),
                s_signed_stat_date: $("#s_signed_stat_date").val(),
                s_reg_stat_date: $("#s_reg_stat_date").val(),
                s_check_stat_date: $("#s_check_stat_date").val(),
                s_licence_date: $("#s_licence_date").val(),
                s_startdate: $("#s_startdate").val(),
                s_enddate: $("#s_enddate").val(),
                s_finish_check_date: $("#s_finish_check_date").val(),
                s_sixpro_code: $("#s_sixpro_code").val(),
                s_remarks: $("#s_remark").val(),
                s_b_industry: $("#s_b_industry").val(),
                r_progress: $("#s_r_progress").val()
            }
            , page: {curr: page}
        });
    },
    //更多搜索
    searchMany: function () {
        $("#more_where").toggle();
        $("#searchMany i").html("&#xe619;");
    },
    //重置按钮
    resetSearchForm: function () {
        $("#searchBody input").val("");
        $("#searchBody select").val("");
    },
    //搜索按钮
    search1: function (page) {
        if (!page || isNaN(page)) {
            page = 1;
        }
        var table = layui.table;
        table.reload('datalist1', {
            where: {
                project_code: $("#code1").val(),
                project_name: $("#name1").val(),
                total_investment: $("#money1").val(),
                application_company_contact_name: $("#linker1").val(),
                application_company_contact_phone: $("#phone1").val()
            }
            , page: {curr: page}
        });
    },
    resetSearchForm1: function () {
        $("#searchBody1 input").val("");
        $("#searchBody1 select").val("");
    },
    search2: function (page) {
        if (!page || isNaN(page)) {
            page = 1;
        }
        var table = layui.table;
        table.reload('datalist2', {
            where: {
                project_code: $("#code2").val(),
                project_name: $("#name2").val(),
                total_investment: $("#money2").val()
            }
            , page: {curr: page}
        });
    },
    resetSearchForm2: function () {
        $("#searchBody2 input").val("");
        $("#searchBody2 select").val("");
    },
    //修改按钮
    edit: function (info) {
        if (info.qr_key) {
            key = info.qr_key
        } else {
            key = ''
        }
        // $("#hide1").show()
        // $("#hide2").show()
        // $("#tzf_fx").addClass('required')
        // $("#cp_qj").addClass('required')
        //草稿箱按钮隐藏
        _UTIL.html.emptyContainerElements("detailInfo")
        if (info.check_status == 4) {
            $("#drafts").show();
        } else {
            $("#drafts").hide();
        }
        if (info.is_rzxq == '是') {
            $(".rz_tr").show()
            $('#rz_money').attr('lay-verify', "required")
        } else {
            $(".rz_tr").hide()
            $('#rz_money').removeAttr('lay-verify')
        }
        biz_info._id = info._id;
        biz_info.pg_status = info.pg_status;
        $("#_id").val(info._id);
        //根据_id获取数据
        $("#detailInfo input").removeAttr('disabled')
        $("#detailInfo button").removeAttr('disabled')
        $("#detailInfo input").removeAttr('readOnly')
        $("#detailInfo button").removeAttr('readOnly')
        $("#detailInfo select").removeAttr('disabled')
        $("#detailInfo select").removeAttr('readOnly')
        $("#detailInfo input").removeClass('layui-disabled');
        $("#detailInfo button").removeClass('layui-disabled');
        $("#detailInfo select").removeClass('layui-disabled');

        $("#signed_stat_date").prop('readonly', true);
        $("#signed_date").prop('readonly', true);
        $("#plan_start_date").prop('readonly', true);
        $("#plan_end_date").prop('readonly', true);
        $("#sjjg_name").prop('readonly', true);
        $("#btnCancel").show();
        $("#btnSave").show();
        // if (info.p_type == 1) {
        //     if ( $('#invest_money').val() && Number($('#invest_money').val()) < 5 ) {
        //         $('#btnSave').text('提交')
        //         $("#xyBox").show()
        //         $("#zzBox").show()
        //         $("#tzf_div").show()
        //     } else {
        //         $('#btnSave').text('提交项目质态评估')
        //         $("#xyBox").hide()
        //         $("#zzBox").hide()
        //         $("#tzf_div").hide()
        //     }
        // } else {
        //     if ( $('#invest_money').val() && Number($('#invest_money').val()) < 3000 ) {
        //         $('#btnSave').text('提交')
        //         $("#xyBox").show()
        //         $("#zzBox").show()
        //         $("#tzf_div").show()
        //     } else {
        //         $('#btnSave').text('提交项目质态评估')
        //         $("#xyBox").hide()
        //         $("#zzBox").hide()
        //         $("#tzf_div").hide()
        //     }
        // }
        setprivilege();
        _UTIL.network.post("getProjProjectSignedById.do", {_id: info._id}, 15000, function (result) {
            $("#file_project").html("");
            $("#file_project1").html("");
            $("#file_project2").html("");
            $("#file_project3").html("");
            $("#file_project_new6").html("");

            //打开窗口
            // _UTIL.dialog.openRightDialog("detailInfo", info._name, '840px');
            $("#detailInfo .title").html(info._name);
            _UTIL.dialog.openRightDialog("detailInfo", info._name, '840px');
            // $("#detailInfo").show().css({"width": "800px"});
            $("input[name=is_sixpro][value=" + result.data.info.is_sixpro + "]").prop("checked", true);
            if (result.data.info.is_import_proj) {
                $("input[name=is_import_proj][value =" + result.data.info.is_import_proj + "]").prop("checked", true);
            }
            if (result.data.info.is_rzxq) {
                $("input[name=is_rzxq][value =" + result.data.info.is_rzxq + "]").prop("checked", true);
            } else {
                $("input[name=is_rzxq]").prop('checked', false)
            }
            // if (result.data.info.is_warning_invest) {
            //     $("input[name=is_warning_invest][value =" + result.data.info.is_warning_invest + "]").prop("checked", true);
            // }
            if (result.data.info.is_sixpro == 1) {
                $("#sixpro_code").removeAttr("disabled", true);
                $("#sixpro_code").removeClass("layui-disabled");
                $("#sixpro_code").addClass("required");
            } else {
                $("#sixpro_code").val("")
                $("#sixpro_code").removeClass("required");
                $("#sixpro_code").attr("disabled", true);
                $("#sixpro_code").addClass("layui-disabled");
            }
            _UTIL.html.setValues(result.data.info);
            fileProjArr = [];
            fileProjArr1 = [];
            fileProjArr6 = [];
            //图片展示不为空
            var imgs = result.data.imgs && result.data.imgs.length ? result.data.imgs.filter(item => item.cate_code == 0) : [];
            var label = "";
            //向数组中存放后端值
            if (imgs && imgs.length) {
                $("#file_project").html("");
                var index = 0;
                for (var f in imgs) {
                    var i = imgs[f];
                    var ob = {};
                    ob.filename = i._name;
                    ob.file_path = i.file_path;
                    fileProjArr.push(ob);
                    if (result.data.info.check_status == 4) {
                        label = "<li id2='" + (index++) + "'><a  href='" + upload_file_path_proj + i.file_path + "' target='_blank'>" + i._name + "</a>"+ ' / ' + "<span class='create_time'>" + i.create_time + "</span><i class='delBaseEdit layui-icon'>&#x1006;</i>" + "</li>";
                    } else {
                        label = "<li id2='" + (index++) + "'><a  href='" + upload_file_path_proj + i.file_path + "' target='_blank'>" + i._name + "</a>"+ ' / ' + "<span class='create_time'>" + i.create_time + "</span>" + "</li>";
                    }
                    $("#file_project").append(label);
                }

            } else {
                $("#file_project").html("<li>无</li>");
            }

            var imgs1 = result.data.imgs && result.data.imgs.length ? result.data.imgs.filter(item => item.cate_code == 99) : []
            var label1 = "";
            //向数组中存放后端值
            if (imgs1 && imgs1.length) {
                $("#file_project1").html("");
                var index = 0;
                for (var f in imgs1) {
                    var i = imgs1[f];
                    var ob = {};
                    ob.filename = i._name;
                    ob.file_path = i.file_path;
                    fileProjArr1.push(ob);
                    label1 = "<li id2='" + (index++) + "'><a  href='" + upload_file_path_proj + i.file_path + "' target='_blank'>" + i._name + "</a><i class='delBaseEdit layui-icon'>&#x1006;</i></li>";
                    $("#file_project1").append(label1);
                }

            } else {
                $("#file_project1").html("<li>无</li>");
            }

            var imgs6 = result.data.imgs && result.data.imgs.length ? result.data.imgs.filter(item => item.cate_code == 66) : []
            var label6 = "";
            //向数组中存放后端值
            if (imgs6 && imgs6.length) {
                $("#file_project_new6").html("");
                var index = 0;
                for (var f in imgs6) {
                    var i = imgs6[f];
                    var ob = {};
                    ob.filename = i._name;
                    ob.file_path = i.file_path;
                    fileProjArr6.push(ob);
                    label6 = "<li id2='" + (index++) + "'><a  href='" + upload_file_path_proj + i.file_path + "' target='_blank'>" + i._name + "</a><i class='delBaseEdit layui-icon'>&#x1006;</i></li>";
                    $("#file_project_new6").append(label6);
                }

            } else {
                $("#file_project_new6").html("<li>无</li>");
            }
            //根据点击切换值
            if (info.p_type == 1) {
                $("#span").text("亿元");
                $(".moneyText").text("万元");
            } else {
                $("#span").text("万美元");
                $(".moneyText").text("万美元");
            }
            var label = " <option value=\"" + result.data.info.zone_code + "\">" + result.data.info.zone_name + "</option>";
            var townName = " <option value=\"" + result.data.info.town_code + "\">" + result.data.info.town_name + "</option>";
            $("#zone_code").html(label);
            $("#town_code").html(townName);
            // $("#zone_code").find("option[value="+result.data.info.zone_code+"]").attr("selected",true);
            // $("#town_code").find("option[value="+result.data.info.town_code+"]").prop("selected",true);
            $("input[name=p_type][value=" + info.p_type + "]").prop("checked", true);
            $("input[name=b_industry][value=" + info.b_industry + "]").prop("checked", true);
            $("input[name=b_resource][value=" + info.b_resource + "]").prop("checked", true);
            if (info.b_resource == 2) {
                // $("#sjjg_name").show()
                $("#orgBox").show()
                $("#sjjg_name").addClass('required')
            } else {
                if (info.b_resource == 1) {
                    // $("#sjjg_name").hide()
                    $("#orgBox").hide()
                    $("#sjjg_name").removeClass('required')
                } else {
                    $("input[name=b_resource][value='1']").prop("checked", true);
                    // $("#sjjg_name").hide()
                    $("#orgBox").hide()
                    $("#sjjg_name").removeClass('required')
                }
            }
            if (info.is_import_proj == '是') {
                $("#import_proj_div").show()
                $("#import_proj_type").addClass('required')
            } else {
                $("#import_proj_div").hide()
                $("#import_proj_type").removeClass('required')
            }
            $("#industry_name").val(result.data.info.industry_name);
            if (info.is_gxjs) {
                $("input[name=is_gxjs][value =" + info.is_gxjs + "]").prop("checked", true);
            }
            if (info.is_kc_proj) {
                $("input[name=is_kc_proj][value =" + info.is_kc_proj + "]").prop("checked", true);
                if (info.is_kc_proj == '是') {
                    $("#kc_proj_div").show()
                    $("#kc_proj_tj").attr('lay-verify', "required")
                    $("#kc_proj_type").attr('lay-verify', "required")
                } else {
                    $("#kc_proj_div").hide()
                    $("#kc_proj_tj").removeAttr('lay-verify')
                    $("#kc_proj_type").removeAttr('lay-verify')
                }
                $("#kc_proj_tj").val(info.kc_proj_tj);
                $("#kc_proj_type").val(info.kc_proj_type);
            }
            if (info.is_build_yfzx) {
                $("input[name=is_build_yfzx][value =" + info.is_build_yfzx + "]").prop("checked", true);
                if (info.is_build_yfzx == '是') {
                    $("#build_yfzx_div").show()
                    $("#build_yfzx").addClass('required')
                } else {
                    $("#build_yfzx_div").hide()
                    $("#build_yfzx").removeClass('required')
                }
                $("#build_yfzx").val(info.build_yfzx);
            }
            if (info.is_sj_proj) {
                $("input[name=is_sj_proj][value =" + info.is_sj_proj + "]").prop("checked", true);
                if (info.is_sj_proj == '是') {
                    $("#sj_proj_div").show()
                    $("#sj_proj").addClass('required')
                } else {
                    $("#sj_proj_div").hide()
                    $("#sj_proj").removeClass('required')
                }
                $("#sj_proj").val(info.sj_proj);
            }
            var proj_type = document.getElementsByName("ra_proj_type");
            if (info.proj_type == "c" || info.proj_type == "") {
                $(proj_type[0]).prop("checked", true);
                $("#div_proj_type").hide();
            } else {
                $(proj_type[1]).prop("checked", true);
                $("#div_proj_type").show();
                if (info["proj_type"]) {
                    treeSelect.checkNode('proj_type', info.proj_type);
                }
            }

            var pType = $('input[name="p_type"]:checked').val();
            if (pType == 1) {
                $("#span").text("亿元");
                $(".moneyText").text("万元");
                $("#foreign_money").addClass("layui-disabled");
                $("#foreign_money").attr("disabled", true);
                $("#foreign_money").removeClass("required");
                $("#foreign_money").val("")
                // 动态渲染内资投资方注册地选项
                renderInvestorPlaceOptions(1);
            } else {
                $("#span").text("万美元")
                $(".moneyText").text("万美元");
                $("#foreign_money").removeClass("layui-disabled");
                $("#foreign_money").removeAttr("disabled");
                $("#foreign_money").addClass("required");
                // 动态渲染外资投资方注册地选项
                renderInvestorPlaceOptions(2);
            }
            layui.form.render("radio");
            $("#investor_place").val(result.data.info.investor_place);
            layui.form.render("select");
            if (info["industry_code"]) {
                treeSelect.checkNode('industry_code', info.industry_code);
            }
            if (result.data.fzList && result.data.fzList.length) {
                fzList = result.data.fzList.map(item => {
                    if (item.content) {
                        return item.content.split('、')[1]
                    }
                }).concat(defaultFZ)
                fzHmtl();
            } else {
                fzInit();
            }
        });
        // if (info.pg_status == 2 || info.pg_status == 3) {
        //     $("#xyBox").show()
        //     $("#zzBox").show()
        //     $("#tzf_div").show()
        //     $("#tzf_div").show()
        //     $("#zsf_div").show()
        //     $("#tzfs_div").show()
        //     $("#tzdz_div").show()
        //     $("#zsf").attr('lay-verify', "required")
        //     $("#tzf").attr('lay-verify', "required")
        //     $("#tzdz").attr('lay-verify', "required")
        //     $('#btnSave').text('提交')
        // } else {
        //     if (info.p_type == 1) {
        //         if ( Number(info.invest_money) < 5 ) {
        //             $('#btnSave').text('提交')
        //             $("#xyBox").show()
        //             $("#zzBox").show()
        //             $("#tzf_div").show()
        //             $("#tzf_div").show()
        //             $("#zsf_div").show()
        //             $("#tzfs_div").show()
        //             $("#tzdz_div").show()
        //             $("#zsf").attr('lay-verify', "required")
        //             $("#tzf").attr('lay-verify', "required")
        //             $("#tzdz").attr('lay-verify', "required")
        //         } else {
        //             $('#btnSave').text('提交项目质态评估')
        //             $("#xyBox").hide()
        //             $("#zzBox").hide()
        //             $("#tzf_div").hide()
        //             $("#zsf_div").hide()
        //             $("#tzfs_div").hide()
        //             $("#tzdz_div").hide()
        //             $("#zsf").removeAttr('lay-verify')
        //             $("#tzf").removeAttr('lay-verify')
        //             $("#tzdz").removeAttr('lay-verify')
        //         }
        //     } else {
        //         if ( Number(info.invest_money) < 3000 ) {
        //             $('#btnSave').text('提交')
        //             $("#xyBox").show()
        //             $("#zzBox").show()
        //             $("#tzf_div").show()
        //             $("#tzf_div").show()
        //             $("#zsf_div").show()
        //             $("#tzfs_div").show()
        //             $("#tzdz_div").show()
        //             $("#zsf").attr('lay-verify', "required")
        //             $("#tzf").attr('lay-verify', "required")
        //             $("#tzdz").attr('lay-verify', "required")
        //         } else {
        //             $('#btnSave').text('提交项目质态评估')
        //             $("#xyBox").hide()
        //             $("#zzBox").hide()
        //             $("#tzf_div").hide()
        //             $("#zsf_div").hide()
        //             $("#tzfs_div").hide()
        //             $("#tzdz_div").hide()
        //             $("#zsf").removeAttr('lay-verify')
        //             $("#tzf").removeAttr('lay-verify')
        //             $("#tzdz").removeAttr('lay-verify')
        //         }
        //     }
        // }
    },
    //添加编辑页面内容
    add: function () {
        key = ''
        // $("#xyBox").hide()
        // $("#zzBox").hide()
        // $("#tzf_div").hide()
        // $("#zsf_div").hide()
        // $("#tzfs_div").hide()
        // $("#tzdz_div").hide()
        // $("#zsf").removeAttr('lay-verify')
        // $("#tzf").removeAttr('lay-verify')
        // $("#tzdz").removeAttr('lay-verify')
        // $("#hide1").hide()
        // $("#hide2").hide()
        // $("#tzf_fx").removeClass('required')
        // $("#cp_qj").removeClass('required')
        $("#backText").css("display", "none");
        $("#backTitle").css("display", "none");
        $("#drafts").show();
        $("#detailInfo input").removeAttr('disabled');
        $("#detailInfo button").removeAttr('disabled');
        $("#detailInfo input").removeAttr('readOnly');
        $("#detailInfo button").removeAttr('readOnly');
        $("#detailInfo select").removeAttr('disabled');
        $("#detailInfo select").removeAttr('readOnly');
        $("#detailInfo input").removeClass('layui-disabled');
        $("#detailInfo button").removeClass('layui-disabled');
        $("#detailInfo select").removeClass('layui-disabled');
        $("#btnCancel").show();
        $("#btnSave").show();
        // $("#btnSave").show();
        // $("#btnSave").text('提交项目质态评估')
        $("#sixpro_code").attr("disabled", true);
        $("#sixpro_code").addClass("layui-disabled");
        $("#foreign_money").attr("disabled", true);
        $("#foreign_money").addClass("layui-disabled");
        $("input[name=p_type][value=" + 1 + "]").prop("checked", true);
        $("#signed_stat_date").prop('readonly', true);
        $("#signed_date").prop('readonly', true);
        $("#plan_start_date").prop('readonly', true);
        $("#plan_end_date").prop('readonly', true);
        $("#signed_stat_date").addClass("layui-disabled");
        $("#sjjg_name").prop('readonly', true);
        biz_info._id = null;
        biz_info.pg_status = null
        //设置当前项目的_id=""
        $("#_id").val("");
        //清空表单元素
        _UTIL.html.emptyContainerElements("detailInfo");
        fileProjArr = [];
        setprivilege();
        $("#file_project").html("");
        $("#file_project1").html("");
        _UTIL.dialog.openRightDialog("detailInfo", '添加信息', '840px');
        // $("#detailInfo").show().css({"width": "800px"});
        // $("#detailInfo .title").html('添加项目信息');
        // fileProjArr = [];
        var time = new Date();
        var day = ("0" + time.getDate()).slice(-2);
        var month = ("0" + (time.getMonth() + 1)).slice(-2);
        var today = time.getFullYear() + "-" + (month) + "-" + (day);
        //获取用户信息
        var user_info = _UTIL.storage.get("USER_INFO");
        user_info = JSON.parse(user_info);
        if (user_info.user_level == 3 || user_info.user_level == 4) {
            var label = " <option value=\"" + user_info.zone_code + "\">" + user_info.zone_name + "</option>";
            $("#zone_code").html(label);
            layui.form.render('select');
        }
        //签约统计日期为当前的
        $('#signed_stat_date').val(today);
        $("#span").text("亿元");
        $(".moneyText").text("万元");
        $("#proj_type").val("");
        $("#industry_code").val("");
        $("#industry_name").val("");
        treeSelect.revokeNode('industry_code', function (d) {
        });
        treeSelect.revokeNode('proj_type', function (d) {
        });
        // treeSelect.checkNode('ra_proj_type', "");
        // treeSelect.checkNode('industry_code', "");

        if (fileProjArr.length == 0) {
            $("#file_project").html("<li>无</li>")
        }
        fzInit();
    },
    cancel: function () {
        biz_info.btnCancel();
    },
    //渲染园区数据
    renderZone: function (callback) {
        var dcode = $("#district_code").val();
        $("#zone_code").empty();
        $("#town_code").empty();
        if (dcode.length > 0) {
            _UTIL.network.post("getDeptByPidForTreeSelect.do", {p_id: dcode}, 15000, function (result) {
                var label = "<option value=\"\">请选择</option>";
                for (var i = 0; i < result.data.datalist.length; i++) {
                    label += " <option value=\"" + result.data.datalist[i].dept_code + "\">" + result.data.datalist[i].dept_name + "</option>";
                }
                $("#zone_code").html(label);
                layui.form.render('select');
                if (callback) {
                    callback();
                }
            });
        }
    },
    //渲染头部园区数据
    renderSZone: function (callback) {
        var sdcode = $("#s_district_code").val();
        $("#s_zone_code").empty();
        $("#s_town_code").empty();
        if (sdcode.length > 0) {

            _UTIL.network.post("getDeptByPidForTreeSelect.do", {p_id: sdcode}, 15000, function (result) {
                console.log(result);
                var label = "<option value=\"\">请选择</option>";
                for (var i = 0; i < result.data.datalist.length; i++) {
                    label += " <option value=\"" + result.data.datalist[i].dept_code + "\">" + result.data.datalist[i].dept_name + "</option>";
                }
                $("#s_zone_code").html(label);

                layui.form.render('select');
                if (callback) {
                    callback();
                }
            });
        }
    },
    //渲染街镇数据
    renderTown: function (callback) {
        var dcode = $("#zone_code").val();
        $("#town_code").empty();
        if (dcode && dcode.length > 0) {
            _UTIL.network.post("getDeptByPidForTreeSelect.do", {p_id: dcode}, 15000, function (result) {
                var label = "<option value=\"\">请选择</option>";
                for (var i = 0; i < result.data.datalist.length; i++) {
                    label += " <option value=\"" + result.data.datalist[i].dept_code + "\">" + result.data.datalist[i].dept_name + "</option>";
                }
                $("#town_code").html(label);
                layui.form.render('select');
                if (callback) {
                    callback();
                }
            });
        }
    },
    //渲染头部街镇数据
    renderSTown: function (callback) {
        var sZcode = $("#s_zone_code").val();
        $("#s_town_code").empty();
        if (sZcode && sZcode.length > 0) {
            _UTIL.network.post("getDeptByPidForTreeSelect.do", {p_id: sZcode}, 15000, function (result) {
                var label = "<option value=\"\">请选择</option>";
                for (var i = 0; i < result.data.datalist.length; i++) {
                    label += " <option value=\"" + result.data.datalist[i].dept_code + "\">" + result.data.datalist[i].dept_name + "</option>";
                }
                $("#s_town_code").html(label);
                layui.form.render('select');
                if (callback) {
                    callback();
                }
            });
        }
    },

    save1 () {
        if ($("#btnSave").text() == '提交') {
            layer.confirm('该项目已与我园区（镇街）签订正式合同，以上信息确切无误，附件资料真实、有效。我园区（镇街）已知悉计入市级机关部门（单位）的签约项目，不再纳入市（区）、园区签约项目总数考核。', {
                btn: ['确定', '关闭'] //按钮
            }, function(index){
                layer.close(index);
                biz_info.save()
            }, function(){

            });
        } else {
            biz_info.save()
        }
    },

    save: function (check_status) {

        //获取当前的_id
        // var _id = $("#_id").val();
        var _id = biz_info._id;
        //获取全部数据
        var data = _UTIL.html.getContainerElementsValue("detailInfo");
        var investor_type = $("#investor_type ").val();
        if (fzList.length > 3) {
            data.fzList = fzList.map((item, index) => {
                return parseInt(index + 1) + '、' + item
            }).slice(0, -3)
            console.log(data.fzList, 888)
        }
        data['investor_type'] = investor_type;
        //获取单选按钮值
        // var p_type = document.getElementsByName("p_type");//项目类别
        // //获取p_type
        // if ($(p_type[0]).prop("checked")) {
        //     data['p_type'] = 1;
        // } else {
        //     data['p_type'] = 2;
        // }
        data['p_type'] = $('input[name="p_type"]:checked').val();
        data['is_sixpro'] = $('input[name="is_sixpro"]:checked').val();
        data['is_import_proj'] = $('input[name="is_import_proj"]:checked').val();
        data['is_sj_proj'] = $('input[name="is_sj_proj"]:checked').val();
        data['is_kc_proj'] = $('input[name="is_kc_proj"]:checked').val();
        data['is_build_yfzx'] = $('input[name="is_build_yfzx"]:checked').val();
        data['is_gxjs'] = $('input[name="is_gxjs"]:checked').val();
        data['is_rzxq'] = $('input[name="is_rzxq"]:checked').val();
        // data['is_warning_invest'] = $('input[name="is_warning_invest"]:checked').val();


        // var proj_type = document.getElementsByName("ra_proj_type"); //传统产业 or 战略新兴产业
        // if (info.proj_type == "c") {
        //     $(proj_type[0]).prop("checked",true);
        //     $("#div_proj_type").hide();
        // } else {
        //     $(proj_type[1]).prop("checked",true);
        //     $("#div_proj_type").show();
        // }
        data['b_industry'] = $('input[name="b_industry"]:checked').val();
        data['b_resource'] = $('input[name="b_resource"]:checked').val();
        if (data.district_code && data.district_code.length > 0) {
            data['district'] = $("#district_code option:selected").text();
        }
        if (data.zone_code && data.zone_code.length > 0) {
            data['zone_name'] = $("#zone_code option:selected").text();
        }
        if (data.town_code && data.town_code.length > 0) {

            data['town_name'] = $("#town_code option:selected").text();
        }
        if (data.industry_first_code && data.industry_first_code.length > 0) {
            data['industry_first_name'] = $("#industry_first_code option:selected").text();
        }
        //设置小数
        var invest_money = $("#invest_money").val().trim();
        var foreign_money = $("#foreign_money").val().trim();
        data['sixpro_code'] = $("#sixpro_code").val();
        if (invest_money == "") {
            data['invest_money'] = 0;
        }
        if (foreign_money == "") {
            data['foreign_money'] = 0;
        }

        var files = $("#file_project a");
        var times = $("#file_project .create_time");
        var fileArr = [];
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            let time = times[i]
            var ob = {};
            ob.file_path = $(file).attr("href").replace(upload_file_path_proj, "");
            // ob.file_path = $(file).attr("href");
            ob.filename = $(file).text();
            ob.create_time = $(time).text();
            ob.cate_code = '0'
            fileArr.push(ob);
        }

        var files1 = $("#file_project1 a");
        var fileArr1 = [];
        for (var i = 0; i < files1.length; i++) {
            var file1 = files1[i];
            var ob = {};
            ob.file_path = $(file1).attr("href").replace(upload_file_path_proj, "");
            // ob.file_path = $(file).attr("href");
            ob.filename = $(file1).text();
            ob.cate_code = '99'
            fileArr1.push(ob);
        }

        var files6= $("#file_project_new6 a");
        var fileArr6 = [];
        for (var i = 0; i < files6.length; i++) {
            var file6 = files6[i];
            var ob = {};
            ob.file_path = $(file6).attr("href").replace(upload_file_path_proj, "");
            // ob.file_path = $(file).attr("href");
            ob.filename = $(file6).text();
            ob.cate_code = '66'
            fileArr6.push(ob);
        }
        data['imgArr1'] = fileArr;
        data['imgArr'] = [...fileArr, ...fileArr1, ...fileArr6];
        data['ztpgzzcl'] = fileArr1.map(item => 'http://172.22.26.71:54934/images/' + item.file_path).join(';')
        data['xyzzcl'] = fileArr.map(item => 'http://172.22.26.71:54934/images/' + item.file_path).join(';')
        // console.log(data);
        // var ob = {};
        // ob.filename = res.data.fileName;
        // ob.file_path = res.data.src;
        //存放图片的数组
        // data['imgArr'] = fileProjArr;
        // if (fileProjArr.length == 0) {
        //     _UTIL.msg.warn("请选择需要上传的文件");
        //     return false;
        // }
        data['progress'] = 0;
        //设置当前的项目_id
        data['_id'] = _id;
        if (biz_info.pg_status) {
            data['pg_status'] = biz_info.pg_status;
        }
        //设置状态为保存未提交
        if (!check_status) {  //如果传了这个值
            check_status = 0;
            if ($('input[name="b_resource"]:checked').val() == 1) {
                if ($('input[name="p_type"]:checked').val() == 1) {
                    if ( $('#invest_money').val() && Number($('#invest_money').val()) < 5 ) {
                        data['pg_status'] = 3
                    }
                } else {
                    if ( $('#invest_money').val() && Number($('#invest_money').val()) < 3000 ) {
                        data['pg_status'] = 3
                    }
                }
            }
        }
        data['check_status'] = check_status;
        data['cate_code'] = '0';
        data['cate_code1'] = '99';
        if (key) {
            data['qr_key'] = key
        }
        _UTIL.biz.save("SaveProjProjSigned.do", data, 15000, function () {
            //清空数组
            fileProjArr = [];
            index = 0;
            var table = layui.table;
            table.reload('datalist');
            // _UTIL.dialog.closeAll();
            biz_info.cancel();
            _UTIL.msg.success("操作成功");
        });
    },
    //存入草稿箱
    drafts: function (info) {
        biz_info.save(4)
    },
    setElementValue: function (id, value) {
        console.log(id, value)
        var obj = $("#" + id);
        console.log(obj)
        if (obj === undefined || obj[0] === undefined) {
            return;
        }
        if (obj[0].tagName.toLocaleLowerCase() === "textarea") {
            obj.val(value);
        } else if (obj[0].tagName.toLocaleLowerCase() === "select") {
            obj.val(value);
        } else if (obj[0].tagName.toLocaleLowerCase() === 'input') {
            $("#" + id).val(value);
        } else {
            obj.html(value);
        }
    },
    emptyElementValue: function (id) {
        var obj = $("#" + id);
        if (obj === undefined || obj[0] === undefined) {
            return;
        }
        if (obj[0].tagName.toLocaleLowerCase() === "textarea") {
            obj.val('');
        } else if (obj[0].tagName.toLocaleLowerCase() === "select") {
            obj.val('');
        } else if (obj[0].tagName.toLocaleLowerCase() === 'input') {
            $("#" + id).val('');
        } else {
            obj.html('');
        }
    },
    bandSuccess: function () {

        dialog2 = _UTIL.dialog.openRightDialog("check_bandBox", '正常绑定', '1200px')
        _UTIL.network.post("getBdzxspInfo.do", {signed_id: biz_info._id, status: 1,listType: 1}, 15000, function (result) {
            // console.log(result.data.datalist.length);
            // _UTIL.html.setValues(result.data.info)
            console.log(result, 44)
            for (var key in result.data.info) {
                biz_info.setElementValue(key, result.data.info[key]);
            }
        })
        // _UTIL.html.setValues(info)
    },
    bandSuccess2: function () {

        dialog2 = _UTIL.dialog.openRightDialog("check_bandBox2", '正常绑定', '1200px')
        _UTIL.network.post("getBdzxspInfo.do", {signed_id: biz_info._id, status: 1, listType: 2}, 15000, function (result) {
            // console.log(result.data.datalist.length);
            // _UTIL.html.setValues(result.data.info)
            console.log(result, 44)
            for (var key in result.data.info) {
                biz_info.setElementValue(key + '2', result.data.info[key]);
            }
        })
        // _UTIL.html.setValues(info)
    },
    bandErrors: function (info) {
        let infoObj = JSON.parse(info)
        listType = 1
        dialog3 = _UTIL.dialog.openRightDialog("error_bandBox", '异常绑定', '1200px')
        for (var key in infoObj) {
            biz_info.setElementValue(key + '1', infoObj[key]);
        }
        // _UTIL.html.setValues(info)
    },
    bandErrors2: function (info) {
        let infoObj = JSON.parse(info)
        listType = 2
        dialog3 = _UTIL.dialog.openRightDialog("error_bandBox", '异常绑定', '1200px')
        for (var key in infoObj) {
            biz_info.setElementValue(key + '1', infoObj[key]);
        }
        // _UTIL.html.setValues(info)
    },
    // 绑定
    band: function (info) {
        console.log(info)
        successObj = info
        biz_info.band_id = info.id
        layer.confirm('是否确认绑定该项目?', function (index) {
            _UTIL.dialog.close(index);
            successObj.signed_id = biz_info._id
            successObj.online_approvalId = biz_info.band_id
            _UTIL.network.post("bdzxsp.do", {...successObj, listType: 1}, 8000, function (res) {
                _UTIL.msg.success("绑定成功");
                var cols = [
                    [
                        // {type: 'checkbox', fixed: 'left'},
                        {field: 'project_code', title: '项目编码'}
                        , {field: 'project_name', title: '项目名称'}
                        , {field: 'project_type_label', title: '项目审批类型', align: 'center'}
                        , {field: 'construction_scale_and_content', title: '项目内容'}
                        , {field: 'total_investment', title: '总投资(万元)', align: 'center'}
                        , {field: 'legal_company_contactName', title: '申报公司联系人', align: 'center'}
                        , {field: 'legal_company_contact_phone', title: '申报人手机号', align: 'center'}
                        , {fixed: 'right', templet: '#operations1', minWidth: 80, title: '操作', align: 'center'}
                    ]
                ];
                var where = {
                    listType: 1,
                    excludeInvestOnlineId: biz_info._id
                };
                biz_info.layuiTableRenderS1("datalist1", "getOnlineApprovalPage.do", 10, cols, where, function (res, curr, count) {
                    // console.log(res, 88888)
                });
                _UTIL.network.post("getOnlineApprovalPage.do", {listType: 1,  includeInvestOnlineId: biz_info._id, size: 100, page: 1}, 15000, function (res) {
                    // console.log(res, 'olList')
                    olList = res.data.datalist
                    let temp = olList.map((item,index)=>{
                        let myStr = JSON.stringify(item).replaceAll('"','&quot;');
                        return `<table class="layui-table ">
                    <tr>
                        <td style="border-right: none;color: #999;font-weight: bold">备案证</td>
                        <td colspan="3" style="text-align: right;border-left: none">
                            <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.showband(\`${myStr}\`)">
                                详情
                            </button>
                            <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.delband(\`${item.id}\`)">
                                解绑
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td class="td-label">备案（核准）项目代码</td>
                        <td><input type="text" disabled value="${item.project_code}" class="layui-input" autocomplete="off"/></td>
                        <td class="td-label">备案（核准）项目名称</td>
                        <td><input type="text" disabled value="${item.project_name}" class="layui-input" autocomplete="off"/></td>
                    </tr>
                    <tr>
                        <td class="td-label">备案（核准）投资总额（万元）</td>
                        <td><input type="text" disabled value="${item.total_investment}" class="layui-input" autocomplete="off"/></td>
                        <td class="td-label">备案（核准）日期</td>
                        <td><input type="text" disabled value="${item.application_time}" class="layui-input" autocomplete="off"/></td>
                    </tr>
                </table>`;
                    }).join('');
                    $('#tableBox1').html(temp);
                })
                // _UTIL.dialog.closeAll()
                // _UTIL.dialog.openRightDialog("approbationBox", "项目进度信息", '760px');
            });
            // _UTIL.dialog.close(dialog1);
            // _UTIL.dialog.close(dialog2);
            for (let key in successObj) {
                biz_info.emptyElementValue(key)
            }
            // $("#bandBtn1").show()
            // $("#bandBtn").hide()
            // $(".xyBands").show()
            // $(".xyBand").hide()
            // $(".xyBands1").show()
            // $(".xyBand1").hide()
        }, function (index) {
            _UTIL.dialog.close(index);
            for (let key in successObj) {
                biz_info.emptyElementValue(key)
            }
            // $("#bandBtn").show()
            // $("#bandBtn1").hide()
            // $(".xyBands").hide()
            // $(".xyBand").show()
            // $(".xyBands1").hide()
            // $(".xyBand1").show()
        });
        // dialog2 = _UTIL.dialog.openRightDialog("check_bandBox", '在线审批项目绑定', '1200px')
        // for (var key in info) {
        //     biz_info.setElementValue(key, info[key]);
        // }
    },
    showband: function (info) {
        let infos = {}
        if (typeof info === 'string') {
            infos = JSON.parse(info)
        } else {
            infos = info
        }
        // _UTIL.dialog.closeAll()
        dialog2 = _UTIL.dialog.openRightDialog("check_bandBox", '在线审批项目绑定', '1200px')
        // console.log(biz_info, 999)
        for (var key in infos) {
            biz_info.setElementValue(key, infos[key]);
        }
    },
    delband: function (id) {
        layer.confirm('是否确认解绑该项目?', function (index) {
            _UTIL.dialog.close(index);
            _UTIL.network.post("jbzxspSuccess.do", {id: id, signed_id: biz_info._id, listType: 1}, 8000, function (res) {
                _UTIL.msg.success("解绑成功");
                _UTIL.network.post("getOnlineApprovalPage.do", {listType: 1,  includeInvestOnlineId: biz_info._id, size: 100, page: 1}, 15000, function (res) {
                    // console.log(res, 'olList')
                    olList = res.data.datalist
                    let temp = olList.map((item,index)=>{
                        let myStr = JSON.stringify(item).replaceAll('"','&quot;');
                        return `<table class="layui-table ">
                    <tr>
                        <td style="border-right: none;color: #999;font-weight: bold">备案证</td>
                        <td colspan="3" style="text-align: right;border-left: none">
                            <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.showband(\`${myStr}\`)">
                                详情
                            </button>
                            <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.delband(\`${item.id}\`)">
                                解绑
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td class="td-label">备案（核准）项目代码</td>
                        <td><input type="text" disabled value="${item.project_code}" class="layui-input" autocomplete="off"/></td>
                        <td class="td-label">备案（核准）项目名称</td>
                        <td><input type="text" disabled value="${item.project_name}" class="layui-input" autocomplete="off"/></td>
                    </tr>
                    <tr>
                        <td class="td-label">备案（核准）投资总额（万元）</td>
                        <td><input type="text" disabled value="${item.total_investment}" class="layui-input" autocomplete="off"/></td>
                        <td class="td-label">备案（核准）日期</td>
                        <td><input type="text" disabled value="${item.application_time}" class="layui-input" autocomplete="off"/></td>
                    </tr>
                </table>`;
                    }).join('');
                    $('#tableBox1').html(temp);
                })
            });
        }, function (index) {
            _UTIL.dialog.close(index);
        });
    },
    // 绑定
    band2: function (info) {
        console.log(info)
        successObj2 = info
        biz_info.band_id = info.id
        layer.confirm('是否确认绑定该项目?', function (index) {
            _UTIL.dialog.close(index);
            successObj2.signed_id = biz_info._id
            successObj2.construction_approval_id = biz_info.band_id
            _UTIL.network.post("bdzxsp.do", {...successObj2, listType: 2}, 8000, function (res) {
                _UTIL.msg.success("绑定成功");
                var cols = [
                    [
                        {field: 'project_code', title: '项目编码'}
                        , {field: 'project_name', title: '项目名称'}
                        , {field: 'project_type_label', title: '项目审批类型', align: 'center'}
                        , {field: 'construction_content', title: '建设内容'}
                        , {field: 'total_investment', title: '总投资(万元)', align: 'center'}
                        , {field: 'legal_company_contactName', title: '申报公司联系人', align: 'center'}
                        , {field: 'legal_company_contact_phone', title: '申报人手机号', align: 'center'}
                        , {fixed: 'right', templet: '#operations2', minWidth: 80, title: '操作', align: 'center'}
                    ]
                ];
                var where = {
                    listType: 2,
                    excludeInvestOnlineId: biz_info._id
                };
                biz_info.layuiTableRenderS1("datalist2", "getOnlineApprovalPage.do", 10, cols, where, function (res, curr, count) {

                });
                _UTIL.network.post("getOnlineApprovalPage.do", {listType: 2,  includeInvestOnlineId: biz_info._id, size: 100, page: 1}, 15000, function (res) {
                    bpList = res.data.datalist
                    let temp = bpList.map((item,index)=>{
                        let myStr = JSON.stringify(item).replaceAll('"','&quot;');
                        return `<table class="layui-table ">
                    <tr>
                        <td style="border-right: none;color: #999;font-weight: bold">报批证</td>
                        <td colspan="3" style="text-align: right;border-left: none">
                            <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.showband2(\`${myStr}\`)">
                                详情
                            </button>
                            <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.delband2(\`${item.id}\`)">
                                解绑
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td class="td-label">项目代码</td>
                        <td><input type="text" disabled value="${item.project_code}" class="layui-input" autocomplete="off"/></td>
                        <td class="td-label">项目名称</td>
                        <td><input type="text" disabled value="${item.project_name}" class="layui-input" autocomplete="off"/></td>
                    </tr>
                </table>`;
                    }).join('');
                    $('#tableBox2').html(temp);
                })
            });
            // _UTIL.dialog.close(dialog1);
            // _UTIL.dialog.close(dialog2);
            for (let key in successObj2) {
                biz_info.emptyElementValue(key + '2')
            }
        }, function (index) {
            _UTIL.dialog.close(index);
            for (let key in successObj2) {
                biz_info.emptyElementValue(key + '2')
            }
            // $("#bandBtn").show()
            // $("#bandBtn1").hide()
            // $(".xyBands").hide()
            // $(".xyBand").show()
            // $(".xyBands1").hide()
            // $(".xyBand1").show()
        });
        // dialog2 = _UTIL.dialog.openRightDialog("check_bandBox", '在线审批项目绑定', '1200px')
        // for (var key in info) {
        //     biz_info.setElementValue(key, info[key]);
        // }
    },
    showband2: function (info) {
        let infos = {}
        if (typeof info === 'string') {
            infos = JSON.parse(info)
        } else {
            infos = info
        }
        dialog4 = _UTIL.dialog.openRightDialog("check_bandBox2", '工程审批项目绑定', '1200px')
        // console.log(biz_info, 999)
        for (var key in infos) {
            biz_info.setElementValue(key + '2', infos[key]);
        }
    },
    delband2: function (id) {
        layer.confirm('是否确认解绑该项目?', function (index) {
            _UTIL.dialog.close(index);
            _UTIL.network.post("jbzxspSuccess.do", {id: id, signed_id: biz_info._id, listType: 2}, 8000, function (res) {
                _UTIL.msg.success("解绑成功");
                _UTIL.network.post("getOnlineApprovalPage.do", {listType: 2,  includeInvestOnlineId: biz_info._id, size: 100, page: 1}, 15000, function (res) {
                    bpList = res.data.datalist
                    let temp = bpList.map((item,index)=>{
                        let myStr = JSON.stringify(item).replaceAll('"','&quot;');
                        return `<table class="layui-table ">
                    <tr>
                        <td style="border-right: none;color: #999;font-weight: bold">报批证</td>
                        <td colspan="3" style="text-align: right;border-left: none">
                            <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.showband2(\`${myStr}\`)">
                                详情
                            </button>
                            <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.delband2(\`${item.id}\`)">
                                解绑
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td class="td-label">项目代码</td>
                        <td><input type="text" disabled value="${item.project_code}" class="layui-input" autocomplete="off"/></td>
                        <td class="td-label">项目名称</td>
                        <td><input type="text" disabled value="${item.project_name}" class="layui-input" autocomplete="off"/></td>
                    </tr>
                </table>`;
                    }).join('');
                    $('#tableBox2').html(temp);
                })
            });
        }, function (index) {
            _UTIL.dialog.close(index);
        });
    },
    bandError: function () {
        // $('.xyBand1').show()
        listType = 1
        dialog3 = _UTIL.dialog.openRightDialog("error_bandBox", '异常绑定', '1200px')
        successObj = {
            application_company_contact_name: '',
            application_company_contact_phone: '',
            project_code: '',
            project_name: '',
            total_investment: '',
            application_time: ''
        }
        for (let key in successObj) {
            biz_info.emptyElementValue(key + '1')
        }
    },
    bandError2: function () {
        // $('.xyBand1').show()
        listType = 2
        dialog3 = _UTIL.dialog.openRightDialog("error_bandBox", '异常绑定', '1200px')
        successObj = {
            application_company_contact_name: '',
            application_company_contact_phone: '',
            project_code: '',
            project_name: '',
            total_investment: '',
            application_time: ''
        }
        for (let key in successObj) {
            biz_info.emptyElementValue(key + '1')
        }
    },
    //添加备注
    remarks: function (info) {
        biz_info._id = info._id;
        _UTIL.network.post("getProjProjectSignedById.do", {_id: info._id}, 15000, function (result) {
            _UTIL.dialog.openDialog("remarksDetail", "添加备注信息", "400", "500")
            $("#remarks").val(result.data.info.remarks);
        });
    },
    //保存备注
    saveRemarks: function () {
        var data = _UTIL.html.getContainerElementsValue("remarksDetail");
        data['_id'] = biz_info._id;
        if (data.valid) {
            _UTIL.network.post("saveRemarks.do", data, 18000, (res) => {
                layui.table.reload("datalist")
                _UTIL.dialog.closeAll();
                biz_info.cancel();
            })
        }
    },
    //到账资金
    receivedMoneyEdit: function (info) {
        biz_info._id = info._id;
        $("#ulli").html("");
        _UTIL.dialog.openRightDialog("receivedMoneyBox", '添加到账资金', '750px');
        //项目的_id
        $("#_id").val(info._id);
        //    根据项目的_id获取数据
        _UTIL.network.post("getReceivedMoneyById.do", {proj_id: info._id}, 15000, function (result) {
            if (result.data.length == 0) {
                $("#total").text(0);
            }
            if (result.data.length != 0) {
                //遍历数据
                var total = 0;
                for (var i = 0; i < result.data.length; i++) {
                    var label = " <div class=\"layui-row\" name='bDateAndreceivedMoney'>\n" +
                        "                <div class=\"layui-col-md6\">\n" +
                        "                    <div class=\"layui-form-item\">\n" +
                        "                        <label class=\"layui-form-label\">日期</label>\n" +
                        "                        <div class=\"layui-input-inline\">\n" +
                        "                            <input type=\"text\" name='b_date' class=\"layui-input\" value='" + result.data[i]['b_date'] + "' autocomplete=\"off\" readonly/>\n" +
                        "                        </div>\n" +
                        "                    </div>\n" +
                        "                </div>\n" +
                        "                <div class=\"layui-col-md6\">\n" +
                        "                    <div class=\"layui-form-item\">\n" +
                        "                        <label class=\"layui-form-label\">到账金额</label>\n" +
                        "                        <div class=\"layui-input-inline\">\n" +
                        "                            <input type=\"text\" rule=\"ffs\" name='received_money' class=\"layui-input\" value='" + result.data[i]['received_money'] + "' autocomplete=\"off\" />\n" +
                        "                        </div>\n" +
                        "                    </div>\n" +
                        "                </div>\n" +
                        "            </div>";
                    var obj = {};
                    obj.bdate = result.data[i]['b_date'];
                    obj.receivedMoney = result.data[i]['received_money'];
                    bDateAndreceivedMoneysArray.push(obj);
                    $("#ulli").append(label);
                    total += result.data[i]['received_money'];
                }
                var bdates = $("input[name=b_date]");
                for (var i = 0; i < bdates.length; i++) {
                    var bdate = bdates[i];
                    layui.laydate.render({
                        elem: bdate,
                        trigger: "click"
                    });
                }
                $("#total").text(total);
            }
        });

    },
    //新增到账资金li
    addLi: function (info) {
        //新增row
        var label = " <div class=\"layui-row\" name='bDateAndreceivedMoney'>\n" +
            "                <div class=\"layui-col-md6\">\n" +
            "                    <div class=\"layui-form-item\">\n" +
            "                        <label class=\"layui-form-label\">日期</label>\n" +
            "                        <div class=\"layui-input-inline\">\n" +
            "                            <input type=\"text\" name='b_date' class=\"layui-input\" autocomplete=\"off\" readonly/>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "                <div class=\"layui-col-md6\">\n" +
            "                    <div class=\"layui-form-item\">\n" +
            "                        <label class=\"layui-form-label\">到账金额</label>\n" +
            "                        <div class=\"layui-input-inline\">\n" +
            "                            <input type=\"text\" rule=\"ffs\" name='received_money'  class=\"layui-input\" autocomplete=\"off\"/>\n" +
            "                        </div>\n" +
            "                    </div>\n" +
            "                </div>\n" +
            "            </div>";
        //新增
        $("#ulli").append(label);
        //渲染b_date
        var bdates = $("input[name=b_date]");
        for (var i = 0; i < bdates.length; i++) {
            var bdate = bdates[i];
            layui.laydate.render({
                elem: bdate,
                trigger: "click"
            });
        }
    },
    //减少到账资金li
    decr: function () {
        //移除元素根据name=bDateAndreceivedMoney
        var bDateAndreceivedMoneys = $("div[name=bDateAndreceivedMoney]");
        //移除一行
        $(bDateAndreceivedMoneys[bDateAndreceivedMoneys.length - 1]).remove();
    },
    //保存到账资金
    btnSaveReceivedMoney: function () {
        //获取日期
        var bDates = $("input[name=b_date]");
        //获取金额
        var receivedMoneys = $("input[name=received_money]");
        //一行
        var bDateAndreceivedMoneys = $("div[name=bDateAndreceivedMoney]");
        //验证
        for (var i = 0; i < bDateAndreceivedMoneys.length; i++) {
            var bDate = $(bDates[i]).val();
            if (bDate == "") {
                layui.layer.msg("请选择日期");
                return false;
            }
        }
        var proj_id = biz_info._id;
        if (bDateAndreceivedMoneys.length == 0) {
            bDateAndreceivedMoneysArray = [];
        } else {
            //获取值存入数组
            bDateAndreceivedMoneysArray = [];
            for (var i = 0; i < bDateAndreceivedMoneys.length; i++) {
                //获取金额
                var receivedMoney = $(receivedMoneys[i]).val();
                var bDate = $(bDates[i]).val();
                var obj = {};
                //放置bdate
                obj.bdate = bDate;
                //放置receivedMoney
                if (receivedMoney == "") {
                    obj.receivedMoney = "0";
                } else {
                    if (!_UTIL.validate.number(receivedMoney)) {
                        layui.layer.tips('请填写数字', $(receivedMoneys[i]), {
                            tips: [4, '#ff7088'],
                            tipsMore: true
                        });
                        return;
                    }
                    obj.receivedMoney = receivedMoney;
                }
                //放置在数组中
                bDateAndreceivedMoneysArray.push(obj);
            }
        }
        //proj_id:项目的_id
        _UTIL.biz.save("updateOrSaveBDateAndreceivedMoneys.do", {
            "bDateAndreceivedMoneysArrays": bDateAndreceivedMoneysArray,
            proj_id: proj_id
        }, 15000, function (result) {
            bDateAndreceivedMoneysArray = [];
            $("#ulli").html("");
            //清空数组
            var table = layui.table;
            table.reload('datalist');
            _UTIL.dialog.closeAll();
            _UTIL.msg.success("操作成功");
        });
    },
    //编辑

    // 报批信息
    progress1: function (info) {
        //获取当前的_id
        biz_info._id = info._id;
        $('#approbationLi').click();
        // //打开窗口
        $("#approbationBox input").attr("disabled",true);
        $("#approbationBox button").attr("disabled",true);
        $("#approbationBox input").addClass("layui-disabled");
        $("#approbationBox button").addClass("layui-disabled");
        $('[need-hide]').hide();
        $('#saveBeginningTT').show();
        $('#saveBeginningTR').show();
        $('#saveEndTT').show();
        $('#saveEndTR').show();
        _UTIL.html.emptyContainerElements("approbationBox");
        _UTIL.dialog.openRightDialog("approbationBox", "项目进度信息", '760px');
        var time = new Date();
        var day = ("0" + time.getDate()).slice(-2);
        var month = ("0" + (time.getMonth() + 1)).slice(-2);
        var today = time.getFullYear() + "-" + (month) + "-" + (day);
        //注册统计日期为当前的
        $('#reg_stat_date').val(today);
        //设置备案统计日期为当前的
        $('#check_stat_date').val(today);
        //设置报批信息为当前的
        $("#finish_check_date").val(today)
        if (info.kg_zydw) {
            $('#kg_zone_name').val(info.kg_zydw)
        } else {
            if (info.town_name) {
                $('#kg_zone_name').val(info.town_name)
            } else {
                $('#kg_zone_name').val(info.zone_name)
            }
        }
        $('#kg_name').val(info.kg_xmmc ? info.kg_xmmc : info._name)
        $('#kg_investor').val(info.kg_tzfmc ? info.kg_tzfmc : info.investor)
        $('#kg_project_address').val(info.kg_xmdz ? info.kg_xmdz : info.project_address)
        $('#kg_signed_date').val(info.kg_qyrq ? info.kg_qyrq : info.signed_stat_date)
        if (info.kg_xmlx) {
            $("input[name=kg_b_industry][value=" + info.kg_xmlx + "]").prop("checked", true);
        } else {
            $("input[name=kg_b_industry][value=" + info.b_industry + "]").prop("checked", true);
        }
        if (info.kg_kcxm) {
            $("input[name=kg_is_kc_proj][value=" + info.kg_kcxm + "]").prop("checked", true);
            if (info.kg_kcxm == '是') {
                $('#kg_kc_proj_div').show()
                $('#kg_kc_proj_tj').val(info.kg_kcxm_rdtj || '')
            } else {
                $('#kg_kc_proj_div').hide()
                $('#kg_kc_proj_tj').val('')
            }
        } else {
            $("input[name=kg_is_kc_proj][value=" + info.is_kc_proj + "]").prop("checked", true);
            if (info.is_kc_proj == '是') {
                $('#kg_kc_proj_div').show()
                $('#kg_kc_proj_tj').val(info.kc_proj_tj || '')
            } else {
                $('#kg_kc_proj_div').hide()
                $('#kg_kc_proj_tj').val('')
            }
        }
        if (info.is_kc_proj == '是') {
            $("#kg_zkc_div").hide()
            if (info.kc_proj_type == '高层次人才类') {
                $("#rc_div").show()
            } else {
                $("#rc_div").hide()
            }
        } else {
            $("#kg_zkc_div").show()
        }
        if (info.kg_is_zkc == '是') {
            $("#kc_div").show()
        } else {
            $("#kc_div").hide()
        }

        if (info.is_kc_proj == '是' || info.kg_is_zkc == '是') {
            $("#jg_zkc_div").hide()
            $(".qy_info").show()
            $("#jg_message").show()
        }
        if (info.is_kc_proj == '否' || info.kg_is_zkc == '否') {
            $("#jg_zkc_div").show()
            $(".qy_info").hide()
            $("#jg_message").hide()
        }
        if (info.jg_is_zkc == '是') {
            $(".qy_info").show()
            $("#jg_message").show()
        } else if (info.jg_is_zkc == '否') {
            $(".qy_info").hide()
            $("#jg_message").hide()
        }
        if (info.kg_qflp) {
            $('#kg_is_qflp').val(info.kg_qflp)
        } else {
            $('#kg_is_qflp').val(info.is_qflp || '')
        }
        if (info.kg_tyxydm) {
            $('#kg_u_code').val(info.kg_tyxydm)
        } else {
            $('#kg_u_code').val(info.u_code || '')
        }
        if (info.kg_zcrq) {
            $('#kg_reg_date').val(info.kg_zcrq)
        } else {
            $('#kg_reg_date').val(info.reg_date || '')
        }
        if (info.kg_jsnr) {
            $('#kg_desc').val(info.kg_jsnr)
        } else {
            $('#kg_desc').val(info._desc || '')
        }
        $('#start_date_commit').val(info.start_date_commit || '')
        $('#complete_date').val(info.complete_date || '')
        if (info["kg_hydm"]) {
            treeSelect.checkNode('kg_industry_code', info.kg_hydm);
        } else {
            treeSelect.checkNode('kg_industry_code', info.industry_code);
        }
        if (info["kg_cyfx"]) {
            treeSelect.checkNode('kg_proj_type', info.kg_cyfx);
        } else {
            treeSelect.checkNode('kg_proj_type', info.proj_type);
        }
        if (info.kg_ztz) {
            $('#kg_invest_money').val(info.kg_ztz)
        } else {
            $('#kg_invest_money').val(info.invest_money || '')
        }
        if (info.p_type == 1) {
            $("#span1").text("亿元");
        } else {
            $("#span1").text("万美元");
        }
        if (info.kg_gdzctz) {
            $('#kg_fixed_invest').val(info.kg_gdzctz)
        } else {
            $('#kg_fixed_invest').val(info.fixed_invest || '')
        }
        $('#pzwh').val(info.pzwh || '')
        $('#pzrq').val(info.pzrq || '')
        $('#cxqk').val(info.cxqk || '')
        if (info.p_type == 1) {
            $("#wztd").hide()
            $("#wztd2").hide()
            $("#reg_foreign_money").removeClass("required");
        } else {
            $("#wztd").show()
            $("#wztd2").show()
            $("#reg_foreign_money").addClass("required");
        }
        // $("#beginning input").removeAttr("disabled");
        // $("#beginning button").removeAttr("disabled");
        // $("#kg_is_qflp").removeAttr("disabled");
        // $("#kg_is_qflp").removeClass("layui-disabled");
        // $("#beginning input").removeClass("layui-disabled");
        // $("#beginning button").removeClass("layui-disabled");
        // $("#end input").removeAttr("disabled");
        // $("#end button").removeAttr("disabled");
        // $("#end input").removeClass("layui-disabled");
        // $("#end button").removeClass("layui-disabled");
        var user_info = JSON.parse(_UTIL.storage.get("USER_INFO"))
        //对所有人，哪些状态下可以进行哪些操作
        //5亿以上项目需要先市区审核，就是2，在市审核，1，普通项目，只要市审核1
        if ((info.progress == 0 && info.check_status == 1) || (info.progress == 1 && info.check_status == 0) ||
            (info.progress == 1 && info.check_status == 3)) {
            $("#register input").removeAttr("disabled");
            $("#register button").removeAttr("disabled");
            $("#register input").removeClass("layui-disabled");
            $("#register button").removeClass("layui-disabled");
        } else if ((info.progress == 1 && info.check_status == 1) || (info.progress == 5 && info.check_status == 0) || (info.progress == 5 && info.check_status == 3)) {
            //当前为公司注册信息审核通过后，可以录入备案信息
            $("#beian input").removeAttr("disabled");
            $("#beian button").removeAttr("disabled");
            $("#beian input").removeClass("layui-disabled");
            $("#beian button").removeClass("layui-disabled");
        } else if ((info.progress == 5 && info.check_status == 1) || (info.progress == 4 && info.check_status == 0) || (info.progress == 4 && info.check_status == 3)) {
            //当前为备案信息审核通过后，可以录入报批信息
            $("#approval input").removeAttr("disabled");
            $("#approval button").removeAttr("disabled");
            $("#approval input").removeClass("layui-disabled");
            $("#approval button").removeClass("layui-disabled");
        } else if (info.progress == 4 && info.check_status == 1) {
            //当前为报批信息审核通过后，可以录入开工信息
            $("#beginning input").removeAttr("disabled");
            $("#beginning button").removeAttr("disabled");
            $("#beginning input").removeClass("layui-disabled");
            $("#beginning button").removeClass("layui-disabled");
            $("#kg_is_qflp").removeAttr("disabled");
            $("#kg_is_qflp").removeClass("layui-disabled");
        } else if (info.progress == 2 && info.check_status == 1) {
            //当前为开工信息审核通过后，可以录入竣工信息，
            $("#end input").removeAttr("disabled");
            $("#end button").removeAttr("disabled");
            $("#end input").removeClass("layui-disabled");
            $("#end button").removeClass("layui-disabled");
        }
        //展示开工确认日期
        if((info.progress == 4 && info.check_status == 1) || (info.progress == 2 && info.check_status == 0) || (info.progress == 2 && info.check_status == 3)){
            // $('#startTimeXX').show();
            // $('#saveBeginningTT').hide();
            // $('#saveBeginningTR').hide();
            $("#beginning input").removeAttr("disabled");
            $("#beginning button").removeAttr("disabled");
            $("#beginning input").removeClass("layui-disabled");
            $("#beginning button").removeClass("layui-disabled");
            $("#kg_is_qflp").removeAttr("disabled", true);
            $("#kg_is_qflp").removeClass("layui-disabled");
            //展示竣工确认日期
        }
        if((info.progress == 2 && info.check_status == 1) || (info.progress == 3 && info.check_status == 0) || (info.progress == 3 && info.check_status == 3)){
            $("#end input").removeAttr("disabled");
            $("#end button").removeAttr("disabled");
            $("#end input").removeClass("layui-disabled");
            $("#end button").removeClass("layui-disabled");
            // $('#endTimeXX').show();
            // $('#saveEndTT').hide();
            // $('#saveEndTR').hide();
        }
        //市区的账号对项目的编辑特殊权限处理
        if(user_info.user_level == 1 || user_info.user_level == 2){
            //注册，只要能有进度按钮，说明签约的审核都通过了。市区注册信息任何时候可以编辑
            $("#register input").removeAttr("disabled");
            $("#register button").removeAttr("disabled");
            $("#register input").removeClass("layui-disabled");
            $("#register button").removeClass("layui-disabled");
            //只要不是备案之前的步骤中，都可以操作备注信息，已注册，审核通过，也可以操作备案上面的逻辑已经处理了
            if(info.progress !=0 && info.progress !=1){
                $("#beian input").removeAttr("disabled");
                $("#beian button").removeAttr("disabled");
                $("#beian input").removeClass("layui-disabled");
                $("#beian button").removeClass("layui-disabled");
                //只要不是报批之前的步骤中，都可以操作报批信息，已备案，审核通过，也可以操作报批上面的逻辑已经处理了
                if(info.progress !=5){
                    $("#approval input").removeAttr("disabled");
                    $("#approval button").removeAttr("disabled");
                    $("#approval input").removeClass("layui-disabled");
                    $("#approval button").removeClass("layui-disabled");
                }
            }
        }
        $("#kg_zone_name").attr("disabled",true);
        $("#kg_zone_name").addClass("layui-disabled");
        $('input[value="1"][name="kg_b_industry"]').attr("disabled", true);
        $('input[value="2"][name="kg_b_industry"]').attr("disabled", true);
        _UTIL.network.post("getProjProjectSignedById.do", {_id: info._id}, 15000, function (result) {
            $("#ulRegister").html("");
            $("#ulBA").html("");
            $("#ulApprove").html("");
            $("#ulBeginning").html("");
            $("#ulEnd").html("");
            //赋值
            $("input[name=is_fixed_asset][value =" + result.data.info.is_fixed_asset + "]").prop("checked", true);
            $("input[name=is_use_land][value =" + result.data.info.is_use_land + "]").prop("checked", true);
            _UTIL.html.setValues(result.data.info);
            // successObj = result.data.online
            // successObj2 = result.data.ggOnline
            // if (Object.keys(successObj).length > 0) {
            //    $("#bandBtn1").show()
            //     $("#bandBtn").hide()
            //     $(".xyBands").show()
            //     $(".xyBand").hide()
            //     $(".xyBands1").show()
            //     $(".xyBand1").hide()
            // } else {
            //     $("#bandBtn").show()
            //     $("#bandBtn1").hide()
            //     $(".xyBands").hide()
            //     $(".xyBand").show()
            //     $(".xyBands1").hide()
            //     $(".xyBand1").show()
            // }
            // if (Object.keys(successObj2).length > 0) {
            //     $("#bandBtn2s").show()
            //     $("#bandBtn2").hide()
            //     $(".xyBands2").show()
            //     $(".xyBand").hide()
            //     $(".xyBands1").show()
            //     $(".xyBand1").hide()
            // } else {
            //     $("#bandBtn2").show()
            //     $("#bandBtn2s").hide()
            //     $(".xyBands2").hide()
            //     $(".xyBand").show()
            //     $(".xyBands1").hide()
            //     $(".xyBand1").show()
            // }
            arrayRegi = [];
            arrayBA = [];
            arrayApproval = [];
            arrayBeginning = [];
            arrayEnd = [];
            indexRegi = 0;
            indexBA = 0;
            indexApproval = 0;
            indexBeginning = 0;
            indexEnd = 0;
            //获取图片
            var imgs = result.data.imgs;
            //存放图片
            var label = "";
            //向数组中存放后端值
            if (imgs != null) {
                for (var f in imgs) {
                    var i = imgs[f]
                    if (i.cate_code == 1) {
                        var ob = {};
                        ob.filename = i._name;
                        ob.file_path = i.file_path;
                        arrayRegi.push(ob);
                        label = "<li id2='" + (indexRegi++) + "'><a  href='" + upload_file_path_proj + i.file_path + "' target='_blank'>" + i._name + "</a><span class='delRegiEdit'><i class='layui-icon'>&#x1006;</i></span></li>";
                        $("#ulRegister").append(label);
                    } else if (i.cate_code == 2) {
                        var ob = {};
                        ob.filename = i._name;
                        ob.file_path = i.file_path;
                        arrayBA.push(ob);
                        label = "<li id2='" + (indexBA++) + "'><a  href='" + upload_file_path_proj + i.file_path + "' target='_blank'>" + i._name + "</a><span class='delBAEdit'><i class='layui-icon'>&#x1006;</i></span></li>";
                        $("#ulBA").append(label);
                    } else if (i.cate_code == 3) {
                        var ob = {};
                        ob.filename = i._name;
                        ob.file_path = i.file_path;
                        arrayApproval.push(ob);
                        label = "<li id2='" + (indexApproval++) + "'><a  href='" + upload_file_path_proj + i.file_path + "' target='_blank'>" + i._name + "</a><span class='delApprovalEdit'><i class='layui-icon'>&#x1006;</i></span></li>";
                        $("#ulApprove").append(label);
                    } else if (i.cate_code == 4) {
                        var ob = {};
                        ob.filename = i._name;
                        ob.file_path = i.file_path;
                        arrayBeginning.push(ob);
                        label = "<li id2='" + (indexBeginning++) + "'><a  href='" + upload_file_path_proj + i.file_path + "' target='_blank'>" + i._name + "</a><span class='delBeginningEdit'><i class='layui-icon'>&#x1006;</i></span></li>";
                        $("#ulBeginning").append(label);
                    } else if (i.cate_code == 5) {
                        var ob = {};
                        ob.filename = i._name;
                        ob.file_path = i.file_path;
                        arrayEnd.push(ob);
                        label = "<li id2='" + (indexEnd++) + "'><a  href='" + upload_file_path_proj + i.file_path + "' target='_blank'>" + i._name + "</a><span class='delEndEdit'><i class='layui-icon'>&#x1006;</i></span></li>";
                        $("#ulEnd").append(label);
                    }

                }
            }
            var imgs2 = result.data.imgs && result.data.imgs.length ? result.data.imgs.filter(item => item.cate_code == 98) : []
            var label2 = "";
            //向数组中存放后端值
            if (imgs2 && imgs2.length) {
                $("#file_project2").html("");
                var index = 0;
                for (var f in imgs2) {
                    var i = imgs2[f];
                    var ob = {};
                    ob.filename = i._name;
                    ob.file_path = i.file_path;
                    label2 = "<li id2='" + (index++) + "'><a  href='" + upload_file_path_proj + i.file_path + "' target='_blank'>" + i._name + "</a><i class='delBaseEdit layui-icon'>&#x1006;</i></li>";
                    $("#file_project2").append(label2);
                }
            } else {
                $("#file_project2").html("<li>无</li>");
            }
            var imgs3 = result.data.imgs && result.data.imgs.length ? result.data.imgs.filter(item => item.cate_code == 97) : []
            var label3 = "";
            //向数组中存放后端值
            if (imgs3 && imgs3.length) {
                $("#file_project3").html("");
                var index = 0;
                for (var f in imgs3) {
                    var i = imgs3[f];
                    var ob = {};
                    ob.filename = i._name;
                    ob.file_path = i.file_path;
                    label3 = "<li id2='" + (index++) + "'><a  href='" + upload_file_path_proj + i.file_path + "' target='_blank'>" + i._name + "</a><i class='delBaseEdit layui-icon'>&#x1006;</i></li>";
                    $("#file_project3").append(label3);
                }
            } else {
                $("#file_project3").html("<li>无</li>");
            }

            var imgs7 = result.data.imgs && result.data.imgs.length ? result.data.imgs.filter(item => item.cate_code == 77) : []
            var label7 = "";
            //向数组中存放后端值
            if (imgs7 && imgs7.length) {
                $("#file_project_new7").html("");
                var index = 0;
                for (var f in imgs7) {
                    var i = imgs7[f];
                    var ob = {};
                    ob.filename = i._name;
                    ob.file_path = i.file_path;
                    label7 = "<li id2='" + (index++) + "'><a  href='" + upload_file_path_proj + i.file_path + "' target='_blank'>" + i._name + "</a><i class='delBaseEdit layui-icon'>&#x1006;</i></li>";
                    $("#file_project_new7").append(label7);
                }

            } else {
                $("#file_project_new7").html("<li>无</li>");
            }

            var imgs8 = result.data.imgs && result.data.imgs.length ? result.data.imgs.filter(item => item.cate_code == 88) : []
            var label8 = "";
            //向数组中存放后端值
            if (imgs8 && imgs8.length) {
                $("#file_project_new8").html("");
                var index = 0;
                for (var f in imgs8) {
                    var i = imgs8[f];
                    var ob = {};
                    ob.filename = i._name;
                    ob.file_path = i.file_path;
                    label8 = "<li id2='" + (index++) + "'><a  href='" + upload_file_path_proj + i.file_path + "' target='_blank'>" + i._name + "</a><i class='delBaseEdit layui-icon'>&#x1006;</i></li>";
                    $("#file_project_new8").append(label8);
                }

            } else {
                $("#file_project_new8").html("<li>无</li>");
            }
        });
        _UTIL.network.post("getOnlineApprovalPage.do", {listType: 1,  includeInvestOnlineId: info._id, size: 100, page: 1}, 15000, function (res) {
            olList = res.data.datalist
            let temp = olList.map((item,index)=>{
                let myStr = JSON.stringify(item).replaceAll('"','&quot;');
                return `<table class="layui-table ">
                    <tr>
                        <td style="border-right: none;color: #999;font-weight: bold">备案证</td>
                        <td colspan="3" style="text-align: right;border-left: none">
                            <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.showband(\`${myStr}\`)">
                                详情
                            </button>
                            <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.delband(\`${item.id}\`)">
                                解绑
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td class="td-label">备案（核准）项目代码</td>
                        <td><input type="text" disabled value="${item.project_code}" class="layui-input" autocomplete="off"/></td>
                        <td class="td-label">备案（核准）项目名称</td>
                        <td><input type="text" disabled value="${item.project_name}" class="layui-input" autocomplete="off"/></td>
                    </tr>
                    <tr>
                        <td class="td-label">备案（核准）投资总额（万元）</td>
                        <td><input type="text" disabled value="${item.total_investment}" class="layui-input" autocomplete="off"/></td>
                        <td class="td-label">备案（核准）日期</td>
                        <td><input type="text" disabled value="${item.application_time}" class="layui-input" autocomplete="off"/></td>
                    </tr>
                </table>`;
            }).join('');
            $('#tableBox1').html(temp);
        })
        _UTIL.network.post("getOnlineApprovalPage.do", {listType: 2,  includeInvestOnlineId: info._id, size: 100, page: 1}, 15000, function (res) {
            bpList = res.data.datalist
            let temp = bpList.map((item,index)=>{
                let myStr = JSON.stringify(item).replaceAll('"','&quot;');
                return `<table class="layui-table ">
                    <tr>
                        <td style="border-right: none;color: #999;font-weight: bold">报批证</td>
                        <td colspan="3" style="text-align: right;border-left: none">
                            <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.showband2(\`${myStr}\`)">
                                详情
                            </button>
                            <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.delband2(\`${item.id}\`)">
                                解绑
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td class="td-label">项目代码</td>
                        <td><input type="text" disabled value="${item.project_code}" class="layui-input" autocomplete="off"/></td>
                        <td class="td-label">项目名称</td>
                        <td><input type="text" disabled value="${item.project_name}" class="layui-input" autocomplete="off"/></td>
                    </tr>
                </table>`;
            }).join('');
            $('#tableBox2').html(temp);
        })
        _UTIL.network.post("getBdzxspInfo.do", {signed_id: biz_info._id, status: 2, listType: 1}, 15000, function (result) {
            // console.log(result.data.datalist.length);
            // _UTIL.html.setValues(result.data.info)
            if (Object.keys(result.data.info).length) {
                let myStr = JSON.stringify(result.data.info).replaceAll('"','&quot;');
            let temp =  `<table class="layui-table ">
                    <tr>
                        <td style="border-right: none;color: #999;font-weight: bold">异常绑定</td>
                        <td colspan="3" style="text-align: right;border-left: none">
                            <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.bandErrors(\`${myStr}\`)">
                                详情
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td class="td-label">申报单位联系人</td>
                        <td><input type="text" disabled value="${item.application_company_contact_name || ''}" class="layui-input" autocomplete="off"/></td>
                        <td class="td-label">手机号码</td>
                        <td><input type="text" disabled value="${item.application_company_contact_phone || ''}" class="layui-input" autocomplete="off"/></td>
                    </tr>
                    <tr>
                        <td class="td-label">项目代码</td>
                        <td><input type="text" disabled value="${item.project_code || ''}" class="layui-input" autocomplete="off"/></td>
                        <td class="td-label">项目名称</td>
                        <td><input type="text" disabled value="${item.project_name || ''}" class="layui-input" autocomplete="off"/></td>
                    </tr>
                    <tr>
                        <td class="td-label">总投资（万元）</td>
                        <td><input type="text" disabled value="${item.total_investment || ''}" class="layui-input" autocomplete="off"/></td>
                        <td class="td-label">申报时间</td>
                        <td><input type="text" disabled value="${item.application_time || ''}" class="layui-input" autocomplete="off"/></td>
                    </tr>
                </table>`;
                $('#error1').html(temp);
            }
            // console.log(result, 55)
            // for (var key in result.data.info) {
            //     biz_info.setElementValue(key + '1', result.data.info[key]);
            // }
        })
        _UTIL.network.post("getBdzxspInfo.do", {signed_id: biz_info._id, status: 2, listType: 2}, 15000, function (result) {
            // console.log(result.data.datalist.length);
            // _UTIL.html.setValues(result.data.info)
            if (Object.keys(result.data.info).length) {
                let myStr = JSON.stringify(result.data.info).replaceAll('"','&quot;');
                let temp =  `<table class="layui-table ">
                    <tr>
                        <td style="border-right: none;color: #999;font-weight: bold">异常绑定</td>
                        <td colspan="3" style="text-align: right;border-left: none">
                            <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.bandErrors2(\`${myStr}\`)">
                                详情
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td class="td-label">申报单位联系人</td>
                        <td><input type="text" disabled value="${item.application_company_contact_name || ''}" class="layui-input" autocomplete="off"/></td>
                        <td class="td-label">手机号码</td>
                        <td><input type="text" disabled value="${item.application_company_contact_phone || ''}" class="layui-input" autocomplete="off"/></td>
                    </tr>
                    <tr>
                        <td class="td-label">项目代码</td>
                        <td><input type="text" disabled value="${item.project_code || ''}" class="layui-input" autocomplete="off"/></td>
                        <td class="td-label">项目名称</td>
                        <td><input type="text" disabled value="${item.project_name || ''}" class="layui-input" autocomplete="off"/></td>
                    </tr>
                    <tr>
                        <td class="td-label">总投资（万元）</td>
                        <td><input type="text" disabled value="${item.total_investment || ''}" class="layui-input" autocomplete="off"/></td>
                        <td class="td-label">申报时间</td>
                        <td><input type="text" disabled value="${item.application_time || ''}" class="layui-input" autocomplete="off"/></td>
                    </tr>
                </table>`;
                $('#error2').html(temp);
            }
        })
    },
//存入草稿箱

    //审核不通过，查看原因
    failPass1: function (info) {
        biz_info._id = info._id;
        _UTIL.dialog.openDialog("failBack", "审核驳回原因", "600", "400");
        //显示驳回原因
        _UTIL.network.post("getProjProjectSignedById.do", {_id: info._id, cate_code: 0}, 15000, function (result) {
            $("#backText").css("display", "block");
            $("#backTitle").css("display", "block");
            $("#backText").html(result.data.info.last_check_desc);
        });

    },

    //编辑后保存  保存的状态
    //注册保存
    saveRegi: function (info) {
        //表单验证
        layui.use('form', function (info) {
            // if ($("#u_code").val() == "" || $("#company_name").val() == ""|| $("#reg_money").val() == ""|| $("#reg_date").val() == "") {
            //     _UTIL.msg.warn("请输入必填数据");
            //     return false;
            // } else {
            //获取当前项目的_id
            var id = biz_info._id;
            //获取注册全部数据
            var data = _UTIL.html.getContainerElementsValue("register");
            //注册资金设置小数
            var reg_money = $("#reg_money").val().trim();
            if (reg_money == "") {
                data['reg_money'] = 0;
            }
            if (reg_money == "") {
                data['reg_money'] = 0;
            }
            data['_id'] = id;
            //存放图片的数组

            var files = $("#ulRegister a");
            if (files.length == 0) {
                _UTIL.msg.tip($("#ulRegister"), "请选择需要上传的文件")
                return false;
            }
            var fileArr = [];
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                var ob = {};
                ob.file_path = $(file).attr("href").replace(upload_file_path_proj, "");
                // ob.file_path = $(file).attr("href");
                ob.filename = $(file).text();
                fileArr.push(ob);
            }
            data['imgArrRegi'] = fileArr;

            console.log(data);
            //设置当前进度
            data['progress'] = 1;
            //设置审核状态待审核
            data['check_status'] = 0;
            data['cate_code'] = 1;
            if (data.valid) {
                _UTIL.biz.save("updateOrSaveRegister.do", data, 15000, function (result) {
                    indexRegi = 0;
                    var table = layui.table;
                    table.reload('datalist');
                    // _UTIL.dialog.close();
                    _UTIL.msg.success("操作成功");
                });
            }
        });
    }
    ,
    //备案保存
    btnSaveBA: function (info) {

        //获取当前项目的_id
        var id = biz_info._id;
        //获取备案全部数据
        var data = _UTIL.html.getContainerElementsValue("beian");
        //备案资金设置小数
        // var check_money = $("#check_money").val().trim();
        // if (check_money == "") {
        //     data['check_money'] = 0;
        // }
        // if (check_money == "") {
        //     data['check_money'] = 0;
        // }
        data['_id'] = id;
        // console.log(data);
        //存放图片的数组
        var files = $("#ulBA a");
        if (files.length == 0) {
            _UTIL.msg.tip($("#ulBA"), "请选择需要上传的文件")
            return false;
        }
        var fileArr = [];
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var ob = {};
            ob.file_path = $(file).attr("href").replace(upload_file_path_proj, "");
            // ob.file_path = $(file).attr("href");
            ob.filename = $(file).text();
            fileArr.push(ob);
        }
        data['imgArrBA'] = fileArr;
        //设置当前进度
        data['progress'] = 5;
        //设置审核状态待审核
        data['check_status'] = 0;
        data['cate_code'] = 2;
        // for (let key in successObj) {
        //     data[key] = successObj[key]
        // }
        // if (Object.keys(successObj).length == 0) {
        //     _UTIL.msg.warn("请先绑定")
        //     return
        // }
        if (data.valid) {
            _UTIL.network.post("getProjProjectSignedById.do", {_id: biz_info._id}, 15000, function (result) {
                if (olList.length == 0) {
                    _UTIL.msg.warn("请先绑定在线审批项目")
                } else {
                    _UTIL.biz.save("updateOrSaveBA.do", data, 15000, function (result) {
                        indexBA = 0;
                        var table = layui.table;
                        table.reload('datalist');
                        _UTIL.msg.success("操作成功");
                    });
                }
            });
            // _UTIL.network.post("bdzxsp.do", {signed_id: biz_info._id, online_approvalId: biz_info.band_id, ...successObj}, 8000, function (res) {
            //     // _UTIL.msg.success("绑定成功");
            //     // layui.table.reload('datalist');
            //     // layui.table.reload('datalist1');
            // });
        }
    },
//报批保存
    btnSaveApproval: function (info) {
        //获取当前项目的_id
        var id = biz_info._id;
        //获取报批全部数据
        var data = _UTIL.html.getContainerElementsValue("approval");
        data['_id'] = id;
        var radio = document.getElementsByName("is_fixed_asset");
        if ($(radio[0]).prop("checked")) {
            data['is_fixed_asset'] = 1;
        } else {
            data['is_fixed_asset'] = 0;
        }
        var radio1 = document.getElementsByName("is_use_land");
        if ($(radio1[0]).prop("checked")) {
            data['is_use_land'] = 1;
        } else {
            data['is_use_land'] = 0;
        }
        // console.log(data);
        //存放图片的数组
        var files = $("#ulApprove a");
        if (files.length == 0) {
            _UTIL.msg.tip($("#ulApprove"), "请选择需要上传的文件")
            return false;
        }
        var fileArr = [];
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            var ob = {};
            ob.file_path = $(file).attr("href").replace(upload_file_path_proj, "");
            // ob.file_path = $(file).attr("href");
            ob.filename = $(file).text();
            fileArr.push(ob);
        }
        data['imgArrApprove'] = fileArr;

        //设置当前进度
        data['progress'] = 4;
        //设置审核状态待审核
        data['check_status'] = 0;
        //图片的cate_code
        data['cate_code'] = 3;
        console.log(data);
        if (data.valid) {
            _UTIL.network.post("getProjProjectSignedById.do", {_id: biz_info._id}, 15000, function (result) {
                if (bpList.length == 0) {
                    _UTIL.msg.warn("请先绑定工程审批项目")
                } else {
                    _UTIL.biz.save("updateOrSaveApprove.do", data, 15000, function (result) {
                        indexApproval = 0;
                        var table = layui.table;
                        table.reload('datalist');
                        _UTIL.msg.success("操作成功");
                        _UTIL.dialog.closeAll();
                    });
                }
            });
        }
    }
    ,
//开工保存新
    saveBeginning: function () {
        layer.confirm("请确认该项目开工信息。", {icon: 3, title:'开工确认'},
            function(index){//确定回调
                layer.close(index);
                var id = biz_info._id;
                let data = {};
                data['_id'] = id;
                data['kg_zydw'] = $('#kg_zone_name').val()
                data['kg_xmmc'] = $('#kg_name').val()
                data['kg_tzfmc'] = $('#kg_investor').val()
                data['kg_xmdz'] = $('#kg_project_address').val()
                data['kg_qyrq'] = $('#kg_signed_date').val()
                data['kg_xmlx'] = $('input[name="kg_b_industry"]:checked').val();
                data['kg_kcxm'] = $('input[name="kg_is_kc_proj"]:checked').val();
                data['kg_is_zkc'] = $('input[name="kg_is_zkc"]:checked').val();
                if (data['kg_kcxm'] == '是') {
                    data['kg_kcxm_rdtj'] = $('#kg_kc_proj_tj').val()
                }
                data['kg_qflp'] = $('#kg_is_qflp').val()
                data['kg_tyxydm'] = $('#kg_u_code').val()
                data['kg_zcrq'] = $('#kg_reg_date').val()
                data['kg_jsnr'] = $('#kg_desc').val()
                data['kg_hydm'] = $('#kg_industry_code').val()
                data['kg_hymc'] = $('#kg_industry_name').val()
                data['kg_cyfx'] = $('#kg_proj_type').val()
                data['kg_ztz'] = $('#kg_invest_money').val()
                data['kg_gdzctz'] = $('#kg_fixed_invest').val()
                data['pzwh'] = $('#pzwh').val()
                data['pzrq'] = $('#pzrq').val()
                data['cxqk'] = $('#cxqk').val()
                data['start_date_commit'] = $('#start_date_commit').val()
                var files2 = $("#file_project2 a");
                if (files2.length == 0) {
                    // _UTIL.msg.warn("请选择需要上传的文件");
                    _UTIL.msg.tip($("#file_project2"), "请选择需要上传的文件")
                    return false;
                }
                var fileArr2 = [];
                for (var i = 0; i < files2.length; i++) {
                    var file2 = files2[i];
                    var ob = {};
                    ob.file_path = $(file2).attr("href").replace(upload_file_path_proj, "");
                    // ob.file_path = $(file).attr("href");
                    ob.filename = $(file2).text();
                    ob.cate_code = '98'
                    fileArr2.push(ob);
                }
                var files7 = $("#file_project_new7 a");
                // if (files7.length == 0) {
                //     _UTIL.msg.tip($("#file_project_new7"), "请选择需要上传的文件")
                //     return false;
                // }
                var fileArr7 = [];
                for (var i = 0; i < files7.length; i++) {
                    var file7 = files7[i];
                    var ob = {};
                    ob.file_path = $(file7).attr("href").replace(upload_file_path_proj, "");
                    // ob.file_path = $(file).attr("href");
                    ob.filename = $(file7).text();
                    ob.cate_code = '77'
                    fileArr7.push(ob);
                }
                var files8 = $("#file_project_new8 a");
                // if (files7.length == 0) {
                //     _UTIL.msg.tip($("#file_project_new7"), "请选择需要上传的文件")
                //     return false;
                // }
                var fileArr8 = [];
                for (var i = 0; i < files8.length; i++) {
                    var file8 = files8[i];
                    var ob = {};
                    ob.file_path = $(file8).attr("href").replace(upload_file_path_proj, "");
                    // ob.file_path = $(file).attr("href");
                    ob.filename = $(file8).text();
                    ob.cate_code = '88'
                    fileArr8.push(ob);
                }
                data['imgArr'] = [...fileArr2,...fileArr7,...fileArr8]
                data['kgzzcl'] = fileArr2.map(item => 'http://172.22.26.71:54934/images/' + item.file_path).join(';')
                if (fileArr7.length) {
                    data['rczzcl'] = fileArr7.map(item => 'http://172.22.26.71:54934/images/' + item.file_path).join(';')
                }
                if (fileArr8.length) {
                    data['kczzcl'] = fileArr8.map(item => 'http://172.22.26.71:54934/images/' + item.file_path).join(';')
                }
                // if (data.valid) {
                    _UTIL.biz.save("createKg.do", data, 15000, function (result) {
                        var table = layui.table;
                        table.reload('datalist');
                        _UTIL.dialog.closeAll();
                        _UTIL.msg.success("开工确认成功");
                    });
                // }
            },function (index) {//取消回调
                layer.close(index);
            }
        );
    }
    ,

//开工保存
//     saveBeginning: function (info) {
//
//         var id = biz_info._id;
//         //获取开工全部数据
//         var data = _UTIL.html.getContainerElementsValue("beginning");
//         if (!data.valid) {
//             return;
//         }
//         //开工投入资金设置小数
//         var actual_invest = $("#actual_invest").val().trim();
//         if (actual_invest == "") {
//             data['actual_invest'] = 0;
//         }
//         if (actual_invest == "") {
//             data['actual_invest'] = 0;
//         }
//         data['_id'] = id;
//         //存放图片的数组
//         var files = $("#ulBeginning a");
//         if (files.length == 0) {
//             _UTIL.msg.tip($("#ulBeginning"), "请选择需要上传的文件")
//             return false;
//         }
//         var fileArr = [];
//         for (var i = 0; i < files.length; i++) {
//             var file = files[i];
//             var ob = {};
//             ob.file_path = $(file).attr("href").replace(upload_file_path_proj, "");
//             // ob.file_path = $(file).attr("href");
//             ob.filename = $(file).text();
//             fileArr.push(ob);
//         }
//         data['imgArrBeginning'] = fileArr;
//
//         console.log(data);
//         data['cate_code'] = 4;
//
//         //设置当前进度
//         data['progress'] = 2;
//         //设置审核状态待审核
//         data['check_status'] = 0;
//         if (data.valid) {
//             _UTIL.biz.save("updateOrSaveBeginning.do", data, 15000, function (result) {
//                 indexBeginning = 0;
//                 var table = layui.table;
//                 table.reload('datalist');
//                 _UTIL.dialog.closeAll();
//                 _UTIL.msg.success("操作成功");
//             });
//         }
//     }
//     ,

//竣工保存新
    saveEnd: function () {

        layer.confirm("请确认该项目竣工信息。", {icon: 3, title:'竣工确认'},
            function(index){//确定回调
                layer.close(index);
                var id = biz_info._id;
                let data = {};
                data['_id'] = id;
                data['complete_date'] = $('#complete_date').val();
                var files3 = $("#file_project3 a");
                if (files3.length == 0) {
                    // _UTIL.msg.warn("请选择需要上传的文件");
                    _UTIL.msg.tip($("#file_project3"), "请选择需要上传的文件")
                    return false;
                }
                var fileArr3 = [];
                for (var i = 0; i < files3.length; i++) {
                    var file3 = files3[i];
                    var ob = {};
                    ob.file_path = $(file3).attr("href").replace(upload_file_path_proj, "");
                    // ob.file_path = $(file).attr("href");
                    ob.filename = $(file3).text();
                    ob.cate_code = '97'
                    fileArr3.push(ob);
                }
                data['imgArr'] = [...fileArr3]
                data['jg_is_zkc'] = $('input[name="jg_is_zkc"]:checked').val();
                data['qy_total_num'] = $('#qy_total_num').val();
                data['qy_sb_num'] = $('#qy_sb_num').val();
                data['qy_tzyf_num'] = $('#qy_tzyf_num').val();
                data['qy_yf_money'] = $('#qy_yf_money').val();
                data['jgzzcl'] = fileArr3.map(item => 'http://172.22.26.71:54934/images/' + item.file_path).join(';')
                // if (data.valid) {
                    _UTIL.biz.save("createJg.do", data, 15000, function (result) {
                        var table = layui.table;
                        table.reload('datalist');
                        _UTIL.dialog.closeAll();
                        _UTIL.msg.success("竣工确认成功");
                    });
                // }
            },function (index) {//取消回调
                layer.close(index);
            }
        );
    }
    ,

//竣工保存
//     saveEnd: function () {
//
//         var id = biz_info._id;
//         //获取开工全部数据
//         var data = _UTIL.html.getContainerElementsValue("end");
//         if (!data.valid) {
//             return;
//         }
//         data['_id'] = id;
//         //存放图片的数组
//         var files = $("#ulEnd a");
//         if (files.length == 0) {
//             _UTIL.msg.tip($("#ulEnd"), "请选择需要上传的文件")
//             return false;
//         }
//         var fileArr = [];
//         for (var i = 0; i < files.length; i++) {
//             var file = files[i];
//             var ob = {};
//             ob.file_path = $(file).attr("href").replace(upload_file_path_proj, "");
//             // ob.file_path = $(file).attr("href");
//             ob.filename = $(file).text();
//             fileArr.push(ob);
//         }
//         data['imgArrEnd'] = fileArr;
//         data['cate_code'] = 5;
//         //设置当前进度
//         data['progress'] = 3;
//         //设置审核状态待审核
//         data['check_status'] = 0;
//         if (data.valid) {
//             _UTIL.biz.save("updateOrSaveEnd.do", data, 15000, function (result) {
//
//                 indexEnd = 0;
//                 var table = layui.table;
//                 table.reload('datalist');
//                 _UTIL.dialog.closeAll();
//                 _UTIL.msg.success("操作成功");
//             });
//         }
//     }
//     ,

    del: function (info) {
        _UTIL.biz.delete("delProjProjectSign.do", {_id: info._id}, function (result) {
            var table = layui.table;
            table.reload('datalist');

        });
    }
    ,
//到账资金取消保存
    btnCancelReceivedMoney: function () {
        _UTIL.dialog.closeAll();
        bDateAndreceivedMoneysArray = [];
        //清空资金页面
        $("#ulli").html("");
    }
    ,

// :草稿箱取消
    btnCancel: function () {
        _UTIL.dialog.closeAll();
        $("#detailInfo").hide();
        //数组清空
        fileProjArr = [];
        index = 0;
        biz_info._id = null;
    }
    ,

    scxy: function () {
        //获取当前的_id
        // var _id = $("#_id").val();
        var _id = biz_info._id;
        //获取全部数据
        var data = _UTIL.html.getContainerElementsValue("detailInfo");
        var investor_type = $("#investor_type ").val();
        if (fzList.length) {
            data.fzList = fzList.map((item, index) => {
                return parseInt(index + 1) + '、' + item
            })
            console.log(data.fzList, 6)
        }
        data['investor_type'] = investor_type;
        //获取单选按钮值
        // var p_type = document.getElementsByName("p_type");//项目类别
        // //获取p_type
        // if ($(p_type[0]).prop("checked")) {
        //     data['p_type'] = 1;
        // } else {
        //     data['p_type'] = 2;
        // }
        data['p_type'] = $('input[name="p_type"]:checked').val();
        data['is_sixpro'] = $('input[name="is_sixpro"]:checked').val();
        data['is_import_proj'] = $('input[name="is_import_proj"]:checked').val();
        data['is_sj_proj'] = $('input[name="is_sj_proj"]:checked').val();
        data['is_kc_proj'] = $('input[name="is_kc_proj"]:checked').val();
        data['is_build_yfzx'] = $('input[name="is_build_yfzx"]:checked').val();
        data['is_gxjs'] = $('input[name="is_gxjs"]:checked').val();
        // data['is_warning_invest'] = $('input[name="is_warning_invest"]:checked').val();


        // var proj_type = document.getElementsByName("ra_proj_type"); //传统产业 or 战略新兴产业
        // if (info.proj_type == "c") {
        //     $(proj_type[0]).prop("checked",true);
        //     $("#div_proj_type").hide();
        // } else {
        //     $(proj_type[1]).prop("checked",true);
        //     $("#div_proj_type").show();
        // }
        data['b_industry'] = $('input[name="b_industry"]:checked').val();
        data['b_resource'] = $('input[name="b_resource"]:checked').val();
        if (data.district_code && data.district_code.length > 0) {
            data['district'] = $("#district_code option:selected").text();
        }
        if (data.zone_code && data.zone_code.length > 0) {
            data['zone_name'] = $("#zone_code option:selected").text();
        }
        if (data.town_code && data.town_code.length > 0) {

            data['town_name'] = $("#town_code option:selected").text();
        }
        // 获取proj_type
        // var proj_type = document.getElementsByName("proj_type");//项目类型
        // if ($(proj_type[0]).prop("checked")) {
        //     data['proj_type'] = "c";
        // } else {
        //     var proj_type = $("#proj_type").val();
        //     data['proj_type'] = proj_type;
        // }
        //
        // // 获取b_industry
        // var b_industry = document.getElementsByName("b_industry");
        // //获取p_type
        // if ($(b_industry[0]).prop("checked")) {
        //     data['b_industry'] = 1;
        // } else {
        //     data['b_industry'] = 2;
        // }
        //设置小数
        var invest_money = $("#invest_money").val().trim();
        var foreign_money = $("#foreign_money").val().trim();
        data['sixpro_code'] = $("#sixpro_code").val();
        if (invest_money == "") {
            data['invest_money'] = 0;
        }
        if (foreign_money == "") {
            data['foreign_money'] = 0;
        }

        var files = $("#file_project a");
        var times = $("#file_project .create_time");
        // if (files.length == 0) {
        //     // _UTIL.msg.warn("请选择需要上传的文件");
        //     _UTIL.msg.tip($("#file_project"), "请选择需要上传的文件")
        //     return false;
        // }
        var fileArr = [];
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            let time = times[i]
            var ob = {};
            ob.file_path = $(file).attr("href").replace(upload_file_path_proj, "");
            // ob.file_path = $(file).attr("href");
            ob.filename = $(file).text();
            ob.create_time = $(time).text();
            ob.cate_code = '0'
            fileArr.push(ob);
        }

        var files1 = $("#file_project1 a");
        var fileArr1 = [];
        for (var i = 0; i < files1.length; i++) {
            var file1 = files1[i];
            var ob = {};
            ob.file_path = $(file1).attr("href").replace(upload_file_path_proj, "");
            // ob.file_path = $(file).attr("href");
            ob.filename = $(file1).text();
            ob.cate_code = '99'
            fileArr1.push(ob);
        }
        data['imgArr1'] = fileArr;
        data['imgArr'] = [...fileArr, ...fileArr1];
        // console.log(data);
        // var ob = {};
        // ob.filename = res.data.fileName;
        // ob.file_path = res.data.src;
        //存放图片的数组
        // data['imgArr'] = fileProjArr;
        // if (fileProjArr.length == 0) {
        //     _UTIL.msg.warn("请选择需要上传的文件");
        //     return false;
        // }
        data['progress'] = 0;
        //设置当前的项目_id
        data['_id'] = _id;
        //设置状态为保存未提交
        // if (!check_status) {  //如果传了这个值
        //     check_status = 0;
        // }
        // data['check_status'] = check_status;
        data['cate_code'] = '0';
        data['cate_code1'] = '99';
        //开始编辑保存中==
        // var user_info = JSON.parse(_UTIL.storage.get("USER_INFO"));
        // if (_id != 0 && (user_info.user_level == 1 || user_info.user_level == 2)){
        //
        // }
        if (key) {
            data['qr_key'] = key
        } else {
            key = new Date().getTime()
            data['qr_key'] = key
        }
        _UTIL.network.post("exportPdf.do", data, 15000, function (res) {
            let url = res.data
            if (url) {
                _UTIL.dialog.openDialog("htmlToPdfDetail", "协议预览", "800", "550")
                $("#xyIframe").attr("src", url)
            }
        })
    }
    ,

//注册取消
    cancelRegi: function () {
        _UTIL.dialog.closeAll();
        //数组清空
        arrayRegi = [];
        indexRegi = 0;
    }
    ,
//备案取消
    btnCancelBA: function () {
        _UTIL.dialog.closeAll();
        //数组清空
        arrayBA = [];
        indexBA = 0;
    }
    ,
//报批取消
    btnCancelApproval: function () {
        _UTIL.dialog.closeAll();
        //数组清空
        arrayApproval = [];
        indexApproval = 0;
    }
    ,
//开工取消
    cancelBeginning: function () {
        _UTIL.dialog.closeAll();
        //数组清空
        arrayBeginning = [];
        indexBeginning = 0;
    }
    ,
//竣工取消
    cancelEnd: function () {
        _UTIL.dialog.closeAll();
        //数组清空
        arrayEnd = [];
        indexEnd = 0;
    }
    ,

//园区树带的数据
    selectcate: function (event, data) {
        $("#zone_code").val(data.node.id);
        $("#zone_name").val(data.node.text);
    }
    ,
//头部园区带的数据
    selectcateTitle: function (event, data) {
        $("#s_zone_code").val(data.node.id);
        $("#s_zone_name").val(data.node.text);
    }
    ,
    //导出excel
    out: function () {
        var data = _UTIL.html.getContainerElementsValue("searchBody")
        console.log()
        _UTIL.network.post("getExcel.do", data, 1200000, function (res) {
            window.open(res.data.filepath);
        })
    }
    ,
    //绑定弹框
    bandSave: function (info) {
        layer.confirm('是否确认绑定该项目?', function (index) {
            _UTIL.dialog.close(index);
            successObj.signed_id = biz_info._id
            successObj.online_approvalId = biz_info.band_id
            _UTIL.network.post("bdzxsp.do", {...successObj}, 8000, function (res) {
                _UTIL.msg.success("绑定成功");
                // layui.table.reload('datalist');
                // layui.table.reload('datalist1');
                _UTIL.dialog.closeAll()
                _UTIL.dialog.openRightDialog("approbationBox", "项目进度信息", '760px');
            });
            // _UTIL.dialog.close(dialog1);
            // _UTIL.dialog.close(dialog2);
            for (let key in successObj) {
                biz_info.emptyElementValue(key)
            }
            // $("#bandBtn1").show()
            // $("#bandBtn").hide()
            // $(".xyBands").show()
            // $(".xyBand").hide()
            // $(".xyBands1").show()
            // $(".xyBand1").hide()
        }, function (index) {
            _UTIL.dialog.close(index);
            for (let key in successObj) {
                biz_info.emptyElementValue(key)
            }
            // $("#bandBtn").show()
            // $("#bandBtn1").hide()
            // $(".xyBands").hide()
            // $(".xyBand").show()
            // $(".xyBands1").hide()
            // $(".xyBand1").show()
        });
    },
    //绑定弹框
    bandSaves: function (info) {
        layer.confirm('是否确认改绑该项目?', function (index) {
            _UTIL.dialog.close(index);
            // _UTIL.dialog.close(dialog1);
            // _UTIL.dialog.closeAll()
            // _UTIL.dialog.openRightDialog("approbationBox", "项目进度信息", '760px');
            // console.log(dialog1, 123456)
            _UTIL.dialog.close(dialog2)
            biz_info.bandBtn()
            // successObj.signed_id = biz_info._id
            // successObj.online_approvalId = biz_info.band_id
            // _UTIL.network.post("bdzxsp.do", {signed_id: biz_info._id, online_approvalId: biz_info.band_id}, 8000, function (res) {
            //     _UTIL.msg.success("绑定成功");
            // });
            // $("#bandBtn1").show()
            // $("#bandBtn").hide()
            // $(".xyBands").show()
            // $(".xyBand").hide()
            // $(".xyBands1").show()
            // $(".xyBand1").hide()
        }, function (index) {
            _UTIL.dialog.close(index);
            // $("#bandBtn").show()
            // $("#bandBtn1").hide()
            // $(".xyBands").hide()
            // $(".xyBand").show()
            // $(".xyBands1").hide()
            // $(".xyBand1").show()
        });
    },
    bandSaves2: function (info) {
        layer.confirm('是否确认改绑该项目?', function (index) {
            _UTIL.dialog.close(index);
            // _UTIL.dialog.close(dialog1);
            // _UTIL.dialog.closeAll()
            // _UTIL.dialog.openRightDialog("approbationBox", "项目进度信息", '760px');
            // console.log(dialog1, 123456)
            _UTIL.dialog.close(dialog4)
            biz_info.bandBtn2()
            // successObj.signed_id = biz_info._id
            // successObj.online_approvalId = biz_info.band_id
            // _UTIL.network.post("bdzxsp.do", {signed_id: biz_info._id, online_approvalId: biz_info.band_id}, 8000, function (res) {
            //     _UTIL.msg.success("绑定成功");
            // });
            // $("#bandBtn1").show()
            // $("#bandBtn").hide()
            // $(".xyBands").show()
            // $(".xyBand").hide()
            // $(".xyBands1").show()
            // $(".xyBand1").hide()
        }, function (index) {
            _UTIL.dialog.close(index);
            // $("#bandBtn").show()
            // $("#bandBtn1").hide()
            // $(".xyBands").hide()
            // $(".xyBand").show()
            // $(".xyBands1").hide()
            // $(".xyBand1").show()
        });
    },
    //异常绑定弹框
    bandSave1: function (info) {
        layer.confirm('是否确认绑定该项目?', function (index) {
            _UTIL.dialog.close(index);
            successObj = {
                signed_id: biz_info._id,
                // online_approvalId: biz_info.band_id,
                application_company_contact_name: $('#application_company_contact_name1').val(),
                application_company_contact_phone: $('#application_company_contact_phone1').val(),
                project_code: $('#project_code1').val(),
                project_name: $('#project_name1').val(),
                total_investment: $('#total_investment1').val(),
                application_time: $('#application_time1').val(),
                listType: listType
            }
            _UTIL.network.post("bdzxsp.do", {...successObj}, 8000, function (res) {
                _UTIL.msg.success("绑定成功");
                // let myStr = JSON.stringify(successObj).replaceAll('"', '&quot;');
                if (listType == 1) {
                //     let temp = `<table class="layui-table ">
                //     <tr>
                //         <td style="border-right: none;color: #999;font-weight: bold">异常绑定</td>
                //         <td colspan="3" style="text-align: right;border-left: none">
                //             <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.bandErrors(\`${myStr}\`)">
                //                 详情
                //             </button>
                //         </td>
                //     </tr>
                //     <tr>
                //         <td class="td-label">申报单位联系人</td>
                //         <td><input type="text" disabled value="${successObj.application_company_contact_name || ''}" class="layui-input" autocomplete="off"/></td>
                //         <td class="td-label">手机号码</td>
                //         <td><input type="text" disabled value="${successObj.application_company_contact_phone || ''}" class="layui-input" autocomplete="off"/></td>
                //     </tr>
                //     <tr>
                //         <td class="td-label">项目代码</td>
                //         <td><input type="text" disabled value="${successObj.project_code || ''}" class="layui-input" autocomplete="off"/></td>
                //         <td class="td-label">项目名称</td>
                //         <td><input type="text" disabled value="${successObj.project_name || ''}" class="layui-input" autocomplete="off"/></td>
                //     </tr>
                //     <tr>
                //         <td class="td-label">总投资（万元）</td>
                //         <td><input type="text" disabled value="${successObj.total_investment || ''}" class="layui-input" autocomplete="off"/></td>
                //         <td class="td-label">申报时间</td>
                //         <td><input type="text" disabled value="${successObj.application_time || ''}" class="layui-input" autocomplete="off"/></td>
                //     </tr>
                // </table>`;
                //     $('#error1').html(temp);
                    _UTIL.network.post("getOnlineApprovalPage.do", {listType: 1,  includeInvestOnlineId: biz_info._id, size: 100, page: 1}, 15000, function (res) {
                        // console.log(res, 'olList')
                        olList = res.data.datalist
                        let temp = olList.map((item,index)=>{
                            let myStr = JSON.stringify(item).replaceAll('"','&quot;');
                            return `<table class="layui-table ">
                    <tr>
                        <td style="border-right: none;color: #999;font-weight: bold">备案证</td>
                        <td colspan="3" style="text-align: right;border-left: none">
                            <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.showband(\`${myStr}\`)">
                                详情
                            </button>
                            <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.delband(\`${item.id}\`)">
                                解绑
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td class="td-label">备案（核准）项目代码</td>
                        <td><input type="text" disabled value="${item.project_code}" class="layui-input" autocomplete="off"/></td>
                        <td class="td-label">备案（核准）项目名称</td>
                        <td><input type="text" disabled value="${item.project_name}" class="layui-input" autocomplete="off"/></td>
                    </tr>
                    <tr>
                        <td class="td-label">备案（核准）投资总额（万元）</td>
                        <td><input type="text" disabled value="${item.total_investment}" class="layui-input" autocomplete="off"/></td>
                        <td class="td-label">备案（核准）日期</td>
                        <td><input type="text" disabled value="${item.application_time}" class="layui-input" autocomplete="off"/></td>
                    </tr>
                </table>`;
                        }).join('');
                        $('#tableBox1').html(temp);
                    })
                } else {
                //     let temp = `<table class="layui-table ">
                //     <tr>
                //         <td style="border-right: none;color: #999;font-weight: bold">异常绑定</td>
                //         <td colspan="3" style="text-align: right;border-left: none">
                //             <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.bandErrors2(\`${myStr}\`)">
                //                 详情
                //             </button>
                //         </td>
                //     </tr>
                //     <tr>
                //         <td class="td-label">申报单位联系人</td>
                //         <td><input type="text" disabled value="${successObj.application_company_contact_name || ''}" class="layui-input" autocomplete="off"/></td>
                //         <td class="td-label">手机号码</td>
                //         <td><input type="text" disabled value="${successObj.application_company_contact_phone || ''}" class="layui-input" autocomplete="off"/></td>
                //     </tr>
                //     <tr>
                //         <td class="td-label">项目代码</td>
                //         <td><input type="text" disabled value="${successObj.project_code || ''}" class="layui-input" autocomplete="off"/></td>
                //         <td class="td-label">项目名称</td>
                //         <td><input type="text" disabled value="${successObj.project_name || ''}" class="layui-input" autocomplete="off"/></td>
                //     </tr>
                //     <tr>
                //         <td class="td-label">总投资（万元）</td>
                //         <td><input type="text" disabled value="${successObj.total_investment || ''}" class="layui-input" autocomplete="off"/></td>
                //         <td class="td-label">申报时间</td>
                //         <td><input type="text" disabled value="${successObj.application_time || ''}" class="layui-input" autocomplete="off"/></td>
                //     </tr>
                // </table>`;
                //     $('#error2').html(temp);
                    _UTIL.network.post("getOnlineApprovalPage.do", {listType: 2,  includeInvestOnlineId: biz_info._id, size: 100, page: 1}, 15000, function (res) {
                        bpList = res.data.datalist
                        let temp = bpList.map((item,index)=>{
                            let myStr = JSON.stringify(item).replaceAll('"','&quot;');
                            return `<table class="layui-table ">
                    <tr>
                        <td style="border-right: none;color: #999;font-weight: bold">报批证</td>
                        <td colspan="3" style="text-align: right;border-left: none">
                            <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.showband2(\`${myStr}\`)">
                                详情
                            </button>
                            <button type="button" class="layui-btn layui-bg-blue" onclick="biz_info.delband2(\`${item.id}\`)">
                                解绑
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td class="td-label">项目代码</td>
                        <td><input type="text" disabled value="${item.project_code}" class="layui-input" autocomplete="off"/></td>
                        <td class="td-label">项目名称</td>
                        <td><input type="text" disabled value="${item.project_name}" class="layui-input" autocomplete="off"/></td>
                    </tr>
                </table>`;
                        }).join('');
                        $('#tableBox2').html(temp);
                    })
                }
                _UTIL.dialog.closeAll()
                _UTIL.dialog.openRightDialog("approbationBox", "项目进度信息", '760px');

            });
            // _UTIL.dialog.close(dialog3);
            for (let key in successObj) {
                biz_info.emptyElementValue(key + '1')
            }
            // if (listType == 1) {
            //     $("#bandBtn1").show()
            //     $("#bandBtn").hide()
            // } else {
            //     $("#bandBtn2s").show()
            //     $("#bandBtn2").hide()
            // }
            // $("#bandBtn1").show()
            // $("#bandBtn").hide()
            // $(".xyBands").show()
            // $(".xyBand").hide()
            // $(".xyBands1").show()
            // $(".xyBand1").hide()
        }, function (index) {
            _UTIL.dialog.close(index);
            for (let key in successObj) {
                biz_info.emptyElementValue(key + '1')
            }
            // $("#bandBtn").show()
            // $("#bandBtn1").hide()
            // $(".xyBands").hide()
            // $(".xyBand").show()
            // $(".xyBands1").hide()
            // $(".xyBand1").show()
        });

    },
    bandSaves1: function (info) {
        layer.confirm('是否确认改绑该项目?', function (index) {
            _UTIL.network.post("bdzxsp.do", {signed_id: biz_info._id,
                // online_approvalId: biz_info.band_id,
                application_company_contact_name: $('#application_company_contact_name1').val(),
                application_company_contact_phone: $('#application_company_contact_phone1').val(),
                project_code: $('#project_code1').val(),
                project_name: $('#project_name1').val(),
                total_investment: $('#total_investment1').val(),
                application_time: $('#application_time1').val(),
                listType: listType
            }, 8000, function (res) {
                _UTIL.msg.success("绑定成功");
                _UTIL.dialog.close(index);
                // _UTIL.dialog.close(dialog3);
                _UTIL.dialog.closeAll()
                _UTIL.dialog.openRightDialog("approbationBox", "项目进度信息", '760px');
            });
            for (let key in successObj) {
                biz_info.emptyElementValue(key + '1')
            }
            // if (listType == 1) {
            //     $("#bandBtn1").show()
            //     $("#bandBtn").hide()
            // } else {
            //     $("#bandBtn2s").show()
            //     $("#bandBtn2").hide()
            // }
            // $(".xyBands").show()
            // $(".xyBand").hide()
            // $(".xyBands1").show()
            // $(".xyBand1").hide()
        }, function (index) {
            _UTIL.dialog.close(index);
            for (let key in successObj) {
                biz_info.emptyElementValue(key + '1')
            }
            // $("#bandBtn").show()
            // $("#bandBtn1").hide()
            // $(".xyBands").hide()
            // $(".xyBand").show()
            // $(".xyBands1").hide()
            // $(".xyBand1").show()
        });

    },
    pgDetails: function (info) {
        biz_info._id = info._id;
        //根据_id获取数据
        _UTIL.network.post("searchProjPgyj.do", {signed_id: info._id}, 15000, function (res) {
            //打开窗口
            // _UTIL.html.emptyContainerElements("pgInfo");
            if (res.code == 1) {
                let datalist = res.data.datalist
                let temp = datalist.map((item,index)=>{
                    return `<li><span>${item.pgbm}</span><span>${item.pgyj}</span></li>`;
                }).join('');
                $('#pgUl').html(temp);
            }
            _UTIL.dialog.openRightDialog("pgInfo", '评估详情', '640px');
        })
    },
    //查看详细信息
    details: function (info) {
        // $("#xyBox").show()
        // $("#zzBox").show()
        // $("#tzf_div").show()
        // $("#tzf_div").show()
        // $("#zsf_div").show()
        // $("#tzfs_div").show()
        // $("#tzdz_div").show()
        // $("#zsf").attr('lay-verify', "required")
        // $("#tzf").attr('lay-verify', "required")
        // $("#tzdz").attr('lay-verify', "required")
        // $("#hide1").show()
        // $("#hide2").show()
        biz_info._id = info._id;
        //根据_id获取数据
        _UTIL.network.post("getProjProjectSignedById.do", {_id: info._id}, 15000, function (result) {
            //打开窗口
            _UTIL.html.emptyContainerElements("detailInfo");
            _UTIL.dialog.openRightDialog("detailInfo", info._name, '840px');
            // $("#detailInfo").show().css({"width": "800px"});

            $("#detailInfo input").attr('disabled', true)
            $("#detailInfo button").attr('disabled', true)
            $("#detailInfo input").attr('readOnly', true)
            $("#detailInfo button").attr('readOnly', true)
            $("#detailInfo select").attr('disabled', true)
            $("#detailInfo select").attr('readOnly', true)
            $("#detailInfo input").addClass('layui-disabled');
            $("#detailInfo button").addClass('layui-disabled');
            $("#detailInfo select").addClass('layui-disabled');
            $("#drafts ").hide();
            $("#btnCancel ").hide();
            $("#btnSave ").hide();
            _UTIL.html.setValues(result.data.info);
            //图片展示不为空
            fileProjArr = [];
            fileProjArr1 = [];
            fileProjArr6 = []
            //图片展示不为空
            var imgs = result.data.imgs && result.data.imgs.length ? result.data.imgs.filter(item => item.cate_code == 0) : [];
            var label = "";
            //向数组中存放后端值
            if (imgs && imgs.length) {
                $("#file_project").html("");
                var index = 0;
                for (var f in imgs) {
                    var i = imgs[f];
                    var ob = {};
                    ob.filename = i._name;
                    ob.file_path = i.file_path;
                    fileProjArr.push(ob);
                    label = "<li id2='" + (index++) + "'><a  href='" + upload_file_path_proj + i.file_path + "' target='_blank'>" + i._name + "</a>" + ' / ' + "<span class='create_time'>" + i.create_time + "</span>" + "</li>";
                    $("#file_project").append(label);
                }

            } else {
                $("#file_project").html("<li>无</li>");
            }

            var imgs1 = result.data.imgs && result.data.imgs.length ? result.data.imgs.filter(item => item.cate_code == 99) : []
            var label1 = "";
            //向数组中存放后端值
            if (imgs1 && imgs1.length) {
                $("#file_project1").html("");
                var index = 0;
                for (var f in imgs1) {
                    var i = imgs1[f];
                    var ob = {};
                    ob.filename = i._name;
                    ob.file_path = i.file_path;
                    fileProjArr1.push(ob);
                    label1 = "<li id2='" + (index++) + "'><a  href='" + upload_file_path_proj + i.file_path + "' target='_blank'>" + i._name + "</a><i class='delBaseEdit layui-icon'>&#x1006;</i></li>";
                    $("#file_project1").append(label1);
                }

            } else {
                $("#file_project1").html("<li>无</li>");
            }

            var imgs6 = result.data.imgs && result.data.imgs.length ? result.data.imgs.filter(item => item.cate_code == 66) : []
            var label6 = "";
            //向数组中存放后端值
            if (imgs6 && imgs6.length) {
                $("#file_project_new6").html("");
                var index = 0;
                for (var f in imgs6) {
                    var i = imgs6[f];
                    var ob = {};
                    ob.filename = i._name;
                    ob.file_path = i.file_path;
                    fileProjArr6.push(ob);
                    label6 = "<li id2='" + (index++) + "'><a  href='" + upload_file_path_proj + i.file_path + "' target='_blank'>" + i._name + "</a><i class='delBaseEdit layui-icon'>&#x1006;</i></li>";
                    $("#file_project_new6").append(label6);
                }

            } else {
                $("#file_project_new6").html("<li>无</li>");
            }
            //根据点击切换值
            if (info.p_type == 1) {
                $("#span").text("亿元");
                $(".moneyText").text("万元");
            } else {
                $("#span").text("万美元");
                $(".moneyText").text("万美元");
            }
            $("input[name=is_sixpro][value=" + result.data.info.is_sixpro + "]").prop("checked", true)
            $("input[name=p_type][value=" + info.p_type + "]").prop("checked", true);
            $("input[name=b_industry][value=" + info.b_industry + "]").prop("checked", true);
            $("input[name=b_resource][value=" + info.b_resource + "]").prop("checked", true);
            if (result.data.info.is_import_proj) {
                $("input[name=is_import_proj][value =" + result.data.info.is_import_proj + "]").prop("checked", true);
            }
            if (result.data.info.is_rzxq) {
                $("input[name=is_rzxq][value =" + result.data.info.is_rzxq + "]").prop("checked", true);
            } else {
                $("input[name=is_rzxq]").prop('checked', false)
            }
            // if (result.data.info.is_warning_invest) {
            //     $("input[name=is_warning_invest][value =" + result.data.info.is_warning_invest + "]").prop("checked", true);
            // }
            if (info.is_rzxq == '是') {
                $(".rz_tr").show()
                $('#rz_money').attr('lay-verify', "required")
            } else {
                $(".rz_tr").hide()
                $('#rz_money').removeAttr('lay-verify')
            }
            if (info.b_resource == 2) {
                // $("#sjjg_name").show()
                $("#orgBox").show()
                $("#sjjg_name").addClass('required')
            } else {
                if (info.b_resource == 1) {
                    // $("#sjjg_name").hide()
                    $("#orgBox").hide()
                    $("#sjjg_name").removeClass('required')
                } else {
                    $("input[name=b_resource][value='1']").prop("checked", true);
                    // $("#sjjg_name").hide()
                    $("#orgBox").hide()
                    $("#sjjg_name").removeClass('required')
                }
            }
            if (info.is_gxjs) {
                $("input[name=is_gxjs][value =" + info.is_gxjs + "]").prop("checked", true);
            }
            if (info.is_kc_proj) {
                $("input[name=is_kc_proj][value =" + info.is_kc_proj + "]").prop("checked", true);
                if (info.is_kc_proj == '是') {
                    $("#kc_proj_div").show()
                    $("#kc_proj_tj").attr('lay-verify', "required")
                    $("#kc_proj_type").attr('lay-verify', "required")
                } else {
                    $("#kc_proj_div").hide()
                    $("#kc_proj_tj").removeAttr('lay-verify')
                    $("#kc_proj_type").removeAttr('lay-verify')
                }
                $("#kc_proj_tj").val(info.kc_proj_tj);
                $("#kc_proj_type").val(info.kc_proj_type);
            }
            if (info.is_build_yfzx) {
                $("input[name=is_build_yfzx][value =" + info.is_build_yfzx + "]").prop("checked", true);
                if (info.is_build_yfzx == '是') {
                    $("#build_yfzx_div").show()
                    $("#build_yfzx").addClass('required')
                } else {
                    $("#build_yfzx_div").hide()
                    $("#build_yfzx").removeClass('required')
                }
                $("#build_yfzx").val(info.build_yfzx);
            }
            if (info.is_sj_proj) {
                $("input[name=is_sj_proj][value =" + info.is_sj_proj + "]").prop("checked", true);
                if (info.is_sj_proj == '是') {
                    $("#sj_proj_div").show()
                    $("#sj_proj").addClass('required')
                } else {
                    $("#sj_proj_div").hide()
                    $("#sj_proj").removeClass('required')
                }
                $("#sj_proj").val(info.sj_proj);
            }
            if (info.is_import_proj == '是') {
                $("#import_proj_div").show()
                $("#import_proj_type").addClass('required')
            } else {
                $("#import_proj_div").hide()
                $("#import_proj_type").removeClass('required')
            }
            $("#industry_name").val(result.data.info.industry_name);
            $("#sixpro_code").val(result.data.info.sixpro_code);
            var proj_type = document.getElementsByName("ra_proj_type");
            if (info.proj_type == "c" || info.proj_type == "") {
                $(proj_type[0]).prop("checked", true);
                $("#div_proj_type").hide();
            } else {
                $(proj_type[1]).prop("checked", true);
                $("#div_proj_type").show();
                if (info["proj_type"]) {
                    treeSelect.checkNode('proj_type', info.proj_type);
                }
            }
            var pType = $('input[name="p_type"]:checked').val();
            if (pType == 1) {
                $("#span").text("亿元");
                $(".moneyText").text("万元");
                $("#foreign_money").addClass("layui-disabled");
                $("#foreign_money").attr("disabled", true);
                $("#foreign_money").removeClass("required");
                $("#foreign_money").val("")
                // 动态渲染内资投资方注册地选项
                renderInvestorPlaceOptions(1);
            } else {
                $("#span").text("万美元")
                $(".moneyText").text("万美元");
                $("#foreign_money").removeClass("layui-disabled");
                $("#foreign_money").removeAttr("disabled");
                $("#foreign_money").addClass("required");
                // 动态渲染外资投资方注册地选项
                renderInvestorPlaceOptions(2);
            }
            layui.form.render("radio");
            $("#investor_place").val(result.data.info.investor_place);
            layui.form.render("select");
            biz_info.renderZone(function () {
                $("#zone_code").val(result.data.info.zone_code);
                biz_info.renderTown(function () {
                    $("#town_code").val(result.data.info.town_code);
                    layui.form.render("select");
                });
                layui.form.render("select");
            });

            if (info["industry_code"]) {
                treeSelect.checkNode('industry_code', info.industry_code);
            }
            if (result.data.fzList && result.data.fzList.length) {
                fzList = result.data.fzList.map(item => {
                    if (item.content) {
                        return item.content.split('、')[1]
                    }
                }).concat(defaultFZ)
                fzHmtl();
            } else {
                fzInit();
            }
        });
    },
    layuiTableRenderS1: function (elementId, url, size, cols, wheres, doBack) {
        var table = layui.table;
        var tableIns = table.render({
            id: elementId
            , elem: '#' + elementId
            , url: url
            , page: true
            , method: 'post'
            , contentType: "application/json"
            , limit: size
            , parseData: function (res) {
                try {
                    return {
                        "code": res.code === "1" ? 0 : -1, //解析接口状态
                        "msg": res.msg, //解析提示文本
                        "count": res.data.count, //解析数据长度
                        "data": res.data.datalist //解析数据列表
                    };
                } catch (e) {
                    return {
                        "code": -1, //解析接口状态
                        "msg": "您可能没有权限，或者您的网络连接出了问题，请联系管理员", //解析提示文本
                        "count": 0, //解析数据长度
                        "data": [] //解析数据列表
                    };
                }
            }
            , request: {
                pageName: 'page',
                limitName: 'size'
            }
            , done: doBack
            , where: wheres
            , cols: cols
            , limits: [5, 10, 20, 50, 100]
        });
        _UTIL.biz.layuiBingTableEvent(elementId);
        return tableIns;
    },
    bandBtn: function (event) {
        dialog1 = _UTIL.dialog.openRightDialog("bandBox", '在线审批项目查询绑定', '1200px', {}, biz_info._id);
        var cols = [
            [
                // {type: 'checkbox', fixed: 'left'},
                {field: 'project_code', title: '项目编码'}
                , {field: 'project_name', title: '项目名称'}
                , {field: 'project_type_label', title: '项目审批类型', align: 'center'}
                , {field: 'construction_scale_and_content', title: '项目内容'}
                , {field: 'total_investment', title: '总投资(万元)', align: 'center'}
                , {field: 'legal_company_contactName', title: '申报公司联系人', align: 'center'}
                , {field: 'legal_company_contact_phone', title: '申报人手机号', align: 'center'}
                , {fixed: 'right', templet: '#operations1', minWidth: 80, title: '操作', align: 'center'}
            ]
        ];
        var where = {
            listType: 1,
            excludeInvestOnlineId: biz_info._id
        };
        biz_info.layuiTableRenderS1("datalist1", "getOnlineApprovalPage.do", 10, cols, where, function (res, curr, count) {

        });
    },
    bandBtn2: function (event) {
        dialog1 = _UTIL.dialog.openRightDialog("bandBox2", '工程审批项目查询绑定', '1200px');
        var cols = [
            [
                {field: 'project_code', title: '项目编码'}
                , {field: 'project_name', title: '项目名称'}
                , {field: 'project_type_label', title: '项目审批类型', align: 'center'}
                , {field: 'construction_content', title: '建设内容'}
                , {field: 'total_investment', title: '总投资(万元)', align: 'center'}
                , {field: 'legal_company_contactName', title: '申报公司联系人', align: 'center'}
                , {field: 'legal_company_contact_phone', title: '申报人手机号', align: 'center'}
                , {fixed: 'right', templet: '#operations2', minWidth: 80, title: '操作', align: 'center'}
            ]
        ];
        var where = {
            listType: 2,
            excludeInvestOnlineId: biz_info._id
        };
        biz_info.layuiTableRenderS1("datalist2", "getOnlineApprovalPage.do", 10, cols, where, function (res, curr, count) {

        });
    }
}


$(document).ready(function () {
    // 初始化加载投资方注册地映射
    fetchInvestorPlaceMap();
    
    // $('#invest_money').blur(function(){
    //     if (biz_info.pg_status == 2 || biz_info.pg_status == 3) {
    //         $("#xyBox").show()
    //         $("#zzBox").show()
    //         $("#tzf_div").show()
    //         $("#zsf_div").show()
    //         $("#tzfs_div").show()
    //         $("#tzdz_div").show()
    //         $("#zsf").attr('lay-verify', "required")
    //         $("#tzf").attr('lay-verify', "required")
    //         $("#tzdz").attr('lay-verify', "required")
    //         $('#btnSave').text('提交')
    //     } else {
    //         if ($('input[name="p_type"]:checked').val() == 1) {
    //             if ( $('#invest_money').val() && Number($('#invest_money').val()) < 5 ) {
    //                 $('#btnSave').text('提交')
    //                 $("#xyBox").show()
    //                 $("#zzBox").show()
    //                 $("#tzf_div").show()
    //                 $("#zsf_div").show()
    //                 $("#tzfs_div").show()
    //                 $("#tzdz_div").show()
    //                 $("#zsf").attr('lay-verify', "required")
    //                 $("#tzf").attr('lay-verify', "required")
    //                 $("#tzdz").attr('lay-verify', "required")
    //             } else {
    //                 $('#btnSave').text('提交项目质态评估')
    //                 $("#xyBox").hide()
    //                 $("#zzBox").hide()
    //                 $("#tzf_div").hide()
    //                 $("#zsf_div").hide()
    //                 $("#tzfs_div").hide()
    //                 $("#tzdz_div").hide()
    //                 $("#zsf").removeAttr('lay-verify')
    //                 $("#tzf").removeAttr('lay-verify')
    //                 $("#tzdz").removeAttr('lay-verify')
    //             }
    //         } else {
    //             if ( $('#invest_money').val() && Number($('#invest_money').val()) < 3000 ) {
    //                 $('#btnSave').text('提交')
    //                 $("#xyBox").show()
    //                 $("#zzBox").show()
    //                 $("#tzf_div").show()
    //                 $("#tzf_div").show()
    //                 $("#zsf_div").show()
    //                 $("#tzfs_div").show()
    //                 $("#tzdz_div").show()
    //                 $("#zsf").attr('lay-verify', "required")
    //                 $("#tzf").attr('lay-verify', "required")
    //                 $("#tzdz").attr('lay-verify', "required")
    //             } else {
    //                 $('#btnSave').text('提交项目质态评估')
    //                 $("#xyBox").hide()
    //                 $("#zzBox").hide()
    //                 $("#tzf_div").hide()
    //                 $("#zsf_div").hide()
    //                 $("#tzfs_div").hide()
    //                 $("#tzdz_div").hide()
    //                 $("#zsf").removeAttr('lay-verify')
    //                 $("#tzf").removeAttr('lay-verify')
    //                 $("#tzdz").removeAttr('lay-verify')
    //             }
    //         }
    //     }
    //     // 当input失去焦点时执行的代码
    // });
    $("#sjjg_name_search").on("keyup",async function(e){
        // 点击enter实现搜索功能
        if(e.which=='13'){
            console.log("点击了enter",$(this).val())
            // 模拟请求获取下拉菜单所需的参数
            // dropData=await getData()
            // console.log("下拉菜单的数据：",dropData)
            // 将获取回来的数据渲染给下拉菜单
            _UTIL.network.post("searchProjSourceList.do", {name: $(this).val()}, 8000, function (res) {
                console.log(res, 999)
                if (res.code == 1) {
                    dropData = res.data.datalist
                    innitSelect("#orgname",dropData)
                    let form = layui.form;
                    form.render()
                    // 将下拉框展开
                    $("#orgBox .layui-form-select").addClass("layui-form-selected")
                }
            });
        }
    })
    // 向本地存储数据
    //非负数
    $(".xyClose1").click(function () {
        _UTIL.dialog.closeAll()
        _UTIL.dialog.openRightDialog("approbationBox", "项目进度信息", '760px');
    })
    $(".xyClose").click(function () {
        _UTIL.dialog.closeAll()
        _UTIL.dialog.openRightDialog("approbationBox", "项目进度信息", '760px');
    })
    $(".xyClose2").click(function () {
        _UTIL.dialog.closeAll()
        _UTIL.dialog.openRightDialog("approbationBox", "项目进度信息", '760px');
    })
    $("#addFz").click(function () {
        let temp = $("#fzValue").val().trim();
        if (temp) {
            fzAdditem(temp);
            $("#fzValue").val('');
        }else{
            _UTIL.msg.warn("请先在输入框内填写内容，再点击添加附则。");
        }
    })
    $('#fzValue').on('keydown', function(event) {
        // 使用event.key判断是否按下了Enter键
        // 这种方式比使用键码13更直观且兼容性更好
        if (event.key === 'Enter') {
            // 阻止默认行为（避免自动换行）
            event.preventDefault();
            $("#addFz").click();
            // 在这里编写Enter键按下后的处理逻辑


            // 示例：可以在这里提交表单或执行其他操作
            // $('#myForm').submit();

            // 清空文本框（根据需求决定是否添加）
            // $(this).val('');
        }
    });
    // $('#plan_total1').blur(function(){
    //     let val1 = $('#plan_total1').val()
    //     let val2 = $('#sq_land_area').val()
    //     if (val1 && val2) {
    //         let num = (((Number(val1) / Number(val2)) * 100) / 100).toFixed(2)
    //         $('#invest_level').val(num)
    //     }
    //     // 当input失去焦点时执行的代码
    // });
    // $('#sq_land_area').blur(function(){
    //     let val1 = $('#plan_total1').val()
    //     let val2 = $('#sq_land_area').val()
    //     if (val1 && val2) {
    //         let num = (((Number(val1) / Number(val2)) * 100) / 100).toFixed(2)
    //         $('#invest_level').val(num)
    //     }
    //     // 当input失去焦点时执行的代码
    // });
    // $('#zl_land_area').blur(function(){
    //     let val1 = $('#zl_land_area').val()
    //     if (val1) {
    //         let num = (((Number(val1) / 2000) * 100) / 100).toFixed(2)
    //         $('#zl_land_area_zs').val(num)
    //     }
    //     // 当input失去焦点时执行的代码
    // });
    _UTIL.html.autoBindAction();//自动绑定带有q-method属性的button, 执行的方法再biz_info中定义
    function renderTreeSelect(options) {
        treeSelect.render({
            // 选择器
            elem: options.elem,
            // 数据
            data: options.data,
            // 异步加载方式：get/post，默认get
            type: 'post',
            search: true,
            // 占位符
            placeholder: options.placeholder,
            // 是否开启搜索功能：true/false，默认false
            // 点击回调
            click: function (d) {
                if (options.onSelected) {
                    options.onSelected(d);
                }
            },
            // 加载完成后的回调函数
            success: function (d) {
                if (options.succBack) {
                    options.succBack(d);
                }
            },
            errback: function () {
                if (options.errBack) {
                    options.errBack();
                }
            }
        });
    }

    function renderIndustryCode() {
        renderTreeSelect({
            // 选择器
            elem: '#industry_code',
            // 数据
            data: 'getIndustryTreeSelect.do',
            placeholder: '行业编码',
            onSelected: function (d) {
                console.log(d, 9988)
                $("#industry_name").val(d.current.name);
                $("#industry_code").val(d.current.id);
            }
            , succBack: function (d) {
                // console.log(d);
                // treeSelect.refresh('tree');
            },
            errBack: function () {
                // _UTIL.msg.warn("数据初始化发生错误，请检查网络并刷新功能。");
                var pp = $("#industry_code").parent();
                pp.remove(".layui-treeSelect");
                var gxbtn = $("<button class='layui-btn layui-bg-blue'>刷新数据</button>");
                pp.append(gxbtn);
                gxbtn.click(function () {
                    $(this).remove();
                    renderIndustryCode();
                });
            }
        })
    }

    function renderIndustryCode1() {
        renderTreeSelect({
            // 选择器
            elem: '#kg_industry_code',
            // 数据
            data: 'getIndustryTreeSelect.do',
            placeholder: '行业编码',
            onSelected: function (d) {
                $("#kg_industry_name").val(d.current.name);
                $("#kg_industry_code").val(d.current.id);
            }
            , succBack: function (d) {
                // console.log(d);
                // treeSelect.refresh('tree');
            },
            errBack: function () {
                // _UTIL.msg.warn("数据初始化发生错误，请检查网络并刷新功能。");
                var pp = $("#kg_industry_code").parent();
                pp.remove(".layui-treeSelect");
                var gxbtn = $("<button class='layui-btn layui-bg-blue'>刷新数据</button>");
                pp.append(gxbtn);
                gxbtn.click(function () {
                    $(this).remove();
                    renderIndustryCode1();
                });
            }
        })
    }

    function renderSIndustryCode() {
        renderTreeSelect({
            // 选择器
            elem: '#s_industry_code',
            // 数据
            data: 'getIndustryTreeSelect.do',
            placeholder: '行业编码',
            onSelected: function (d) {
                $("#s_industry_name").val(d.current.name);
                $("#s_industry_code").val(d.current.id);
            },
            succBack: function (d) {
                // console.log(d);
                // treeSelect.refresh('tree');
            },
            errBack: function () {
                // _UTIL.msg.warn("数据初始化发生错误，请检查网络并刷新功能。");
                var pp = $("#s_industry_code").parent();
                pp.remove(".layui-treeSelect");

                var gxbtn = $("<button class='layui-btn layui-bg-blue'>刷新数据</button>");
                pp.append(gxbtn);
                gxbtn.click(function () {
                    $(this).remove();
                    renderSIndustryCode();
                });
            }
        });
    }

    function renderSProjType() {
        renderTreeSelect({
            // 选择器
            elem: '#s_s_proj_type',
            // 数据
            data: 'getProjType.do',
            placeholder: '项目类型',
            onSelected: function (d) {
                $("#s_proj_code").val(d.current.id);
                $("#s_s_proj_type").val(d.current.name);
            }
            , succBack: function (d) {
                // console.log(d);
            },
            errBack: function () {
                // _UTIL.msg.warn("数据初始化发生错误，请检查网络并刷新功能。");
                var pp = $("#s_s_proj_type").parent();
                pp.remove(".layui-treeSelect");
                var gxbtn = $("<button class='layui-btn layui-bg-blue'>刷新数据</button>");
                pp.append(gxbtn);
                gxbtn.click(function () {
                    $(this).remove();
                    renderSProjType();
                });
            }
        });
    }

    function renderProjType() {
        renderTreeSelect({
            // 选择器
            elem: '#proj_type',
            // 数据
            data: 'getProjType.do',
            placeholder: '项目类型',
            onSelected: function (d) {
                $("#proj_type").val(d.current.id);
            }
            , succBack: function (d) {
                // $("#proj_type").val(d.current.id);
            },
            errBack: function () {
                // _UTIL.msg.warn("数据初始化发生错误，请检查网络并刷新功能。");
                var pp = $("#proj_type").parent();
                pp.remove(".layui-treeSelect");
                var gxbtn = $("<button class='layui-btn layui-bg-blue'>刷新数据</button>");
                pp.append(gxbtn);
                gxbtn.click(function () {
                    $(this).remove();
                    renderProjType();
                });
            }
        });
    }

    function renderProjType1() {
        renderTreeSelect({
            // 选择器
            elem: '#kg_proj_type',
            // 数据
            data: 'getProjType.do',
            placeholder: '项目类型',
            onSelected: function (d) {
                $("#kg_proj_type").val(d.current.id);
            }
            , succBack: function (d) {
                // $("#proj_type").val(d.current.id);
            },
            errBack: function () {
                // _UTIL.msg.warn("数据初始化发生错误，请检查网络并刷新功能。");
                var pp = $("#kg_proj_type").parent();
                pp.remove(".layui-treeSelect");
                var gxbtn = $("<button class='layui-btn layui-bg-blue'>刷新数据</button>");
                pp.append(gxbtn);
                gxbtn.click(function () {
                    $(this).remove();
                    renderProjType1();
                });
            }
        });
    }

    function page_init() {

        layui.use(['form', 'notice', 'element', 'table', 'layer', 'upload', 'flow', 'laydate', 'treeSelect'], function () {
            //industry下拉树
            treeSelect = layui.treeSelect;
            renderIndustryCode();
            renderIndustryCode1();
            renderProjType1();
            renderSIndustryCode();
            renderSProjType();
            renderProjType();

            // var table1 = layui.table;
            // table.render({
            //     defaultToolbar:  ['filter', 'print', 'exports']
            // })
            // table1.on('checkbox(datalist1)', function(obj){
            //     console.log(obj, 11111)
            // });
            // table1.on('checkbox(datalist2)', function(obj){
            //     console.log(obj, 22222)
            // });
            var form = layui.form;
            setprivilege();
            form.render("select");
            form.render("radio");

            //自定义验证
            form.verify({
                radioVerify: function (value, item) { //value：表单的值、item：表单的DOM对象
                    var $ = layui.$;
                    var verifyName = $(item).attr('name')
                        , verifyType = $(item).attr('type')
                        , formElem = $(item).parents('.layui-form')   //获取当前所在的form元素，如果存在的话
                        , verifyElem = formElem.find("input[name='" + verifyName + "']")//获取需要校验的元素
                        , isTrue = verifyElem.is(':checked')//是否命中校验
                        , focusElem = verifyElem.next().find('i.layui-icon');//焦点元素
                    if (!isTrue || !value) {
                        //定位焦点
                        focusElem.css(verifyType == 'radio' ? {"color": "#FF5722"} : {"border-color": "#FF5722"});
                        //对非输入框设置焦点
                        focusElem.first().attr("tabIndex", "1").css("outline", "0").blur(function () {
                            focusElem.css(verifyType == 'radio' ? {"color": ""} : {"border-color": ""});
                        }).focus();
                        return '必填项不能为空!!!';
                    }
                }
            })
            // if ($("#btnSave").text() == '提交') {
            //     layer.confirm('该项目已与我园区（镇街）签订正式合同，以上信息确切无误，附件资料真实、有效。我园区（镇街）已知悉计入市级机关部门（单位）的签约项目，不再纳入市（区）、园区签约项目总数考核。', {
            //         btn: ['确定', '关闭'] //按钮
            //     }, function(index){
            //         layer.close(index);
            //         biz_info.save()
            //     }, function(){
            //
            //     });
            // } else {
            //     biz_info.save()
            // }
            // 提交事件
            form.on('submit(demo-submit)', function(res){
                // if ($("#btnSave").text() == '提交') {
                //     layer.confirm('该项目已与我园区（镇街）签订正式合同，以上信息确切无误，附件资料真实、有效。我园区（镇街）已知悉计入市级机关部门（单位）的签约项目，不再纳入市（区）、园区签约项目总数考核。', {
                //         btn: ['确定', '关闭'] //按钮
                //     }, function(index){
                //         layer.close(index);
                //         toEnd(res.field)
                //     }, function(){
                //
                //     });
                // } else {
                    toEnd(res.field)
                // }
                // 此处可执行 Ajax 等操作
                // …
                return false; // 阻止默认 form 跳转
            });
            function toEnd (mydata, check_status) {
                var _id = biz_info._id;
                var data = mydata; // 获取表单字段值
                if (fzList.length > 3) {
                    data.fzList = fzList.map((item, index) => {
                        return parseInt(index + 1) + '、' + item
                    }).slice(0, -3)
                    console.log(data.fzList, 888)
                }
                // 显示填写结果，仅作演示用
                if (data.district_code && data.district_code.length > 0) {
                    data['district'] = $("#district_code option:selected").text();
                }
                if (data.zone_code && data.zone_code.length > 0) {
                    data['zone_name'] = $("#zone_code option:selected").text();
                }
                if (data.town_code && data.town_code.length > 0) {

                    data['town_name'] = $("#town_code option:selected").text();
                }
                if (data.industry_first_code && data.industry_first_code.length > 0) {
                    data['industry_first_name'] = $("#industry_first_code option:selected").text();
                }
                var invest_money = $("#invest_money").val().trim();
                var foreign_money = $("#foreign_money").val().trim();
                data['sixpro_code'] = $("#sixpro_code").val();
                if (invest_money == "") {
                    data['invest_money'] = 0;
                }
                if (foreign_money == "") {
                    data['foreign_money'] = 0;
                }

                var files = $("#file_project a");
                var times = $("#file_project .create_time");
                if (files.length == 0) {
                    // _UTIL.msg.warn("请选择需要上传的文件");
                    _UTIL.msg.tip($("#file_project"), "请选择需要上传的文件")
                    return false;
                }
                var fileArr = [];
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    let time = times[i]
                    var ob = {};
                    ob.file_path = $(file).attr("href").replace(upload_file_path_proj, "");
                    // ob.file_path = $(file).attr("href");
                    ob.filename = $(file).text();
                    ob.create_time = $(time).text();
                    ob.cate_code = '0'
                    fileArr.push(ob);
                }

                var files1 = $("#file_project1 a");
                if (files1.length == 0) {
                    // _UTIL.msg.warn("请选择需要上传的文件");
                    _UTIL.msg.tip($("#file_project1"), "请选择需要上传的文件")
                    return false;
                }
                var fileArr1 = [];
                for (var i = 0; i < files1.length; i++) {
                    var file1 = files1[i];
                    var ob = {};
                    ob.file_path = $(file1).attr("href").replace(upload_file_path_proj, "");
                    // ob.file_path = $(file).attr("href");
                    ob.filename = $(file1).text();
                    ob.cate_code = '99'
                    fileArr1.push(ob);
                }

                var files6= $("#file_project_new6 a");
                if ($('input[name="is_kc_proj"]:checked').val() == '是' && files6.length == 0) {
                    // _UTIL.msg.warn("请选择需要上传的文件");
                    _UTIL.msg.tip($("#file_project_new6"), "请选择需要上传的文件")
                    return false;
                }
                var fileArr6 = [];
                for (var i = 0; i < files6.length; i++) {
                    var file6 = files6[i];
                    var ob = {};
                    ob.file_path = $(file6).attr("href").replace(upload_file_path_proj, "");
                    // ob.file_path = $(file).attr("href");
                    ob.filename = $(file6).text();
                    ob.cate_code = '66'
                    fileArr6.push(ob);
                }
                data['imgArr1'] = fileArr;
                data['imgArr'] = [...fileArr, ...fileArr1, ...fileArr6];
                data['ztpgzzcl'] = fileArr1.map(item => 'http://172.22.26.71:54934/images/' + item.file_path).join(';')
                data['xyzzcl'] = fileArr.map(item => 'http://172.22.26.71:54934/images/' + item.file_path).join(';')
                // console.log(data);
                // var ob = {};
                // ob.filename = res.data.fileName;
                // ob.file_path = res.data.src;
                //存放图片的数组
                // data['imgArr'] = fileProjArr;
                // if (fileProjArr.length == 0) {
                //     _UTIL.msg.warn("请选择需要上传的文件");
                //     return false;
                // }
                data['progress'] = 0;
                //设置当前的项目_id
                data['_id'] = _id;
                if (biz_info.pg_status) {
                    data['pg_status'] = biz_info.pg_status;
                }
                //设置状态为保存未提交
                if (!check_status) {  //如果传了这个值
                    check_status = 0;
                    if ($('input[name="b_resource"]:checked').val() == 1) {
                        if ($('input[name="p_type"]:checked').val() == 1) {
                            if ( $('#invest_money').val() && Number($('#invest_money').val()) < 5 ) {
                                data['pg_status'] = 3
                            }
                        } else {
                            if ( $('#invest_money').val() && Number($('#invest_money').val()) < 3000 ) {
                                data['pg_status'] = 3
                            }
                        }
                    }
                }
                data['check_status'] = check_status;
                data['cate_code'] = '0';
                data['cate_code1'] = '99';
                if (key) {
                    data['qr_key'] = key
                }
                //开始编辑保存中==
                _UTIL.biz.save("SaveProjProjSigned.do", data, 15000, function () {
                    //清空数组
                    fileProjArr = [];
                    index = 0;
                    var table = layui.table;
                    table.reload('datalist');
                    // _UTIL.dialog.closeAll();
                    biz_info.cancel();
                    _UTIL.msg.success("操作成功");
                });
            }
            form.on('submit(cg-submit)', function(res){
                toEnd(res.field, 4)
                return false; // 阻止默认 form 跳转
            });
            form.on('submit(scxy-submit)', function(res){
                var _id = biz_info._id;
                var data = res.field; // 获取表单字段值
                if (fzList.length) {
                    data.fzList = fzList.map((item, index) => {
                        return parseInt(index + 1) + '、' + item
                    })
                    console.log(data.fzList, 6)
                }
                // 显示填写结果，仅作演示用
                if (data.district_code && data.district_code.length > 0) {
                    data['district'] = $("#district_code option:selected").text();
                }
                if (data.zone_code && data.zone_code.length > 0) {
                    data['zone_name'] = $("#zone_code option:selected").text();
                }
                if (data.town_code && data.town_code.length > 0) {

                    data['town_name'] = $("#town_code option:selected").text();
                }
                var invest_money = $("#invest_money").val().trim();
                var foreign_money = $("#foreign_money").val().trim();
                data['sixpro_code'] = $("#sixpro_code").val();
                if (invest_money == "") {
                    data['invest_money'] = 0;
                }
                if (foreign_money == "") {
                    data['foreign_money'] = 0;
                }

                var files = $("#file_project a");
                var times = $("#file_project .create_time");
                // if (files.length == 0 && biz_info.pg_status == 2) {
                //     // _UTIL.msg.warn("请选择需要上传的文件");
                //     _UTIL.msg.tip($("#file_project"), "请选择需要上传的文件")
                //     return false;
                // }
                var fileArr = [];
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    let time = times[i]
                    var ob = {};
                    ob.file_path = $(file).attr("href").replace(upload_file_path_proj, "");
                    // ob.file_path = $(file).attr("href");
                    ob.filename = $(file).text();
                    ob.create_time = $(time).text();
                    ob.cate_code = '0'
                    fileArr.push(ob);
                }

                var files1 = $("#file_project1 a");
                // if (files1.length == 0) {
                //     // _UTIL.msg.warn("请选择需要上传的文件");
                //     _UTIL.msg.tip($("#file_project1"), "请选择需要上传的文件")
                //     return false;
                // }
                var fileArr1 = [];
                for (var i = 0; i < files1.length; i++) {
                    var file1 = files1[i];
                    var ob = {};
                    ob.file_path = $(file1).attr("href").replace(upload_file_path_proj, "");
                    // ob.file_path = $(file).attr("href");
                    ob.filename = $(file1).text();
                    ob.cate_code = '99'
                    fileArr1.push(ob);
                }
                data['imgArr1'] = fileArr;
                data['imgArr'] = [...fileArr, ...fileArr1];
                data['ztpgzzcl'] = fileArr1.map(item => 'http://172.22.26.71:54934/images/' + item.file_path).join(';')
                data['xyzzcl'] = fileArr.map(item => 'http://172.22.26.71:54934/images/' + item.file_path).join(';')
                // console.log(data);
                // var ob = {};
                // ob.filename = res.data.fileName;
                // ob.file_path = res.data.src;
                //存放图片的数组
                // data['imgArr'] = fileProjArr;
                // if (fileProjArr.length == 0) {
                //     _UTIL.msg.warn("请选择需要上传的文件");
                //     return false;
                // }
                data['progress'] = 0;
                //设置当前的项目_id
                data['_id'] = _id;
                if (biz_info.pg_status) {
                    data['pg_status'] = biz_info.pg_status;
                }
                //设置状态为保存未提交
                // if (!check_status) {  //如果传了这个值
                //     check_status = 0;
                // }
                // data['check_status'] = 4;
                data['cate_code'] = '0';
                data['cate_code1'] = '99';
                if (key) {
                    data['qr_key'] = key
                } else {
                    key = new Date().getTime()
                    data['qr_key'] = key
                }
                console.log(key, 88888)
                //开始编辑保存中==
                _UTIL.network.post("exportPdf.do", data, 15000, function (res) {
                    let url = res.data
                    if (url) {
                        var a = document.createElement('a');
                        a.href = url;
                        a.download = '项目签约协议.docx';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a)
                        // _UTIL.dialog.openDialog("htmlToPdfDetail", "协议预览", "800", "550")
                        // $("#xyIframe").attr("src", url)
                    }
                })
                // 此处可执行 Ajax 等操作
                // …
                return false; // 阻止默认 form 跳转
            });
            form.on('radio(kg_is_zkc)', function (data) {
                if (data.value == '是') {
                    $("#kc_div").show()
                } else {
                    $("#kc_div").hide()
                }
            });
            form.on('radio(is_rzxq)', function (data) {
                if (data.value == '是') {
                    $(".rz_tr").show()
                    $('#rz_money').attr('lay-verify', "required")
                } else {
                    $(".rz_tr").hide()
                    $('#rz_money').removeAttr('lay-verify')
                }
            });
            form.on('radio(jg_is_zkc)', function (data) {
                if (data.value == '是') {
                    $("#qy_info").show()
                    $("#jg_message").show()
                } else {
                    $("#qy_info").hide()
                    $("#jg_message").hide()
                }
            });
            form.on('radio(is_import_proj)', function (data) {
                $("#import_proj_type").val('')
                if (data.value == '是') {
                    $("#import_proj_div").show()
                    $("#import_proj_type").addClass('required')
                } else {
                    $("#import_proj_div").hide()
                    $("#import_proj_type").removeClass('required')
                }
            });
            form.on('radio(is_kc_proj)', function (data) {
                $("#kc_proj_tj").val('')
                $("#kc_proj_type").val('')
                if (data.value == '是') {
                    $("#kc_proj_div").show()
                    $("#kc_proj_tj").attr('lay-verify', "required")
                    $("#kc_proj_type").attr('lay-verify', "required")
                } else {
                    $("#kc_proj_div").hide()
                    $("#kc_proj_tj").removeAttr('lay-verify')
                    $("#kc_proj_type").removeAttr('lay-verify')
                }
            });
            form.on('radio(kg_is_kc_proj)', function (data) {
                $("#kg_kc_proj_tj").val('')
                if (data.value == '是') {
                    $("#kg_kc_proj_div").show()
                    $("#kg_kc_proj_tj").addClass('required')
                } else {
                    $("#kg_kc_proj_div").hide()
                    $("#kg_kc_proj_tj").removeClass('required')
                }
            });
            form.on('radio(is_sj_proj)', function (data) {
                $("#sj_proj").val('')
                if (data.value == '是') {
                    $("#sj_proj_div").show()
                    $("#sj_proj").addClass('required')
                } else {
                    $("#sj_proj_div").hide()
                    $("#sj_proj").removeClass('required')
                }
            });
            form.on('radio(is_build_yfzx)', function (data) {
                $("#build_yfzx").val('')
                if (data.value == '是') {
                    $("#build_yfzx_div").show()
                    $("#build_yfzx").addClass('required')
                } else {
                    $("#build_yfzx_div").hide()
                    $("#build_yfzx").removeClass('required')
                }
            });
            form.on("select(orgname)",function(data){
                let value=data.value
                let selectObj=dropData.filter(item=>{
                    return item.name==value
                })
                $("#sjjg_name_search").val(selectObj[0].name);
                $("#sjjg_name").val(selectObj[0].name);
            })
            form.on("select(kc_proj_type)",function(data){
                let value=data.value
                if (value == '知识产权类') {
                    $("#file_message").text('请上传投资企业专利证书或受理通知书等证明材料')
                } else if (value == '高层次人才类') {
                    $("#file_message").text('请上传人才学历、职称、获奖等证明材料')
                } else if (value == '科技计划或大赛类') {
                    $("#file_message").text('请上传计划项目立项或大赛获奖文件等证明材料')
                } else if (value == '风险投资类') {
                    $("#file_message").text('请上传投资协议等证明材料')
                } else if (value == '省市产研院类') {
                    $("#file_message").text('请上传签约协议')
                } else if (value == '重大创新平台类') {
                    $("#file_message").text('请上传合作共建协议等证明材料')
                } else {
                    $("#file_message").text('')
                }
            })
            // form.on('radio(is_warning_invest)', function (data) {
            //     $("#fx_name").val('')
            //     if (data.value == '是') {
            //         $("#fx_div").show()
            //         $("#fx_name").addClass('required')
            //     } else {
            //         $("#fx_div").hide()
            //         $("#fx_name").removeClass('required')
            //     }
            // });
            //监听选中建设用地radio时状态
            form.on('radio(is_use_land)', function (data) {
                if (data.value == 1) {
                    $("#is_use_land1").show();
                    $("#is_fixed_asset1").show();
                } else {
                    $("#is_use_land1").hide();
                    $("#is_fixed_asset1").hide();
                    $("#land_licence").val("");
                    $("#licence_date").val("")
                }
            });
            form.on('radio(b_resource)', function (data) {
                $("#sjjg_name").val('')
                $("#sjjg_name_search").val('')
                if (data.value == 2) {
                    // $("#sjjg_name").show()
                    $("#orgBox").show()
                    $("#sjjg_name").addClass('required')
                } else {
                    // $("#sjjg_name").hide()
                    $("#orgBox").hide()
                    $("#sjjg_name").removeClass('required')
                }
            });
            //监听选中radio时状态
            form.on('radio(p_type)', function (data) {
                if (data.value == 1) {
                    $("#span").text("亿元");
                    $(".moneyText").text("万元");
                    $("#foreign_money").addClass("layui-disabled");
                    $("#foreign_money").attr("disabled", true);
                    $("#foreign_money").removeClass("required");
                    $("#foreign_money").val("")
                    // 动态渲染内资投资方注册地选项
                    renderInvestorPlaceOptions(1);
                    // if (biz_info.pg_status == 2 || biz_info.pg_status == 3) {
                    //     $("#xyBox").show()
                    //     $("#zzBox").show()
                    //     $("#tzf_div").show()
                    //     $("#tzf_div").show()
                    //     $("#zsf_div").show()
                    //     $("#tzfs_div").show()
                    //     $("#tzdz_div").show()
                    //     $("#zsf").attr('lay-verify', "required")
                    //     $("#tzf").attr('lay-verify', "required")
                    //     $("#tzdz").attr('lay-verify', "required")
                    //     $('#btnSave').text('提交')
                    // } else {
                    //     if ( $('#invest_money').val() && Number($('#invest_money').val()) < 5 ) {
                    //         $('#btnSave').text('提交')
                    //         $("#xyBox").show()
                    //         $("#zzBox").show()
                    //         $("#tzf_div").show()
                    //         $("#tzf_div").show()
                    //         $("#zsf_div").show()
                    //         $("#tzfs_div").show()
                    //         $("#tzdz_div").show()
                    //         $("#zsf").attr('lay-verify', "required")
                    //         $("#tzf").attr('lay-verify', "required")
                    //         $("#tzdz").attr('lay-verify', "required")
                    //     } else {
                    //         $('#btnSave').text('提交项目质态评估')
                    //         $("#xyBox").hide()
                    //         $("#zzBox").hide()
                    //         $("#tzf_div").hide()
                    //         $("#zsf_div").hide()
                    //         $("#tzfs_div").hide()
                    //         $("#tzdz_div").hide()
                    //         $("#zsf").removeAttr('lay-verify')
                    //         $("#tzf").removeAttr('lay-verify')
                    //         $("#tzdz").removeAttr('lay-verify')
                    //     }
                    // }
                } else {
                    $("#span").text("万美元")
                    $(".moneyText").text("万美元");
                    $("#foreign_money").removeClass("layui-disabled");
                    $("#foreign_money").removeAttr("disabled");
                    $("#foreign_money").addClass("required");
                    // 动态渲染外资投资方注册地选项
                    renderInvestorPlaceOptions(2);
                    // if (biz_info.pg_status == 2 || biz_info.pg_status == 3) {
                    //     $("#xyBox").show()
                    //     $("#zzBox").show()
                    //     $("#tzf_div").show()
                    //     $("#tzf_div").show()
                    //     $("#zsf_div").show()
                    //     $("#tzfs_div").show()
                    //     $("#tzdz_div").show()
                    //     $("#zsf").attr('lay-verify', "required")
                    //     $("#tzf").attr('lay-verify', "required")
                    //     $("#tzdz").attr('lay-verify', "required")
                    //     $('#btnSave').text('提交')
                    // } else {
                    //     if ( $('#invest_money').val() && Number($('#invest_money').val()) < 3000 ) {
                    //         $('#btnSave').text('提交')
                    //         $("#xyBox").show()
                    //         $("#zzBox").show()
                    //         $("#tzf_div").show()
                    //         $("#tzf_div").show()
                    //         $("#zsf_div").show()
                    //         $("#tzfs_div").show()
                    //         $("#tzdz_div").show()
                    //         $("#zsf").attr('lay-verify', "required")
                    //         $("#tzf").attr('lay-verify', "required")
                    //         $("#tzdz").attr('lay-verify', "required")
                    //     } else {
                    //         $('#btnSave').text('提交项目质态评估')
                    //         $("#xyBox").hide()
                    //         $("#zzBox").hide()
                    //         $("#tzf_div").hide()
                    //         $("#zsf_div").hide()
                    //         $("#tzfs_div").hide()
                    //         $("#tzdz_div").hide()
                    //         $("#zsf").removeAttr('lay-verify')
                    //         $("#tzf").removeAttr('lay-verify')
                    //         $("#tzdz").removeAttr('lay-verify')
                    //     }
                    // }
                }
                form.render("select")
            });
            form.on('radio(ra_proj_type)', function (data) {
                console.log(data);
                if (data.value == 2) {
                    $("#div_proj_type").show();
                    // $("#rad_proj_type_zl").hide();
                } else {
                    $("#div_proj_type").hide();
                    $("#proj_type").val("c");
                    // $("#rad_proj_type_zl").show();
                }
            });
            //监听是否选中建设用地radio
            form.on('radio(is_use_land)', function (data) {
                //表示不是建设用地
                if (data.value == 2) {
                    $("#land_licence").attr("disabled", true);
                    $("#licence_date").attr("disabled", true);
                    $("#land_licence").addClass("layui-disabled");
                    $("#licence_date").addClass("layui-disabled");
                    $("#land_licence").removeClass("required");
                    $("#licence_date").removeClass("required");
                    $("#land_licence").val("");
                    $("#licence_date").val("");

                } else if (data.value == 1) {
                    //是建设用地
                    $("#land_licence").removeAttr("disabled", true);
                    $("#licence_date").removeAttr("disabled", true);
                    $("#land_licence").removeClass("layui-disabled");
                    $("#licence_date").removeClass("layui-disabled");
                    $("#land_licence").addClass("required");
                    $("#licence_date").addClass("required");

                }
            })
            form.on('select(district_code)', function () {
                biz_info.renderZone();
            });
            form.on('select(zone_code)', function () {
                biz_info.renderTown();
            });
            form.on('select(s_district_code)', function () {
                biz_info.renderSZone();
            });
            form.on('select(s_zone_code)', function () {
                biz_info.renderSTown();
            });
            //监听是否选中六大产业
            form.on('radio(is_sixpro)', function (data) {
                if (data.value == 0) {
                    $("#sixpro_code").val("")
                    $("#sixpro_code").removeClass("required");
                    $("#sixpro_code").attr("disabled", true);
                    $("#sixpro_code").addClass("layui-disabled");
                } else {
                    $("#sixpro_code").removeAttr("disabled", true);
                    $("#sixpro_code").removeClass("layui-disabled");
                    $("#sixpro_code").addClass("required");
                }
                form.render("select")
            })
            //设置日期下拉框
            var laydate = layui.laydate;
            lay(".date").each(function () {
                laydate.render({
                    elem: this,
                    range: "~",
                    trigger: "click"
                    // ,eventElem: '.icon-riqi'
                });
            });

            form.render("radio");
            laydate.render({
                elem: "#signed_date",
                eventElem: '.date-input-icon',
                trigger: "click"
            });
            laydate.render({
                elem: "#kg_signed_date",
                eventElem: '.date-input-icon',
                trigger: "click"
            });
            laydate.render({
                elem: "#plan_start_date",
                eventElem: '.date-input-icon',
                trigger: "click"
            });
            laydate.render({
                elem: "#plan_end_date",
                eventElem: '.date-input-icon',
                trigger: "click"
            });
            laydate.render({
                elem: "#application_time1",
                eventElem: '.date-input-icon',
                trigger: "click"
            });
            laydate.render({
                elem: "#reg_date",
                trigger: "click"
            });
            laydate.render({
                elem: "#pzrq",
                trigger: "click"
            });
            laydate.render({
                elem: "#kg_reg_date",
                trigger: "click"
            });
            laydate.render({
                elem: "#check_date",
                trigger: "click"
            });
            laydate.render({
                elem: "#licence_date",
                trigger: "click"
            });

            laydate.render({
                elem: "#start_date_commit",
                trigger: "click"
            });
            laydate.render({
                elem: "#complete_date",
                trigger: "click"
            });
            //设置表格内容templet:
            var cols = [
                [
                    {type: 'numbers', title: 'ID'}
                    , {field: 'district', title: '市区', width: 80,}
                    , {field: 'zone_name', title: '园区名称', width: 150}
                    , {field: 'town_name', title: '镇街名称', align: 'center', width: 120}
                    , {field: '_code', title: '项目编码', width: 120}
                    , {field: '_name', title: '项目名称', templet: '#colsname', minWidth: 200}
                    , {field: 'invest_money', title: '投资额', templet: '#tpl_invest_money', width: 100, align: 'center'}
                    , {field: 'p_type', title: '类别', templet: '#colsp_type', width: 60, align: 'center'}
                    , {field: 'pg_status', title: '评估状态', templet: '#pgStatus',  width: 90, align: 'center'}
                    , {field: 'progress', templet: '#colsprogress', title: '当前进度', width: 90, align: 'center'}
                    , {field: 'check_status', templet: '#colscheck_status', title: '审核状态', width: 120, align: 'center'}
                    , {field: 'progress', templet: '#colspassProgress ', title: '认定进度', width: 90, align: 'center'}
                    , {fixed: 'right', templet: '#operations', minWidth: 240, title: '操作', align: 'center'}
                ]
            ];
            var where = {};
            _UTIL.biz.layuiTableRenderS("datalist", "searchProjProjectSigned.do", 10, cols, where, function (res, curr, count) {
                //控制按钮隐藏显示
                var user_info = JSON.parse(_UTIL.storage.get("USER_INFO"))
                QS_APP.setPermissionButton();
            });

            //获取产业大类数据放入下拉框
            _UTIL.network.post("getindustryfirst.do", {}, 15000, function (result) {
                // console.log(result.data.datalist.length);
                var label = "<option value=\"\">请选择</option>";
                for (var i = 0; i < result.data.datalist.length; i++) {
                    // console.log(result.data.datalist[i]._code);
                    // console.log(result.data.datalist[i]._name);
                    label += " <option value=\"" + result.data.datalist[i]._code + "\">" + result.data.datalist[i]._name + "</option>";
                }
                $("#industry_first_code").html(label);
                layui.form.render('select');
            })

            _UTIL.network.post("searchProjSourceList.do", {}, 8000, function (res) {
                if (res.code == 1) {
                    dropData = res.data.datalist
                    innitSelect("#orgname",dropData)
                    // let form = layui.form;
                    // form.render()
                    // 将下拉框展开
                    // $("#orgBox .layui-form-select").addClass("layui-form-selected")
                }
            });


            //    ---------------------------
            var upload = layui.upload;
            //基本信息上传
            var uploadDetail = upload.render({
                elem: '#uploadDetail' //绑定元素
                , url: 'uploadDetail.lupload' //上传接口
                , accept: "file"
                , multiple: true
                , size: 512000
                , number: 10
                , done: function (res) {//上传完毕回调
                    //对象
                    var ob = {};
                    var index = 0;
                    // fileProjArr = [];
                    ob.filename = res.data.fileName;
                    ob.file_path = res.data.src;
                    let currentDate = new Date();
                    let year = currentDate.getFullYear();
                    let month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 使用padStart方法补足两位数
                    let day = currentDate.getDate().toString().padStart(2, '0');
                    let hours = currentDate.getHours().toString().padStart(2, '0');
                    let minutes = currentDate.getMinutes().toString().padStart(2, '0');
                    let seconds = currentDate.getSeconds().toString().padStart(2, '0');
                    let create_time = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
                    // fileProjArr.push(ob);
                    //将数组中的数据在页面展示
                    var value = $("#file_project li:first").text();
                    if (value == '无') {
                        $("#file_project").html("");
                    }
                    var label = "<li><a href='" + upload_file_path_proj + ob.file_path + "' target='_blank'>" + ob['filename'] + "</a>"+ ' / ' + "<span class='create_time'>" + create_time + "</span><span class='delBase'><i class='layui-icon'>&#x1006;</i></span></li>";
                    $("#file_project").append(label);
                }
                , error: function (ee, upload) {
                    //请求异常回调
                    // console.log(ee);
                    // console.log(upload);
                    // console.log("================================");
                }
            });
            //监听基本信息文件删除
            $("#file_project").on('click', '.delBase', function (event) {
                var element = $(this).parent().attr("id");
                // fileProjArr.splice(element, 1);
                $(this).parent().remove();
            });
            // 上传会议纪要
            var uploadDetail1 = upload.render({
                elem: '#uploadDetail1' //绑定元素
                , url: 'uploadDetail.lupload' //上传接口
                , accept: "file"
                , multiple: true
                , size: 512000
                , number: 10
                , done: function (res) {//上传完毕回调
                    //对象
                    var ob = {};
                    var index = 0;
                    // fileProjArr = [];
                    ob.filename = res.data.fileName;
                    ob.file_path = res.data.src;
                    // fileProjArr.push(ob);
                    //将数组中的数据在页面展示
                    var value = $("#file_project1 li:first").text();
                    if (value == '无') {
                        $("#file_project1").html("");
                    }
                    var label = "<li><a href='" + upload_file_path_proj + ob.file_path + "' target='_blank'>" + ob['filename'] + "</a><span class='delBase'><i class='layui-icon'>&#x1006;</i></span></li>";
                    $("#file_project1").append(label);
                }
                , error: function (ee, upload) {
                    //请求异常回调
                    // console.log(ee);
                    // console.log(upload);
                    // console.log("================================");
                }
            });
            //监听基本信息文件删除
            $("#file_project1").on('click', '.delBase', function (event) {
                var element = $(this).parent().attr("id");
                // fileProjArr.splice(element, 1);
                $(this).parent().remove();
            });
            // 开工附件
            var uploadDetail2 = upload.render({
                elem: '#uploadDetail2' //绑定元素
                , url: 'uploadDetail.lupload' //上传接口
                , accept: "file"
                , multiple: true
                , size: 512000
                , number: 10
                , done: function (res) {//上传完毕回调
                    //对象
                    var ob = {};
                    var index = 0;
                    // fileProjArr = [];
                    ob.filename = res.data.fileName;
                    ob.file_path = res.data.src;
                    // fileProjArr.push(ob);
                    //将数组中的数据在页面展示
                    var value = $("#file_project2 li:first").text();
                    if (value == '无') {
                        $("#file_project2").html("");
                    }
                    var label = "<li><a href='" + upload_file_path_proj + ob.file_path + "' target='_blank'>" + ob['filename'] + "</a><span class='delBase'><i class='layui-icon'>&#x1006;</i></span></li>";
                    $("#file_project2").append(label);
                }
                , error: function (ee, upload) {
                    //请求异常回调
                    // console.log(ee);
                    // console.log(upload);
                    // console.log("================================");
                }
            });
            //监听基本信息文件删除
            $("#file_project2").on('click', '.delBase', function (event) {
                var element = $(this).parent().attr("id");
                // fileProjArr.splice(element, 1);
                $(this).parent().remove();
            });
            // 科创附件
            var uploadDetail_new6 = upload.render({
                elem: '#uploadDetail_new6' //绑定元素
                , url: 'uploadDetail.lupload' //上传接口
                , accept: "file"
                , multiple: true
                , size: 512000
                , number: 10
                , done: function (res) {//上传完毕回调
                    //对象
                    var ob = {};
                    var index = 0;
                    // fileProjArr = [];
                    ob.filename = res.data.fileName;
                    ob.file_path = res.data.src;
                    // fileProjArr.push(ob);
                    //将数组中的数据在页面展示
                    var value = $("#file_project_new6 li:first").text();
                    if (value == '无') {
                        $("#file_project_new6").html("");
                    }
                    var label = "<li><a href='" + upload_file_path_proj + ob.file_path + "' target='_blank'>" + ob['filename'] + "</a><span class='delBase'><i class='layui-icon'>&#x1006;</i></span></li>";
                    $("#file_project_new6").append(label);
                }
                , error: function (ee, upload) {
                    //请求异常回调
                    // console.log(ee);
                    // console.log(upload);
                    // console.log("================================");
                }
            });
            //监听基本信息文件删除
            $("#file_project_new6").on('click', '.delBase', function (event) {
                var element = $(this).parent().attr("id");
                // fileProjArr.splice(element, 1);
                $(this).parent().remove();
            });
            // 人才附件
            var uploadDetail_new7 = upload.render({
                elem: '#uploadDetail_new7' //绑定元素
                , url: 'uploadDetail.lupload' //上传接口
                , accept: "file"
                , multiple: true
                , size: 512000
                , number: 10
                , done: function (res) {//上传完毕回调
                    //对象
                    var ob = {};
                    var index = 0;
                    // fileProjArr = [];
                    ob.filename = res.data.fileName;
                    ob.file_path = res.data.src;
                    // fileProjArr.push(ob);
                    //将数组中的数据在页面展示
                    var value = $("#file_project_new7 li:first").text();
                    if (value == '无') {
                        $("#file_project_new7").html("");
                    }
                    var label = "<li><a href='" + upload_file_path_proj + ob.file_path + "' target='_blank'>" + ob['filename'] + "</a><span class='delBase'><i class='layui-icon'>&#x1006;</i></span></li>";
                    $("#file_project_new7").append(label);
                }
                , error: function (ee, upload) {
                    //请求异常回调
                    // console.log(ee);
                    // console.log(upload);
                    // console.log("================================");
                }
            });
            //监听基本信息文件删除
            $("#file_project_new7").on('click', '.delBase', function (event) {
                var element = $(this).parent().attr("id");
                // fileProjArr.splice(element, 1);
                $(this).parent().remove();
            });
            // 科创证明附件
            var uploadDetail_new8 = upload.render({
                elem: '#uploadDetail_new8' //绑定元素
                , url: 'uploadDetail.lupload' //上传接口
                , accept: "file"
                , multiple: true
                , size: 512000
                , number: 10
                , done: function (res) {//上传完毕回调
                    //对象
                    var ob = {};
                    var index = 0;
                    // fileProjArr = [];
                    ob.filename = res.data.fileName;
                    ob.file_path = res.data.src;
                    // fileProjArr.push(ob);
                    //将数组中的数据在页面展示
                    var value = $("#file_project_new8 li:first").text();
                    if (value == '无') {
                        $("#file_project_new8").html("");
                    }
                    var label = "<li><a href='" + upload_file_path_proj + ob.file_path + "' target='_blank'>" + ob['filename'] + "</a><span class='delBase'><i class='layui-icon'>&#x1006;</i></span></li>";
                    $("#file_project_new8").append(label);
                }
                , error: function (ee, upload) {
                    //请求异常回调
                    // console.log(ee);
                    // console.log(upload);
                    // console.log("================================");
                }
            });
            //监听基本信息文件删除
            $("#file_project_new8").on('click', '.delBase', function (event) {
                var element = $(this).parent().attr("id");
                // fileProjArr.splice(element, 1);
                $(this).parent().remove();
            });
            // 竣工附件
            var uploadDetail3 = upload.render({
                elem: '#uploadDetail3' //绑定元素
                , url: 'uploadDetail.lupload' //上传接口
                , accept: "file"
                , multiple: true
                , size: 512000
                , number: 10
                , done: function (res) {//上传完毕回调
                    //对象
                    var ob = {};
                    var index = 0;
                    // fileProjArr = [];
                    ob.filename = res.data.fileName;
                    ob.file_path = res.data.src;
                    // fileProjArr.push(ob);
                    //将数组中的数据在页面展示
                    var value = $("#file_project3 li:first").text();
                    if (value == '无') {
                        $("#file_project3").html("");
                    }
                    var label = "<li><a href='" + upload_file_path_proj + ob.file_path + "' target='_blank'>" + ob['filename'] + "</a><span class='delBase'><i class='layui-icon'>&#x1006;</i></span></li>";
                    $("#file_project3").append(label);
                }
                , error: function (ee, upload) {
                    //请求异常回调
                    // console.log(ee);
                    // console.log(upload);
                    // console.log("================================");
                }
            });
            //监听基本信息文件删除
            $("#file_project3").on('click', '.delBase', function (event) {
                var element = $(this).parent().attr("id");
                // fileProjArr.splice(element, 1);
                $(this).parent().remove();
            });
            //清除编辑文件
            $("#cleanDetail").click(function (e) {
                fileProjArr = [];
                $("#file_project").html("<li>无</li>")
            });
            //监听编辑基本信息文件删除

            $("#file_project").on('click', '.delBaseEdit', function (event) {
                var element = $(this).parent().attr("id2");
                // fileProjArr.splice(element, 1);
                $(this).parent().remove();
            });
            $("#file_project1").on('click', '.delBaseEdit', function (event) {
                var element = $(this).parent().attr("id2");
                // fileProjArr.splice(element, 1);
                $(this).parent().remove();
            });
            $("#file_project2").on('click', '.delBaseEdit', function (event) {
                var element = $(this).parent().attr("id2");
                // fileProjArr.splice(element, 1);
                $(this).parent().remove();
            });
            $("#file_project3").on('click', '.delBaseEdit', function (event) {
                var element = $(this).parent().attr("id2");
                // fileProjArr.splice(element, 1);
                $(this).parent().remove();
            });
            //注册信息上传
            var uploadRegi = upload.render({
                elem: '#uploadRegi' //绑定元素
                , url: 'uploadRegi.lupload' //上传接口
                , accept: "file"  //指定文件上传类型
                , done: function (res) {//上传完毕回调
                    //对象
                    var ob = {};
                    ob.filename = res.data.fileName;
                    ob.file_path = res.data.src;
                    arrayRegi.push(ob);
                    //将数组中的数据在页面展示
                    var value = $("#ulRegister li:first").text();
                    if (value == '无') {
                        $("#ulRegister").html("");
                    }
                    var label = "<li id1='" + (indexRegi++) + "'><a href='" + upload_file_path_proj + ob.file_path + "' target='_blank'>"
                        + ob['filename'] + "</a><span class='delRegister'>&nbsp;<i class='layui-icon'>&#x1006;</i></span></li>";
                    $("#ulRegister").append(label);
                }
                , error: function () {
                    //请求异常回调
                }
            });

            //监听注册编辑文件删除
            $("#ulRegister").on('click', '.delRegiEdit', function (event) {
                var element = $(this).parent().attr("id2");
                // arrayRegi.splice(element, 1);
                $(this).parent().remove();
            });

            //监听注册文件删除
            $("#ulRegister").on('click', '.delRegister', function (event) {
                var element = $(this).parent().attr("id1");
                // arrayRegi.splice(element, 1);
                $(this).parent().remove();
            });

            //注册清除
            $("#cleanRegi").click(function (e) {
                arrayRegi = [];
                $("#ulRegister").html("<li>无</li>")
            });

            // //监听编辑文件删除
            // $("#file_project").on('click', '#delRegister', function (event) {
            //     var element = $(this).parent().attr("id1");
            //     fileProjArr.splice(element, 1);
            //     $(this).parent().remove();
            // });
            //备案
            var uploadBA = upload.render({
                elem: '#uploadBA' //绑定元素
                , url: 'uploadBA.lupload' //上传接口
                , accept: "file"  //指定文件上传类型
                , done: function (res) {//上传完毕回调
                    //对象
                    var ob = {};
                    ob.filename = res.data.fileName;
                    ob.file_path = res.data.src;
                    arrayBA.push(ob);
                    //将数组中的数据在页面展示
                    var value = $("#ulBA li:first").text();
                    if (value == '无') {
                        $("#ulBA").html("");
                    }
                    var label = "<li id1='" + (indexBA++) + "'><a href='" + upload_file_path_proj + ob.file_path + "'>" + ob['filename'] + "</a><span class='delBA'><i class='layui-icon'>&#x1006;</i></span></li>";
                    $("#ulBA").append(label);
                }
                , error: function () {
                    //请求异常回调
                }
            });

            //监听备案文件删除
            $("#ulBA").on('click', '.delBA', function (event) {
                var element = $(this).parent().attr("id1");
                // arrayBA.splice(element, 1);
                $(this).parent().remove();
            });

            //监听备案编辑文件删除
            $("#ulBA").on('click', '.delBAEdit', function (event) {
                var element = $(this).parent().attr("id2");
                // arrayBA.splice(element, 1);
                $(this).parent().remove();
            });

            //备案清除
            $("#cleanBA").click(function (e) {
                arrayBA = [];
                $("#ulBA").html("<li>无</li>")
            });
            //报批
            var uploadApprove = upload.render({
                elem: '#uploadApprove' //绑定元素
                , url: 'uploadApprove.lupload',//上传接口
                accept: "file" //上传文件格式
                , done: function (res) {//上传完毕回调
                    //对象
                    var ob = {};
                    ob.filename = res.data.fileName;
                    ob.file_path = res.data.src;
                    arrayApproval.push(ob);
                    //将数组中的数据在页面展示
                    var value = $("#ulApprove li:first").text();
                    if (value == '无') {
                        $("#ulApprove").html("");
                    }
                    var label = "<li id1='" + (indexApproval++) + "'><a href='" + upload_file_path_proj + ob.file_path + "' target='_blank'>" + ob['filename'] + "</a><span class='delApproval'><i class='layui-icon'>&#x1006;</i></span></li>";
                    $("#ulApprove").append(label);
                }
                , error: function () {
                    //请求异常回调
                }
            });
            //监听报批文件删除
            $("#ulApprove").on('click', '.delApproval', function (event) {
                var element = $(this).parent().attr("id1");
                // arrayApproval.splice(element, 1);
                $(this).parent().remove();
            });

            //监听报批编辑文件删除
            $("#ulApprove").on('click', '.delApprovalEdit', function (event) {
                var element = $(this).parent().attr("id2");
                // arrayApproval.splice(element, 1);
                $(this).parent().remove();
            });

            //报批文件清除
            $("#cleanApprove").click(function (e) {
                arrayApproval = [];
                $("#ulApprove").html("<li>无</li>")
            });

            //开工
            var uploadBeginning = upload.render({
                elem: '#uploadBeginning' //绑定元素
                , url: 'uploadBeginning.lupload' //上传接口
                , accept: "file" //开工文件上传格式
                , done: function (res) {//上传完毕回调
                    //对象
                    var ob = {};
                    ob.filename = res.data.fileName;
                    ob.file_path = res.data.src;
                    arrayBeginning.push(ob);
                    //将数组中的数据在页面展示
                    var value = $("#ulBeginning li:first").text();
                    if (value == '无') {
                        $("#ulBeginning").html("");
                    }
                    var label = "<li id1='" + (indexBeginning++) + "'><a href='" + upload_file_path_proj + ob.file_path + "'>" + ob['filename'] + "</a><span class='delBeginning'><i class='layui-icon'>&#x1006;</i></span></li>";
                    $("#ulBeginning").append(label);
                }
                , error: function () {
                    //请求异常回调
                }
            });

            //监听开工文件删除
            $("#ulBeginning").on('click', '.delBeginning', function (event) {
                var element = $(this).parent().attr("id1");
                // arrayBeginning.splice(element, 1);
                $(this).parent().remove();
            });

            //监听开工编辑文件删除
            $("#ulBeginning").on('click', '.delBeginningEdit', function (event) {
                var element = $(this).parent().attr("id2");
                // arrayBeginning.splice(element, 1);
                $(this).parent().remove();
            });

            //开工文件清除
            $("#cleanBeginning").click(function (e) {
                arrayBeginning = [];
                $("#ulBeginning").html("<li>无</li>")
            });
            //竣工
            var uploadEnd = upload.render({
                elem: '#uploadEnd' //绑定元素
                , url: 'uploadEnd.lupload' //上传接口
                , accept: "file"  //上传文件格式
                , done: function (res) {//上传完毕回调
                    //对象
                    var ob = {};
                    ob.filename = res.data.fileName;
                    ob.file_path = res.data.src;
                    arrayEnd.push(ob);
                    //将数组中的数据在页面展示
                    var value = $("#ulEnd li:first").text();
                    if (value == '无') {
                        $("#ulEnd").html("");
                    }
                    var label = "<li id1='" + (indexEnd++) + "'><a href='" + upload_file_path_proj + ob.file_path + "'>" + ob['filename'] + "</a><span class='delEnd'><i class='layui-icon'>&#x1006;</i></span></li>";
                    $("#ulEnd").append(label);
                }
                , error: function () {
                    //请求异常回调
                }
            });

            //监听竣工文件删除
            $("#ulEnd").on('click', '.delEnd', function (event) {
                var element = $(this).parent().attr("id1");
                // arrayEnd.splice(element, 1);
                $(this).parent().remove();
            });

            //监听竣工编辑文件删除
            $("#ulEnd").on('click', '.delEndEdit', function (event) {
                var element = $(this).parent().attr("id2");
                // arrayEnd.splice(element, 1);
                $(this).parent().remove();
            });
            //竣工文件清除
            $("#ulEnd").click(function (e) {
                arrayEnd = [];
                $("#ulEnd").html("<li>无</li>")
            });
        });
    }

    //根据权限设置机构的显示
    page_init();
});

function setprivilege() {
    var user_info = _UTIL.storage.get("USER_INFO");
    user_info = JSON.parse(user_info);
    if (user_info.user_level == 1) {
        $("#district_code").prop("disabled", false);
        $("#district_code").removeClass("layui-disabled");
        $("#zone_code").prop("disabled", false);
        $("#zone_code").removeClass("layui-disabled");
        $("#town_code").prop("disabled", false);
        $("#town_code").removeClass("layui-disabled");
    } else if (user_info.user_level == 2) {
        $("#district_code").val(user_info.district_code);
        biz_info.renderZone();
        $("#district_code").prop("disabled", true);
        $("#district_code").addClass("layui-disabled");
        $("#zone_code").prop("disabled", false);
        $("#zone_code").removeClass("layui-disabled");
        $("#town_code").prop("disabled", false);
        $("#town_code").removeClass("layui-disabled");
    } else if (user_info.user_level == 3) {
        $("#district_code").val(user_info.district_code);
        biz_info.renderZone();
        $("#district_code").prop("disabled", true);
        $("#district_code").addClass("layui-disabled");
        $("#zone_code").prop("disabled", true);
        $("#zone_code").addClass("layui-disabled");
        _UTIL.network.post("getDeptByCode1.do", {dept_code: user_info.zone_code}, 18000, function (result) {
            var label = " <option selected value=\"" + result.data.info.dept_code + "\">" + result.data.info.dept_name + "</option>";
            $("#zone_code").append(label);
            var form = layui.form;
            form.render("select")
            biz_info.renderTown();
        });
    } else if (user_info.user_level == 4) {
        $("#district_code").val(user_info.district_code);
        biz_info.renderZone();
        $("#district_code").prop("disabled", true);
        $("#district_code").addClass("layui-disabled");
        _UTIL.network.post("getDeptByCode1.do", {dept_code: user_info.zone_code}, 18000, function (result) {
            var label = " <option selected value=\"" + result.data.info.dept_code + "\">" + result.data.info.dept_name + "</option>";
            $("#zone_code").append(label);
            var form = layui.form;
            form.render("select")
            // biz_info.renderTown();
        });
        _UTIL.network.post("getDeptByCode1.do", {dept_code: user_info.dept_code}, 18000, function (result) {
            var label = " <option selected value=\"" + result.data.info.dept_code + "\">" + result.data.info.dept_name + "</option>";
            $("#town_code").append(label);
            var form = layui.form;
            form.render("select")
        });
        $("#town_code").prop("disabled", true);
        $("#town_code").addClass("layui-disabled");
        $("#zone_code").prop("disabled", true);
        $("#zone_code").addClass("layui-disabled");
    }
    // if (user_info.district_code == "*") {
    //     $("#district_code").prop("disabled", false);
    //     $("#district_code").removeClass("layui-disabled");
    //     // $("#district_code").val(user_info.district_code);
    // }else {
    //     $("#district_code").val(user_info.district_code);
    //     biz_info.renderZone();
    //     $("#district_code").prop("disabled", true);
    //     $("#district_code").addClass("layui-disabled");
    // }
    // if (user_info.zone_code == "*") {
    //     $("#zone_code").prop("disabled", false);
    //     $("#zone_code").removeClass("layui-disabled");
    // } else {
    //     _UTIL.network.post("getDeptByCode1.do", {dept_code: user_info.zone_code}, 8000, (res) => {
    //         var label = " <option selected value=\"" + res.data.info.dept_code + "\">" + res.data.info.dept_name + "</option>";
    //         $("#zone_code").append(label);
    //         var form = layui.form;
    //         form.render("select")
    //         if (user_info.user_level != 4) {
    //             biz_info.renderTown();
    //         }
    //     });
    //     $("#zone_code").prop("disabled", true);
    //     $("#zone_code").addClass("layui-disabled");
    // }
    //
    // if (user_info.town_code == "*") {
    //     $("#town_code").prop("disabled", false);
    //     $("#town_code").removeClass("layui-disabled");
    //
    // } else {
    //     $("#town_code").prop("disabled", true);
    //     $("#town_code").addClass("layui-disabled");
    //     $("#town_code").val(user_info.town_code);
    // }
    // if (user_info.user_level == 4) {
    //     _UTIL.network.post("getDeptByCode1.do", {dept_code: user_info.dept_code}, 8000, function (result) {
    //         console.log(result.data.info.dept_code)
    //         var label = " <option selected value=\"" + result.data.info.dept_code + "\">" + result.data.info.dept_name + "</option>";
    //         $("#town_code").html("");
    //         $("#town_code").append(label);
    //         var form = layui.form;
    //         form.render("select")
    //     });
    //     $("#town_code").prop("disabled", true);
    //     $("#town_code").addClass("layui-disabled");
    // }
    layui.form.render('select');
}



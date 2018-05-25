/**
 * 加载公共组件 事件
 */
$(document).ready(function(){
    /**
     * 创建修改密码模态对话框
     */
    var changePwdFormEl = $('#changePwdModal');
    if(changePwdFormEl.length===0){
        var  el = `<div class="modal fade" id="changePwdModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title">修改密码</h4>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label>旧密码</label>
                            <input class="form-control" type="password" name="old_pwd">
                            <label>新密码</label>
                            <input class="form-control" type="password" name="new_pwd">
                            <label>确认新密码</label>
                            <input class="form-control" type="password" name="confirm_pwd">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">关闭</button>
                        <button type="button" class="btn btn-primary">确定</button>
                    </div>
                </div>
            </div>
        </div>`;
        $('#wrapper').append(el);
    }
    /**
     * 绑定修改秘密按钮click事件
     * 
     */
    $('a#change_pwd').on('click', function(){
        $('#changePwdModal').modal();
    });

    /**
     * 创建公共弹出模态对话框
     */
    if($('#AlterModal').length===0){
        var  el = `<div class="modal fade" id="AlterModal" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                        <h4 class="modal-title"></h4>
                    </div>
                    <div class="modal-body"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal">确定</button>
                    </div>
                </div>
            </div>
        </div>`;
        $('#wrapper').append(el);
    }
});

/**
 * 模态提示框公共组件函数
 * @argument msg message for alter
 * @argument title alter title
 * @argument type dialog type [info, warning, error]
 */
function modalAlter (msg, title, type) {
    var icon;
    if(type==="warning"){
        icon = '<i class="fa fa-warning szfo-icon-warning"></i> ';
    }else if(type==="error") {
        icon = '<i class="fa fa-times-circle szfo-icon-error"></i> ';
    }else{
        icon = '<i class="fa fa-info szfo-icon-info"></i> ';
    }
    if(title===undefined) title = "";
    $('#AlterModal h4.modal-title').html((icon+title));
    $('#AlterModal div.modal-body').html(msg);
    $('#AlterModal').modal();
}
// 设置默认ajax错误处理
$.ajaxSetup({
    error: function (x,e) {
        var msg = "请求服务器时出现问题，请重试或联系管理员。";
        modalAlter(msg,"服务器请求出错","error");
        return false;
    }
});

/**
 * 生成举报信息详情区块内容
 * @param {Object} data 
 */
function genDetailInfoEL (data) {
    var attachments = data.attachments;
    var attEl = genAttachEl(attachments);
    var content = `<div class="info-detail-cell"><label>编号：</label> ${data.id}</div>
                <div class="info-detail-cell"><label>举报人：</label>${data.informer} <label>举报时间：</label>${data.date} <label>电话：${data.phone}</label></div>
                <div class="info-detail-cell"><label>举报对象：</label>${data.jbdx} <label>事项：</label>${data.type} <label>地址：</label>${data.addr}</div>
                <div class="info-detail-cell"><label>案件描述：</label><p>${data.desc}</p></div>
                <div class="info-detail-cell"><label>附件：</label>${attEl}</div>
                <div class="splliter"><label>审批信息</label></div>
                <div>${genAppListEl(data.appList)}</div>
                <div class="splliter"><label>反馈信息</label></div>
                <div>${genFeedbackEL(data.feedback)}</div>`;
    return content;
}

/**
 * 生成详情区块附件及图片内容区块HTML
 * 
 * */
function genAttachEl(attachments){
    if(attachments){
        var attachList = "";
        var picList = "";
        attachments.forEach(url => {
            var point = url.lastIndexOf("."); 
            var type = url.substr(point).toLowerCase(); 
            if(type===".jpg"||type==".gif"||type===".jpeg"||type===".bmp"||type===".npg"){ 
                picList += "<div class='info-attachment'><a target='_blank' href='"+url+"'><img width=200 height=200 src='"+url+"'></a></div>";
            }else{
                point = url.lastIndexOf("/");
                var fName = "";
                if(point>0) {
                    fName = url.substr(point+1);
                }else{
                    fName = url;
                }
                attachList += "<li><a target='_blank' href="+url+">附件("+fName+")</a></li>";
            }
        });
        
        return "<ol>"+picList + attachList+"</ol>";
    }
}

/**
* 生成审批信息区块
*/
function genAppListEl(appList){
    var appListEl = "";
    if(appList && appList.length>0){
        appListEl += '<table width="100%" class="table table-striped table-bordered table-hover"><thead><tr><th>时间</th><th>审批人</th><th>状态</th><th>说明</th></tr></thead><tbody>';
        appList.forEach(item => {
            appListEl += `<tr>
            <td>${item.date}</td>
            <td>${item.userName}</td>
            <td>${actionTranslate(item.act)}</td>
            <td>${item.act==="confirm"?genAppRemark(item):item.remark}</td></tr>`;
        });
        appListEl += "</tbody></table>";
    }
    return appListEl;
}

/**
* 生成审批意见说明（确认后线下流转会有流转接口人，所以需要拼接）
*/
function genAppRemark(item) {
    return `<label>流转接口人：${item.interface}</label><p>${item.remark}</p>`;
}
/**
* 审批状态转意 review：审批通过 confirm: 确认通过 refuse：不通过
*/
function actionTranslate(act) {
    if(act==="review"){
        return "审核通过，等待确认";
    }else if(act==="confirm"){
        return "确认通过，进入线下流转";
    }else if(act==="refuse"){
        return "不通过";
    }
    return "";
}

/**
* 生产反馈信息区块
*/
function genFeedbackEL(feedback){
    var fbEl = "";
    if(feedback){
        fbEl += `<table width="100%" class="table table-bordered table-hover">
        <tbody><tr><td>反馈说明：</td><td>${feedback.desc}</td></tr>
        <tr><td>附件</td><td>${genAttachEl(feedback.attachments)}</td></tr></tbody></table>`;
    }
    return fbEl;
}

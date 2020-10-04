
// handle auto dismisable alerts 
function myAlert(msg = "ok", mode = "alert-success", timeout = 5000) {
    let html = 
    `<div class="alert ${mode} alert-dismissible fade show" role="alert">
        ${msg}
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
        </button>
    </div>`
    $("#my-alert").html(html)
    // alert auto close timeout
    window.setTimeout(function() {
        $(".alert").alert('close')
    }, timeout);
}

// add a log message to the textarea
function textareaAdd(msg = "") {
    let dt = luxon.DateTime.local()
    let datetime = dt.toFormat('yyyy/MM/dd HH:mm:ss | ')
    let textarea = $("#messages")
    textarea.append(datetime + msg + '\n')
    textarea.scrollTop(textarea[0].scrollHeight)
}
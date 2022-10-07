var dataSheet = [];

async function sendToAll() {
    document.getElementById('send_load').style.display = 'flex';
    var subject = document.getElementById('subject').value;
    var message = "";
    var email = "";
    dataSheet.map(async (item) => {
        email = item["Buyer's E-mail Address"];
        message = replaceVariable(myEditor.getData(), item)
        await sendMessage(
            {
                'To': email,
                'Subject': subject,
                'MIME-Version': '1.0',
                'Content-Type': 'text/html; charset=UTF-8',
                'Content-Transfer-Encoding': '7bit',
            },
            message
        )
    });
    document.getElementById('send_load').style.display = 'none';
    document.getElementById('sent').style.display = 'flex';
    setTimeout(() =>{
        document.getElementById('sent').style.display = 'none';
    }, 20000);
}

function listRecepients() {
    var emails = "";
    dataSheet.map((item) => {
        emails += item["Buyer's E-mail Address"] + ", "
    });
    emails = emails.substring(0, emails.length-2);
    document.getElementById('recepients').innerHTML = emails;
}

function replaceVariable(url, data) {
    var regex = new RegExp('{(' + Object.keys(data).join('|') + ')}', 'g');

    return url.replace(regex, (m, $1) => data[$1] || m);
}

DecoupledEditor
.create( document.querySelector( '#editor' ), {
    toolbar: [
        'heading', 
        'fontFamily', 
        'fontSize',
        'fontColor', 
        'fontBackgroundColor',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        'alignment',
        'indent',
        'bulletedList', 
        'numberedList',
        'link', 
        'blockQuote',
        'undo', 
        'redo'
    ]
})
.then( editor => {
    const toolbarContainer = document.querySelector( '#toolbar-container' );

    toolbarContainer.appendChild( editor.ui.view.toolbar.element );
    myEditor = editor;
} )
.catch( error => {
    console.error( error );
} );


var CLIENT_ID = '';
var API_KEY = '';
var DISCOVERY_DOC = '';
const SCOPES =  'https://www.googleapis.com/auth/gmail.readonly '+
                'https://www.googleapis.com/auth/gmail.send';

let tokenClient;
let gapiInited = false;
let gisInited = false;

$(document).ready(function(){
    $.getJSON("./credentials.json", function(data){
        setCredentials(data)
        gapiLoaded();
        gisLoaded();
    }).fail(function(){
        console.log("An error has occurred.");
    });
});

function setCredentials(data) {
    CLIENT_ID = data.client_id;
    API_KEY = data.api_key;
    DISCOVERY_DOC = data.discovery_doc;
}

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.visibility = 'hidden';
document.getElementById('send_load').style.display = 'none';
document.getElementById('auth_load').style.display = 'none';
document.getElementById('sent').style.display = 'none';

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: '', 
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorize_button').style.visibility = 'visible';
    }
}

function handleAuthClick() {
    document.getElementById('auth_load').style.display = 'flex';
    tokenClient.callback = async (resp) => {
    if (resp.error !== undefined) {
        throw (resp);
    }
    document.getElementById('signout_button').style.visibility = 'visible';
    document.getElementById('authorize_button').innerText = 'Refresh';
    document.getElementById('auth_load').style.display = 'none';

    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({prompt: 'consent'});
    } else {
        tokenClient.requestAccessToken({prompt: ''});
    }
}

function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
        document.getElementById('content').innerText = '';
        document.getElementById('authorize_button').innerText = 'Authorize';
        document.getElementById('signout_button').style.visibility = 'hidden';
    }
}

async function sendMessage(headers_obj, message) {
    var email = '';

    for(var header in headers_obj)
        email += header += ": "+headers_obj[header]+"\r\n";

    email += "\r\n" + message;

    console.log(email);
    
    let raw = window.btoa(unescape(encodeURIComponent(email))).replace(/\+/g, '-').replace(/\//g, '_');

    console.log(raw);
    await gapi.client.gmail.users.messages.send({
        'userId': 'me',
        'resource': {
            'raw': raw
        }
    });

    return;
}
const _url = require('./url.js');
const _strings = require('./strings.js');

let _authToken = localStorage.getItem("userToken");

const _global = {
    languages: {},
    labels: {},
    issues: {}
};

async function auth() {
    let args = _url.stringToArguments(location.search.substring(1));

    if (_authToken)
        return true;
    else if (args.code) {
        let response = await $.get("https://secreter.herokuapp.com/8a518f3373e19665e2b0/" + args.code).catch(() => null);
        if (response) {
            console.log(response);
            localStorage.setItem("userToken", response.access_token);
            _authToken = response.access_token;
        }

        return !!response;
    } else return false;
}

async function getIssues() {
    let obj = await $.ajax({
        method: "POST",
        url: "https://api.github.com/graphql",
        data: JSON.stringify({ 
            query: "query { viewer { following(first: 30) { nodes { repositories(first: 20, isFork: false) { nodes { nameWithOwner, languages(first: 3) {  nodes { name } }, issues(first: 20, states: [OPEN]) { nodes { number, labels(first: 2) { nodes { name } } } } } } } } } }"
        }),
        headers: {
            'Authorization': 'bearer ' + _authToken
        }
    }).catch(console.error);

    for (let i = 0; i < obj.data.viewer.following.nodes.length; i++) {
        for (let i2 = 0; i2 < obj.data.viewer.following.nodes[i].repositories.nodes.length; i2++) {
            //if (obj.data.viewer.following.nodes[i].repositories.nodes[i2].nameWithOwner.split("/")[0] === _user)
            //    continue;
        
            let langs = [];
            for (let i3 = 0; i3 < obj.data.viewer.following.nodes[i].repositories.nodes[i2].languages.nodes.length; i3++) {
                let lang = obj.data.viewer.following.nodes[i].repositories.nodes[i2].languages.nodes[i3].name;
                _global.languages[lang] = true;
                langs.push(lang);
            }
            for (let i3 = 0; i3 < obj.data.viewer.following.nodes[i].repositories.nodes[i2].issues.nodes.length; i3++) {
                let labels = [];
                for (let i4 = 0; i4 < obj.data.viewer.following.nodes[i].repositories.nodes[i2].issues.nodes[i3].labels.nodes.length; i4++) {
                    let label = _strings.titleize(obj.data.viewer.following.nodes[i].repositories.nodes[i2].issues.nodes[i3].labels.nodes[i4].name);
                    _global.labels[label] = true;
                    labels.push(label);
                }
        
                _global.issues[
                    obj.data.viewer.following.nodes[i].repositories.nodes[i2].nameWithOwner + "#"
                    + obj.data.viewer.following.nodes[i].repositories.nodes[i2].issues.nodes[i3].number
                ] = {
                    languages: langs,
                    labels: labels
                };
            }
        }
    }

    return _global.issues;
}

function getIssue(repo, issue) {
    return $.ajax({
        method: 'GET',
        url: "https://api.github.com/repos/" + repo + "/issues/" + issue,
        headers: {
            'Authorization': 'bearer ' + _authToken
        }
    }).catch(() => null);
}

module.exports = { auth, getIssues, getIssue };

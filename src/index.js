const declarativ = require('declarativ');
const github = require('./github.js');

const { main, div, h1, h2, p, span } = declarativ.elements;

let issue;

function button(...text) {
    return declarativ.elements.button(text).className("button");
}

function description() {
    return [
        h1("Bugiver"),
        p("Bugiver is a simple website that iterates through everyone that you are following and selects a random issue in a completely random repository in a language of your choice.")
    ];
}

function signInComponent() {
    return button("Sign In").on("click", () => location.href = "https://github.com/login/oauth/authorize?client_id=8a518f3373e19665e2b0");
}

function filterComponent() {
    return button("Gimme Issue").on("click", async () => {
        let issues = await github.getIssues();
        let arr = Object.keys(issues);
        issue = arr[Math.floor(Math.random() * arr.length)];
        onRender();
    });
}

function homePage() {
    return div(
        description(),
        github.auth().then((isAuth) => isAuth ? filterComponent() : signInComponent())
    ).attr("style", "text-align: center;");
}

function issuePage(issue) {
    issue = issue.split('#');
    let repo = issue[0];
    let issueNum = issue[1];

    return div(
        h1(`${repo} - Issue #${issueNum}`),
        h2((data) => data.title),
        p((data) => data.body)
    ).bind(github.getIssue(repo, issueNum));
}

function onRender() {
    declarativ.renderElement(
        $('#container'),
        main(
            () => issue ? issuePage(issue) : homePage()
        )
    );
}

onRender();

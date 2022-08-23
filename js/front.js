const navContainer = document.querySelector("#nav-container");
const navItem = document.querySelector("#nav-item").cloneNode(true);

new Category("Test 1");
new Category("Test 2");
new Category("Test 3");

new Article("Test Article 1", null, "tag 1, tag 2", "HELLO WORLD!!!!");
new Article("Test Article 2", null, "tag 2, tag 3", "WORLD!!!!");
new Article("Test Article 3", null, "tag 1, tag 3", "GOODBYE WORLD!!!!");

RenderCategory(qwiki.currentCategory);

function RenderCategory(categoryId)
{
    navContainer.innerHTML = '';
    let cat = qwiki.categories[categoryId];
    
    qwiki.currentCategory = categoryId;

    //Render children categories at the top
    cat.children.forEach(c => {
        c = qwiki.categories[c];
        let item = navItem.cloneNode(true);
        item.childNodes[0].innerHTML = c.name+"/ ("+c.pub_id+")";
        item.onclick = function () { RenderCategory(c.pub_id); }
        item.hidden = false;
        navContainer.appendChild(item);
    });

    //Render articles
    cat.articles.forEach(a => {
        a = qwiki.articles[a];
        let item = navItem.cloneNode(true);
        item.childNodes[0].innerHTML = a.name;
        item.onclick = function () { OpenArticle(a.pub_id); }
        item.hidden = false;
        navContainer.appendChild(item);
    });
}

function UpCategory()
{
    let parentId = qwiki.categories[qwiki.currentCategory].parent;
    RenderCategory(parentId);
}

const articleTitle = document.querySelector("#article-title");
const articleBody  = document.querySelector("#article-body");

function OpenArticle(articleId)
{
    let a = qwiki.articles[articleId];
    articleTitle.innerHTML = a.name;
    articleBody.innerHTML  = a.content;
    qwiki.currentArticle = articleId;

    SetArticleForEdit(articleId);
}

const editTitle   = document.querySelector("#edit-title");
const editTags    = document.querySelector("#edit-tags");
const editContent = document.querySelector("#edit-content");

const options = {
    debug: 'info',
    bounds: editContent,
    placeholder: 'Write your article here...',
    theme: 'snow'
};
const quill = new Quill(editContent, options);

function SetArticleForEdit(articleId)
{
    let a = qwiki.articles[articleId];

    editTitle.value = a.name;
    editTags .value = a.TagsToString();
    quill.setContents(a.content);

    qwiki.editingArticle = articleId;
}

function SetNewArticle()
{
    qwiki.editingArticle = "";

    editTitle.value = "";
    editTags .value = "";
    editContent.value = "";
}

function SaveArticle()
{
    var a;
    if(qwiki.editingArticle == "") {
        a = new Article (
            editTitle.value,
            qwiki.currentCategory,
            editTags.value,
            quill.getContents()
        );
    }
    else {
        a = qwiki.articles[qwiki.editingArticle];
        a.name = editTitle.value;
        a.SetTags(editTags.value);
        a.content = quill.getContents();
    }
    
    OpenArticle(a.pub_id);
    RenderCategory(qwiki.currentCategory);
}

const dbFile  = document.querySelector('#db-file');
const dbDownload = document.querySelector('#db-download');

function OnDBFileChange() {
    qwiki.storage.onFileChange(dbFile.files[0]);
}

function OnDownloadDB() {
    qwiki.storage.export(dbDownload);
}
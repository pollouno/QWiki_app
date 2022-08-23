qwiki = {};

qwiki.info = {
    version : '1.0.0'
}

qwiki.currentCategory = "";
qwiki.currentArticle  = "";
qwiki.editingArticle  = "";

qwiki.articles   = {};
qwiki.categories = {
    "home" : new Category("Home")
};
qwiki.tags = [];

function Article(name, category, tags, content)
{
    this.name = name;
    this.pub_id = makeid('AR', 8);
    this.category = category;
    
    this.content = content;
    
    qwiki.articles[this.pub_id] = this;
    qwiki.categories[category == null ? "home" : category].articles.push(this.pub_id);
    
    if(qwiki.currentArticle == "")
        qwiki.currentArticle = this.pub_id;
    
    this.SetTags = (tagsString) => {
        this.tags = [];
        
        let tt = tagsString.split(',');
        tt.forEach(t => {
            t = t.trim();
            this.tags.push(t);
            if(qwiki.tags.indexOf(t) == -1)
                qwiki.tags.push(t);
        });
    }

    this.TagsToString = () => {
        var s = "";

        this.tags.forEach(tag => {
            if(s != "")
                s += ", ";

            s += tag;
        });

        return s;
    }

    this.SetTags(tags);
}

function Category(name, id = null, parent = null)
{
    this.name = name;
    this.parent = parent == null ? "home" : parent;
    this.articles = [];
    this.children = [];

    this.setParent = (categoryId) => {
        if(qwiki.categories.indexOf(categoryId) == -1)
            return;
        
        qwiki.categories[this.parent].children.remove(this);
        qwiki.categories[categoryId].children.push(this);
        qwiki.parent = categoryId;
    }

    if(qwiki.currentCategory == "") {
        this.pub_id = "home";
        qwiki.currentCategory = this.pub_id;
        return;
    }
    
    this.pub_id = id == null ? makeid('CA', 8) : id;
    qwiki.categories[this.pub_id] = this;

    if(parent != null)
        qwiki.categories[parent].children.push(this.pub_id);
    else
        qwiki.categories["home"].children.push(this.pub_id);
}

function makeid(prefix, length) {
    var result           = prefix;
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
}
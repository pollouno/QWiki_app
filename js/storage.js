const fs = require('fs');
var storage = {};

storage.loadDB = function(SQL, filepath) {
	const filebuffer = fs.readFileSync(filepath);
	return new SQL.Database(filebuffer);
}

storage.saveDB = function(db, filepath) {
	const data = db.export();
	const buffer = Buffer.from(data);
	fs.writeFileSync(filepath, buffer);
}

storage.exportToJSON = function(db) {

}

storage.categoryCreate = function (db, id, name, parentId) {
	const query = `INSERT into category (pub_id, name, parent)
				 VALUES ('${id}', '${name}', (select category_id from category where pub_id = '${parentId}'))`;
	const res = db.exec(query);
}

storage.categoryUpdate = function (db, id, name, parentId) {
	const query = `UPDATE category
				   SET name = '${name}',
				   	   parent = (select category_id from category where pub_id = '${parentId}')
				   WHERE pub_id = '${id}'`;
	const res = db.exec(query);
}

storage.categoryRemove = function (db, id, childToId) {
	var query = `UPDATE category
				   SET deleted = 1
				   WHERE pub_id = '${id}'`;
	const res = db.exec(query);
	
	query = `UPDATE category
			 SET parent = (select category_id from category where pub_id = ${childToId})
			 WHERE parent = (select category_id from category where pub_id = ${id});
			 UPDATE article
			 SET category_id = (select category_id from category where pub_id = ${childToId})
			 WHERE parent = (select category_id from category where pub_id = ${id});`;
	res = db.exec(query);
}

storage.articleCreate = function (db, id, name, tags, categoryId) {
	const query = `INSERT INTO article (pub_id, name, tags, category_id)
				   VALUES (${id}, '${name}', '${tags}',
						  (select category_id from category where pub_id = '${categoryId}'))`;
	
	const res = db.exec(query);
}

storage.articleUpdate = function (db, id, name, tags, categoryId) {
	const query = `UPDATE article
				   SET name = ${name}
				   	   tags = ${tags}
					   category_id = (select category_id from category where pub_id = '${categoryId}')
				   WHERE pub_id = ${id}`;
	const res = db.exec(query);
}

storage.articleRemove = function (db, id) {
	var query = `UPDATE article
				   SET deleted = 1
				   WHERE pub_id = '${id}'`;
	const res = db.exec(query);
}

storage.articleGetContent = function (db, id) {

}

storage.articleSetContent = function (db, id, content) {

}

storage.articleApplyDelta = function (db, id, delta) {

}

module.exports = { storage };
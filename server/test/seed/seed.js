const {ObjectID} = require('mongodb');

const {Article} = require('./../../models/article');

const articles = [
    {
     _id: new ObjectID(),
    // _creatorId: new ObjectID(),
    // creator: 'Mike',
    title: 'Graphene silicon of the future?',
    text: 'Will be graphene material of future ?',
    likes: [],
    comments:[]
    },{
    _id: new ObjectID(),
    // _creatorId: new ObjectID(),
    // creator: 'Steve',
    title: 'Is fusion finaly here ?',
    text: 'Or is it still 20 yeras away.',
    likes: [],
    comments:[]
    }

];

const populateArticles = async () => {
    try {
        await Article.remove({});
        await Article.insertMany(articles);
    } catch (e) {}
};

module.exports = {articles, populateArticles}
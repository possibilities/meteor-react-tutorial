/** @jsx React.DOM */

Comments = new Meteor.Collection('comments');

Meteor.startup(function() {

  var converter = new Showdown.converter();

  var Comment = React.createClass({
    render: function() {
      var rawMarkup = converter.makeHtml(this.props.children.toString());
      return (
        <div className="comment">
         <h2 className="commentAuthor">{this.props.author}</h2>
         <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
        </div>
      );
    }
  });

  var CommentBox = React.createClass({
    handleCommentSubmit: function(comment) {
      var comments = this.state.data;
      comments.push(comment);
      this.setState({data: comments});
      comment._id = Comments.insert(comment);
    },
    getInitialState: function() {
      return {data: []};
    },
    render: function() {
      return (
        <div className="commentBox">
          <h1>Comments</h1>
          <CommentList data={this.state.data} />
          <CommentForm onCommentSubmit={this.handleCommentSubmit} />
        </div>
      );
    }
  });

  var CommentList = React.createClass({
    mixins: [MeteorMixin],
    getMeteorState: function() {
      return {
        data: Comments.find({}).fetch()
      };
    },
    render: function() {
      var commentNodes = this.state.data.map(function (comment) {
        return <Comment key={comment._id} author={comment.author}>{comment.text}</Comment>;
      });
      return <div className="commentList">{commentNodes}</div>;
    }
  });

  var CommentForm = React.createClass({
    handleSubmit: function() {
      var author = this.refs.author.getDOMNode().value.trim();
      var text = this.refs.text.getDOMNode().value.trim();
      this.props.onCommentSubmit({author: author, text: text});
      this.refs.author.getDOMNode().value = '';
      this.refs.text.getDOMNode().value = '';
      return false;
    },
    render: function() {
      return (
        <form className="commentForm" onSubmit={this.handleSubmit}>
          <input type="text" placeholder="Your name" ref="author" />
          <input type="text" placeholder="Say something..." ref="text" />
          <input type="submit" value="Post" />
        </form>
      );
    }
  });

// <CommentBox url="/comments.json" pollInterval={2000} />,
  React.renderComponent(
    <CommentBox />,
    document.getElementById('container')
  );
});

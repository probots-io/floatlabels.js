QTags.SyntaxButton = function() {
	QTags.TagButton.call( this, 'syntax_highlighter', 'syntax highlighter', '', '[/code]' );
};
QTags.SyntaxButton.prototype = new QTags.TagButton();
QTags.SyntaxButton.prototype.callback = function( e, c, ed ) {
	var type, linenums, title, t = this;

	if ( t.isOpen( ed ) === false ) {
		type = prompt( 'Type (markup, php, css, javascript)', 'markup' ),
		title = prompt( 'Title (optional)' ),
		linenums = prompt( 'Line number (optional)' );

		type = ( type ) ? ' type="' + type + '"' : '';
		title = ( title ) ? ' title="' + title + '"' : '';
		linenums = ( linenums ) ? ' linenums="' + linenums + '"' : '';

		if ( type ) {
			t.tagStart = '[code' + type + title + linenums + ']';
			QTags.TagButton.prototype.callback.call( t, e, c, ed );
		}
	} else {
		QTags.TagButton.prototype.callback.call( t, e, c, ed );
	}
};
edButtons[150] = new QTags.SyntaxButton();
<?php
/*
Plugin Name: Syntax Highlighter CB
Plugin URI: http://wp.tutsplus.com/tutorials/plugins/adding-a-syntax-highlighter-shortcode-using-prism-js
Description: Highlight your code snippets with an easy to use shortcode based on Lea Verou's Prism.js.
Version: 1.0.0
Author: c.bavota
Author URI: http://bavotasan.com
*/

add_filter( 'the_content', 'sh_pre_process_shortcode', 7 );
/**
 * Functionality to set up highlighter shortcode correctly.
 *
 * This function is attached to the 'the_content' filter hook.
 *
 * @since 1.0.0
 */
function sh_pre_process_shortcode( $content ) {
	global $shortcode_tags;

	$orig_shortcode_tags = $shortcode_tags;
	$shortcode_tags = array();

	// New shortcodes
	add_shortcode( 'code', 'sh_syntax_highlighter' );

	$content = do_shortcode( $content );
	$shortcode_tags = $orig_shortcode_tags;

	return $content;
}

/**
 * Code shortcode function
 *
 * This function is attached to the 'code' shortcode hook.
 *
 * @since 1.0.0
 */
function sh_syntax_highlighter( $atts, $content = null ) {
	extract( shortcode_atts( array(
		'type' => 'markup',
		'title' => '',
		'linenums' => '',
	), $atts ) );

	$title = ( $title ) ? ' rel="' . $title . '"' : '';
	$linenums = ( $linenums ) ? ' data-linenums="' . $linenums . '"' : '';
	$find_array = array( '&#91;', '&#93;' );
	$replace_array = array( '[', ']' );
	return '<div class="syntax-highlighter"' . $title . '><pre><code class="language-' . $type . '"' . $linenums . '>'	. preg_replace_callback( '|(.*)|isU', 'sh_pre_entities', trim( str_replace( $find_array, $replace_array, $content ) ) ) . '</code></pre>
</div>';
}

/**
 * Helper function for 'sh_syntax_highlighter'
 *
 * @since 1.0.0
 */
function sh_pre_entities( $matches ) {
	return str_replace( $matches[1], htmlentities( $matches[1]), $matches[0] );
}

add_action( 'wp_enqueue_scripts', 'sh_add_js' );
/**
 * Load all JavaScript to header
 *
 * This function is attached to the 'wp_enqueue_scripts' action hook.
 *
 * @uses	is_admin()
 * @uses	is_singular()
 * @uses	wp_enqueue_script()
 * @uses	plugins_url()
 *
 * @since 1.0.0
 */
function sh_add_js() {
	if ( sh_has_shortcode( 'code' ) ) {
		wp_enqueue_script( 'sh_js', plugins_url( 'js/sh.js', __FILE__ ), '', '', true );
		wp_enqueue_style( 'sh_css', plugins_url( 'css/sh.css', __FILE__ ) );
	}
}

/**
 * Check posts to see if shortcode has been used
 *
 * @since 1.0.0
 */function sh_has_shortcode( $shortcode = '' ) {
	global $wp_query;
	foreach( $wp_query->posts as $post ) {
		if ( ! empty( $shortcode ) && stripos($post->post_content, '[' . $shortcode) !== false ) {
			return true;
		}
	}
	return false;
}

add_filter( 'comments_template', 'sh_comment_shortcodes' );
/**
 * Allow code shortcode in comments
 *
 * This function is attached to the 'comments_template' filter hook.
 *
 * @since 1.0.0
 */
function sh_comment_shortcodes() {
	add_shortcode( 'code', 'sh_syntax_highlighter' );
	add_filter( 'comment_text', 'do_shortcode' );
}

add_action( 'admin_enqueue_scripts', 'sh_add_quicktags' );
/**
 * Adds a syntax highlighter quicktag to the post editor
 *
 * This function is attached to the 'admin_print_footer_scripts' action hook.
 *
 * @since 1.0.0
 */
function sh_add_quicktags( $hook ) {
    if( 'post.php' == $hook ||  'post-new.php' == $hook )
		wp_enqueue_script( 'sh_quicktag_js', plugins_url( 'js/quicktag.js', __FILE__ ), array( 'quicktags' ), '', true );
}
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/docuflow.ts":
/*!*************************!*\
  !*** ./src/docuflow.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Docuflow: () => (/* binding */ Docuflow)\n/* harmony export */ });\n/* harmony import */ var _parser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./parser */ \"./src/parser/index.ts\");\n\n/**\n * The actual Docuflow class. Handles all the management of state, logic, and rendering of\n * MD files as needed.\n */\nclass Docuflow {\n    currentMD;\n    constructor() {\n        this.currentMD = \"index.md\";\n    }\n    async renderMarkdown(md) {\n        // Open the MD file and parse each of its elements.\n        const response = await fetch(`./docs/${md}`);\n        const content = await response.text();\n        const parser = new _parser__WEBPACK_IMPORTED_MODULE_0__.Parser(content);\n        console.log('Parsed all tokens', parser.tokens.length);\n        return parser.toHTML();\n    }\n    async inject() {\n        // Grab the element to inject into, in this case, id=\"content\"\n        const contentElement = document.getElementById(\"content\");\n        if (contentElement) {\n            // For a test, let's render the currentMD and inject it\n            const rendered = await this.renderMarkdown(this.currentMD);\n            console.log('Rendered text', rendered);\n            contentElement.innerHTML = rendered;\n        }\n    }\n}\n\n\n//# sourceURL=webpack://my-webpack-project/./src/docuflow.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _docuflow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./docuflow */ \"./src/docuflow.ts\");\n\nconst docuflow = new _docuflow__WEBPACK_IMPORTED_MODULE_0__.Docuflow();\nawait docuflow.inject();\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } }, 1);\n\n//# sourceURL=webpack://my-webpack-project/./src/index.ts?");

/***/ }),

/***/ "./src/parser/ast.ts":
/*!***************************!*\
  !*** ./src/parser/ast.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Heading: () => (/* binding */ Heading),\n/* harmony export */   Italic: () => (/* binding */ Italic),\n/* harmony export */   Paragraph: () => (/* binding */ Paragraph),\n/* harmony export */   Text: () => (/* binding */ Text)\n/* harmony export */ });\n/**\n * Represents raw Text in the MD file. This is just a string of characters that follow\n * each other not interrupted by any special characters or nodes or formatting.\n */\nclass Text {\n    tokens = [];\n    constructor(tokens) {\n        this.tokens = tokens;\n    }\n    get length() {\n        return this.tokens.length;\n    }\n    toHTML() {\n        return this.tokens.map(token => token.value).join(\"\");\n    }\n}\n/**\n * Represents content in the MD file. This is raw content without any formatting,\n * a body.\n */\nclass Paragraph {\n    nodes = [];\n    constructor(nodes) {\n        this.nodes = nodes;\n    }\n    get length() {\n        return this.nodes.length;\n    }\n    toHTML() {\n        // Join the nodes together and wrap them in a <p> tag\n        return `<p>${this.nodes.map(node => node.toHTML()).join(\" \")}</p>`;\n    }\n}\n/**\n * Represents a heading in the MD file. This is a title.\n */\nclass Heading {\n    nodes = []; // The nodes that make up this heading\n    level; // The level of the heading, from 1 to 6\n    constructor(nodes, level) {\n        this.nodes = nodes;\n        this.level = level;\n    }\n    toHTML() {\n        // Grab the level of the heading, and wrap the text in an <h{level}> tag\n        const level = this.level;\n        return `<h${level}>${this.nodes.map(node => node.toHTML()).join(\"\\n\")}</h${level}>`;\n    }\n}\nclass Italic {\n    nodes = [];\n    constructor(nodes) {\n        this.nodes = nodes;\n    }\n    toHTML() {\n        return `<i>${this.nodes.map(node => node.toHTML()).join(\"\")}</i>`;\n    }\n}\n\n\n//# sourceURL=webpack://my-webpack-project/./src/parser/ast.ts?");

/***/ }),

/***/ "./src/parser/index.ts":
/*!*****************************!*\
  !*** ./src/parser/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Heading: () => (/* reexport safe */ _ast__WEBPACK_IMPORTED_MODULE_0__.Heading),\n/* harmony export */   Italic: () => (/* reexport safe */ _ast__WEBPACK_IMPORTED_MODULE_0__.Italic),\n/* harmony export */   Paragraph: () => (/* reexport safe */ _ast__WEBPACK_IMPORTED_MODULE_0__.Paragraph),\n/* harmony export */   Parser: () => (/* reexport safe */ _parser__WEBPACK_IMPORTED_MODULE_1__.Parser),\n/* harmony export */   Text: () => (/* reexport safe */ _ast__WEBPACK_IMPORTED_MODULE_0__.Text),\n/* harmony export */   Token: () => (/* reexport safe */ _tokens__WEBPACK_IMPORTED_MODULE_2__.Token),\n/* harmony export */   TokenType: () => (/* reexport safe */ _tokens__WEBPACK_IMPORTED_MODULE_2__.TokenType)\n/* harmony export */ });\n/* harmony import */ var _ast__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ast */ \"./src/parser/ast.ts\");\n/* harmony import */ var _parser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./parser */ \"./src/parser/parser.ts\");\n/* harmony import */ var _tokens__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./tokens */ \"./src/parser/tokens.ts\");\n\n\n\n\n\n//# sourceURL=webpack://my-webpack-project/./src/parser/index.ts?");

/***/ }),

/***/ "./src/parser/parser.ts":
/*!******************************!*\
  !*** ./src/parser/parser.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Parser: () => (/* binding */ Parser)\n/* harmony export */ });\n/* harmony import */ var _ast__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ast */ \"./src/parser/ast.ts\");\n/* harmony import */ var _tokens__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./tokens */ \"./src/parser/tokens.ts\");\n\n\n/**\n * Represents an MD parser. This class is responsible for walking through a MD\n * file and parsing it into HTML. This class is only meant to handle one\n * file at a time.\n */\nclass Parser {\n    content; // The content of the MD file\n    tokens = []; // The tokens that make up the MD file. Will only be set after parsing\n    constructor(content) {\n        this.content = content;\n        this.tokens = this.parseTokens();\n    }\n    parseTokens() {\n        let tokens = [];\n        for (let i = 0; i < this.content.length; i++) {\n            const char = this.content[i];\n            // Turn it into a token.\n            // NOTE: We're keeping \\n tokens because they're important for\n            // formatting. We'll use them to determine when to create new\n            // paragraphs.\n            const token = new _tokens__WEBPACK_IMPORTED_MODULE_1__.Token(char);\n            // And append it to the list of tokens\n            tokens.push(token);\n        }\n        // Return our tokens\n        return tokens;\n    }\n    /**\n     * Peeks at the next token in the stream without consuming it.\n     * Returns NULL if there are no more tokens.\n     */\n    peek(amount = 1) {\n        if (this.tokens.length <= amount) {\n            return null;\n        }\n        return this.tokens[amount];\n    }\n    /**\n     * Consumes the current token in the stream and returns it. Moves\n     * onto the next token. Returns NULL if there are no more tokens.\n     */\n    consume() {\n        if (!this.tokens) {\n            return null;\n        }\n        // Remove the first token in the array, index 0, and return it\n        const token = this.tokens.shift();\n        return token;\n    }\n    currentToken() {\n        if (!this.tokens) {\n            return null;\n        }\n        return this.tokens[0];\n    }\n    currentTokenIs(...type) {\n        const current = this.currentToken();\n        if (!current) {\n            return false;\n        }\n        for (let i = 0; i < type.length; i++) {\n            if (current.type === type[i]) {\n                return true;\n            }\n        }\n        return false;\n    }\n    currentTokenIsNot(...type) {\n        return !this.currentTokenIs(...type);\n    }\n    /**\n     * Denotes if a possible bold can be parsed. That is, if the bold has an\n     * ending double star. This is important because we need to know if we can parse a\n     * bold or not.\n     *\n     * **this is bold** -> Can parse\n     * **this is not bold -> Cannot parse\n     * This is ** not bold -> Cannot parse\n     */\n    canParseBold() {\n        return false;\n    }\n    /**\n     * Denotes if a possible italic can be parsed. That is, if the italic has an\n     * ending star. This is important because we need to know if we can parse an\n     * italic or not.\n     *\n     * *this is italic* -> Can parse\n     * *this is not italic -> Cannot parse\n     * This is * not italic -> Cannot parse\n     */\n    canParseItalic() {\n        // We know that the current token is a star, so we need to look ahead for\n        // the ending star.\n        let ahead = 1;\n        // Continue peeking until we find another char that is not a star identifier - ie,\n        // the next peek token is a star identifier.\n        while (this.peek(ahead) && this.peek(ahead).type !== _tokens__WEBPACK_IMPORTED_MODULE_1__.TokenType.STAR_IDENTIFIER) {\n            // If peeking ahead is a new line, then we can't parse an italic\n            if (this.peek(ahead).type === _tokens__WEBPACK_IMPORTED_MODULE_1__.TokenType.NEW_LINE) {\n                return false;\n            }\n            ahead++;\n        }\n        // If peeking ahead is NULL, then we can't parse an italic\n        // If it is, then we can parse an italic\n        return this.peek(ahead) !== null;\n    }\n    /**\n     * Parses an italic token. This is a Text that is surrounded by a single star\n     * on either side. For example, *this is italic*.\n     *\n     * The invariant is that the current token is a star, and the next token\n     * is a character. This will consume the star token and return an Italic\n     * object.\n     *\n     * @returns Italic | null - The italic object if it could be parsed, NULL otherwise.\n     */\n    parsePotentialItalic() {\n        if (!this.canParseItalic()) {\n            console.log('Cannot parse italic for current token', this.currentToken());\n            return null;\n        }\n        let italic = new _ast__WEBPACK_IMPORTED_MODULE_0__.Italic([]);\n        let currentText = new _ast__WEBPACK_IMPORTED_MODULE_0__.Text([]);\n        // Consume the star token at the beginning\n        this.consume();\n        // While the current token is not a star, consume the token and add it to\n        // the current text.\n        while (this.currentTokenIsNot(_tokens__WEBPACK_IMPORTED_MODULE_1__.TokenType.STAR_IDENTIFIER)) {\n            const next = this.consume();\n            currentText.tokens.push(next);\n        }\n        // Consume the ending star token.\n        this.consume();\n        // And if the currentText has tokens, we need to append it to the italic object\n        if (currentText.length > 0) {\n            italic.nodes.push(currentText);\n        }\n        return italic;\n    }\n    parseHeader() {\n        // If the token is a header, we need to create a header node starting\n        // at this token and walking until we find a new line.\n        let level = 0;\n        // While we have tokens and the token is a header identifier, increment\n        // the level of the header\n        while (this.currentTokenIs(_tokens__WEBPACK_IMPORTED_MODULE_1__.TokenType.HEADER_IDENTIFIER)) {\n            level++;\n            this.consume();\n        }\n        let header = new _ast__WEBPACK_IMPORTED_MODULE_0__.Heading([], level);\n        let currentText = new _ast__WEBPACK_IMPORTED_MODULE_0__.Text([]);\n        while (this.currentTokenIsNot(_tokens__WEBPACK_IMPORTED_MODULE_1__.TokenType.NEW_LINE)) {\n            // If this is a star and the next is a char, this could be an italic\n            if (this.currentTokenIs(_tokens__WEBPACK_IMPORTED_MODULE_1__.TokenType.STAR_IDENTIFIER) && this.peek() && this.peek().type === _tokens__WEBPACK_IMPORTED_MODULE_1__.TokenType.CHAR) {\n                // Try and parse the italic. If we can't, then we just treat this star as if it was\n                // a normal character.\n                const italic = this.parsePotentialItalic();\n                if (italic) {\n                    // We were able to parse it. Push the current text, reset it, and add the italic \n                    header.nodes.push(currentText);\n                    currentText = new _ast__WEBPACK_IMPORTED_MODULE_0__.Text([]);\n                    header.nodes.push(italic);\n                }\n                else {\n                    // We were not able to parse it. Push this star as a normal character\n                    currentText.tokens.push(this.consume());\n                }\n                continue;\n            }\n            // For now, just add the token to the current text\n            currentText.tokens.push(this.consume());\n        }\n        if (currentText.length > 0) {\n            header.nodes.push(currentText);\n        }\n        return header;\n    }\n    parseParagraph() {\n        // If the token is a character, we need to create a paragraph node starting\n        // at this token and walking until we find a new line.\n        let paragraph = new _ast__WEBPACK_IMPORTED_MODULE_0__.Paragraph([]);\n        let currentText = new _ast__WEBPACK_IMPORTED_MODULE_0__.Text([]);\n        while (this.currentTokenIsNot(_tokens__WEBPACK_IMPORTED_MODULE_1__.TokenType.HEADER_IDENTIFIER)) {\n            // If this token is a new line, one of many things could happen\n            if (this.currentTokenIs(_tokens__WEBPACK_IMPORTED_MODULE_1__.TokenType.NEW_LINE)) {\n                // If this is the last token (ie nothing new to peek to), we can break out of the loop\n                let next = this.peek();\n                if (!next) {\n                    this.consume();\n                    break;\n                }\n                // If the next token is also a new line, this means the paragraph is over\n                if (next.type === _tokens__WEBPACK_IMPORTED_MODULE_1__.TokenType.NEW_LINE) {\n                    // Consume the next new line as well and break\n                    console.log('Next is also a new line token, consuming the next line also and breaking');\n                    this.consume();\n                    break;\n                }\n                // If the next token is a header identifier, this means the paragraph is over. Consume\n                // this blank line and break\n                if (next.type === _tokens__WEBPACK_IMPORTED_MODULE_1__.TokenType.HEADER_IDENTIFIER) {\n                    this.consume();\n                    break;\n                }\n                // If nothing else, simply move onto the next character. Push this current line\n                // to the paragraph and reset the current text\n                if (currentText.length > 0) {\n                    paragraph.nodes.push(currentText);\n                    currentText = new _ast__WEBPACK_IMPORTED_MODULE_0__.Text([]);\n                }\n                this.consume();\n                continue;\n            }\n            // If this token is a star and the next is a char, this is an italic\n            else if (this.currentTokenIs(_tokens__WEBPACK_IMPORTED_MODULE_1__.TokenType.STAR_IDENTIFIER) && this.peek() && this.peek().type === _tokens__WEBPACK_IMPORTED_MODULE_1__.TokenType.CHAR) {\n                // Try and parse this italic. If we can't, treat it as a normal character\n                const italic = this.parsePotentialItalic();\n                if (italic) {\n                    // This is valid, so we need to push the current text, reset it, and add the italic\n                    if (currentText.length > 0) {\n                        paragraph.nodes.push(currentText);\n                        currentText = new _ast__WEBPACK_IMPORTED_MODULE_0__.Text([]);\n                    }\n                    paragraph.nodes.push(italic);\n                }\n            }\n            else {\n                // This is a normal character, so we can append it to the current text\n                currentText.tokens.push(this.consume());\n            }\n        }\n        // If the current text has tokens, we need to append it to the paragraph\n        if (currentText.length > 0) {\n            paragraph.nodes.push(currentText);\n        }\n        return paragraph;\n    }\n    parseAST() {\n        // Now that we have our tokens, we can walk through them to create an AST.\n        // Some elements, like code blocks, lists, and tables, will require special\n        // handling, and others (like bodies) are quite simple. Unlike a traditional AST,\n        // we're going to be creating a flat list of nodes. This is because we're not\n        // going to be doing any transformations on the nodes themselves. Instead, we'll\n        // be using the nodes to generate HTML. This is a bit of a simplification, but\n        // it should be sufficient for our needs.\n        let ast = [];\n        console.log('Parsing AST');\n        // While we still have tokens, continue getting them and parsing them\n        while (this.tokens.length > 0) {\n            const token = this.currentToken();\n            if (!token) {\n                break;\n            }\n            console.log('Parsing token: ', token.value);\n            // If the token type is a new line, we can skip over it. The parsing\n            // process will handle new lines (will walk until a new line is found).\n            if (token.type === _tokens__WEBPACK_IMPORTED_MODULE_1__.TokenType.NEW_LINE) {\n                console.log('Skipping new line');\n                this.consume();\n            }\n            else if (token.type == _tokens__WEBPACK_IMPORTED_MODULE_1__.TokenType.HEADER_IDENTIFIER) {\n                console.log('Parsing header');\n                const header = this.parseHeader();\n                console.log('Parsed header and pushing', header);\n                ast.push(header);\n            }\n            else {\n                const paragraph = this.parseParagraph();\n                ast.push(paragraph);\n            }\n        }\n        return ast;\n    }\n    /**\n     * Parses the contents of the MD file into an AST then into HTML. Will return the\n     * created HTML as a string.\n     */\n    toHTML() {\n        // Walk through all the AST nodes and convert them to HTML, then join them\n        // together into a single string.\n        const parsed = this.parseAST();\n        console.log('Parsed AST', parsed);\n        return parsed.map(node => node.toHTML()).join(\"\\n\");\n    }\n}\n\n\n//# sourceURL=webpack://my-webpack-project/./src/parser/parser.ts?");

/***/ }),

/***/ "./src/parser/tokens.ts":
/*!******************************!*\
  !*** ./src/parser/tokens.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Token: () => (/* binding */ Token),\n/* harmony export */   TokenType: () => (/* binding */ TokenType)\n/* harmony export */ });\n/**\n * Represents one of the many types of tokens in an MD file.\n */\nvar TokenType;\n(function (TokenType) {\n    TokenType[TokenType[\"HEADER_IDENTIFIER\"] = 0] = \"HEADER_IDENTIFIER\";\n    TokenType[TokenType[\"CHAR\"] = 1] = \"CHAR\";\n    TokenType[TokenType[\"NEW_LINE\"] = 2] = \"NEW_LINE\";\n    TokenType[TokenType[\"STAR_IDENTIFIER\"] = 3] = \"STAR_IDENTIFIER\";\n})(TokenType || (TokenType = {}));\n/**\n * Represents a Token in an MD file. This is a character, specific identifier,\n * or similar.\n */\nclass Token {\n    value;\n    constructor(value) {\n        this.value = value;\n    }\n    get type() {\n        // Determine the type of token based on its value\n        switch (this.value) {\n            case \"#\":\n                return TokenType.HEADER_IDENTIFIER;\n            case \"\\n\":\n                return TokenType.NEW_LINE;\n            case \"*\":\n                return TokenType.STAR_IDENTIFIER;\n            default:\n                return TokenType.CHAR;\n        }\n    }\n}\n\n\n//# sourceURL=webpack://my-webpack-project/./src/parser/tokens.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;